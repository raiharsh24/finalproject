import React, { useState, useRef, useEffect } from 'react';
import { chatMessages } from '../data/messages';
import Avatar from './Avatar';
import { Paperclip, Smile, Send } from 'lucide-react';

export default function ChatWindow({ chatId }) {
  const [messages, setMessages] = useState(chatMessages[chatId] || []);
  const [input, setInput] = useState('');
  const containerRef = useRef(null);

  // scroll to bottom on new message
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg = {
      id: Date.now(),
      type: 'sent',
      text: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput('');
  };

  const renderBubble = (msg) => {
    if (msg.type === 'date') {
      return (
        <div key={msg.id} className="flex justify-center my-2">
          <span className="px-2 py-1 bg-gray-200 text-gray-600 rounded-full text-sm">
            {msg.label}
          </span>
        </div>
      );
    }
    const isSent = msg.type === 'sent';
    const bubbleClass = isSent
      ? 'bg-sent-bubble text-white self-end'
      : 'bg-received-bubble text-gray-800 self-start';
    return (
      <div key={msg.id} className={`flex ${isSent ? 'justify-end' : 'justify-start'} mb-2`}>
        <div className={`max-w-xs px-4 py-2 rounded-lg ${bubbleClass}`}>
          {msg.isLink ? (
            <a href={msg.text} target="_blank" rel="noopener noreferrer" className="underline">
              {msg.text}
            </a>
          ) : (
            <span>{msg.text}</span>
          )}
          {msg.status && <span className="ml-1 text-xs opacity-75">{msg.status}</span>}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center px-4 py-2 border-b border-border-divider bg-white">
        <Avatar initials="EH" bgColor="bg-primary" />
        <div className="ml-3 flex-1">
          <p className="font-medium text-gray-800">Esther Howard</p>
          <p className="text-sm text-green-600 flex items-center">
            <span className="w-2 h-2 bg-online-dot rounded-full mr-1" /> online
          </p>
        </div>
        <div className="flex space-x-3 items-center">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12h12M12 6v12"/></svg>
        </div>
      </div>
      {/* Message list */}
      <div ref={containerRef} className="flex-1 overflow-y-auto p-4 bg-page-bg" style={{maxHeight: 'calc(100vh - 200px)'}}>
        {messages.map(renderBubble)}
      </div>
      {/* Input bar */}
      <div className="flex items-center p-3 border-t border-border-divider bg-white">
        <input
          type="text"
          placeholder="Type something"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary"
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <div className="flex items-center space-x-2 ml-2">
          <Paperclip className="w-5 h-5 text-gray-500 cursor-pointer" />
          <Smile className="w-5 h-5 text-gray-500 cursor-pointer" />
          <button onClick={handleSend} className="bg-primary text-white p-2 rounded-full hover:bg-primary-hover">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
