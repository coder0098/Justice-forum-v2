"use client";

import React from 'react';
import Sidebar from './Sidebar';
import CardColumn from './CardColumn';
import ChatArea from './ChatArea';
import MessageInput from './MessageInput';
import SignOutButton from '../components/SignOutButton'
export default function MainContent({ email }: { email: string }) {
  return (
    <div className="flex flex-1">
      <Sidebar />
      <div className="flex flex-col flex-1 bg-gray-100 p-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-xl font-bold text-gray-900 mb-4">Welcome, {email}</h1>
          <SignOutButton />
        </div>
        
        <ChatArea />
        <MessageInput />
      </div>
      <CardColumn />
    </div>
  );
}