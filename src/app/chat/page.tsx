"use client"
import { useState } from "react";
import { ChatSidebar } from "./_components/chatSideBar";
import { ChatArea } from "./_components/chatArea";

export interface ChatUser {
  id: string;
  email: string;
  role: string;
  profile?: {
    firstName: string;
    lastName: string;
  };
}

export default function Chat () {
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);

  return (
     <section className="h-screen flex w-[70rem]">
      <ChatSidebar onSelectUser={setSelectedUser} selectedUserId={selectedUser?.id} />
      <ChatArea selectedUser={selectedUser} />
    </section>
  );
}