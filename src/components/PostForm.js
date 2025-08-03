// src/components/PostForm.js
import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

function PostForm({ user }) {
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content) return;

    try {
      await addDoc(collection(db, "posts"), {
        userId: user.uid,
        userName: user.displayName,
        content,
        createdAt: serverTimestamp(),
        likes: 0,
      });
      setContent(""); // 投稿後にクリア
      console.log("✅ 投稿が成功しました");
    } catch (err) {
      console.error("❌ 投稿に失敗しました:", err);
      alert("投稿に失敗しました。ネットワークや権限設定をご確認ください。");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <textarea
        className="w-full p-2 border rounded"
        placeholder="今日の善行を記録しよう！"
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
