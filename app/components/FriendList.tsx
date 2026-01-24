import { User as Friend } from "@/types/user";

interface Props {
    friends: Friend[];
    status: "online" | "offline";
};

export default function FriendList({ friends, status }: Props) {
    return (
        <div>
            {friends.map(friend => (
            <div key={friend.id} className="flex">
                <div className={`w-2 h-2 rounded-full ml-3 mt-2 ${
                    status === "online" ? "bg-green-500" : "bg-gray-500"}`}></div>
                    <p className="ml-3 text-gray-300">{friend.username}</p>
            </div>
    ))}
    </div>
    );
}