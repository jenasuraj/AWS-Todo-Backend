# aws-todo-backend

Express + TypeScript backend for the AWS Todo app.

## Scripts

| Command         | What it does                         |
| --------------- | ------------------------------------ |
| `npm run dev`   | Start the server with hot reload     |
| `npm run build` | Compile TypeScript to `dist/`        |
| `npm start`     | Run the compiled server              |
| `npm test`      | Run Jest tests                       |

The server listens on `PORT` (default `4000`). Health check: `GET /health`.

## Tests

Tests live in the `test/` folder and are named `*.test.ts`.
