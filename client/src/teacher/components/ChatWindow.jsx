import React, {
  useState,
  useRef,
  useEffect,
} from "react";

import {
  chats,
  chatMessages,
} from "../data/messages";

import Avatar from "./Avatar";

import {
  Paperclip,
  Smile,
  Send,
} from "lucide-react";

export default function ChatWindow({
  chatId,
}) {
  const selectedChat =
    chats.find(
      (c) => c.id === chatId
    ) || chats[0];

  const [messages, setMessages] =
    useState(
      chatMessages[chatId] || []
    );

  const [input, setInput] =
    useState("");

  const containerRef =
    useRef(null);

  // update chat when switching user
  useEffect(() => {
    setMessages(
      chatMessages[chatId] || []
    );
  }, [chatId]);

  // auto scroll
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop =
        containerRef.current
          .scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMsg = {
      id: Date.now(),
      type: "sent",
      text: input.trim(),
      time:
        new Date().toLocaleTimeString(
          [],
          {
            hour: "2-digit",
            minute:
              "2-digit",
          }
        ),
      status: "✓✓",
    };

    setMessages((prev) => [
      ...prev,
      newMsg,
    ]);

    setInput("");

    // fake reply after 1 sec
    setTimeout(() => {
      const autoReply = {
        id:
          Date.now() + 1,
        type: "received",
        text: "Thanks! I received your message.",
        time:
          new Date().toLocaleTimeString(
            [],
            {
              hour: "2-digit",
              minute:
                "2-digit",
            }
          ),
      };

      setMessages((prev) => [
        ...prev,
        autoReply,
      ]);
    }, 1000);
  };

  const renderBubble = (
    msg
  ) => {
    if (msg.type === "date") {
      return (
        <div
          key={msg.id}
          className="flex justify-center my-3"
        >
          <span className="px-3 py-1 bg-gray-200 text-gray-600 rounded-full text-xs">
            {msg.label}
          </span>
        </div>
      );
    }

    const isSent =
      msg.type === "sent";

    return (
      <div
        key={msg.id}
        className={`flex ${
          isSent
            ? "justify-end"
            : "justify-start"
        } mb-3`}
      >
        <div
          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow-sm ${
            isSent
              ? "bg-primary text-white rounded-br-sm"
              : "bg-gray-100 text-gray-800 rounded-bl-sm"
          }`}
        >
          {msg.isLink ? (
            <a
              href={msg.text}
              target="_blank"
              rel="noopener noreferrer"
              className="underline break-all"
            >
              {msg.text}
            </a>
          ) : (
            <p className="break-words">
              {msg.text}
            </p>
          )}

          <div
            className={`text-[11px] mt-1 flex items-center justify-end gap-1 ${
              isSent
                ? "text-gray-200"
                : "text-gray-500"
            }`}
          >
            <span>
              {msg.time}
            </span>

            {msg.status && (
              <span>
                {msg.status}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">

      {/* Header */}

      <div className="flex items-center px-4 py-3 border-b border-border-divider bg-white">

        <Avatar
          initials={
            selectedChat.avatar
          }
          bgColor="bg-primary"
        />

        <div className="ml-3 flex-1">

          <p className="font-medium text-gray-800">
            {selectedChat.name}
          </p>

          <p className="text-sm text-green-600 flex items-center">

            <span className="w-2 h-2 bg-green-500 rounded-full mr-1" />

            Online

          </p>

        </div>

        <div className="flex space-x-3 items-center">

          <button className="text-gray-400 hover:text-primary transition">
            <Paperclip className="w-5 h-5" />
          </button>

          <button className="text-gray-400 hover:text-primary transition">
            <Smile className="w-5 h-5" />
          </button>

        </div>

      </div>

      {/* Messages */}

      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 bg-page-bg"
        style={{
          maxHeight:
            "calc(100vh - 200px)",
        }}
      >

        {messages.length >
        0 ? (
          messages.map(
            renderBubble
          )
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            No messages yet
          </div>
        )}

      </div>

      {/* Input */}

      <div className="flex items-center p-3 border-t border-border-divider bg-white">

        <input
          type="text"
          placeholder="Type something..."
          value={input}
          onChange={(e) =>
            setInput(
              e.target.value
            )
          }
          className="flex-1 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          onKeyDown={(e) =>
            e.key ===
              "Enter" &&
            handleSend()
          }
        />

        <div className="flex items-center space-x-2 ml-2">

          <button className="text-gray-500 hover:text-primary transition">
            <Paperclip className="w-5 h-5" />
          </button>

          <button className="text-gray-500 hover:text-primary transition">
            <Smile className="w-5 h-5" />
          </button>

          <button
            onClick={
              handleSend
            }
            className="bg-primary text-white p-2 rounded-full hover:bg-primary-hover transition"
          >

            <Send className="w-5 h-5" />

          </button>

        </div>

      </div>

    </div>
  );
}