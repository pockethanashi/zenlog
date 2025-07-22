import React, { useState } from "react";

const samplePosts = [
  {
    id: 1,
    text: "朝の通勤時に、駅の階段でお年寄りの荷物を持ってあげていた人がいました。",
    likes: 3,
    category: "#やさしさ",
    location: "東京駅",
  },
  {
    id: 2,
    text: "雨の日に傘を分けてあげている学生さんを見ました。",
    likes: 5,
    category: "#思いやり",
    location: "渋谷駅",
  },
];

export default function App() {
  const [posts, setPosts] = useState(samplePosts);
  const [newPost, setNewPost] = useState("");

  const handleLike = (id) => {
    const updated = posts.map((post) =>
      post.id === id ? { ...post, likes: post.likes + 1 } : post
    );
    setPosts(updated);
  };

  const handleAddPost = () => {
    if (newPost.trim() === "") return;
    const newEntry = {
      id: Date.now(),
      text: newPost,
      likes: 0,
      category: "#善行",
      location: "未指定",
    };
    setPosts([newEntry, ...posts]);
    setNewPost("");
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-green-700">
        🌞 善ログ - 他人の善行を見つけよう
      </h1>

      <div className="mb-4">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          className="w-full p-2 border rounded"
          rows={3}
          placeholder="町で見かけた誰かの良い行いを記録しましょう..."
        ></textarea>
        <button
          onClick={handleAddPost}
          className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          投稿する
        </button>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="border p-4 rounded shadow-sm bg-white"
          >
            <p>{post.text}</p>
            <div className="text-sm text-gray-500 mt-1">
              {post.category} ・ {post.location}
            </div>
            <button
              onClick={() => handleLike(post.id)}
              className="mt-2 text-blue-600 hover:underline"
            >
              🌞 共感 ({post.likes})
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

