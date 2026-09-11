Edited package.json
Ran command: `npm run db:migrate`

Here are the commands to run both the **Backend** and **Frontend** on your laptop.

---

### Step 1: First-Time Setup (Run Once)

If setting up for the first time or on a new laptop, run this in your project root:

```bash
# 1. Install all dependencies (frontend + backend) & create .env files
npm run install:all

# 2. Apply database tables to Supabase Postgres (otps, users, payments, usage)
npm run db:migrate
```

---

### Step 2: Running the Projects Locally (Open 2 Terminals)

Because Frontend and Backend run as independent services with hot-reload, open **two terminal windows or tabs**:

#### Terminal 1 — Backend Server (`localhost:4000`)
Run from the root directory:
```bash
npm run server:dev
```
> **Alternative runner script**: You can also use our interactive runner:
> ```bash
> npm run server:local
> # Or auto-kill any port conflict:
> npm run server:local -- -k
> ```
> Backend will be live at: **`http://localhost:4000`** (Health check: `http://localhost:4000/api/health`)

---

#### Terminal 2 — Frontend App (`localhost:3000`)
Run from the root directory:
```bash
npm run dev
```
> Frontend will be live at: **`http://localhost:3000`**

---

### Summary of Handy Commands

| Action | Command (from project root) | Description |
| :--- | :--- | :--- |
| **Start Frontend** | `npm run dev` | Runs Vite dev server on port `3000` |
| **Start Backend** | `npm run server:dev` | Runs Express serverless backend on port `4000` with hot-reload |
| **Local Runner** | `npm run server:local` | Dedicated backend runner with port checks & flags |
| **Sync Database** | `npm run db:migrate` | Applies latest Drizzle schema migrations to Supabase |
| **Seed SuperAdmin** | `npm run db:seed` | Seeds SuperAdmin account into the database |
| **Database GUI** | `npm run db:studio` | Opens Drizzle Studio browser GUI to view tables & data |
| **Build Frontend** | `npm run build` | Compiles production bundle for Vercel deployment |
| **Build Backend** | `npm run server:build` | Compiles TypeScript backend bundle |