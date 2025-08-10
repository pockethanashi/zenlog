// src/components/PostForm.js
import React, { useState } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";

function PostForm({ user, userName }) {
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content) return;

    try {
      await addDoc(collection(db, "posts"), {
        userId: user.uid,
        userName: userName, // ✅ Firestoreから取得した名前を使用
        content,
        createdAt: serverTimestamp(),
        likes: 0,
      });

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        postCount: increment(1),
      });

      setContent("");
    } catch (err) {
      console.error("❌ 投稿に失敗:", err);
      alert("投稿に失敗しました。ネットワークや権限をご確認ください。");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <textarea
        className="w-full p-2 border rounded"
        placeholder="今日見つけた善行をほめよう！"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
      />
      <button type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
        投稿
      </button>
    </form>
  );
}

export default PostForm;
