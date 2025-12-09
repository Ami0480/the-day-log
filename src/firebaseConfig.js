import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDd5yd5bq-dIE-kpw3RLxnHgsELe5MmxQ0",
  authDomain: "diary-app-7eef9.firebaseapp.com",
  projectId: "diary-app-7eef9",
  storageBucket: "diary-app-7eef9.firebasestorage.app",
  messagingSenderId: "458063018506",
  appId: "1:458063018506:web:695fc7e30953f0e34c3df3",
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const db = getFirestore(app);
export const storage = getStorage(app);
