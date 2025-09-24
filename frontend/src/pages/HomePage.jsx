import { UserButton } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { useStreamChat } from "../hooks/useStreamChat.js";
import PageLoader from "../components/PageLoader";

import {
  Chat,
  Channel,
  ChannelList,
  MessageInput,
  Thread,
  Window,
} from "stream-chat-react";

import "../styles/stream-chat-theme.css";


const HomePage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeChannel, setActiveChannel] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const { chatClient, error, isLoading } = useStreamChat();

  // set active channel from URL params
  useEffect(() => {
    if (chatClient) {
      const channelId = searchParams.get("channel");
      if (channelId) {
        const channel = chatClient.channel("messaging", channelId);
        setActiveChannel(channel);
      }
    }
  }, [chatClient, searchParams]);

  // todo: handle this with a better component
  if (error) return <p>Something went wrong...</p>;
  if (isLoading || !chatClient) return <PageLoader />;


  return (
    <div className="chat-wrapper">

      <Chat client={chatClient}>

        <div className="chat-container">
          {/* Left sidebare */}

          <div className="str-chat_channel-list">
            <div className="team-channel-list">
              {/* Header */}
              <div className="team-channel-list_header gap-4">
                <div className="brand-container">
                  <img src="/logo.png" alt="logo" className="brand-logo" />
                  <span className="brand-name">slack</span>
                </div>
                <div className="user-button-wrapper">
                  <UserButton />
                </div>
              </div>
            </div>
          </div>
        </div>

      </Chat>
    </div>
  )
}

export default HomePage