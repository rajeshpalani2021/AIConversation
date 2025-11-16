# ATOM AI MCP Client - Tools Explorer

A modern Angular application for exploring and managing AI tools with real-time streaming data support. This project demonstrates a clean, component-based architecture with Server-Sent Events (SSE) for real-time UI updates.

## Features

- **Real-time Streaming**: UI updates as backend sends data using Server-Sent Events (SSE)
- **Tools Explorer**: Browse, search, and filter AI tools
- **Interactive UI**: Test tools directly from the interface
- **Responsive Design**: Mobile-friendly layout
- **Component-based Architecture**: Modular, reusable components
- **Lazy Loading**: Optimized performance with route-based code splitting

## Project Structure

```
src/app/
├── core/
│   └── components/
│       ├── header/          # Application header
│       └── sidebar/         # Navigation sidebar
├── models/
│   └── tool.model.ts        # Data models and interfaces
├── modules/
│   └── tools-explorer/
│       ├── components/
│       │   ├── stats-bar/   # Statistics display
│       │   ├── filters/     # Search and category filters
│       │   ├── tools-grid/  # Grid layout for tools
│       │   ├── tool-card/   # Individual tool card
│       │   └── detail-panel/ # Tool details sidebar
│       └── tools-explorer.component.ts  # Main page component
└── services/
    ├── streaming.service.ts  # Handles SSE and streaming
    └── tools.service.ts      # Tools data management
```

## Streaming API Support

This application includes a **StreamingService** that supports real-time data updates through two methods:

### 1. Server-Sent Events (SSE)

```typescript
// In your backend, create an SSE endpoint
app.get('/api/tools/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Send tools one by one
  tools.forEach((tool, index) => {
    setTimeout(() => {
      res.write(`data: ${JSON.stringify(tool)}\n\n`);
    }, index * 200);
  });
});
```

### 2. Fetch API with Readable Streams

```typescript
// Use the StreamingService in your components
this.streamingService.streamFetch<Tool>('/api/tools/stream')
  .subscribe({
    next: (tool) => {
      // UI updates automatically as each tool arrives
      this.tools.push(tool);
    },
    complete: () => console.log('Streaming complete')
  });
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI (v20.3.10)

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd atom-ai-mcp-client
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm start
# or
ng serve
```

4. Open your browser and navigate to `http://localhost:4200/`

### Building for Production

```bash
npm run build
# or
ng build
```

The build artifacts will be stored in the `dist/` directory.

## Components Overview

### Header Component
- Displays application branding
- Shows system status indicator
- Displays user information

### Sidebar Component
- Navigation menu with route links
- Active route highlighting
- Responsive design for mobile

### Tools Explorer
Main page that orchestrates all sub-components:
- **Stats Bar**: Displays aggregated statistics
- **Filters**: Search and category filtering
- **Tools Grid**: Displays tools in a responsive grid
- **Detail Panel**: Slides in from right with tool details

### Streaming Service

The `StreamingService` provides two methods for real-time data:

#### getServerSentEvents<T>(url: string): Observable<T>
- Uses native EventSource API
- Ideal for one-way server-to-client streaming
- Automatically handles reconnection

#### streamFetch<T>(url: string, options?: RequestInit): Observable<T>
- Uses Fetch API with ReadableStream
- More flexible, supports custom headers and methods
- Better error handling

## Backend Integration

To connect this app to a real backend:

1. Update the API URL in `tools.service.ts`:
```typescript
private apiUrl = 'http://your-backend-url:port/api';
```

2. Replace the mock streaming implementation:
```typescript
streamTools(): Observable<Tool> {
  return this.streamingService.getServerSentEvents<Tool>(`${this.apiUrl}/tools/stream`);
}
```

3. Implement your backend SSE endpoint following the example above

## Sample Backend (Node.js/Express)

```javascript
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/api/tools/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');

  const tools = getTools(); // Your data source

  let index = 0;
  const interval = setInterval(() => {
    if (index < tools.length) {
      res.write(`data: ${JSON.stringify(tools[index])}\n\n`);
      index++;
    } else {
      clearInterval(interval);
      res.end();
    }
  }, 200);

  req.on('close', () => {
    clearInterval(interval);
  });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

## Development

### Running Tests

```bash
npm test
```

### Code Scaffolding

Generate a new component:
```bash
ng generate component component-name
```

Generate a new service:
```bash
ng generate service service-name
```

## Key Features Demonstrated

1. **Streaming Data**: Real-time UI updates as backend sends data
2. **Reactive Programming**: RxJS observables for async data handling
3. **Component Communication**: @Input/@Output for parent-child communication
4. **Standalone Components**: Modern Angular standalone component architecture
5. **Lazy Loading**: Route-based code splitting for better performance
6. **Responsive Design**: Mobile-first CSS with flexbox and grid
7. **Type Safety**: Full TypeScript typing throughout

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is licensed under the MIT License.

## Additional Resources

- [Angular Documentation](https://angular.dev)
- [Server-Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
- [RxJS Documentation](https://rxjs.dev/)
