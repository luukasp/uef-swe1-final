# KinderHUB – Kindergarten Management System

KinderHUB is a full-stack platform designed to bridge the gap between teachers and parents. It allows for real-time attendance tracking, parent updates, and administrative oversight.

## 🚀 Tech Stack

### Frontend

* **Framework:** React 19 (via TanStack Start)
* **Routing:** TanStack Router (Type-safe routing)
* **State Management:** TanStack Query (Server-state)
* **Authentication:** Better Auth
* **Styling:** Tailwind CSS + Shadcn UI

### Backend

* **Runtime:** Node.js / Bun
* **Framework:** Hono (High-performance web framework)
* **Database:** PostgreSQL / SQLite (via Drizzle ORM)
* **Security:** Better Auth middleware

---

## 🛠️ Getting Started

### 1. Prerequisites

* [Node.js](https://nodejs.org/) (v18+) or [Bun](https://bun.sh/)
* A running PostgreSQL instance (or SQLite file)
* An `.env` file for both frontend and backend

### 2. Backend Setup

1. Navigate to the server directory:
```bash
cd backend

```


2. Install dependencies:
```bash
npm install

```


3. Configure your `.env`:
```env
DATABASE_URL=your_db_connection_string
BETTER_AUTH_SECRET=your_secret
VITE_API_LINK=http://localhost:3000

```


4. Run migrations:
```bash
npx drizzle-kit push

```


5. Start the server:
```bash
npm run dev

```



### 3. Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend

```


2. Install dependencies:
```bash
npm install

```


3. Configure your `.env`:
```env
VITE_API_LINK=http://localhost:3000

```


4. Start the development server:
```bash
npm run dev

```
