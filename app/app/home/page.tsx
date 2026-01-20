"use client";

import Link from "next/link";
import Image from "next/image";
import Dropdown from "@/components/Dropdown";
import PersonalStats from "@/components/PersonalStats";
import GeneralStats from "@/components/GeneralStats";
import FriendSection from "@/components/FriendSection";
import { getFriendsList, getPendingRequestsList } from "@/services/friendship";
import { useEffect, useState } from "react";
import { User, FriendsResponse } from "@/types/user";

export default function Home() {
  const [friends, setFriends] = useState<User[]>()
  const [friendRequests, setFriendRequests] = useState<FriendsResponse[]>()

  async function fetchFriendsAndRequests() {
    try {
      const response = await getFriendsList();
      setFriends(response);
      const requests = await getPendingRequestsList();
      setFriendRequests(requests);
    } catch (error) {
      console.error("ERROR:", error);
    }
  }

  useEffect(() => {
    fetchFriendsAndRequests();
  }, []);
  
  return (
    <>
      <div className="grid grid-cols-12 grid-rows-24 gap-2 h-dvh">
        <div className="row-span-1 pl-3 pt-1 pb-13 col-span-1">
          <Link href="/home">
            <Image src="/home.svg" alt="home" className="pt-4 ml-5" width={31} height={31} />
          </Link>
          <br />
        </div>
        <div className="row-span-1 pl-3 pt-4 pb-13 col-span-10">
          {/* @ts-expect-error: marquee */}
          <marquee className="pt-2">latest news</marquee>
        </div>
        <div className="row-span-1 col-span-1 mt-4 flex justify-end mr-8 ml-18">
          <Dropdown />
        </div>
        <div className="row-span-23 row-start-3 col-span-10 grid grid-cols-subgrid gap-2">
          <div className="row-span-8 col-span-5 mt-1">
            <PersonalStats />
          </div>

          <div className="row-span-8 col-span-5 mt-1">
            <GeneralStats />
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

          <Link href="/matchmaking" className="row-span-1 row-start-10 col-span-2">
            <div className="flex flex-col items-center">
              <Image src="/matchmaking.svg" alt="matchmaking" width={100} height={100} />
              <p className="text-3xl mt-3 text-amber-100">matchmaking</p>
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
    </>
  );
}
