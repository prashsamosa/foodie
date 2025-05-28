import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDegmON3eLvy5bOvMLcWeFDRhOkXmfQ3gg",
  authDomain: "food-ordering-app-2a15b.firebaseapp.com",
  projectId: "food-ordering-app-2a15b",
  storageBucket: "food-ordering-app-2a15b.firebasestorage.app",
  messagingSenderId: "679998251687",
  appId: "1:679998251687:web:0690a71e9a795b1bf93182",
  measurementId: "G-6Z43ZQZ1E0"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
