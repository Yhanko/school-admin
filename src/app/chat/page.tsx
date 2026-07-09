"use client"
import { useState } from "react";
import { ChatSidebar } from "./_components/chatSideBar";
import { ChatArea } from "./_components/chatArea";

export interface ChatUser {
  id: string;
  email: string;
  role: string;
  name: string;
}

export default function Chat () {
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);

  return (
     <section className="h-[calc(100vh-5rem)] flex w-full">
      <ChatSidebar onSelectUser={setSelectedUser} selectedUserId={selectedUser?.id} />
      <ChatArea selectedUser={selectedUser} />
    </section>
  );
}