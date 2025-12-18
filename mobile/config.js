// Mobile configuration
// This file tries to pick a sensible API_URL depending on environment:
// - In Expo dev, it derives the host IP from the debuggerHost so a physical device
//   running the Expo client can reach your local backend.
// - For standalone APKs, set `PRODUCTION_API` below to your deployed backend URL.

import Constants from 'expo-constants';

const PRODUCTION_API = ''; // e.g. 'https://api.myserver.com/api' - set before building standalone APK

function deriveHost() {
  try {
    const dbg = Constants.manifest?.debuggerHost || Constants.manifest2?.debuggerHost || '';
    if (dbg) {
      return dbg.split(':')[0];
    }
  } catch (e) {}
  return null;
}

const host = deriveHost();
let API_URL = '';
if (host) {
  // assume backend runs on port 5000 on dev machine
  API_URL = `http://${host}:5000/api`;
} else if (PRODUCTION_API) {
  API_URL = PRODUCTION_API;
} else {
  // fallback to emulator host; works only on Android emulator
  API_URL = 'http://10.0.2.2:5000/api';
}

export default {
  API_URL,
};
