import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Tool, SystemStats } from '../models/tool.model';
import { StreamingService } from './streaming.service';

@Injectable({
  providedIn: 'root'
})
export class ToolsService {
  private apiUrl = 'http://localhost:3000/api'; // Configure your backend URL

  constructor(private streamingService: StreamingService) {}

  /**
   * Streams tools data from the backend
   * The UI will update as each tool is received
   */
  streamTools(): Observable<Tool> {
    // For production: Use actual streaming endpoint
    // return this.streamingService.getServerSentEvents<Tool>(`${this.apiUrl}/tools/stream`);

    // For demo: Simulate streaming with mock data
    return this.getMockToolsStream();
  }

  /**
   * Get tools via regular HTTP request (non-streaming)
   */
  getTools(): Observable<Tool[]> {
    return of(this.getMockTools()).pipe(delay(300));
  }

  /**
   * Get system statistics
   */
  getSystemStats(): Observable<SystemStats> {
    return of({
      totalTools: 48,
      totalCategories: 8,
      totalCalls: 1247,
      successRate: '94.8%'
    });
  }

  /**
   * Execute a tool with given parameters
   */
  executeTool(toolId: string, parameters: any): Observable<any> {
    // In production, this would call the backend API
    return of({
      success: true,
      result: 'Tool executed successfully',
      executionTime: '342ms'
    }).pipe(delay(500));
  }

  /**
   * Mock streaming implementation
   * Simulates server sending tools one by one
   */
  private getMockToolsStream(): Observable<Tool> {
    return new Observable(observer => {
      const tools = this.getMockTools();
      let index = 0;

      const interval = setInterval(() => {
        if (index < tools.length) {
          observer.next(tools[index]);
          index++;
        } else {
          clearInterval(interval);
          observer.complete();
        }
      }, 200); // Send one tool every 200ms to simulate streaming

      // Cleanup
      return () => clearInterval(interval);
    });
  }

  /**
   * Mock tools data based on the HTML template
   */
  private getMockTools(): Tool[] {
    return [
      {
        id: '1',
        name: 'Data Analyzer',
        description: 'Performs statistical analysis on datasets including mean, median, mode, standard deviation, and generates insights from numerical data.',
        icon: '📊',
        categories: ['Analytics', 'Database'],
        keywords: ['statistics', 'analysis', 'data', 'insights', 'metrics'],
        stats: {
          totalCalls: 234,
          successRate: 96.2,
          averageTime: '342ms',
          lastUsed: '2h ago'
        },
        schema: {
          type: 'object',
          properties: {
            dataset: {
              type: 'array',
              description: 'Array of numbers'
            },
            analysisType: {
              type: 'string',
              enum: ['basic', 'advanced', 'full']
            }
          },
          required: ['dataset']
        },
        examples: [
          'Calculate basic statistics for sales data: [120, 145, 167, 134, 189]',
          'Analyze customer satisfaction scores with advanced metrics',
          'Generate full statistical report for quarterly revenue figures'
        ]
      },
      {
        id: '2',
        name: 'Email Sender',
        description: 'Sends emails with customizable templates, attachments, and recipient lists. Supports HTML formatting and bulk sending capabilities.',
        icon: '📧',
        categories: ['Email', 'Integration'],
        keywords: ['email', 'send', 'notification', 'template', 'smtp'],
        stats: {
          totalCalls: 187,
          successRate: 98.9,
          averageTime: '1.2s',
          lastUsed: '1h ago'
        },
        schema: {
          type: 'object',
          properties: {
            to: { type: 'array', description: 'Recipient email addresses' },
            subject: { type: 'string' },
            body: { type: 'string' },
            attachments: { type: 'array' }
          },
          required: ['to', 'subject', 'body']
        },
        examples: [
          'Send welcome email to new users',
          'Send daily report with PDF attachment',
          'Bulk send newsletter to subscriber list'
        ]
      },
      {
        id: '3',
        name: 'Database Query',
        description: 'Executes SQL queries against configured databases with support for SELECT, INSERT, UPDATE operations and transaction management.',
        icon: '🗄️',
        categories: ['Database'],
        keywords: ['sql', 'database', 'query', 'data', 'crud'],
        stats: {
          totalCalls: 412,
          successRate: 92.5,
          averageTime: '156ms',
          lastUsed: '30m ago'
        },
        schema: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'SQL query to execute' },
            database: { type: 'string' },
            parameters: { type: 'object' }
          },
          required: ['query']
        },
        examples: [
          'SELECT * FROM users WHERE status = "active"',
          'INSERT INTO orders (user_id, total) VALUES (123, 99.99)',
          'UPDATE products SET stock = stock - 1 WHERE id = 456'
        ]
      },
      {
        id: '4',
        name: 'Chart Generator',
        description: 'Creates various types of charts and visualizations from data including bar charts, line graphs, pie charts, and scatter plots.',
        icon: '📈',
        categories: ['Analytics', 'Reporting'],
        keywords: ['chart', 'graph', 'visualization', 'plot', 'diagram'],
        stats: {
          totalCalls: 156,
          successRate: 95.1,
          averageTime: '782ms',
          lastUsed: '3h ago'
        },
        schema: {
          type: 'object',
          properties: {
            type: { type: 'string', enum: ['bar', 'line', 'pie', 'scatter'] },
            data: { type: 'array' },
            options: { type: 'object' }
          },
          required: ['type', 'data']
        },
        examples: [
          'Create bar chart of monthly sales',
          'Generate line graph showing user growth',
          'Build pie chart of market share distribution'
        ]
      },
      {
        id: '5',
        name: 'Report Builder',
        description: 'Generates comprehensive reports in PDF, Excel, or Word formats with custom templates, data tables, and embedded charts.',
        icon: '📄',
        categories: ['Reporting', 'File System'],
        keywords: ['report', 'pdf', 'excel', 'document', 'export'],
        stats: {
          totalCalls: 98,
          successRate: 97.9,
          averageTime: '2.4s',
          lastUsed: '5h ago'
        },
        schema: {
          type: 'object',
          properties: {
            format: { type: 'string', enum: ['pdf', 'excel', 'word'] },
            template: { type: 'string' },
            data: { type: 'object' }
          },
          required: ['format', 'data']
        },
        examples: [
          'Generate quarterly financial report in PDF',
          'Create sales analysis report in Excel',
          'Build custom branded report with charts'
        ]
      },
      {
        id: '6',
        name: 'API Connector',
        description: 'Makes HTTP requests to external APIs with support for authentication, headers, query parameters, and various HTTP methods.',
        icon: '🔗',
        categories: ['API', 'Integration'],
        keywords: ['api', 'http', 'rest', 'request', 'integration'],
        stats: {
          totalCalls: 289,
          successRate: 91.3,
          averageTime: '894ms',
          lastUsed: '45m ago'
        },
        schema: {
          type: 'object',
          properties: {
            url: { type: 'string' },
            method: { type: 'string', enum: ['GET', 'POST', 'PUT', 'DELETE'] },
            headers: { type: 'object' },
            body: { type: 'object' }
          },
          required: ['url', 'method']
        },
        examples: [
          'GET request to fetch weather data',
          'POST request to create new resource',
          'Authenticated API call with bearer token'
        ]
      }
    ];
  }
}
