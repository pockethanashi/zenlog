// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase コンソールから取得した設定情報を貼り付けてください
const firebaseConfig = {
  apiKey: "AIzaSyCQVB95Z4j3hxkunLTC29YA3-PUxEtB5hM",
  authDomain: "zenlog-1ba66.firebaseapp.com",
  projectId: "zenlog-1ba66",
  storageBucket: "zenlog-1ba66.firebasestorage.app",
  messagingSenderId: "130268338444",
  appId: "1:130268338444:web:31a81a53d76b7e90efd129",
  measurementId: "G-YWN8Z0WCHH"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app); // 今後 Firestore を使う場合
