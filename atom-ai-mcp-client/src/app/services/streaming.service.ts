import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StreamingService {
  constructor(private zone: NgZone) {}

  /**
   * Creates a Server-Sent Events connection for streaming data
   * @param url The endpoint URL for SSE
   * @returns Observable that emits data as it arrives from the server
   */
  getServerSentEvents<T>(url: string): Observable<T> {
    return new Observable(observer => {
      const eventSource = new EventSource(url);

      eventSource.onmessage = event => {
        this.zone.run(() => {
          try {
            const data = JSON.parse(event.data);
            observer.next(data);
          } catch (error) {
            console.error('Error parsing SSE data:', error);
          }
        });
      };

      eventSource.onerror = error => {
        this.zone.run(() => {
          console.error('SSE Error:', error);
          if (eventSource.readyState === EventSource.CLOSED) {
            observer.complete();
          } else {
            observer.error(error);
          }
          eventSource.close();
        });
      };

      // Cleanup function
      return () => {
        eventSource.close();
      };
    });
  }

  /**
   * Streams data using fetch with readable stream
   * @param url The endpoint URL
   * @param options Fetch options
   * @returns Observable that emits chunks of data
   */
  streamFetch<T>(url: string, options?: RequestInit): Observable<T> {
    return new Observable(observer => {
      let controller = new AbortController();

      fetch(url, {
        ...options,
        signal: controller.signal
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const reader = response.body?.getReader();
          const decoder = new TextDecoder();

          if (!reader) {
            observer.complete();
            return;
          }

          const readChunk = () => {
            reader.read().then(({ done, value }) => {
              if (done) {
                observer.complete();
                return;
              }

              this.zone.run(() => {
                try {
                  const chunk = decoder.decode(value, { stream: true });
                  // Split by newlines to handle multiple JSON objects
                  const lines = chunk.split('\n').filter(line => line.trim());

                  lines.forEach(line => {
                    try {
                      const data = JSON.parse(line);
                      observer.next(data);
                    } catch (e) {
                      // If not valid JSON, emit as raw text
                      observer.next(line as any);
                    }
                  });
                } catch (error) {
                  console.error('Error processing chunk:', error);
                }
              });

              readChunk();
            }).catch(error => {
              this.zone.run(() => observer.error(error));
            });
          };

          readChunk();
        })
        .catch(error => {
          this.zone.run(() => observer.error(error));
        });

      // Cleanup function
      return () => {
        controller.abort();
      };
    });
  }

  /**
   * Streams data using HTTP POST with readable stream
   * This is useful for AI/LLM APIs that return streaming responses
   * @param url The endpoint URL
   * @param body The POST body data
   * @param headers Optional headers
   * @returns Observable that emits chunks of data as they arrive
   */
  streamPost<T>(url: string, body: any, headers?: HeadersInit): Observable<T> {
    return new Observable(observer => {
      const controller = new AbortController();

      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify(body),
        signal: controller.signal
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const reader = response.body?.getReader();
          const decoder = new TextDecoder();

          if (!reader) {
            observer.complete();
            return;
          }

          const readChunk = () => {
            reader.read().then(({ done, value }) => {
              if (done) {
                observer.complete();
                return;
              }

              this.zone.run(() => {
                try {
                  const chunk = decoder.decode(value, { stream: true });

                  // Handle different streaming formats
                  // Format 1: Newline-delimited JSON (NDJSON)
                  // Format 2: Server-Sent Events format (data: {...})
                  const lines = chunk.split('\n').filter(line => line.trim());

                  lines.forEach(line => {
                    // Remove "data: " prefix if present (SSE format)
                    let dataLine = line;
                    if (line.startsWith('data: ')) {
                      dataLine = line.substring(6);
                    }

                    // Skip empty lines or "[DONE]" markers
                    if (!dataLine || dataLine === '[DONE]') {
                      return;
                    }

                    try {
                      const data = JSON.parse(dataLine);
                      observer.next(data);
                    } catch (e) {
                      // If not valid JSON, emit as raw text
                      observer.next(dataLine as any);
                    }
                  });
                } catch (error) {
                  console.error('Error processing chunk:', error);
                }
              });

              readChunk();
            }).catch(error => {
              this.zone.run(() => observer.error(error));
            });
          };

          readChunk();
        })
        .catch(error => {
          this.zone.run(() => observer.error(error));
        });

      // Cleanup function
      return () => {
        controller.abort();
      };
    });
  }
}
