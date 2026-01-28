"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import NgrokImage from "@/components/NgrokImage";
import { getFriendsList, getPendingRequestsList, sendFriendRequest, acceptFriendRequest, rejectFriendRequest } from "@/services/friendship";
import { getAllActiveUsers } from "@/services/profile";
import { Profile, FriendRequest } from "@/types/user";

type TabType = "friends" | "find" | "requests";

// Separate component to handle search params (needs Suspense)
function FriendsPageContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as TabType) || "friends";

  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [friends, setFriends] = useState<Profile[]>([]);
  const [allUsers, setAllUsers] = useState<Profile[]>([]);
  const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Update activeTab when URL changes
  useEffect(() => {
    const tabParam = searchParams.get("tab") as TabType;
    if (tabParam && ["friends", "find", "requests"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Load data
  const loadData = async () => {
    setLoading(true);
    try {
      const [friendsRes, usersRes, requestsRes] = await Promise.all([
        getFriendsList(),
        getAllActiveUsers(),
        getPendingRequestsList(),
      ]);
      setFriends(friendsRes.data || []);
      setAllUsers(usersRes.data || []);
      setPendingRequests(requestsRes.data || []);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Clear action message after 3 seconds
  useEffect(() => {
    if (actionMessage) {
      const timer = setTimeout(() => setActionMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [actionMessage]);

  // Check if user is already a friend
  const isFriend = (userId: number) => {
    return friends.some((f) => f.id === userId);
  };

  // Check if there's a pending request from this user
  const hasPendingRequestFrom = (userId: number) => {
    return pendingRequests.some((r) => r.from_user.id === userId);
  };

  // Handle sending friend request
  const handleSendRequest = async (toUserId: number) => {
    try {
      await sendFriendRequest(toUserId);
      setActionMessage({ type: "success", text: "Friend request sent!" });
      loadData(); // Refresh data
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Failed to send friend request";
      setActionMessage({ type: "error", text: errorMsg });
    }
  };

  // Handle accepting friend request
  const handleAcceptRequest = async (requestId: number) => {
    try {
      await acceptFriendRequest(requestId);
      setActionMessage({ type: "success", text: "Friend request accepted!" });
      loadData();
    } catch (error) {
      setActionMessage({ type: "error", text: "Failed to accept request" });
    }
  };

  // Handle rejecting friend request
  const handleRejectRequest = async (requestId: number) => {
    try {
      await rejectFriendRequest(requestId);
      setActionMessage({ type: "success", text: "Friend request rejected" });
      loadData();
    } catch (error) {
      setActionMessage({ type: "error", text: "Failed to reject request" });
    }
  };

  // Filter users based on search query
  const filteredUsers = allUsers.filter((user) =>
    user.user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Tab button component
  const TabButton = ({ tab, label, count }: { tab: TabType; label: string; count?: number }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-2 font-bold text-sm uppercase tracking-wide transition-colors ${
        activeTab === tab
          ? "bg-[#fbb034] text-[#5d1a1a] border-b-4 border-[#5d1a1a]"
          : "bg-[#8b2b2b] text-[#fbb034] hover:bg-[#a33] border-b-4 border-transparent"
      }`}
    >
      {label}
      {count !== undefined && count > 0 && (
        <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-red-500 text-white">
          {count}
        </span>
      )}
    </button>
  );

  // User card component
  const UserCard = ({
    profile,
    showStatus = false,
    actionButton,
  }: {
    profile: Profile;
    showStatus?: boolean;
    actionButton?: React.ReactNode;
  }) => (
    <div className="flex gap-4 items-center bg-[#fcc15a] border-4 border-[#5d1a1a] p-3 rounded-lg shadow-[4px_4px_0px_0px_#5d1a1a]">
      <div className="w-14 h-14 bg-[#4a90e2] border-3 border-[#1a1a1a] rounded-lg overflow-hidden flex items-center justify-center">
        <NgrokImage
          src={profile.avatar}
          alt="Avatar"
          className="w-full h-full object-cover"
          fallback={<span className="text-2xl">🐱</span>}
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-[#5d1a1a]">{profile.user.username}</h2>
          {showStatus && (
            <span
              className={`text-xs font-black px-2 py-0.5 rounded ${
                profile.user.is_online ? "bg-teal-700 text-white" : "bg-gray-600 text-white"
              }`}
            >
              {profile.user.is_online ? "ONLINE" : "OFFLINE"}
            </span>
          )}
        </div>
        {profile.bio && profile.bio !== '""' && (
          <p className="text-sm italic opacity-80 text-[#5d1a1a] truncate">{profile.bio}</p>
        )}
      </div>
      {actionButton && <div className="flex-shrink-0">{actionButton}</div>}
    </div>
  );

  return (
    <div className="grid grid-cols-12 grid-rows-24 gap-2 h-dvh">
      <Header />

      <div className="row-span-23 row-start-3 col-span-12 flex items-center justify-center">
        <div className="w-full max-w-[600px] h-[80vh] bg-[#fbb034] border-4 border-[#5d1a1a] rounded-xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-[#8b2b2b] p-2 border-b-4 border-[#5d1a1a] flex justify-between items-center px-4">
            <h1 className="text-3xl text-[#fbb034] tracking-wider uppercase font-bold">Friends</h1>
            <Link
              href="/home"
              className="text-[#fbb034] hover:text-white text-sm font-bold border-2 border-[#fbb034] px-2 py-1 rounded"
            >
              Go Back
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex bg-[#8b2b2b]">
            <TabButton tab="friends" label="My Friends" />
            <TabButton tab="find" label="Find Friends" />
            <TabButton tab="requests" label="Requests" count={pendingRequests.length} />
          </div>

          {/* Action Message */}
          {actionMessage && (
            <div
              className={`px-4 py-2 text-center font-bold ${
                actionMessage.type === "success"
                  ? "bg-green-500 text-white"
                  : "bg-red-500 text-white"
              }`}
            >
              {actionMessage.text}
            </div>
          )}

          {/* Search bar for Find Friends tab */}
          {activeTab === "find" && (
            <div className="p-4 border-b-4 border-[#5d1a1a]">
              <input
                type="text"
                placeholder="Search by username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border-3 border-[#5d1a1a] rounded-lg text-[#5d1a1a] font-bold placeholder-[#5d1a1a]/50 focus:outline-none focus:ring-2 focus:ring-[#5d1a1a]"
              />
            </div>
          )}

          {/* Content area */}
          <div className="p-4 text-[#5d1a1a] overflow-y-auto flex-1">
            {loading ? (
              <p className="font-bold italic text-center py-8">Loading...</p>
            ) : (
              <>
                {/* My Friends Tab */}
                {activeTab === "friends" && (
                  <>
                    {friends.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="font-bold italic mb-4">You have no friends yet</p>
                        <button
                          onClick={() => setActiveTab("find")}
                          className="px-4 py-2 bg-[#5d1a1a] text-[#fbb034] font-bold rounded-lg hover:bg-[#3a0f0f] transition-colors"
                        >
                          Find Friends
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {friends.map((friend) => (
                          <UserCard key={friend.id} profile={friend} showStatus />
                        ))}
                      </div>
                    )}
                  </>
                )}

                {/* Find Friends Tab */}
                {activeTab === "find" && (
                  <>
                    {filteredUsers.length === 0 ? (
                      <p className="font-bold italic text-center py-8">
                        {searchQuery ? "No users found" : "No users available"}
                      </p>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {filteredUsers.map((user) => {
                          const alreadyFriend = isFriend(user.id);
                          const hasRequest = hasPendingRequestFrom(user.id);

                          let actionButton = null;
                          if (alreadyFriend) {
                            actionButton = (
                              <span className="px-3 py-1 bg-teal-700 text-white text-xs font-bold rounded-lg">
                                Friends
                              </span>
                            );
                          } else if (hasRequest) {
                            actionButton = (
                              <button
                                onClick={() => {
                                  const request = pendingRequests.find((r) => r.from_user.id === user.id);
                                  if (request) handleAcceptRequest(request.id);
                                }}
                                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg transition-colors"
                              >
                                Accept
                              </button>
                            );
                          } else {
                            actionButton = (
                              <button
                                onClick={() => handleSendRequest(user.id)}
                                className="px-3 py-1 bg-[#5d1a1a] hover:bg-[#3a0f0f] text-[#fbb034] text-xs font-bold rounded-lg transition-colors"
                              >
                                Add Friend
                              </button>
                            );
                          }

                          return (
                            <UserCard
                              key={user.id}
                              profile={user}
                              showStatus
                              actionButton={actionButton}
                            />
                          );
                        })}
                      </div>
                    )}
                  </>
                )}

                {/* Requests Tab */}
                {activeTab === "requests" && (
                  <>
                    {pendingRequests.length === 0 ? (
                      <p className="font-bold italic text-center py-8">No pending requests</p>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {pendingRequests.map((request) => (
                          <UserCard
                            key={request.id}
                            profile={request.from_user}
                            actionButton={
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleAcceptRequest(request.id)}
                                  className="w-8 h-8 bg-green-500 hover:bg-green-600 rounded-lg flex items-center justify-center text-white font-bold transition-colors"
                                >
                                  ✓
                                </button>
                                <button
                                  onClick={() => handleRejectRequest(request.id)}
                                  className="w-8 h-8 bg-red-500 hover:bg-red-600 rounded-lg flex items-center justify-center text-white font-bold transition-colors"
                                >
                                  ✕
                                </button>
                              </div>
                            }
                          />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main component with Suspense wrapper for useSearchParams
const FriendsPage = () => {
  return (
    <Suspense fallback={
      <div className="grid grid-cols-12 grid-rows-24 gap-2 h-dvh">
        <Header />
        <div className="row-span-23 row-start-3 col-span-12 flex items-center justify-center">
          <p className="text-amber-100 font-bold">Loading...</p>
        </div>
      </div>
    }>
      <FriendsPageContent />
    </Suspense>
  );
};

export default FriendsPage;
