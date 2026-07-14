# Patient Records Dashboard

A responsive and optimized frontend application designed to manage, search, edit, and archive patient records. This project is built using React 19, Tailwind CSS v4, Zod validation, and TypeScript, focused on clean architecture, performance, and accessibility.

---

## Live Demo

- **Deployment**: https://patients-dashboard-seven.vercel.app/

---

## Features

### Core Capabilities
* **Interactive Grid & Cards**: Displays patient profiles in a responsive grid. Cards feature smooth animation transitions for expanding and collapsing detailed profiles.
* **Add & Edit Records**: A fully validated modal form to register new patients or modify existing ones.
* **Favorites Section**: Users can toggle patient favorited states, persisting them across reloads using browser storage. Includes a modern glassmorphism slide-in sidebar.
* **Infinite Scroll**: Dynamic data loading handled using the native browser `IntersectionObserver` API for a fluid navigation experience.
* **Offline-First / Hybrid Sync Engine**: Simulates writes, updates, and deletes locally using an event-driven `localStorage` synchronization layer that merges local updates with MockAPI records.

### UX/UI & Polishing
* **Tailwind CSS v4 styling**: Custom styling tokens with dynamic theme toggles (Dark/Light mode support synced with system preferences).
* **Skeleton Loaders**: Provides elegant placeholder cards during data loading phases.
* **Global Notifications**: Custom context-based Toast alert system to show success/error alerts upon record actions.
* **Search Debounce**: Limits server calls while typing to 300ms intervals, reducing server load.

---

## Tech Stack

* **Core**: [React 19](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/)
* **Build Tool**: [Vite](https://vite.dev/)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (using `@tailwindcss/vite` integration)
* **Routing**: [React Router 7](https://reactrouter.com/)
* **Form & API Validation**: [Zod](https://zod.dev/)
* **HTTP Client**: [Axios](https://axios-http.com/)

---

## Testing & QA

The codebase features a dual-layer testing setup ensuring high coverage and preventing regression:

1. **Unit & Component Testing (Vitest)**
   * Tests components in isolation (checking correct renders, event triggers, and prop calls).
   * Verifies custom hooks behavior (`usePatients`, `useFavorites`) mocking API states and verifying `localStorage` synchronizations.
   * *Run unit tests*: `pnpm test:unit`
   
2. **End-to-End Integration Testing (Playwright)**
   * Automates browser actions in headless Chromium/Firefox/Webkit.
   * Tests user scenarios: opening the app, filtering names, filling forms in the modal, submitting, and asserting success toasts.
   * *Run E2E tests*: `pnpm exec playwright test`

3. **Visual Documentation (Storybook)**
   * Documented UI components in isolation (`Card`, `Button`, `Toast`, `Avatar`, `PatientCard`).
   * *Run Storybook*: `pnpm storybook`

---

## Project Structure

The directory structure is organized following the **Separation of Concerns (SoC)** principle:

```text
src/
├── components/       # Reusable UI elements (atomic 'ui' components and domain 'Patient' cards)
├── contexts/         # Global state providers (ToastContext for alert broadcasts)
├── hooks/            # Encapsulated state and side effects (usePatients, useDebounce, useInfiniteScroll)
├── pages/            # Core views organizing the components (Dashboard, ArchivedPatients, PatientDetails)
├── services/         # Data fetchers (Axios) and LocalStorage persistence engine (api.ts)
├── types/            # Data models and Zod validation schemas
└── utils/            # Helper utilities and validators
```

---

## Installation & Setup

Make sure you have [Node.js](https://nodejs.org/) and [pnpm](https://pnpm.io/) installed.

1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd patient-records-dashboard
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root folder and configure the API endpoint:
   ```env
   VITE_API_URL=https://<your-mockapi-endpoint-url>
   ```

4. **Run the development server**:
   ```bash
   pnpm dev
   ```

---

## Available Scripts

* `pnpm dev`: Runs the application in development mode on `http://localhost:5173`.
* `pnpm build`: Builds the production bundle.
* `pnpm test`: Runs Vitest test suites.
* `pnpm test:unit`: Specifically runs unit tests for components and hooks.
* `pnpm test:storybook`: Runs tests in Storybook.
* `pnpm storybook`: Starts Storybook dev server on `http://localhost:6006`.
* `pnpm build-storybook`: Compiles static Storybook build.
* `pnpm lint`: Lints the source files for code quality.

---

## Architecture Decisions

* **Boundary Schema Validation**: We run `safeParse` from Zod on raw API responses. This acts as a boundary guard that sanitizes corrupt payloads (like malformed avatar objects returned by public mock endpoints) before they reach React renderers.
* **Decoupled Logic (Hooks Pattern)**: UI pages are purely declarative. State is managed by decoupled custom hooks. The scroll hook uses native `IntersectionObserver` and receives its triggers from the state hook, maintaining clean interfaces.
* **Component-Library Free**: All UI elements (modals, toolbars, custom toast lists, and buttons) were written from scratch to adhere to the challenge rules, showcasing clean Tailwind CSS layouts and focus-state accessibility features.
