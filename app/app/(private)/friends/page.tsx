"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { getFriendsList } from "@/services/friendship";

interface Friend {
  id: number;
  user: {
    username: string;
    is_online: boolean;
  };
  bio?: string;
  avatar?: string | null;
}

const FriendsPage = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFriends = async () => {
      try {
        const response = await getFriendsList();
        setFriends(response.data || []);
      } catch (error) {
        console.error("Erro ao carregar amigos:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFriends();
  }, []);

  return (
    <div className="grid grid-cols-12 grid-rows-24 gap-2 h-dvh">
      <Header />

      <div className="row-span-23 row-start-3 col-span-12 flex items-center justify-center">
        <div className="w-full max-w-[600px] h-[75vh] bg-[#fbb034] border-4 border-[#5d1a1a] rounded-xl overflow-hidden flex flex-col">
          
          {/* Header do Card */}
          <div className="bg-[#8b2b2b] p-2 border-b-4 border-[#5d1a1a] flex justify-between items-center px-4">
            <h1 className="text-3xl text-[#fbb034] tracking-wider uppercase font-bold">
              Friends
            </h1>
            <Link
              href="/home"
              className="text-[#fbb034] hover:text-white text-sm font-bold border-2 border-[#fbb034] px-2 py-1 rounded"
            >
              Go Back
            </Link>
          </div>

          {/* Área com SCROLL */}
          <div className="p-6 text-[#5d1a1a] overflow-y-auto flex-1">
            {loading ? (
              <p className="font-bold italic">Loading friends...</p>
            ) : friends.length === 0 ? (
              <p className="font-bold italic">You have no friends yet 😢</p>
            ) : (
              <div className="flex flex-col gap-4">
                {friends.map((friend) => (
                  <div
                    key={friend.id}
                    className="flex gap-4 items-start bg-[#fcc15a] border-4 border-[#5d1a1a] p-3 rounded-lg shadow-[4px_4px_0px_0px_#5d1a1a]"
                  >
                    {/* Avatar */}
                    <div className="w-16 h-16 bg-[#4a90e2] border-4 border-[#1a1a1a] rounded-lg overflow-hidden flex items-center justify-center">
                      {friend.avatar ? (
                        <img
                          src={`http://localhost:8000${friend.avatar}`}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-3xl">🐱</span>
                      )}
                    </div>

                    {/* Infos */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold">
                          {friend.user.username}
                        </h2>
                        <span
                          className={`text-xs font-black px-2 py-0.5 rounded ${
                            friend.user.is_online
                              ? "bg-teal-700 text-white"
                              : "bg-gray-600 text-white"
                          }`}
                        >
                          {friend.user.is_online ? "ONLINE" : "OFFLINE"}
                        </span>
                      </div>

                      <p className="text-sm italic opacity-80 mt-1">
                        {friend.bio && friend.bio !== '""'
                          ? friend.bio
                          : "No bio yet..."}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Fim área scroll */}
        </div>
      </div>
    </div>
  );
};

export default FriendsPage;
