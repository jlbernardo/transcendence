import { FriendsResponse as Requests } from "@/types/user";

interface Props {
    requests: Requests[];
};

export default function FriendRequestList({ requests }: Props) {
    return (
        <div>
            {requests.map(request => (
                <div key={request.from_user.id} className="flex">
                <p className="ml-3 text-gray-400">{request.from_user.username}</p>
                <div className="ml-auto flex gap-2 pr-3">
                    <button className="w-4 h-4 mt-1 bg-green-500 rounded flex items-center justify-center text-white text-sm">✓</button>
                    <button className="w-4 h-4 mt-1 bg-red-500 rounded flex items-center justify-center text-white text-sm">✕</button>
                </div>
                </div>
        ))}
      </div>
    );
}