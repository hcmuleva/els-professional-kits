import { Avatar, Badge, Button, List, SearchBar } from "antd-mobile";
import { AddOutline } from "antd-mobile-icons";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { getUserChatList } from "../../services/chat";
import ably from "../../utils/ablyClient";

export default function ChatSection({ onOpenChat }) {
  const { user } = useContext(AuthContext);
  const [chats, setChats] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [activeChatId, setActiveChatId] = useState(null);

  useEffect(() => {
    if (!user?.id || chats.length === 0) return;

    const subscriptions = [];

    chats.forEach((chat) => {
      const channel = ably.channels.get(`userchat:${chat.id}`);

      const handler = (msg) => {
        const { chatId, message, createdAt } = msg.data || {};
        if (!chatId) return;

        setChats((prev) => {
          const updated = prev.map((c) =>
            c.id === chatId
              ? {
                  ...c,
                  lastMessage: message || c.lastMessage,
                  timestamp: createdAt || new Date().toISOString(),
                  unreadCount:
                    chatId !== activeChatId ? (c.unreadCount || 0) + 1 : 0,
                }
              : c
          );

          return [...updated].sort(
            (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
          );
        });
      };

      channel.subscribe("chat-messages", handler);
      subscriptions.push({ channel, handler });
    });

    return () => {
      subscriptions.forEach(({ channel, handler }) =>
        channel.unsubscribe("chat-messages", handler)
      );
    };
  }, [user?.id, chats, activeChatId]);

  useEffect(() => {
    const loadChats = async () => {
      const result = await getUserChatList(user.id);
      const sorted = result.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
      setChats(sorted);
    };
    loadChats();
  }, [user]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffDays <= 7) {
      return date.toLocaleDateString([], { weekday: "short" });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleChatClick = (chat) => {
    setActiveChatId(chat.id); // 🔥 mark as active

    // 🔁 reset unread count for this chat
    setChats((prev) =>
      prev.map((c) => (c.id === chat.id ? { ...c, unreadCount: 0 } : c))
    );

    if (onOpenChat) {
      onOpenChat({
        id: chat.id,
        name: chat.name,
        isGroup: false,
      });
    }
  };

  const handleStartNewChat = () => {
    console.log("Start new chat");
    // Here you would typically open a user selection modal/page
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "0",
      }}
    >
      <div
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          padding: "16px",
          borderRadius: "0 0 20px 20px",
          marginBottom: "8px",
        }}
      >
        <SearchBar
          placeholder="Search chats..."
          value={searchValue}
          onChange={setSearchValue}
          style={{
            "--border-radius": "25px",
            "--background": "rgba(102, 126, 234, 0.1)",
            "--border": "1px solid rgba(102, 126, 234, 0.3)",
            "--placeholder-color": "#8b5cf6",
          }}
        />
      </div>

      <List
        style={{
          background: "transparent",
          "--border-top": "none",
          "--border-bottom": "none",
        }}
      >
        {filteredChats.map((chat) => (
          <List.Item
            key={chat.id}
            prefix={
              <div style={{ position: "relative" }}>
                <Avatar
                  style={{
                    "--size": "50px",
                    background: "linear-gradient(45deg, #8b5cf6, #3b82f6)",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  {getInitials(chat.name)}
                </Avatar>
                {chat.online && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "2px",
                      right: "2px",
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      background: "#10b981",
                      border: "2px solid white",
                    }}
                  />
                )}
              </div>
            }
            description={
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <span
                  style={{
                    color: "#6b7280",
                    fontSize: "14px",
                    flex: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    marginRight: "8px",
                  }}
                >
                  {chat.lastMessage}
                </span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span
                    style={{
                      color: "#9ca3af",
                      fontSize: "12px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {formatTime(chat.timestamp)}
                  </span>
                  {chat.unreadCount > 0 && (
                    <Badge
                      content={chat.unreadCount}
                      style={{
                        "--color": "white",
                        "--background-color": "#8b5cf6",
                      }}
                    />
                  )}
                </div>
              </div>
            }
            onClick={() => handleChatClick(chat)}
            style={{
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(10px)",
              margin: "4px 16px",
              borderRadius: "16px",
              border: "1px solid rgba(139, 92, 246, 0.2)",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              "--padding-left": "16px",
              "--padding-right": "16px",
            }}
          >
            <div
              style={{
                fontWeight: "600",
                color: "#1f2937",
                fontSize: "16px",
              }}
            >
              {chat.name}
            </div>
          </List.Item>
        ))}
      </List>

      <div
        style={{
          position: "fixed",
          bottom: 0,
          right: "20px",
          zIndex: 1000,
        }}
      >
        <Button
          shape="rounded"
          size="large"
          style={{
            background: "linear-gradient(45deg, #8b5cf6, #3b82f6)",
            border: "none",
            boxShadow: "0 8px 16px rgba(139, 92, 246, 0.3)",
            width: "56px",
            height: "56px",
          }}
          onClick={handleStartNewChat}
        >
          <AddOutline style={{ fontSize: "24px", color: "white" }} />
        </Button>
      </div>
    </div>
  );
}
