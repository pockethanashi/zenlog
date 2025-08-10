// src/components/CommentList.js
import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";

function CommentList({ postId }) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "posts", postId, "comments"),
      orderBy("createdAt", "asc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setComments(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [postId]);

  return (
    <div className="mt-2">
      {comments.map((comment) => (
        <div key={comment.id} className="border-b py-1 text-sm text-gray-800">
          <strong>{comment.userName}</strong>: {comment.content}
        </div>
      ))}
    </div>
  );
}

export default CommentList;
