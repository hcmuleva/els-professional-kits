import { ArrowLeftOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Input,
  NavBar,
  Toast,
  InfiniteScroll,
} from "antd-mobile";
import { SendOutline } from "antd-mobile-icons";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import ChatMessage from "./ChatMessage";
import { getPaginatedUserChat, sendUserMessage } from "../../services/chat";
import ably from "../../utils/ablyClient"; // Import ably client

const PAGE_SIZE = 20;

export default function UserChatArea({ chatId, chatName, receiverId, onBack }) {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const ablyChannelRef = useRef(null);

  // Transform Strapi message data to ChatMessage format
  const transformMessage = (message) => {
    try {
      if (message?.attributes) {
        // Strapi response format
        const senderData = message.attributes.sender?.data || null;
        const senderAttributes = senderData?.attributes || {};
        return {
          id: message.id || `temp-${Date.now()}`,
          message: message.attributes.message || "",
          createdAt: message.attributes.createdAt || new Date().toISOString(),
          updatedAt: message.attributes.updatedAt || new Date().toISOString(),
          timestamp: message.attributes.createdAt || new Date().toISOString(),
          sender: senderData
            ? {
                id: senderData.id || null,
                first_name: senderAttributes.first_name || "Unknown",
                last_name: senderAttributes.last_name || "",
                username: senderAttributes.username || "Unknown",
                email: senderAttributes.email || "",
                profile_picture:
                  senderAttributes.profile_picture?.data?.attributes?.url ||
                  null,
                avatar: senderAttributes.avatar?.data?.attributes?.url || null,
              }
            : {
                id: null,
                first_name: "Unknown",
                last_name: "",
                username: "Unknown",
                email: "",
                profile_picture: null,
                avatar: null,
              },
        };
      } else {
        // Raw message format (including Ably messages)
        const sender = message.sender || {};
        return {
          id: message.id || `temp-${Date.now()}`,
          message: message.message || "",
          createdAt:
            message.createdAt || message.timestamp || new Date().toISOString(),
          updatedAt: message.updatedAt || new Date().toISOString(),
          timestamp:
            message.createdAt || message.timestamp || new Date().toISOString(),
          sender: {
            id: sender.id || null,
            first_name: sender.first_name || "Unknown",
            last_name: sender.last_name || "",
            username: sender.username || "Unknown",
            email: sender.email || "",
            profile_picture: sender.profile_picture || null,
            avatar: sender.avatar || null,
          },
        };
      }
    } catch (error) {
      console.error("Error transforming message:", error, message);
      // Return a safe fallback
      return {
        id: message?.id || `error-${Date.now()}`,
        message: message?.message || "Error loading message",
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        sender: {
          id: null,
          first_name: "Unknown",
          last_name: "",
          username: "Unknown",
          email: "",
          profile_picture: null,
          avatar: null,
        },
      };
    }
  };

  const loadMessages = async (page) => {
    try {
      const response = await getPaginatedUserChat(
        user.id,
        receiverId,
        page,
        PAGE_SIZE
      );
      const rawMessages = response.messages || [];
      const transformedMessages = rawMessages.map(transformMessage);
      // Sort messages chronologically (oldest first for proper chat flow)
      const sortedMessages = transformedMessages.sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );
      return sortedMessages;
    } catch (error) {
      console.error("Error loading messages:", error);
      Toast.show({
        content: "Failed to load messages",
        icon: "fail",
      });
      return [];
    }
  };

  const loadInitialMessages = async () => {
    try {
      setLoading(true);
      setMessages([]);
      setCurrentPage(1);
      setHasMore(true);

      const firstBatch = await loadMessages(1);
      setMessages(firstBatch);
      setHasMore(firstBatch.length === PAGE_SIZE);
      setCurrentPage(1);

      // Scroll to bottom after loading
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    } catch (error) {
      console.error("Error loading initial messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (receiverId && user?.id) {
      loadInitialMessages();
    }
  }, [receiverId, user?.id]);

  useEffect(() => {
    if (messages.length > 0 && currentPage <= 1) {
      scrollToBottom();
    }
  }, [messages, currentPage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadMoreMessages = async () => {
    if (!hasMore || loading) return;

    try {
      const nextPage = currentPage + 1;
      const moreMessages = await loadMessages(nextPage);

      // Prepend older messages to the beginning
      setMessages((prev) => [...moreMessages, ...prev]);
      setHasMore(moreMessages.length === PAGE_SIZE);
      setCurrentPage(nextPage);
    } catch (error) {
      console.error("Error loading more messages:", error);
      Toast.show({
        content: "Failed to load more messages",
        icon: "fail",
      });
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || sending) return;
    const text = newMessage.trim();

    const optimisticMessage = {
      id: `temp-${Date.now()}`,
      message: text,
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sender: {
        id: user.id,
        first_name: user.first_name || "You",
        last_name: user.last_name || "",
        username: user.username || "You",
        email: user.email || "",
        avatar: user.avatar || null,
        profile_picture: user.profile_picture || null,
      },
      sending: true,
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setNewMessage("");
    setSending(true);
    setTimeout(() => scrollToBottom(), 100);

    try {
      const data = await sendUserMessage(user.id, receiverId, text);

      const realMessage = {
        id: data?.id || optimisticMessage.id,
        message: text,
        timestamp: data?.createdAt || new Date().toISOString(),
        createdAt: data?.createdAt || new Date().toISOString(),
        updatedAt: data?.updatedAt || new Date().toISOString(),
        sender: {
          id: user.id,
          first_name: user.first_name || "You",
          last_name: user.last_name || "",
          username: user.username || "You",
          email: user.email || "",
          avatar: user.avatar || null,
          profile_picture: user.profile_picture || null,
        },
        sending: false,
      };

      setMessages((prev) =>
        prev.map((msg) => (msg.id === optimisticMessage.id ? realMessage : msg))
      );

      if (ablyChannelRef.current) {
        try {
          await ablyChannelRef.current.publish("chat-messages", {
            from: user.id,
            to: receiverId,
            message: text,
            chatId: realMessage.id,
            sender: {
              id: user.id,
              first_name: user.first_name,
              last_name: user.last_name,
              username: user.username,
              avatar: user.avatar,
              profile_picture: user.profile_picture,
            },
            timestamp: realMessage.timestamp,
          });
          console.log("✅ Message published to Ably");
        } catch (ablyError) {
          console.error("❌ Ably publish error:", ablyError);
        }
      }
    } catch (err) {
      console.error("❌ Send failed:", err);
      setMessages((prev) =>
        prev.filter((msg) => msg.id !== optimisticMessage.id)
      );
      Toast.show({
        content: `Failed to send message: ${err.message || "Unknown error"}`,
        icon: "fail",
      });
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Set up Ably real-time messaging for user chat
  useEffect(() => {
    if (!receiverId || !user?.id) return;

    console.log(
      "🔔 Setting up Ably channel for user chat:",
      user.id,
      "->",
      receiverId
    );

    // Create a consistent channel name for both users
    // Use the smaller ID first to ensure both users connect to the same channel
    const channelId = [user.id, receiverId].sort().join("-");
    const channel = ably.channels.get(`userchat:${channelId}`);
    ablyChannelRef.current = channel;

    // Handle incoming messages
    const handleIncomingMessage = (message) => {
      console.log("📨 Received real-time user message:", message);

      const messageData = message.data;

      // Don't add our own messages (they're handled optimistically)
      if (messageData.from === user.id) {
        return;
      }

      // Only process messages intended for this conversation
      if (messageData.to !== user.id && messageData.from !== receiverId) {
        return;
      }

      // Transform the Ably message to our format
      const newMessage = transformMessage({
        id: messageData.chatId || `ably-${Date.now()}`,
        message: messageData.message,
        timestamp: messageData.timestamp || new Date().toISOString(),
        createdAt: messageData.timestamp || new Date().toISOString(),
        sender: messageData.sender,
      });

      // Add the new message to the state
      setMessages((prev) => {
        // Check if message already exists to prevent duplicates
        const exists = prev.some((msg) => msg.id === newMessage.id);
        if (exists) return prev;

        // Add new message at the end (newest)
        return [...prev, newMessage];
      });

      // Scroll to bottom to show new message
      setTimeout(() => scrollToBottom(), 100);
    };

    // Subscribe to the channel
    channel.subscribe("chat-messages", handleIncomingMessage);

    // Cleanup function
    return () => {
      console.log("🔌 Unsubscribing from Ably user chat channel:", channelId);
      channel.unsubscribe("chat-messages", handleIncomingMessage);
      ablyChannelRef.current = null;
    };
  }, [receiverId, user?.id]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <NavBar
        onBack={onBack}
        backIcon={<ArrowLeftOutlined />}
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          padding: "20px",
          height: "60px",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          "--border-bottom": "1px solid rgba(139, 92, 246, 0.2)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Avatar
            style={{
              "--size": "36px",
              background: "linear-gradient(45deg, #8b5cf6, #3b82f6)",
              color: "white",
              fontWeight: "bold",
            }}
          >
            {getInitials(chatName)}
          </Avatar>
          <div>
            <div style={{ fontWeight: "600", color: "#1f2937" }}>
              {chatName}
            </div>
            <div style={{ fontSize: "12px", color: "#6b7280" }}>Online</div>
          </div>
        </div>
      </NavBar>

      <div
        ref={messagesContainerRef}
        style={{
          flex: 1,
          overflowY: "auto",
          background: "rgba(255, 255, 255, 0.05)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {loading && messages.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "20px",
              color: "#8b5cf6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "200px",
            }}
          >
            Loading messages...
          </div>
        )}

        {!loading && (
          <div
            style={{
              padding: "8px 0",
              display: "flex",
              flexDirection: "column",
              width: "100%",
            }}
          >
            <InfiniteScroll
              loadMore={loadMoreMessages}
              hasMore={hasMore}
              threshold={10}
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
              }}
            >
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  message={msg.message}
                  sender={msg.sender}
                  timestamp={msg.timestamp}
                  isCurrentUser={msg.sender.id === user.id}
                  sending={msg.sending}
                  isGroup={false}
                />
              ))}

              {messages.length === 0 && !loading && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px 20px",
                    color: "#6b7280",
                  }}
                >
                  No messages yet. Start the conversation!
                </div>
              )}
            </InfiniteScroll>

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div
        style={{
          backdropFilter: "blur(10px)",
          padding: "12px 16px",
          borderTop: "1px solid rgba(139, 92, 246, 0.2)",
          display: "flex",
          alignItems: "flex-end",
          gap: "8px",
          position: "sticky",
          bottom: 0,
          zIndex: 100,
          background: "rgba(255, 255, 255, 0.95)",
        }}
      >
        <div style={{ flex: 1 }}>
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={setNewMessage}
            onKeyPress={handleKeyPress}
            disabled={sending}
            style={{
              "--border-radius": "20px",
              "--background": "rgba(102, 126, 234, 0.1)",
              "--border": "1px solid rgba(102, 126, 234, 0.3)",
              "--placeholder-color": "#8b5cf6",
              "--font-size": "14px",
              "--padding-left": "16px",
              "--padding-right": "16px",
            }}
          />
        </div>
        <Button
          shape="rounded"
          size="small"
          disabled={!newMessage.trim() || sending}
          onClick={handleSendMessage}
          loading={sending}
          style={{
            background:
              newMessage.trim() && !sending
                ? "linear-gradient(45deg, #8b5cf6, #3b82f6)"
                : "#e5e7eb",
            border: "none",
            width: "44px",
            height: "44px",
            minWidth: "44px",
          }}
        >
          <SendOutline style={{ fontSize: "18px", color: "white" }} />
        </Button>
      </div>
    </div>
  );
}
