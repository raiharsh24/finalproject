import React from 'react';
import { chats } from '../data/messages';
import Avatar from './Avatar';

export default function MessageList({ selectedId, onSelect }) {
  return (
    <div className="w-80 border-r border-border-divider bg-white">
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <h2 className="font-medium">All Chats</h2>
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7"/></svg>
      </div>
      <div className="p-2 overflow-y-auto" style={{maxHeight: 'calc(100vh - 140px)'}}>
        {chats.map((c) => (
          <div
            key={c.id}
            onClick={() => onSelect(c.id)}
            className={`flex items-center p-2 rounded cursor-pointer hover:bg-purple-100 ${selectedId === c.id ? 'bg-purple-200' : ''}`}
          >
            <Avatar initials={c.avatar} bgColor="bg-primary" />
            <div className="ml-3 flex-1">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-800">{c.name}</span>
                <span className="text-xs text-gray-500">{c.time}</span>
              </div>
              <p className="text-sm text-gray-500 truncate">{c.lastMessage}</p>
            </div>
            {c.unread > 0 && (
              <span className="ml-2 bg-unread-badge text-white text-xs rounded-full px-1.5 py-0.5">
                {c.unread}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
