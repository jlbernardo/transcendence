import Link from "next/link";
import Dropdown from "@/components/Dropdown";

export default function Home() {
  return (
    <>
      <div className="grid grid-cols-12 grid-rows-24 gap-2 h-dvh">
        <div className="row-span-1 pl-3 pt-1 pb-13 col-span-1">
          <Link href="/profile">
            <Image src="/home.svg" alt="home" className="pt-4 ml-5" width={31} height={31} />
          </Link>
          <br />
        </div>
        <div className="row-span-1 pl-3 pt-1 pb-13 col-span-10 bg-amber-400">
          {/* @ts-expect-error: marquee */}
          <marquee className="pt-2">latest news</marquee>
        </div>
        <div className="row-span-1 col-span-1 mt-4 flex justify-end mr-8 ml-18">
          <Dropdown />
        </div>
        <div className="row-span-23 row-start-3 col-span-10 grid grid-cols-subgrid gap-2">
          <div className="row-span-11 pl-3 pt-1 col-span-5 bg-amber-400">
            personal stats
          </div>
          <div className="row-span-11 pl-3 pt-1 col-span-5 bg-amber-400">
            general stats
          </div>
          <div className="row-span-7 pl-3 pt-1 mt-8 mb-8 col-span-2 bg-amber-400">
            <Link href="/chat">chat</Link>
            <br />
          </div>
          <div className="row-span-7 pl-3 pt-1 mt-8 mb-8 col-span-2 bg-amber-400">
            <Link href="/lobby">lobby</Link>
          </div>
          <div className="row-span-7 pl-3 pt-1 mt-8 mb-8 col-span-2 bg-amber-400">
            new game
          </div>
          <div className="row-span-7 pl-3 pt-1 mt-8 mb-8 col-span-2 bg-amber-400">
            tournaments
          </div>
          <div className="row-span-7 pl-3 pt-1 mt-8 mb-8 col-span-2 bg-amber-400">
            find new friends
          </div>
        </div>
        <div className="row-span-22 row-start-3 pl-3 pt-1 mb-6 col-span-2 col-start-11 bg-amber-400">
          social list
        </div>
      </div>
    </>
  );
}
