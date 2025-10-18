import React, { useState, useRef, useEffect } from "react";
import {
  SendOutlined,
  PhoneOutlined,
  VideoCameraOutlined,
  MoreOutlined,
  SearchOutlined,
  PaperClipOutlined,
  SmileOutlined,
} from "@ant-design/icons";

const ChatSystem = () => {
  const [messages, setMessages] = useState([
    {
      id: 43,
      message: "have a great day",
      read: null,
      createdAt: "2025-06-18T15:45:38.261Z",
      updatedAt: "2025-06-18T15:45:38.261Z",
      publishedAt: null,
      sender: {
        id: 2,
        username: "3292141252",
        email: "quin9eog@sdg.co",
        first_name: "rebn",
        last_name: "qwtqwgb",
        mobile: "3292141252",
      },
      groupchat: {
        id: 2,
        group_name: "code group",
        group_description: null,
        createdAt: "2025-06-17T13:07:03.114Z",
      },
    },
    {
      id: 44,
      message: "Thanks! You too 😊",
      read: null,
      createdAt: "2025-06-18T15:46:12.261Z",
      sender: {
        id: 1,
        first_name: "John",
        last_name: "Doe",
        mobile: "1234567890",
      },
      groupchat: {
        id: 2,
        group_name: "code group",
      },
    },
    {
      id: 45,
      message: "Hey, how are you doing?",
      read: null,
      createdAt: "2025-06-18T16:30:15.261Z",
      sender: {
        id: 3,
        first_name: "Alice",
        last_name: "Smith",
        mobile: "9876543210",
      },
    },
    {
      id: 46,
      message: "I'm doing great! Working on a new chat system project.",
      read: null,
      createdAt: "2025-06-18T16:31:22.261Z",
      sender: {
        id: 1,
        first_name: "You",
        last_name: "",
        mobile: "current_user",
      },
    },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const [currentUserId] = useState(1); // Simulating current user ID
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getInitials = (firstName, lastName) => {
    const first = firstName ? firstName.charAt(0).toUpperCase() : "";
    const last = lastName ? lastName.charAt(0).toUpperCase() : "";
    return first + last || "?";
  };

  const getAvatarColor = (userId) => {
    const colors = [
      "#ef4444",
      "#3b82f6",
      "#10b981",
      "#f59e0b",
      "#8b5cf6",
      "#ec4899",
      "#6366f1",
      "#14b8a6",
    ];
    return colors[userId % colors.length];
  };

  const isCurrentUser = (senderId) => {
    return senderId === currentUserId;
  };

  const isGroupMessage = (message) => {
    return message.groupchat && message.groupchat.id;
  };

  const getCurrentChatInfo = () => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && isGroupMessage(lastMessage)) {
      return {
        name: lastMessage.groupchat.group_name,
        type: "group",
        avatar: lastMessage.groupchat.group_name.charAt(0).toUpperCase(),
      };
    } else {
      // For individual chat, we'll use the other person's info
      const otherUser = messages.find(
        (m) => !isCurrentUser(m.sender.id)
      )?.sender;
      if (otherUser) {
        return {
          name: `${otherUser.first_name} ${otherUser.last_name}`.trim(),
          type: "individual",
          avatar: getInitials(otherUser.first_name, otherUser.last_name),
        };
      }
    }
    return { name: "Chat", type: "individual", avatar: "C" };
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        message: newMessage,
        read: null,
        createdAt: new Date().toISOString(),
        sender: {
          id: currentUserId,
          first_name: "You",
          last_name: "",
          mobile: "current_user",
        },
        // Add groupchat info if it's a group conversation
        ...(getCurrentChatInfo().type === "group" && {
          groupchat: messages.find((m) => m.groupchat)?.groupchat,
        }),
      };

      setMessages([...messages, message]);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const chatInfo = getCurrentChatInfo();

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      backgroundColor: "#f3f4f6",
      maxWidth: "448px",
      margin: "0 auto",
      border: "1px solid #e5e7eb",
    },
    header: {
      backgroundColor: "#16a34a",
      color: "white",
      padding: "16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    },
    headerLeft: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    avatar: {
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontWeight: "600",
    },
    headerInfo: {
      display: "flex",
      flexDirection: "column",
    },
    headerName: {
      fontWeight: "600",
      fontSize: "18px",
      margin: 0,
    },
    headerStatus: {
      color: "#bbf7d0",
      fontSize: "14px",
      margin: 0,
    },
    headerActions: {
      display: "flex",
      gap: "4px",
    },
    headerButton: {
      padding: "8px",
      backgroundColor: "transparent",
      border: "none",
      borderRadius: "50%",
      color: "white",
      cursor: "pointer",
      transition: "background-color 0.2s",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    messagesContainer: {
      flex: 1,
      overflowY: "auto",
      padding: "16px",
      backgroundColor: "#f9fafb",
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    },
    messageRow: {
      display: "flex",
      alignItems: "flex-end",
      gap: "8px",
    },
    messageRowSent: {
      justifyContent: "flex-end",
    },
    messageRowReceived: {
      justifyContent: "flex-start",
    },
    messageAvatar: {
      width: "32px",
      height: "32px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontSize: "12px",
      fontWeight: "600",
      flexShrink: 0,
    },
    messageBubble: {
      maxWidth: "320px",
      padding: "12px 16px",
      borderRadius: "12px",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    },
    messageBubbleSent: {
      backgroundColor: "#16a34a",
      color: "white",
    },
    messageBubbleReceived: {
      backgroundColor: "white",
      color: "#374151",
      border: "1px solid #e5e7eb",
    },
    senderName: {
      fontSize: "12px",
      fontWeight: "600",
      color: "#16a34a",
      marginBottom: "4px",
      margin: 0,
    },
    messageText: {
      fontSize: "14px",
      wordBreak: "break-word",
      margin: 0,
    },
    messageTime: {
      fontSize: "12px",
      marginTop: "4px",
      textAlign: "right",
      margin: "4px 0 0 0",
    },
    messageTimeSent: {
      color: "#bbf7d0",
    },
    messageTimeReceived: {
      color: "#6b7280",
    },
    inputContainer: {
      backgroundColor: "white",
      borderTop: "1px solid #e5e7eb",
      padding: "16px",
    },
    inputRow: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    inputButton: {
      padding: "8px",
      backgroundColor: "transparent",
      border: "none",
      color: "#6b7280",
      cursor: "pointer",
      transition: "color 0.2s",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    inputWrapper: {
      flex: 1,
      position: "relative",
    },
    input: {
      width: "100%",
      padding: "8px 16px",
      border: "1px solid #d1d5db",
      borderRadius: "24px",
      outline: "none",
      fontSize: "14px",
      boxSizing: "border-box",
    },
    sendButton: {
      padding: "8px",
      backgroundColor: "#16a34a",
      border: "none",
      borderRadius: "50%",
      color: "white",
      cursor: "pointer",
      transition: "background-color 0.2s",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    sendButtonDisabled: {
      backgroundColor: "#d1d5db",
      cursor: "not-allowed",
    },
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div
            style={{
              ...styles.avatar,
              backgroundColor:
                chatInfo.type === "group" ? "#15803d" : getAvatarColor(2),
            }}
          >
            {chatInfo.avatar}
          </div>
          <div style={styles.headerInfo}>
            <h3 style={styles.headerName}>{chatInfo.name}</h3>
            <p style={styles.headerStatus}>
              {chatInfo.type === "group"
                ? "Group • Online"
                : "last seen recently"}
            </p>
          </div>
        </div>
        <div style={styles.headerActions}>
          <button
            style={styles.headerButton}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#15803d")}
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = "transparent")
            }
          >
            <VideoCameraOutlined style={{ fontSize: "20px" }} />
          </button>
          <button
            style={styles.headerButton}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#15803d")}
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = "transparent")
            }
          >
            <PhoneOutlined style={{ fontSize: "20px" }} />
          </button>
          <button
            style={styles.headerButton}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#15803d")}
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = "transparent")
            }
          >
            <MoreOutlined style={{ fontSize: "20px" }} />
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div style={styles.messagesContainer}>
        {messages.map((message) => {
          const isSent = isCurrentUser(message.sender.id);
          const isGroup = isGroupMessage(message);

          return (
            <div
              key={message.id}
              style={{
                ...styles.messageRow,
                ...(isSent ? styles.messageRowSent : styles.messageRowReceived),
              }}
            >
              {/* Avatar for received messages */}
              {!isSent && (
                <div
                  style={{
                    ...styles.messageAvatar,
                    backgroundColor: getAvatarColor(message.sender.id),
                  }}
                >
                  {getInitials(
                    message.sender.first_name,
                    message.sender.last_name
                  )}
                </div>
              )}

              {/* Message Bubble */}
              <div
                style={{
                  ...styles.messageBubble,
                  ...(isSent
                    ? styles.messageBubbleSent
                    : styles.messageBubbleReceived),
                }}
              >
                {/* Group message sender name */}
                {!isSent && isGroup && (
                  <p style={styles.senderName}>
                    {message.sender.first_name} {message.sender.last_name}
                  </p>
                )}

                {/* Message text */}
                <p style={styles.messageText}>{message.message}</p>

                {/* Time */}
                <p
                  style={{
                    ...styles.messageTime,
                    ...(isSent
                      ? styles.messageTimeSent
                      : styles.messageTimeReceived),
                  }}
                >
                  {formatTime(message.createdAt)}
                </p>
              </div>

              {/* Avatar for sent messages */}
              {isSent && (
                <div
                  style={{
                    ...styles.messageAvatar,
                    backgroundColor: "#16a34a",
                  }}
                >
                  You
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div style={styles.inputContainer}>
        <div style={styles.inputRow}>
          <button
            style={styles.inputButton}
            onMouseEnter={(e) => (e.target.style.color = "#374151")}
            onMouseLeave={(e) => (e.target.style.color = "#6b7280")}
          >
            <PaperClipOutlined style={{ fontSize: "20px" }} />
          </button>

          <div style={styles.inputWrapper}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              style={{
                ...styles.input,
                ":focus": {
                  borderColor: "#16a34a",
                  boxShadow: "0 0 0 2px rgba(22, 163, 74, 0.2)",
                },
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#16a34a";
                e.target.style.boxShadow = "0 0 0 2px rgba(22, 163, 74, 0.2)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#d1d5db";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <button
            style={styles.inputButton}
            onMouseEnter={(e) => (e.target.style.color = "#374151")}
            onMouseLeave={(e) => (e.target.style.color = "#6b7280")}
          >
            <SmileOutlined style={{ fontSize: "20px" }} />
          </button>

          <button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            style={{
              ...styles.sendButton,
              ...(newMessage.trim() ? {} : styles.sendButtonDisabled),
            }}
            onMouseEnter={(e) => {
              if (newMessage.trim()) {
                e.target.style.backgroundColor = "#15803d";
              }
            }}
            onMouseLeave={(e) => {
              if (newMessage.trim()) {
                e.target.style.backgroundColor = "#16a34a";
              }
            }}
          >
            <SendOutlined style={{ fontSize: "20px" }} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatSystem;
