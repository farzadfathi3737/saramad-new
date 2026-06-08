# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development (port 3100)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint
npm run lint

# Format code
npm run format

# Check formatting without writing
npm run format:check
```

No test suite is configured in this project.

## Environment Variables

```
NEXT_PUBLIC_EXTERNAL_API=<backend URL>
```

This variable is required at build and runtime. All API proxy routes and rewrites depend on it.

## Architecture

### API Flow

All backend calls go through the Next.js API proxy at `/api/proxy/[...path]`. The proxy:
1. Reads the `token` HttpOnly cookie (JSON with `accessToken` and `refreshToken`)
2. Forwards the request to `NEXT_PUBLIC_EXTERNAL_API` with `Authorization: Bearer <accessToken>`
3. On 401, automatically refreshes the token via `/api/Membership/User/refresh-token` and retries
4. On refresh failure, deletes the cookie and returns 401

Client-side code calls `/cloud/<path>` which is rewritten in `next.config.ts` directly to the external API (bypassing the proxy). When auth is needed, call `/api/proxy/<path>` instead, using `apiFetch()` from `lib/apiFetch.ts`.

`apiFetch` automatically includes cookies (`credentials: 'include'`) and redirects to `/login` on 401.

### Tab-based Navigation

The app does not use standard Next.js page routing for feature navigation. Instead, `app/components/tabPage.tsx` is the central router — it maintains up to 7 concurrent tabs in Redux state. All feature components are imported directly into `tabPage.tsx` and rendered based on the active tab's `key` field.

To add a new page/view:
1. Import the component in `tabPage.tsx`
2. Add a `case` for its tab key in the component switch
3. Add a menu item in `app/Sidebar.tsx` that dispatches `setTabs` with the correct key

Tab state (`tabs`, `activeTab`) is persisted in both Redux and `localStorage`.

### Redux State (`store/appConfigSlice.tsx`)

Global state contains only three things:
- `company` — selected company (`id`, `name`, `backgroundColor`, `textColor`)
- `fiscalYear` — selected fiscal year (`id`, `name`, `begin`, `end`)
- `tabs` / `activeTab` — tab management

All three are automatically synced to `localStorage` on every change.

### Data Model System

Business entities are defined as `IDataModel` objects in `generated/modelsD.json` and extended/overridden in `models/entity.js` via `uiLists`. Each model describes:
- `list` — GET endpoint + response columns for the data table
- `register` — POST endpoint + request body fields for create form
- `update` — PUT endpoint + request body fields for edit form
- `delete` — DELETE endpoint
- `read` — GET single record endpoint

Feature pages (`app/Shareholding/<feature>/index.tsx`) call `getEntityModel('<name>')` to get the model, then pass it to the `<Demo>` datatable component. This drives both the table columns and the inline create/edit forms.

### Feature Module Pattern

Each feature under `app/Shareholding/<feature>/` follows this structure:
- `index.tsx` — list page, uses `Demo` (MRT datatable) with the entity model
- `add.tsx` — create form
- `[id]/index.tsx` — edit form (some older modules use `[id].tsx` directly)

Some complex features have sub-pages (e.g. `shareMeeting/capitalraise/`, `transactionImportsession/[id]/`).

### Key Shared Components

- **`app/components/Datatable/MRT.tsx`** — wraps Mantine React Table. Accepts a `DatatableProps` with the entity model and handles data fetching, pagination, filtering, inline forms, and row actions.
- **`app/components/Forms/index.tsx`** — form wrapper used by MRT for create/edit dialogs
- **`app/components/inputs/`** — individual input field components (`selectField`, `selectModelField`, date inputs, etc.) used inside Formik forms
- **`app/components/tabPage.tsx`** — the main content area; renders the active tab's component
- **`app/Sidebar.tsx`** — navigation menu; dispatches `setTabs` to open new tabs

### Internationalization

Language is managed by `contexts/LanguageContext.jsx`. Supported locales: `fa` (Persian, RTL, default) and `en`. Translations are in `locales/fa.json` and `locales/en.json`. Use the `useLanguage()` hook to get the `t()` function in components.

RTL direction is applied at the root via Mantine's `DirectionProvider` in `app/layout.tsx`.

### Authentication

- Login: `POST /api/auth/login` sets an HttpOnly `token` cookie
- Logout: `POST /api/auth/logout` clears the cookie
- Middleware (`middleware.ts`) currently allows all routes (the redirect guard is commented out)
- Token structure: `{ accessToken: string, refreshToken: string }`

## Important Patterns

- **Never call the external API directly from client components.** Always go through `/api/proxy/` (with `apiFetch`) or the `/cloud/` rewrite.
- **Company and fiscal year IDs** must be included as query parameters in most API calls. Read them from Redux store via `useSelector`.
- **`modelsD.json` is auto-generated** — do not edit it manually. Override specific models in `models/entity.js` using the spread pattern: `{ ...Models.entityName, list: { ...customList } }`.
- **Adding a new Shareholding module**: create the folder under `app/Shareholding/`, add the model key to `entity.js` if needed, import the component(s) in `tabPage.tsx`, and add the sidebar entry in `Sidebar.tsx`.
