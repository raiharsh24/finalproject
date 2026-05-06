import { Search } from "lucide-react";

const chats = [
  {
    id: 1,
    name: "Jenny Wilson",
    message: "Good job!",
    time: "9:52 AM",
  },
  {
    id: 2,
    name: "Esther Howard",
    message: "I can help you :)",
    time: "9:52 AM",
  },
];

export default function ChatList({ onSelect }) {
  return (
    <div className="w-80 border-r border-gray-200 flex flex-col">
      
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-3">Messages</h2>

        <div className="relative">
          <input
            className="w-full border rounded-lg py-2 pl-10 pr-3 text-sm"
            placeholder="Search..."
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onSelect(chat)}
            className="p-4 cursor-pointer hover:bg-gray-50"
          >
            <p className="font-medium text-sm">{chat.name}</p>
            <p className="text-xs text-gray-500">{chat.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}