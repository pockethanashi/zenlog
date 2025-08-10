// src/components/CommentForm.js
import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

function CommentForm({ postId, user, userName }) {
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    await addDoc(collection(db, "posts", postId, "comments"), {
      userId: user.uid,
      userName: userName || "匿名", // ✅ 修正：props経由のニックネームを使用
      content,
      createdAt: serverTimestamp(),
    });

    setContent("");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2">
      <input
        className="border px-2 py-1 w-full rounded mb-1"
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="コメントを書く..."
      />
      <button type="submit" className="text-sm bg-blue-500 text-white px-3 py-1 rounded">
        投稿
      </button>
    </form>
  );
}

export default CommentForm;
