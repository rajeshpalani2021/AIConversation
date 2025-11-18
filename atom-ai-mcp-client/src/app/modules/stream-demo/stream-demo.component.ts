import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { StreamingService } from '../../services/streaming.service';

interface StreamResponse {
  id?: string;
  content?: string;
  message?: string;
  delta?: string;
  done?: boolean;
}

@Component({
  selector: 'app-stream-demo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stream-demo.component.html',
  styleUrls: ['./stream-demo.component.css']
})
export class StreamDemoComponent implements OnDestroy {
  // API Configuration
  apiUrl = 'http://localhost:3000/api/chat/stream';

  // Request body
  requestBody = JSON.stringify({
    message: 'Hello, how are you?',
    model: 'gpt-4',
    stream: true
  }, null, 2);

  // Response state
  responses: string[] = [];
  fullResponse = '';
  isLoading = false;
  error: string | null = null;

  private streamSubscription?: Subscription;

  constructor(private streamingService: StreamingService) {}

  ngOnDestroy() {
    this.cancelStream();
  }

  /**
   * Start streaming from the POST API
   */
  startStream() {
    // Reset state
    this.responses = [];
    this.fullResponse = '';
    this.error = null;
    this.isLoading = true;

    let body: any;
    try {
      body = JSON.parse(this.requestBody);
    } catch (e) {
      this.error = 'Invalid JSON in request body';
      this.isLoading = false;
      return;
    }

    // Start the POST stream
    this.streamSubscription = this.streamingService
      .streamPost<StreamResponse>(this.apiUrl, body)
      .subscribe({
        next: (data) => {
          // Handle the streamed data
          const chunk = data.content || data.delta || data.message || JSON.stringify(data);
          this.responses.push(chunk);
          this.fullResponse += chunk;
          console.log('Received chunk:', data);
        },
        error: (err) => {
          this.error = err.message || 'Stream error occurred';
          this.isLoading = false;
          console.error('Stream error:', err);
        },
        complete: () => {
          this.isLoading = false;
          console.log('Stream completed');
        }
      });
  }

  /**
   * Cancel the current stream
   */
  cancelStream() {
    if (this.streamSubscription) {
      this.streamSubscription.unsubscribe();
      this.streamSubscription = undefined;
      this.isLoading = false;
    }
  }

  /**
   * Clear all responses
   */
  clearResponses() {
    this.responses = [];
    this.fullResponse = '';
    this.error = null;
  }

  /**
   * Run demo with mock streaming (no backend required)
   */
  runMockDemo() {
    this.responses = [];
    this.fullResponse = '';
    this.error = null;
    this.isLoading = true;

    // Simulate streaming response
    const mockResponses = [
      'Hello',
      '! ',
      'I am ',
      'doing ',
      'great, ',
      'thank ',
      'you ',
      'for ',
      'asking. ',
      'How ',
      'can ',
      'I ',
      'help ',
      'you ',
      'today?'
    ];

    let index = 0;
    const interval = setInterval(() => {
      if (index < mockResponses.length) {
        const chunk = mockResponses[index];
        this.responses.push(chunk);
        this.fullResponse += chunk;
        index++;
      } else {
        clearInterval(interval);
        this.isLoading = false;
      }
    }, 100);
  }
}
