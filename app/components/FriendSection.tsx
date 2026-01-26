import FriendList from "./FriendList";
import { User, Profile, FriendRequest } from "@/types/user";
import FriendRequestList from "./FriendRequestList";

interface Props {
  friends: Profile[];
  requests: FriendRequest[];
  onRequestHandled: () => void;
}

export default function FriendSection({ friends, requests, onRequestHandled }: Props) {
  return (
    <div className="w-full h-full border-4  border-black bg-black/70">
      <div>
        <p className="text-amber-200 text-4xl text-center mt-5 mb-1">friends</p>
        <p className="text-amber-100 mt-5 ml-3 mb-1">Online</p>
        <FriendList friends={friends.filter(friend => friend.user.is_online === true)} status="online" />
      </div>

      <div className="w-3/4 mt-30 mx-auto border-t border-white opacity-60"></div>
      <div>
        <p className="text-amber-100 mt-5 ml-3 mb-1">Offline</p>
        <FriendList friends={friends.filter(friend => friend.user.is_online === false)} status="offline" />
      </div>

      <div className="w-3/4 mt-30 mx-auto border-t border-white opacity-60"></div>
      <div>
        <p className="text-amber-100 mt-5 ml-3 mb-1">Requests</p>
        <FriendRequestList requests={requests} onRequestHandled={onRequestHandled} />
      </div>
    </div>
  )
}
