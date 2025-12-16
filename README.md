# ExpenseSync
# ExpenseSync

ExpenseSync is a mobile expense tracking application scaffolded with a MERN-style backend and an Expo React Native frontend.

Workspace layout

- backend/: Express + MongoDB API
- mobile/: Expo React Native app (screens, QR share component)

Quick start

1. Backend

```powershell
cd backend
npm install
copy .env.example .env
# edit .env to set MONGO_URI and JWT_SECRET
npm run dev
```

2. Mobile (Expo)

```powershell
cd mobile
npm install
# set backend IP in mobile/screens/*.js (replace <SERVER_IP>)
npm start
```

Notes

- The backend includes auth (JWT), transaction model, and placeholder notification endpoints.
- The mobile app is a minimal skeleton demonstrating login, recording an expense, and QR sharing.

Next steps

- Hook up push notifications (FCM/APNs) for instant/daily/weekly notifications.
- Add calendar view and analytics UI in the mobile app.
- Add secure local token storage on mobile and input validation.
