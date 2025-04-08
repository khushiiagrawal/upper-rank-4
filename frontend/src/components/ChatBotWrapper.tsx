"use client";

import dynamic from "next/dynamic";

// Dynamically import the ChatBot component with no SSR
const ChatBot = dynamic(() => import("./ChatBot"), {
  ssr: false,
});

const ChatBotWrapper = () => {
  return <ChatBot />;
};

export default ChatBotWrapper;
