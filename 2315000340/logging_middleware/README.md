# Logging Middleware

A reusable, framework-agnostic logging utility that sends structured log entries to the backend `/logs` endpoint.

## Function Signature

```js
Log(stack, level, packageName, message)
```

## Parameters

| Param         | Type   | Allowed values |
|---------------|--------|----------------|
| `stack`       | string | `frontend` |
| `level`       | string | `debug` \| `info` \| `warn` \| `error` \| `fatal` |
| `packageName` | string | `api`, `component`, `hook`, `page`, `state`, `style`, `auth`, `config`, `middleware`, `utils` |
| `message`     | string | Any human-readable string |

## Usage

```js
import { Log } from '../logging_middleware/index.js'

// Page load
Log("frontend", "info", "page", "Dashboard loaded")

// API error
Log("frontend", "error", "api", "Failed to fetch notifications")

// Component render
Log("frontend", "debug", "component", "Notification card rendered")
```

## Rules

- Silently ignores invalid stack/level/package values
- Never throws — a logging failure must not break the app
- Does NOT use `console.log` or any built-in logger
