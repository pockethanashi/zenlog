import React, { useEffect, useState } from "react";
import { auth, provider } from "./firebase";
import { signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import PostForm from "./components/PostForm";
import PostList from "./components/PostList"; // ← 投稿一覧コンポーネントのインポート

function App() {
  const [user, setUser] = useState(null);

  const login = () => {
    signInWithPopup(auth, provider);
  };

  const logout = () => {
    signOut(auth);
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Zenlog</h1>
      {user ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <p>こんにちは、{user.displayName} さん</p>
            <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded">
              ログアウト
            </button>
          </div>
          <PostForm user={user} />
          <PostList /> {/* ← 投稿一覧の表示を追加 */}
        </>
      ) : (
        <button onClick={login} className="bg-green-500 text-white px-4 py-2 rounded">
          Googleでログイン
        </button>
      )}
    </div>
  );
}

export default App;
