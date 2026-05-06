import { Send } from "lucide-react";
import { useState } from "react";

export default function ChatWindow({ chat }) {
  const [messages, setMessages] = useState([
    { from: "student", text: "Hi!", time: "9:59 AM" },
    { from: "teacher", text: "Hello!", time: "10:00 AM" },
  ]);

  const [input, setInput] = useState("");

  const send = () => {
    if (!input.trim()) return;

    setMessages([
      ...messages,
      {
        from: "teacher",
        text: input,
        time: "now",
      },
    ]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full">
      
      {/* HEADER */}
      <div className="border-b p-4 font-semibold">
        {chat.name}
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${
              m.from === "teacher" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-3 py-2 rounded-lg text-sm ${
                m.from === "teacher"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>

      {/* INPUT */}
      <div className="p-3 border-t flex gap-2">
        <input
          className="flex-1 border rounded-lg px-3 py-2 text-sm"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type message..."
        />
        <button
          onClick={send}
          className="bg-blue-600 text-white px-4 rounded-lg"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}