# aws-todo-backend

Express + TypeScript backend for the AWS Todo app.

## Scripts

| Command         | What it does                     |
| --------------- | -------------------------------- |
| `npm run dev`   | Start the server with hot reload |
| `npm run build` | Compile TypeScript to `dist/`    |
| `npm start`     | Run the compiled server          |
| `npm test`      | Run Jest tests                   |

The server listens on `PORT` (default `4000`). Health check: `GET /health`.

## Tests

Tests live in the `test/` folder and are named `*.test.ts`.

## Linting & formatting

| Command                | What it does                            |
| ---------------------- | --------------------------------------- |
| `npm run lint`         | Check code with ESLint                  |
| `npm run lint:fix`     | Auto-fix ESLint issues                  |
| `npm run format`       | Format all files with Prettier          |
| `npm run format:check` | Check formatting without changing files |

ESLint uses `typescript-eslint` with `eslint-config-prettier`, so ESLint handles code quality and Prettier handles formatting without conflicts.
