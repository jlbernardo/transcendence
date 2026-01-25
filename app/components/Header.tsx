import Link from "next/link";
import Image from "next/image";
import Dropdown from "@/components/Dropdown";
import Marquee from "react-fast-marquee";

const mockNews = [
  "Welcome to Transcendence! Stay tuned for upcoming features.",
  "This is Girl Pong, your ultimate gaming experience!",
  "New game modes are coming soon. Get ready to play!",
  "Check out the latest updates in your profile settings.",
  "Invite your friends and earn exclusive rewards!",
  "Join our community events and tournaments for exciting prizes!",
];

export default function Header() {
  return (
    <>
      <div className="col-span-1">
        <Link href="/home">
          <Image src="/home.svg" alt="home" className="pt-4 ml-5" width={34} height={34} />
        </Link>
        <br />
      </div>
      <div className="row-span-1 pl-3 pt-4 pb-13 col-span-10">
        <Marquee className="pt-2 text-white">
          {mockNews.join("   ***   ")}
        </Marquee>
      </div>
      <div className="row-span-1 col-span-1 mt-4 flex justify-end mr-8 ml-18 text-white">
        <Dropdown />
      </div>
    </>
  );
}
