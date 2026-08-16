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
  const [showSidebar, setShowSidebar] = useState(true);

  const handleSelectUser = (user: ChatUser) => {
    setSelectedUser(user);
    // On mobile, hide the sidebar when a user is selected
    setShowSidebar(false);
  };

  const handleBack = () => {
    setShowSidebar(true);
  };

  return (
    <section className="h-[calc(100vh-5rem)] flex w-full overflow-hidden">
      {/* Sidebar: always visible on sm+, toggle on mobile */}
      <div className={`
        ${showSidebar ? 'flex' : 'hidden'} sm:flex
        w-full sm:w-72 lg:w-80
        flex-col shrink-0
        border-r border-border
      `}>
        <ChatSidebar
          onSelectUser={handleSelectUser}
          selectedUserId={selectedUser?.id}
        />
      </div>

      {/* Chat area: always visible on sm+, toggle on mobile */}
      <div className={`
        ${!showSidebar || selectedUser ? 'flex' : 'hidden'} sm:flex
        flex-1 flex-col min-w-0
      `}>
        <ChatArea selectedUser={selectedUser} onBack={handleBack} />
      </div>
    </section>
  );
}