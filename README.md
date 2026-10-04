# Donable

Donable is a mobile-first productivity workspace for tasks, habits, and focused work. This repository contains the local-first MVP: a landing page, demo sign-in, a task board, habit tracking, a focus timer, notifications, and workspace settings.

## Run locally

```sh
npm install
npm run dev
```

Other checks:

```sh
npm run lint
npm run build
```

## Styling

The UI uses Tailwind CSS v4 through the Vite plugin. Shared design tokens and global resets live in `src/index.css`; component rules in `src/App.css` compose Tailwind utilities with `@apply`, keeping bespoke animation and responsive behavior where needed. Prefer Tailwind utilities for new layout and styling, and reserve standalone CSS declarations for effects that are awkward to express with utilities.

## MVP notes

- Sign-in is a **demo flow**, not secure authentication. Any valid email and a password of at least six characters opens a local workspace; the password is never stored.
- Tasks, habits, notification history, settings, timer state, and the demo profile are persisted in browser `localStorage`.
- A gentle two-note audio chime is enabled by default when a focus or break timer ends. Start a timer once to unlock browser audio; change this under **Settings → Alerts & notifications**.
- In-app toast alerts are shown for newly completed tasks/habits and finished timers. Optional browser notifications require explicit permission from **Settings → Alerts & notifications**.
- Use **Settings → Your data → Export JSON** to save a copy of the workspace.
- Analytics use workspace activity rather than random values. The productivity score is weighted as task completion (40%), today's habit consistency (25%), today's completed focus time against a 2-hour target (20%), and on-time completion of tasks with due dates (15%). Empty deadline history is neutral.
- The initial task and habit records are sample data for exploring the MVP. Delete or update them like any other records.
- No server, shared account, remote push delivery, or cross-device sync is included. Browser notifications are local system notifications while the app is open. Demo auth and local repositories are isolated behind service/repository modules so a future API implementation can replace the data source.

## Structure

```text
src/
  components/       Shared dialogs and app shell
  data/             Initial sample records
  pages/            Landing, auth, and MVP feature pages
  services/         Local repositories, auth, notification, API client
  store/            Redux Toolkit store and feature slices
```

The intended data flow is `pages → Redux feature state → services/repositories → localStorage`. UI components do not read JSON or call Axios directly. Axios is configured as the starting point for a future API repository; it is not used by the local-first MVP.
