# Campus Notifications System

A production-grade frontend for a campus notification system.  
Built with React + Vite + Material UI.

---

## Repository Structure

```
2315000340/
├── logging_middleware/         # Reusable logging package
│   ├── index.js
│   └── README.md
├── notification_app_fe/        # React frontend
├── notification_app_be/        # Backend (placeholder)
├── notification_system_design.md
└── .gitignore
```

---

## Setup

### 1. Install dependencies

```bash
cd notification_app_fe
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:

```
VITE_BASE_URL=http://4.224.186.213/evaluation-service
VITE_TOKEN=your_actual_token_here
```

### 3. Start the dev server

```bash
npm run dev
```

App runs at: **http://localhost:3000**

---

## Features

### Dashboard (`/`)
- Fetches paginated notifications from the API
- Filter by type: All / Placement / Result / Event
- Mark all visible notifications as read
- Responsive pagination
- Skeleton loading states
- Error state with retry

### Priority Inbox (`/priority`)
- Shows top N unread notifications
- Sorted by: `Placement > Result > Event`, then recency
- Adjustable top-N via slider (1–20)
- Real-time update as you mark items read

### Notification Details (`/notifications/:id`)
- Full detail view of a notification
- Mark as read button
- Shows ID, type, timestamp, priority level

---

## Logging

All logs use the custom `Log()` function — never `console.log`.

```js
Log("frontend", "info", "page", "Dashboard loaded")
Log("frontend", "error", "api", "Failed to fetch notifications")
Log("frontend", "debug", "component", "Notification card rendered")
```

Logs are POSTed to `POST /logs`.

---

## Architecture Highlights

- **Axios interceptors** attach Bearer token and measure response time
- **Context API** manages global read/unread state, persisted to `localStorage`
- **React.lazy** for route-level code splitting
- **React.memo + useCallback** for optimised renders
- **AbortController** cancels stale fetch requests on filter change

See `notification_system_design.md` for full architecture documentation.

---

## Tech Stack

- React 18
- Vite 5
- Material UI 5
- Axios
- React Router DOM 6
