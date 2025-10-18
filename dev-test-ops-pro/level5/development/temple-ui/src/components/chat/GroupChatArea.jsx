import { ArrowLeftOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Input,
  NavBar,
  Toast,
  InfiniteScroll,
  Tabs,
  List,
  Dialog,
  Divider,
} from "antd-mobile";
import { SendOutline, UserAddOutline, DeleteOutline } from "antd-mobile-icons";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import ChatMessage from "./ChatMessage";
import {
  getPaginatedGroupChat,
  sendGroupMessage,
  fetchGroupMembers,
  removeUserFromGroupChat,
} from "../../services/chat";
import ably from "../../utils/ablyClient";
import AddMembersModal from "./AddMembersModal";

const MESSAGES_PER_PAGE = 20;

export default function GroupChatArea({ groupId, chatName, onBack, orgId }) {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");

  // Users tab state
  const [groupMembers, setGroupMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [removingMember, setRemovingMember] = useState(null);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const ablyChannelRef = useRef(null);
  const lastScrollHeight = useRef(0);

  // Check if current user is admin
  const isAdmin = user?.userrole === "ADMIN";

  // Transform message data to consistent format
  const transformMessage = (message) => {
    try {
      if (message?.attributes) {
        const attrs = message.attributes;
        const senderData = attrs.sender?.data;
        const senderAttrs = senderData?.attributes || {};

        return {
          id: message.id,
          message: attrs.message || "",
          timestamp: attrs.createdAt || new Date().toISOString(),
          createdAt: attrs.createdAt || new Date().toISOString(),
          updatedAt: attrs.updatedAt || new Date().toISOString(),
          sender: {
            id: senderData?.id || null,
            first_name: senderAttrs.first_name || "Unknown",
            last_name: senderAttrs.last_name || "",
            username: senderAttrs.username || "Unknown",
            email: senderAttrs.email || "",
            avatar: senderAttrs.avatar?.data?.attributes?.url || null,
            profile_picture:
              senderAttrs.profile_picture?.data?.attributes?.url || null,
          },
        };
      } else {
        const sender = message.sender || {};

        return {
          id: message.id || `temp-${Date.now()}`,
          message: message.message || "",
          timestamp:
            message.createdAt || message.timestamp || new Date().toISOString(),
          createdAt:
            message.createdAt || message.timestamp || new Date().toISOString(),
          updatedAt: message.updatedAt || new Date().toISOString(),
          sender: {
            id: sender.id || null,
            first_name: sender.first_name || "Unknown",
            last_name: sender.last_name || "",
            username: sender.username || "Unknown",
            email: sender.email || "",
            avatar: sender.avatar || null,
            profile_picture: sender.profile_picture || null,
          },
        };
      }
    } catch (error) {
      console.error("Error transforming message:", error, message);
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
          avatar: null,
          profile_picture: null,
        },
      };
    }
  };

  // Load initial messages (most recent)
  const loadInitialMessages = async () => {
    try {
      setLoading(true);
      setMessages([]);
      setCurrentPage(1);
      setHasMore(true);

      const response = await getPaginatedGroupChat(
        groupId,
        1,
        MESSAGES_PER_PAGE,
        user.id
      );

      const rawMessages = response.messages || [];
      console.log("Raw messages received:", rawMessages);

      const transformedMessages = rawMessages.map(transformMessage);

      // Sort messages chronologically (oldest first for display)
      const sortedMessages = transformedMessages.sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );

      setMessages(sortedMessages);
      setHasMore(
        response.hasMore !== undefined
          ? response.hasMore
          : rawMessages.length === MESSAGES_PER_PAGE
      );

      // Scroll to bottom after loading initial messages
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    } catch (error) {
      console.error("Error loading initial messages:", error);
      Toast.show({
        content: "Failed to load messages",
        icon: "fail",
      });
    } finally {
      setLoading(false);
    }
  };

  // Load group members
  const loadGroupMembers = async () => {
    try {
      setLoadingMembers(true);
      const response = await fetchGroupMembers(groupId, 0, 50);
      setGroupMembers(response.data || []);
    } catch (error) {
      console.error("Error loading group members:", error);
      Toast.show({
        content: "Failed to load group members",
        icon: "fail",
      });
    } finally {
      setLoadingMembers(false);
    }
  };

  // Remove member from group
  const handleRemoveMember = async (memberId, memberName) => {
    if (!isAdmin) {
      Toast.show({
        content: "Only admins can remove members",
        icon: "fail",
      });
      return;
    }

    if (memberId === user.id) {
      Toast.show({
        content: "You cannot remove yourself",
        icon: "fail",
      });
      return;
    }

    const result = await Dialog.confirm({
      content: `Are you sure you want to remove ${memberName} from the group?`,
      confirmText: "Remove",
      cancelText: "Cancel",
    });

    if (result) {
      try {
        setRemovingMember(memberId);

        // Call the API to remove user from group
        await removeUserFromGroupChat(memberId, groupId);

        // Remove from local state after successful API call
        setGroupMembers((prev) =>
          prev.filter((member) => member.id !== memberId)
        );

        Toast.show({
          content: `${memberName} has been removed from the group`,
          icon: "success",
        });
      } catch (error) {
        console.error("Error removing member:", error);
        Toast.show({
          content: `Failed to remove member: ${error || "Unknown error"}`,
          icon: "fail",
        });
      } finally {
        setRemovingMember(null);
      }
    }
  };

  // Load older messages (for infinite scroll up)
  const loadMoreMessages = async () => {
    console.log("🔄 loadMoreMessages called", {
      hasMore,
      loadingMore,
      currentPage,
    });

    if (!hasMore || loadingMore) {
      console.log(
        "❌ Skipping load - hasMore:",
        hasMore,
        "loadingMore:",
        loadingMore
      );
      return;
    }

    try {
      setLoadingMore(true);
      const nextPage = currentPage + 1;

      console.log("📡 Fetching page:", nextPage);

      // Store current scroll position
      const container = messagesContainerRef.current;
      if (container) {
        lastScrollHeight.current = container.scrollHeight;
      }

      const response = await getPaginatedGroupChat(
        groupId,
        nextPage,
        MESSAGES_PER_PAGE,
        user.id
      );

      console.log("📦 Response received:", response);

      const rawMessages = response.messages || [];

      if (rawMessages.length === 0) {
        console.log("✅ No more messages, setting hasMore to false");
        setHasMore(false);
        return;
      }

      const transformedMessages = rawMessages.map(transformMessage);

      // Sort new messages chronologically
      const sortedMessages = transformedMessages.sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );

      console.log("📝 Adding", sortedMessages.length, "messages to the top");

      // Prepend older messages to the beginning
      setMessages((prev) => {
        const newMessages = [...sortedMessages, ...prev];
        console.log("📊 Total messages now:", newMessages.length);
        return newMessages;
      });

      setCurrentPage(nextPage);
      setHasMore(
        response.hasMore !== undefined
          ? response.hasMore
          : rawMessages.length === MESSAGES_PER_PAGE
      );

      // Maintain scroll position after loading older messages
      setTimeout(() => {
        if (container) {
          const newScrollHeight = container.scrollHeight;
          const scrollDiff = newScrollHeight - lastScrollHeight.current;
          console.log("🔧 Adjusting scroll:", {
            scrollDiff,
            newScrollHeight,
            lastScrollHeight: lastScrollHeight.current,
          });
          container.scrollTop = scrollDiff;
        }
      }, 100);
    } catch (error) {
      console.error("❌ Error loading more messages:", error);
      Toast.show({
        content: "Failed to load more messages",
        icon: "fail",
      });
    } finally {
      setLoadingMore(false);
    }
  };

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || sending) return;
    const text = newMessage.trim();

    // Create optimistic message for immediate UI update
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

    // Add message to UI immediately at the end
    setMessages((prev) => [...prev, optimisticMessage]);
    setNewMessage("");
    setSending(true);

    // Scroll to bottom to show the new message
    setTimeout(() => scrollToBottom(), 100);

    try {
      const response = await sendGroupMessage(user.id, groupId, text);

      const realMessage = {
        id: response?.id || response?.data?.id || optimisticMessage.id,
        message: text,
        timestamp: response?.createdAt || new Date().toISOString(),
        createdAt: response?.createdAt || new Date().toISOString(),
        updatedAt: response?.updatedAt || new Date().toISOString(),
        sender: { ...user },
        sending: false,
      };

      setMessages((prev) =>
        prev.map((msg) => (msg.id === optimisticMessage.id ? realMessage : msg))
      );

      // Publish to Ably
      if (ablyChannelRef.current) {
        try {
          await ablyChannelRef.current.publish("chat-messages", {
            from: user.id,
            message: text,
            groupId,
            chatId: realMessage.id,
            sender: { ...user },
            timestamp: realMessage.timestamp,
          });
          console.log("✅ Group message published to Ably");
        } catch (ablyErr) {
          console.error("❌ Ably publish error:", ablyErr);
        }
      }
    } catch (err) {
      console.error("❌ Group send failed:", err);
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

  // Handle key press in input
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return "G";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Custom scroll handler for infinite scroll
  const handleScroll = (e) => {
    const container = e.target;
    const { scrollTop, scrollHeight, clientHeight } = container;

    console.log("Scroll Debug:", {
      scrollTop,
      scrollHeight,
      clientHeight,
      hasMore,
      loadingMore,
    });

    // Load more messages when scrolled near the top (like WhatsApp)
    // Check if we're within 50px of the top
    if (scrollTop <= 50 && hasMore && !loadingMore) {
      console.log("🔄 Triggering loadMoreMessages");
      loadMoreMessages();
    }
  };

  // Handle tab change
  const handleTabChange = (key) => {
    setActiveTab(key);
    if (key === "users" && groupMembers.length === 0) {
      loadGroupMembers();
    }
  };

  useEffect(() => {
    // Preload members so tab title has count
    loadGroupMembers();
  }, []);

  // Set up Ably real-time messaging
  useEffect(() => {
    if (!groupId || !user?.id) return;

    console.log("🔔 Setting up Ably channel for group:", groupId);

    const channel = ably.channels.get(`groupchat:${groupId}`);
    ablyChannelRef.current = channel;

    const handleIncomingMessage = (message) => {
      console.log("📨 Received real-time message:", message);

      const messageData = message.data;

      // Don't add our own messages (they're handled optimistically)
      if (messageData.from === user.id) {
        return;
      }

      const newMessage = transformMessage({
        id: messageData.chatId || `ably-${Date.now()}`,
        message: messageData.message,
        timestamp: messageData.timestamp || new Date().toISOString(),
        createdAt: messageData.timestamp || new Date().toISOString(),
        sender: messageData.sender,
      });

      // Add new message at the end (newest)
      setMessages((prev) => {
        const exists = prev.some((msg) => msg.id === newMessage.id);
        if (exists) return prev;
        return [...prev, newMessage];
      });

      // Scroll to bottom to show new message
      setTimeout(() => scrollToBottom(), 100);
    };

    channel.subscribe("chat-messages", handleIncomingMessage);

    return () => {
      console.log("🔌 Unsubscribing from Ably channel for group:", groupId);
      channel.unsubscribe("chat-messages", handleIncomingMessage);
      ablyChannelRef.current = null;
    };
  }, [groupId, user?.id]);

  // Load messages when component mounts or groupId changes
  useEffect(() => {
    if (groupId && user?.id) {
      loadInitialMessages();
    }
  }, [groupId, user?.id]);

  const tabItems = [
    {
      key: "chat",
      title: "Chat",
    },
    {
      key: "users",
      title: `Users (${groupMembers.length})`,
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Navigation Bar */}
      <NavBar
        onBack={onBack}
        backIcon={<ArrowLeftOutlined />}
        right={
          <Button
            shape="rounded"
            size="small"
            onClick={() => setIsModalVisible(true)}
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
            <UserAddOutline style={{ fontSize: "18px" }} />
          </Button>
        }
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
              background: "linear-gradient(45deg, #3b82f6, #8b5cf6)",
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
            <div style={{ fontSize: "12px", color: "#6b7280" }}>Group chat</div>
          </div>
        </div>
      </NavBar>

      {/* Tabs */}
      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        style={{
          position: "sticky",
          top: "60px", // exactly below the NavBar
          zIndex: 99,
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          "--border-bottom": "1px solid rgba(139, 92, 246, 0.2)",
        }}
      >
        {tabItems.map((item) => (
          <Tabs.Tab title={item.title} key={item.key} />
        ))}
      </Tabs>

      {/* Tab Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {activeTab === "chat" && (
          <>
            {/* Messages Container */}
            <div
              ref={messagesContainerRef}
              onScroll={handleScroll}
              style={{
                flex: 1,
                overflowY: "auto",
                background: "rgba(255, 255, 255, 0.05)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {loading && messages.length === 0 ? (
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
              ) : (
                <div
                  style={{
                    padding: "8px 0",
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    minHeight: "100%",
                  }}
                >
                  {/* Load More Button */}
                  {hasMore && !loading && (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "10px",
                        borderBottom: "1px solid rgba(139, 92, 246, 0.1)",
                      }}
                    >
                      <Button
                        size="small"
                        onClick={loadMoreMessages}
                        loading={loadingMore}
                        disabled={loadingMore}
                        style={{
                          background: "rgba(139, 92, 246, 0.1)",
                          border: "1px solid rgba(139, 92, 246, 0.3)",
                          color: "#8b5cf6",
                          fontSize: "12px",
                        }}
                      >
                        {loadingMore ? "Loading..." : "Load older messages"}
                      </Button>
                    </div>
                  )}

                  {/* Loading indicator for older messages */}
                  {loadingMore && (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "10px",
                        color: "#8b5cf6",
                        fontSize: "14px",
                      }}
                    >
                      Loading older messages...
                    </div>
                  )}

                  {/* Messages */}
                  {messages.map((msg) => (
                    <ChatMessage
                      key={msg.id}
                      message={msg.message}
                      sender={msg.sender}
                      timestamp={msg.timestamp}
                      isCurrentUser={msg.sender.id === user.id}
                      sending={msg.sending}
                      isGroup={true}
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

                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Message Input */}
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
          </>
        )}

        {activeTab === "users" && (
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              background: "rgba(255, 255, 255, 0.05)",
            }}
          >
            {loadingMembers ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px 20px",
                  color: "#8b5cf6",
                }}
              >
                Loading members...
              </div>
            ) : (
              <List
                style={{
                  "--border-top": "none",
                  "--border-bottom": "none",
                }}
              >
                {groupMembers.map((member) => (
                  <List.Item
                    key={member.id}
                    prefix={
                      <Avatar
                        src={
                          member.profilePicture?.url ||
                          member.photos?.url ||
                          null
                        }
                        style={{
                          "--size": "40px",
                          background:
                            "linear-gradient(45deg, #3b82f6, #8b5cf6)",
                          color: "white",
                          fontWeight: "bold",
                        }}
                      >
                        {getInitials(
                          `${member.first_name} ${member.last_name}`.trim() ||
                            member.username
                        )}
                      </Avatar>
                    }
                    extra={
                      isAdmin && member.id !== user.id ? (
                        <Button
                          size="small"
                          color="danger"
                          fill="none"
                          onClick={() =>
                            handleRemoveMember(
                              member.id,
                              `${member.first_name} ${member.last_name}`.trim() ||
                                member.username
                            )
                          }
                          loading={removingMember === member.id}
                          disabled={removingMember === member.id}
                          style={{
                            "--border-color": "#ef4444",
                            "--text-color": "#ef4444",
                          }}
                        >
                          <DeleteOutline style={{ fontSize: "16px" }} />
                        </Button>
                      ) : member.id === user.id ? (
                        <span
                          style={{
                            fontSize: "12px",
                            color: "#8b5cf6",
                            fontWeight: "500",
                          }}
                        >
                          You
                        </span>
                      ) : null
                    }
                    style={{
                      "--border-bottom": "1px solid rgba(139, 92, 246, 0.1)",
                      "--padding-left": "16px",
                      "--padding-right": "16px",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: "500", color: "#1f2937" }}>
                        {`${member.first_name} ${member.last_name}`.trim() ||
                          member.username}
                      </div>
                      <div style={{ fontSize: "12px", color: "#6b7280" }}>
                        {member.email}
                      </div>
                    </div>
                  </List.Item>
                ))}

                {groupMembers.length === 0 && !loadingMembers && (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "40px 20px",
                      color: "#6b7280",
                    }}
                  >
                    No members found
                  </div>
                )}
              </List>
            )}
          </div>
        )}
      </div>

      {/* Add Members Modal */}
      <AddMembersModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        groupId={groupId}
        groupName={chatName}
        orgId={orgId}
        onMembersAdded={loadGroupMembers} // Refresh members when new ones are added
      />
    </div>
  );
}
