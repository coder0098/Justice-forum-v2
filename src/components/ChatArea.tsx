"use client";

import React, { useState } from 'react';

export default function ChatArea() {
  const [messages] = useState<string[]>([]);

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((msg, idx) => (
        <div key={idx} className="p-2 bg-white shadow rounded mb-2">
          {msg}
        </div>
      ))}
    </div>
  );
}
