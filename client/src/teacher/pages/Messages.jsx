import React, { useState } from 'react';
import MessageList from '../components/MessageList';
import ChatWindow from '../components/ChatWindow';

export default function Messages() {
  const [selectedChat, setSelectedChat] = useState(2); // default Esther Howard

  return (
    <div className="flex h-full bg-page-bg">
      <MessageList selectedId={selectedChat} onSelect={setSelectedChat} />
      <div className="flex-1 bg-white border-l border-border-divider">
        <ChatWindow chatId={selectedChat} />
      </div>
    </div>
  );
}
