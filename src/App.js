import React, { useEffect, useState } from "react";
import {
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { auth, provider } from "./firebase";
import PostForm from "./components/PostForm";
import PostList from "./components/PostList";

function App() {
  const [user, setUser] = useState(null);

  const login = () => {
    signInWithRedirect(auth, provider);
  };

  const logout = () => {
    signOut(auth);
  };

  useEffect(() => {
    // Firebase auth state listener
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // After redirect, get user result
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          setUser(result.user);
        }
      })
      .catch((error) => {
        console.error("ログインエラー:", error);
      });

    return () => unsubscribe();
  }, []);

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Zenlog</h1>
      {user ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <p>こんにちは、{user.displayName} さん</p>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              ログアウト
            </button>
          </div>
          <PostForm user={user} />
          <PostList />
        </>
      ) : (
        <button
          onClick={login}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Googleでログイン
        </button>
      )}
    </div>
  );
}

export default App;
