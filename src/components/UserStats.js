// src/components/UserStats.js
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

function UserStats({ user }) {
  const [stats, setStats] = useState({
    postCount: 0,
    receivedLikes: 0,
    likeGiven: 0,
  });

  const [weights, setWeights] = useState({
    a: 1,
    b: 1,
    c: 1,
  });

  const calculatePoints = () => {
    const { postCount, receivedLikes, likeGiven } = stats;
    const { a, b, c } = weights;
    return a * postCount + b * receivedLikes + c * likeGiven;
  };

  useEffect(() => {
    const fetchStatsAndWeights = async () => {
      try {
        // ユーザー統計情報取得
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setStats((prev) => ({
            ...prev,
            ...userSnap.data(),
          }));
        }

        // 重み係数取得（Firestore の settings/general ドキュメント）
        const settingsRef = doc(db, "settings", "weights");
        const settingsSnap = await getDoc(settingsRef);
        if (settingsSnap.exists()) {
          const data = settingsSnap.data();
          setWeights({
            a: data.a ?? 1,
            b: data.b ?? 1,
            c: data.c ?? 1,
          });
        }
      } catch (error) {
        console.error("データの取得に失敗:", error);
      }
    };

    if (user) {
      fetchStatsAndWeights();
    }
  }, [user]);

  return (
    <div className="bg-gray-100 p-4 rounded shadow mb-6">
      <h3 className="font-bold mb-2">あなたの活動</h3>
      <div className="flex items-center text-green-700 mb-1">
        <CheckCircleIcon className="h-5 w-5 mr-2" />
        あなたの投稿数：{stats.postCount} 件
      </div>
      <div className="flex items-center text-blue-700 mb-1">
        <CheckCircleIcon className="h-5 w-5 mr-2" />
        受け取ったいいね：{stats.receivedLikes} 件
      </div>
      <div className="flex items-center text-yellow-700 mb-1">
        <CheckCircleIcon className="h-5 w-5 mr-2" />
        他の投稿にいいねした数：{stats.likeGiven} 件
      </div>
      <div className="flex items-center text-purple-700 font-semibold text-lg mt-2">
        <CheckCircleIcon className="h-6 w-6 mr-2" />
        あなたのポイント：{calculatePoints()} pt
      </div>
    </div>
  );
}

export default UserStats;
