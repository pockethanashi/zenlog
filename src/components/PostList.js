import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

function PostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postData);
    });

    return () => unsubscribe(); // クリーンアップ
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">みんなの善行</h2>
      {posts.map((post) => (
        <div key={post.id} className="mb-4 p-4 border rounded shadow">
          <p className="text-sm text-gray-600">{post.userName}</p>
          <p className="text-lg mt-2">{post.content}</p>
          <p className="text-right text-xs text-gray-500">いいね: {post.likes}</p>
        </div>
      ))}
    </div>
  );
}

export default PostList;
