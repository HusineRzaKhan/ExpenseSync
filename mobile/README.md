# ExpenseSync Mobile (Expo)

This is a minimal Expo React Native skeleton for ExpenseSync.

Replace `<SERVER_IP>` in `screens/*.js` with your backend IP (for emulator use `10.0.2.2` or local network IP for device).

Install dependencies:

```bash
cd mobile
npm install
npm start
```

Additional native-capable packages required for the new UI (run in `mobile`):

```powershell
npx expo install react-native-calendars react-native-chart-kit react-native-svg expo-image-picker @react-native-async-storage/async-storage @react-navigation/bottom-tabs
npx expo install @react-native-async-storage/async-storage
Additionally, to support PDF download & sharing, install:

```powershell
npx expo install expo-file-system expo-sharing

Also install the native picker and icon helpers:

```powershell
npx expo install @react-native-picker/picker
npm install react-native-vector-icons
```

Icons

- Put app icons and other images under `mobile/assets/icons/` (create the folder).
- Reference them in code with `require('../assets/icons/my-icon.png')` or use vector icons from `react-native-vector-icons`.

```
```

Then restart Metro with cache clear:

```powershell
npx expo start -c
```
