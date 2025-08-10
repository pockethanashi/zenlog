import React, { useEffect, useState } from "react";
import {
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { auth, provider } from "./firebase";
import PostForm from "./components/PostForm";
import PostList from "./components/PostList";
import UserStats from "./components/UserStats";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

function App() {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");       // 入力/表示用のユーザー名
  const [isNameSet, setIsNameSet] = useState(false);  // 名前が設定済みかどうか

  const login = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      console.error("ログイン失敗:", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/zenlog/";
    } catch (error) {
      console.error("ログアウト失敗:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        console.log("ログイン中のUID:", currentUser.uid);
        setUser(currentUser);

        const userRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(userRef);

        if (!docSnap.exists()) {
          await setDoc(userRef, {
            postCount: 0,
            receivedLikes: 0,
            likeGiven: 0,
            displayName: currentUser.displayName || "",
          });
          setUserName(currentUser.displayName || "");
          setIsNameSet(!!currentUser.displayName);
        } else {
          const data = docSnap.data();
          setUserName(data.displayName || "");
          setIsNameSet(!!data.displayName);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-green-600 text-white py-4 shadow-md">
          <div className="max-w-xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">みんなでいいことほめていこう～</h1>
            <a
              href="/zenlog/about.html"
              className="text-sm underline hover:text-gray-200"
            >
              このアプリについて
            </a>
          </div>
      </header>


      {/* コンテンツ */}
      <main className="max-w-xl mx-auto p-6">
        {user ? (
          <>
            <div className="flex justify-between items-center mb-4">
              {!isNameSet ? (
                <div>
                  <p className="mb-1">ユーザー名を設定してください：</p>
                  <div className="flex">
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="border px-2 py-1 rounded mr-2 flex-1"
                    />
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                      onClick={async () => {
                        const userRef = doc(db, "users", user.uid);
                        await setDoc(userRef, { displayName: userName }, { merge: true });
                        setIsNameSet(true);
                      }}
                    >
                      保存
                    </button>
                  </div>
                </div>
              ) : (
                <p>こんにちは、{userName} さん</p>
              )}
              <button
                onClick={logout}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                ログアウト
              </button>
            </div>

            <PostForm user={user} userName={userName} />
            <UserStats user={user} userName={userName} />
            <PostList user={user} userName={userName} />
          </>
        ) : (
          <div className="flex justify-center">
            <button
              onClick={login}
              className="bg-green-600 text-white px-4 py-2 rounded shadow"
            >
              Googleでログイン
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
