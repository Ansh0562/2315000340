# Notification System Design

## Overview

The Campus Notifications System is a frontend-first application for students to receive, filter, and prioritise campus notifications (Placements, Results, Events). It integrates with a protected REST API and logs all significant events to a centralised logging endpoint.

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│                React Frontend                   │
│                                                 │
│  ┌──────────┐  ┌──────────┐  ┌───────────────┐ │
│  │Dashboard │  │Priority  │  │Notification   │ │
│  │(list+    │  │Inbox     │  │Details        │ │
│  │filter)   │  │(top N)   │  │(mark read)    │ │
│  └────┬─────┘  └────┬─────┘  └──────┬────────┘ │
│       │             │               │           │
│  ┌────▼─────────────▼───────────────▼────────┐  │
│  │        useNotifications (hook)            │  │
│  └────────────────────┬──────────────────────┘  │
│                       │                         │
│  ┌────────────────────▼──────────────────────┐  │
│  │      axios.js (instance + interceptors)   │  │
│  └────────────────────┬──────────────────────┘  │
└───────────────────────┼─────────────────────────┘
                        │
        ┌───────────────┴──────────────┐
        │        Backend API           │
        │  GET  /notifications         │
        │  POST /logs                  │
        └──────────────────────────────┘
```

---

## Component Tree

```
App
├── ThemeProvider (MUI)
├── BrowserRouter
│   └── NotificationProvider (Context)
│       ├── Navbar
│       └── Routes
│           ├── / → Dashboard
│           │       ├── FilterBar
│           │       └── NotificationList
│           │               └── NotificationCard[]
│           ├── /priority → PriorityInbox
│           │       └── NotificationList
│           └── /notifications/:id → NotificationDetails
└── GlobalSnackbar
```

---

## API Flow

### Fetching Notifications

1. Component mounts → `useNotifications` hook called
2. Hook calls `fetchNotifications({ page, limit, notification_type })`
3. `axios.js` interceptor attaches `Authorization: Bearer TOKEN`
4. Logger records `API request started`
5. Response received → logger records `API response success` with response time
6. Hook sets `notifications` state → component re-renders
7. On error: error state set, snackbar shown, logger records `API response failed`

### Logging

Every significant event calls `Log(stack, level, package, message)` which:
1. Validates stack/level/package against allowlists
2. POSTs `{ stack, level, package, message }` to `/logs`
3. Fails silently — never interrupts the user flow

---

## Priority Algorithm

Located in `utils/priority.js`.

### Score Calculation

```
score = TYPE_WEIGHT + recency_normalised

TYPE_WEIGHT:
  Placement → 300
  Result    → 200
  Event     → 100

recency_normalised = timestamp_ms / 1e10
```

This ensures type always dominates, but among same-type notifications, newer ones rank higher.

### Top-N Selection

```
getTopPriorityUnread(notifications, readIds, N):
  1. Filter out notifications whose ID is in readIds
  2. Sort remaining by score (descending)
  3. Return first N
```

---

## State Management

- `NotificationContext` holds `readIds` (a `Set<string>`)
- Persisted to `localStorage` under key `campus_notifications_read`
- Actions: `markAsRead(id)`, `markAllAsRead(ids[])`, `isRead(id)`
- Snackbar state also lives in context

---

## Read/Unread Visual Treatment

| State  | Card border   | Background    | Typography        |
|--------|---------------|---------------|-------------------|
| Unread | `primary.light` | `primary.50` | Bold, blue border |
| Read   | `divider`     | `paper`       | Regular weight    |

An unread dot indicator appears beside the timestamp for unread items.

---

## Logging Strategy

All logs use `Log("frontend", level, package, message)`. No `console.*` calls anywhere.

| Event                        | Level  | Package   |
|------------------------------|--------|-----------|
| Page load                    | info   | page      |
| API request started          | info   | api       |
| API response success         | info   | api       |
| API response failed          | error  | api       |
| Unauthorized (401)           | warn   | auth      |
| Filter changed               | info   | page      |
| User marks as read           | info   | page      |
| Component rendered           | debug  | component |
| Hook fetch result            | info   | hook      |
| State persisted              | debug  | state     |

---

## Performance

- Route-level lazy loading via `React.lazy + Suspense`
- `React.memo` on `NotificationCard` and `NotificationList`
- `useCallback` for event handlers in context and pages
- `useRef` for AbortController — cancels stale requests on filter/page change
- Pagination limits API payload to 10 items per page

---

## Error Handling

| Scenario             | Handling                                 |
|----------------------|------------------------------------------|
| 401 Unauthorized     | Warn log, error state with message       |
| Network failure      | Error log, `ErrorState` component, retry |
| Empty response       | Empty state with icon and message        |
| Invalid state access | `useNotificationContext` guard throws     |

---

## Folder Responsibilities

| Folder       | Purpose                                           |
|--------------|---------------------------------------------------|
| `api/`       | Axios instance, notification API calls            |
| `auth/`      | Token retrieval from env                          |
| `middleware/`| `Log()` function — the only logger in the app     |
| `pages/`     | Full-page views (Dashboard, PriorityInbox, Details)|
| `components/`| Reusable UI building blocks                       |
| `hooks/`     | Data-fetching logic                               |
| `utils/`     | Pure functions (priority scoring, date formatting)|
| `context/`   | Global state (read IDs, snackbar)                 |
