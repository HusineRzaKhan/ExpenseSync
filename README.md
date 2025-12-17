# ExpenseSync 📊💸

**ExpenseSync** is a full-stack expense tracking mobile application built with **React Native (Expo)** and a **Node.js + MongoDB backend**.
The app helps users track daily expenses, visualize spending, and manage finances efficiently.

---

## 🚀 Features

### 📱 Mobile App (Expo + React Native)

* User authentication (JWT based)
* Add, edit, delete expenses
* QR code generation & sharing
* Expense statistics & charts
* Calendar-based expense view
* Modern UI (Figma-based design)
* Works on Android (Expo Go / APK)

### 🌐 Backend (Node.js + Express)

* REST API
* MongoDB database
* JWT authentication
* Secure password hashing
* Scalable structure

---

## 🧱 Tech Stack

### Frontend (Mobile)

* React Native
* Expo SDK 54
* React Navigation
* Expo Sharing
* React Native Chart Kit
* Async Storage

### Backend

* Node.js
* Express.js
* MongoDB (Atlas)
* Mongoose
* JWT
* bcrypt

---

## 📁 Project Structure

```
ExpenseSync/
│
├── backend/              # Backend API
│   ├── node_modules/
│   ├── routes/
│   ├── models/
│   ├── controllers/
│   ├── .env
│   └── server.js
│
├── mobile/               # Expo mobile app
│   ├── node_modules/
│   ├── components/
│   ├── screens/
│   ├── App.js
│   ├── app.json
│   └── package.json
│
└── README.md
```

---

## 🔐 Environment Variables

### Backend `.env`

Create a `.env` file inside the `backend` folder:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

* **MONGO_URI** → MongoDB Atlas connection string
* **JWT_SECRET** → Any long random string (used for authentication)

---

## 🛠 Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/ExpenseSync.git
cd ExpenseSync
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend will start at:

```
http://localhost:5000
```

---

### 3️⃣ Mobile App Setup

```bash
cd mobile
npm install
npx expo start
```

* Press **`a`** to run on Android emulator
* Or scan QR using **Expo Go**

---

## 📦 Android APK (Optional)

You can build an APK using Expo:

```bash
npx expo prebuild
npx expo run:android
```

Or using EAS:

```bash
npx expo prebuild
npx expo run:android
```

---

## 🔗 QR Code App Download

The app supports QR-based download by redirecting users to a **direct APK link** hosted on:

* GitHub Releases

Best practice:

```
https://yourdomain.com/expensesync.apk
```

---

## 🎨 UI Design

* UI designed using **Figma**
* Designs are manually converted into React Native components
* Styling done using `StyleSheet`

---

## ⚠️ Common Issues & Fixes

### Expo dependency mismatch

```bash
npx expo install
```

### Navigation errors

```bash
npx expo install react-native-screens react-native-safe-area-context
```

### Clear cache

```bash
npx expo start -c
```

---

## 🧪 Development Notes

* Backend & mobile have **separate `node_modules`** (this is correct)
* Do NOT delete mobile or backend `node_modules`
* `.expo/` folder is ignored via `.gitignore`

---

## 🔒 Security Notes

* Never commit `.env` files
* Do not expose JWT secrets
* Use HTTPS for APK hosting

---

## 📄 License

This project is for **educational and personal use**.
You are free to modify and extend it.

---

## 🤝 Contribution

Pull requests are welcome.
For major changes, please open an issue first.

---

## 📬 Contact

Developed by **Hussain Raza**
If you have questions or suggestions, feel free to connect.