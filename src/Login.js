// src/Login.js
import React, { useEffect, useState } from "react";
import { auth, provider } from "./firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

const Login = ({ setUser }) => {
  const [localUser, setLocalUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setLocalUser(currentUser);
      setUser(currentUser); // App.js に通知
    });
    return () => unsubscribe();
  }, [setUser]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <div className="p-4 border rounded shadow bg-white">
      {localUser ? (
        <div>
          <p>こんにちは、{localUser.displayName} さん</p>
          <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 mt-2 rounded">
            ログアウト
          </button>
        </div>
      ) : (
        <button onClick={handleLogin} className="bg-blue-500 text-white px-3 py-1 rounded">
          Googleでログイン
        </button>
      )}
    </div>
  );
};


export default Login;
