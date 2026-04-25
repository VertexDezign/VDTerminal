# VDTerminal

This is a small website that displays data from the Farming Simulator mod in real-time.

## Structure

- `server/`: Node.js Express server with Socket.IO and file watcher.
- `client/`: React + Vite + TypeScript + Tailwind CSS frontend.

## Setup

1. Make sure you have Node.js installed.
2. From the `root` directory, install dependencies:
   ```bash
   npm install
   cd client
   npm install
   ```
3. Run the dashboard (both server and client):
   ```bash
   npm run dev
   ```

## How it works

The server watches the `examples/xml/combine.xml` file (default) and emits the parsed JSON data over WebSockets whenever the file changes. The frontend connects to the WebSocket and updates the UI (gauges, bars, etc.) in real-time.
