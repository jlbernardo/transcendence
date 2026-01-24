"use client";

import Link from "next/link";
import Image from "next/image";
import FriendSection from "@/components/FriendSection";
import Header from "@/components/Header";
import { LoadingPong } from "@/components/LoadingPong";
import { getFriendsList, getPendingRequestsList } from "@/services/friendship";
import { useEffect, useState } from "react";
import { User, FriendRequest } from "@/types/user";
import StatsBox from "@/components/StatsBox";

export default function Home() {
  const [friends, setFriends] = useState<User[]>()
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>()
  const [isLoading, setIsLoading] = useState(false)

  async function fetchFriendsAndRequests() {
    try {
      setIsLoading(true);
      const response = await getFriendsList();
      setFriends(response.data);
      const requests = await getPendingRequestsList();
      console.log("FRIEND REQUESTS:", requests.data);
      setFriendRequests(requests.data);
    } catch (error) {
      console.error("ERROR:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchFriendsAndRequests();
  }, []);
  
  return (
    <>
      <div className="grid grid-cols-12 grid-rows-24 gap-2 h-dvh">
        <Header />
        <div className="row-span-23 row-start-3 col-span-10 grid grid-cols-subgrid gap-2">
          <div className="row-span-8 col-span-5 mt-1 ml-2">
            <StatsBox title="My stats" stats={[
              { label: "Wins", value: 12 },
              { label: "Losses", value: 4 },
              { label: "Win rate", value: "75%" },
              { label: "Total games", value: 16 },
            ]} />
          </div>

          <div className="row-span-8 col-span-5 mt-1">
            <StatsBox title="General stats" stats={[
              { label: "Total Games", value: 320 },
              { label: "Total Players", value: 145 },
              { label: "Games Today", value: 27 },
              { label: "Most Wins (Player)", value: "beyoncé" },
            ]} />
          </div>

          <Link href="/chat" className="row-span-1 row-start-10 col-span-2">
            <div className="flex flex-col items-center">
              <Image src="/chat.svg" alt="conversations" width={100} height={100} />
              <p className="text-3xl mt-3 text-amber-100">conversations</p>
            </div>
          </Link>

          <Link href="/lobby" className="row-span-1 row-start-10 col-span-2">
            <div className="flex flex-col items-center">
              <Image src="/lobby.svg" alt="lobby" width={100} height={100} />
              <p className="text-3xl mt-3 text-amber-100">lobby</p>
            </div>
          </Link>

          <Link href="/game" className="row-span-1 row-start-10 col-span-2">
            <div className="flex flex-col items-center">
              <Image src="/matchmaking.svg" alt="matchmaking" width={100} height={100} />
              <p className="text-3xl mt-3 text-amber-100">game</p>
            </div>
          </Link>

          <Link href="/tournament" className="row-span-1 row-start-10 col-span-2">
            <div className="flex flex-col items-center">
              <Image src="/tournament.svg" alt="tournament" width={100} height={100} />
              <p className="text-3xl mt-3 text-amber-100">tournament</p>
            </div>
          </Link>

          <Link href="/search" className="row-span-1 row-start-10 col-span-2">
            <div className="flex flex-col items-center">
              <Image src="/search.svg" alt="find new friends" width={100} height={100} />
              <p className="text-3xl mt-3 text-amber-100">find new friends</p>
            </div>
          </Link>
        </div>

        <div className="row-span-22 row-start-3 pt-1 mr-2 mb-6 col-span-2 col-start-11">
          <FriendSection 
            friends={friends || []}
            requests={friendRequests || []}
            onRequestHandled={fetchFriendsAndRequests}
          />
        </div>
      </div>
      <LoadingPong visible={isLoading} />
    </>
  );
}
