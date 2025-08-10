import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  increment,
  serverTimestamp,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { ChatBubbleLeftIcon, TrashIcon, HandThumbUpIcon } from "@heroicons/react/24/outline";

function PostList({ user, userName }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPosts(postData);
    });
    return () => unsubscribe();
  }, []);

  const handleLike = async (postId, postUserId) => {
    if (!user) return;
    const likeRef = doc(db, "posts", postId, "likesBy", user.uid);
    const likeSnap = await getDoc(likeRef);

    if (!likeSnap.exists()) {
      await setDoc(likeRef, {
        userId: user.uid,
        userName: userName, // ← 修正
        createdAt: serverTimestamp(),
      });
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, {
        likes: increment(1),
      });
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        likeGiven: increment(1),
      });
      const postUserRef = doc(db, "users", postUserId);
      await updateDoc(postUserRef, {
        receivedLikes: increment(1),
      });
    }
  };

  const handleCommentSubmit = async (postId, commentText) => {
    if (!user || !commentText.trim()) return;
    const commentRef = collection(db, "posts", postId, "comments");
    await addDoc(commentRef, {
      userId: user.uid,
      userName: userName, // ← 修正
      text: commentText.trim(),
      createdAt: serverTimestamp(),
    });
  };

  const handleCommentDelete = async (postId, commentId) => {
    if (!user) return;
    const commentRef = doc(db, "posts", postId, "comments", commentId);
    const snap = await getDoc(commentRef);
    if (snap.exists() && snap.data().userId === user.uid) {
      await deleteDoc(commentRef);
    }
  };

  const handleDeletePost = async (postId) => {
    const isAdmin = user?.uid === "1DkaD96Z55cL4MFdCDrUyPneu572"; // 管理者UID
    if (isAdmin && window.confirm("この投稿を削除しますか？")) {
      await deleteDoc(doc(db, "posts", postId));
    }
  };

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div key={post.id} className="border p-4 rounded shadow bg-white">
          <div className="flex justify-between items-center">
            <h4 className="font-bold">{post.userName}</h4>
            {user?.uid === "1DkaD96Z55cL4MFdCDrUyPneu572" && (
              <button onClick={() => handleDeletePost(post.id)}>
                <TrashIcon className="w-5 h-5 text-red-500" />
              </button>
            )}
          </div>
          <p className="mt-2 whitespace-pre-wrap">{post.content}</p>
          <div className="mt-2 flex items-center space-x-4">
            <button
              onClick={() => handleLike(post.id, post.userId)}
              className="flex items-center text-sm text-blue-500"
            >
              <HandThumbUpIcon className="w-5 h-5 mr-1" />いいね ({post.likes || 0})
            </button>
          </div>

          <CommentSection
            postId={post.id}
            user={user}
            onSubmitComment={handleCommentSubmit}
            onDeleteComment={handleCommentDelete}
          />
        </div>
      ))}
    </div>
  );
}

function CommentSection({ postId, user, onSubmitComment, onDeleteComment }) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "posts", postId, "comments"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setComments(commentData);
    });
    return () => unsubscribe();
  }, [postId]);

  return (
    <div className="mt-4">
      {comments.map((c) => (
        <div key={c.id} className="flex justify-between items-center bg-gray-100 px-2 py-1 rounded mb-1">
          <span className="text-sm">
            <strong>{c.userName}：</strong> {c.text}
          </span>
          {user?.uid === c.userId && (
            <button onClick={() => onDeleteComment(postId, c.id)}>
              <TrashIcon className="w-4 h-4 text-red-400" />
            </button>
          )}
        </div>
      ))}
      <div className="flex items-center mt-2">
        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="flex-1 border px-2 py-1 rounded text-sm"
          placeholder="コメントを入力..."
        />
        <button
          onClick={() => {
            onSubmitComment(postId, comment);
            setComment("");
          }}
          className="ml-2 text-sm bg-green-500 text-white px-2 py-1 rounded"
        >
          投稿
        </button>
      </div>
    </div>
  );
}

export default PostList;
