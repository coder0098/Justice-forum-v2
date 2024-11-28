"use client";

import React, { useState } from 'react';

export default function MessageInput() {
  const [message, setMessage] = useState('');

  const sendMessage = () => {
    if (message.trim()) {
      console.log('Send message:', message);
      setMessage('');
    }
  };

  return (
    <div className="mt-4 flex">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message"
        className="flex-1 p-2 border rounded"
      />
      <button
        onClick={sendMessage}
        className="ml-2 py-2 px-4 bg-blue-600 text-white rounded"
      >
        Send
      </button>
    </div>
  );
}
