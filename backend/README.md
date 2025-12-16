# ExpenseSync Backend

Minimal Express + MongoDB backend for ExpenseSync.

Setup

1. Copy `.env.example` to `.env` and set `MONGO_URI` and `JWT_SECRET`.
2. Install dependencies: `npm install`.
3. Run: `npm run dev` (requires `nodemon`) or `npm start`.

APIs

- `POST /api/auth/signup` {name,email,password}
- `POST /api/auth/login` {email,password}
- `POST /api/transactions` (auth) create transaction
- `GET /api/transactions` (auth) list transactions
- `GET /api/transactions?date=YYYY-MM-DD` (auth) transactions for date
- `GET /api/transactions/daily-totals` (auth) aggregated totals
