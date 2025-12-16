# ExpenseSync Backend

Minimal Express + MongoDB backend for ExpenseSync.

Setup

1. Copy `.env.example` to `.env` and set `MONGO_URI` and `JWT_SECRET`.

MongoDB Atlas notes

- Use a connection string that includes the database name and retry options, for example:

	`mongodb+srv://<username>:<password>@cluster0.6c7y1cc.mongodb.net/expensesync?retryWrites=true&w=majority`

- Ensure your Atlas cluster network access allows connections from your current IP address (or add 0.0.0.0/0 for quick testing).
- If you still get "bad auth", verify the username and password, URL-encode any special characters in the password, and avoid committing credentials to source control.

If using a local MongoDB, set `MONGO_URI=mongodb://localhost:27017/expensesync` instead.
2. Install dependencies: `npm install`.
3. Run: `npm run dev` (requires `nodemon`) or `npm start`.

APIs

- `POST /api/auth/signup` {name,email,password}
- `POST /api/auth/login` {email,password}
- `POST /api/transactions` (auth) create transaction
- `GET /api/transactions` (auth) list transactions
- `GET /api/transactions?date=YYYY-MM-DD` (auth) transactions for date
- `GET /api/transactions/daily-totals` (auth) aggregated totals
