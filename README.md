# Trailpilot – Travel Agency CRM Dashboard

A responsive CRM dashboard for travel agencies, built as a frontend assessment for Artbyte Innovations. It manages leads and tour packages with full CRUD against a mock REST API, using Redux Toolkit for shared state.

**Live demo:** https://trail-pilot-dashboard.vercel.app

## Features

- **Dashboard:** stat cards (Total Leads, Active Bookings, Total Revenue, Upcoming Trips), monthly booking trends chart, recent leads
- **Leads:** add, edit, delete, search, status filter, pagination
- **Packages:** add, edit, delete, search by destination, price and duration filters, pagination
- **Quality:** Formik + Yup validation, loading skeletons, empty and error states, success/error notifications, delete confirmation
- **Responsive:** sidebar on desktop, bottom navigation on mobile

## Tech Stack

React (Vite), Material UI, SCSS, Redux Toolkit, Axios, MockAPI.io, Formik, Yup, Recharts, React Router, Vercel

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

## Project Structure

```
src/
├── components/   Reusable UI (DataTable, StatCard, StatusBadge, SearchBar, FormInput, Pagination, dialogs)
├── features/     dashboard, leads, packages (page + slice per feature)
├── hooks/        usePagination
├── layout/       AppLayout, Sidebar, BottomNavigation
├── providers/    NotificationProvider
├── services/     Axios instance
├── store/        Redux store
└── utils/        formatters and constants
```

Components used in more than one place live in `components/`. Code used by one feature stays in that feature's folder.

## State Management

The `leads` and `packages` slices each hold `{ items, loading, error }`.

```
Component → dispatch(thunk) → Axios → Mock API → slice → store → useSelector → re-render
```

- Async thunks (`createAsyncThunk`) handle GET, POST, PUT and DELETE.
- `pending`, `fulfilled` and `rejected` drive loading and error states, and the UI updates without a page reload.
- Create, update and delete use `.unwrap()` in `try/catch`: dialogs close only on success, and failures show an error message.
- Search, filters, dialog state and the current page stay in local component state.

Dashboard stats are derived from the leads in the store. A lead with status **Converted** counts as a booking: Active Bookings is the count, Total Revenue is the sum of their budgets, and Upcoming Trips are those with a future travel date.

## Limitations

- Statistics, search, filters and pagination run on the client because the mock API has no backend logic.
- Bookings are derived from converted leads, with no separate resource.
- Package images are URLs only, with no upload.
- Authentication and the optional AI Lead Assistant are not included.

## Security

Dummy data only. No credentials or API keys are committed, and `.env` is excluded through `.gitignore`.
