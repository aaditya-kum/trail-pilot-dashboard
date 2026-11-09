# Trailpilot – Travel Agency CRM Dashboard

A responsive CRM dashboard for travel agencies, built as a frontend assessment for Artbyte Innovations. It manages leads and tour packages with full CRUD against a mock REST API, uses Redux Toolkit for shared state, and includes an AI-style follow-up message assistant.

**Live demo:** https://trail-pilot-dashboard.vercel.app

## Features

- **Dashboard:** four stat cards (Total Leads, Active Bookings, Total Revenue, Upcoming Trips), a monthly booking trends line chart, and a recent leads list
- **Leads:** add, edit and delete leads; search by name, email, phone, destination or status; status filter; pagination (6 per page)
- **Packages:** add, edit and delete packages; search by destination; price filter (Under 50K, 50K - 1L, Above 1L) and duration filter (1 - 3, 4 - 7, 8+ days); pagination (5 per page)
- **Follow-up assistant (bonus):** generates a suggested follow-up message for a customer. Open it from the Leads page, either empty or pre-filled from a lead's row. Choose the lead status, tone (Friendly, Formal, Persuasive) and channel (Email, WhatsApp), then edit, regenerate or copy the message. Responses are mocked, so no AI service or API key is used.
- **Quality:** Formik and Yup validation, loading skeletons, empty and error states, success and error notifications, delete confirmation
- **Responsive:** sidebar on desktop; on mobile, a sticky top header with the brand and a bottom navigation bar

## Tech Stack

React (Vite), Material UI, SCSS, Redux Toolkit, Axios, MockAPI.io, Formik, Yup, Recharts, React Router, React Icons, Vercel

## Setup

```bash
git clone <repository-url>
cd trail-pilot-dashboard
npm install
cp .env.example .env
npm run dev
```

Set the API base URL in `.env` (your own MockAPI project, without `/leads` at the end):

```env
VITE_API_URL=<your-mockapi-base-url>
```

The mock API needs two resources:

- `leads`: name, email, phone, destination, budget (number), travelDate (`YYYY-MM-DD`), status (`New`, `Contacted`, `Interested`, `Converted`, `Lost`)
- `packages`: name, destination, price (number), duration (number of days), description, image (URL)

Other scripts: `npm run build`, `npm run preview`, `npm run lint`.

`vercel.json` rewrites every route to `index.html`, so refreshing on `/leads` or `/packages` works after deployment. Add `VITE_API_URL` in the Vercel project's environment variables.

## Project Structure

```
src/
├── components/   Reusable UI (DataTable, StatCard, StatusBadge, SearchBar, FormInput, FormSelect,
│                 Button, Pagination, DialogHeader, LeadDialog, PackageDialog, DeleteConfirmationDialog)
├── features/     dashboard, leads, packages, assistant
├── hooks/        usePagination
├── layout/       AppLayout, Sidebar, MobileHeader, BottomNavigation
├── providers/    NotificationProvider
├── services/     Axios instance
├── store/        Redux store
├── styles/       Design system variables
└── utils/        Formatters and constants
```

Components used in more than one place live in `components/`. Code used by one feature stays in that feature's folder.

## State Management

The store has three slices:

| Slice       | State                        | Purpose                                                   |
| ----------- | ---------------------------- | --------------------------------------------------------- |
| `leads`     | `{ items, loading, error }`  | Leads data, shared by the Dashboard and the Leads page    |
| `packages`  | `{ items, loading, error }`  | Packages data                                             |
| `assistant` | `{ status, message, error }` | Generated follow-up draft and its loading and error state |

```
Component → dispatch(thunk) → Axios → Mock API → slice → store → useSelector → re-render
```

- Async thunks (`createAsyncThunk`) handle GET, POST, PUT and DELETE for leads and packages.
- `pending`, `fulfilled` and `rejected` drive loading and error states, and the UI updates without a page reload.
- Create, update and delete use `.unwrap()` in `try/catch`: dialogs close only on success, and failures show an error message.
- Search, filters, dialog state and the current page stay in local component state.

Dashboard stats are derived from the leads in the store. A lead with status **Converted** counts as a booking: Active Bookings is the count, Total Revenue is the sum of their budgets, and Upcoming Trips are the converted leads with a future travel date. The chart groups converted leads by travel month.

## Follow-up Assistant

`assistantService.js` holds `generateFollowUp()`, the only place that produces the message. It builds a subject, greeting, body and closing from the lead's status, tone and channel, and waits 1 to 2 seconds to simulate an AI request. The `assistant` slice calls it through a thunk, so the dialog works the same way whether the response is mocked or real.

To connect a real model later, only the body of `generateFollowUp()` changes: it would call a backend or serverless endpoint that stores the model API key as a server-side secret. Keys are never placed in frontend code, including `VITE_*` variables, because they would be public.

## Limitations

- Statistics, search, filters and pagination run on the client because the mock API has no backend logic.
- Bookings are derived from converted leads, with no separate resource.
- Package images are URLs only, with no upload.
- The assistant uses template-based mock responses, not a real language model.
- Authentication is not included. Settings and Profile in the sidebar are disabled placeholders.

## Security

Dummy data only. No credentials or API keys are committed, and `.env` is excluded through `.gitignore`.
