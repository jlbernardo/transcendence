import { acceptFriendRequest } from "@/services/friendship";
import { FriendsResponse as Requests } from "@/types/user";

interface Props {
    requests: Requests[];
    onRequestHandled: () => void;
};

export default function FriendRequestList({ requests, onRequestHandled }: Props) {
    async function handleRequest(request_id: number, accept: boolean) {
        try {
            if (accept) {
                await acceptFriendRequest(request_id);
                console.log("Friend request accepted");
            }
            else {
            //     await rejectFriendRequest(request_id);
                console.log("Friend request rejected");
            }
            onRequestHandled(); 
        } catch (error) {
            console.error("Error handling friend request:", error); 
        }
    }
    return (
        <div>
            {requests.map(request => (
                <div key={request.id} className="flex">
                <p className="ml-3 text-gray-400">{request.from_user.username}</p>
                <div className="ml-auto flex gap-2 pr-3">
                    <button 
                    onClick={() => handleRequest(request.id, true)}
                    className="w-4 h-4 mt-1 bg-green-500 rounded flex items-center justify-center text-white text-sm">✓</button>
                    <button 
                    onClick={() => handleRequest(request.id, false)}
                    className="w-4 h-4 mt-1 bg-red-500 rounded flex items-center justify-center text-white text-sm">✕</button>
                </div>
                </div>
        ))}
      </div>
    );
}