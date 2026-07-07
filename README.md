# Mini ERP – Frontend

Inventory & Sales Management System — Frontend built with React, TypeScript, React Router, Tailwind CSS, Shadcn/ui, Redux Toolkit, and TanStack Query.

## Tech Stack

- React 19 + TypeScript (Vite)
- React Router v7
- Tailwind CSS v4 + Shadcn/ui
- Redux Toolkit (auth/session state)
- TanStack Query (server state — API data fetching, caching, mutations)
- Axios (HTTP client)

## Features

- Login with JWT-based authentication
- Protected & role-based routes
- Dashboard with statistics cards and low-stock product list
- Product management: list, search, pagination, add, edit, delete (with image upload)
- Sales: create a sale with multiple products, quantity input, and automatic total calculation
- Role-aware UI (Employee cannot see Add/Edit/Delete product actions)

## Project Structure

```
Frontend/
├── src/
│   ├── app/
│   │   ├── store.ts
│   │   └── hooks.ts
│   ├── features/
│   │   ├── auth/
│   │   │   ├── authApi.ts
│   │   │   ├── authSlice.ts
│   │   │   └── LoginPage.tsx
│   │   ├── products/
│   │   │   ├── productApi.ts
│   │   │   ├── ProductsPage.tsx
│   │   │   └── ProductFormPage.tsx
│   │   ├── sales/
│   │   │   ├── saleApi.ts
│   │   │   └── CreateSalePage.tsx
│   │   └── dashboard/
│   │       ├── dashboardApi.ts
│   │       └── DashboardPage.tsx
│   ├── components/
│   │   ├── ui/            # Shadcn components
│   │   └── Layout.tsx
│   ├── routes/
│   │   └── ProtectedRoute.tsx
│   ├── lib/
│   │   └── axios.ts
│   ├── types/
│   │   └── product.ts
│   ├── App.tsx
│   └── main.tsx
├── .env
├── package.json
└── vite.config.ts
```

## Prerequisites

- Node.js (v18 or higher recommended)
- The Backend API running (locally or deployed)

## Installation & Setup

1. **Clone the repository**

   ```bash
   git clone <frontend-repo-url>
   cd Frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure the API base URL**

   Open `src/lib/axios.ts` and set `baseURL` to point to your backend:

   ```ts
   const api = axios.create({
     baseURL: "http://localhost:5000/api", // change to your deployed backend URL in production
   });
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`.

5. **Build for production**

   ```bash
   npm run build
   npm run preview
   ```

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Login Credentials (for testing)

- Email: `admin@erp.com`
- Password: `Admin@123`

## Role-Based Access

| Role | Can view products | Can add/edit/delete products | Can create sales |
|---|---|---|---|
| Admin | ✅ | ✅ | ✅ |
| Manager | ✅ | ✅ | ✅ |
| Employee | ✅ | ❌ | ✅ |

The UI hides Add/Edit/Delete actions for the Employee role, and routes are additionally protected on both the frontend (route guards) and backend (authorization middleware).