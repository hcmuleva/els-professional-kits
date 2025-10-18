import {
  Avatar,
  Button,
  List,
  SearchBar,
  Toast,
  Form,
  Input,
  TextArea,
  ImageUploader,
  Picker,
} from "antd-mobile";
import {
  AddOutline,
  TeamOutline,
  CloseOutline,
  UserOutline,
} from "antd-mobile-icons";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { createGroupChat, getGroupChatDetails } from "../../services/chat";
import ably from "../../utils/ablyClient";
import AddMembersModal from "./AddMembersModal"; // Import the new component

const categoryOptions = [
  "community",
  "temple",
  "events",
  "business",
  "education",
];

export default function GroupSection({ onOpenChat }) {
  const { user } = useContext(AuthContext);
  const [groups, setGroups] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeGroupId, setActiveGroupId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [categoryPickerVisible, setCategoryPickerVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Add Members Modal State
  const [showAddMembersModal, setShowAddMembersModal] = useState(false);
  const [selectedGroupForMembers, setSelectedGroupForMembers] = useState(null);

  const [form] = Form.useForm();

  useEffect(() => {
    if (!user?.id || groups.length === 0) return;

    const subscriptions = [];

    groups.forEach((grp) => {
      const channel = ably.channels.get(`groupchat:${grp.id}`);

      const handler = (msg) => {
        const { groupId, message, chatId, createdAt } = msg.data || {};

        if (!groupId) return;

        setGroups((prev) =>
          prev.map((g) =>
            g.id === groupId
              ? {
                  ...g,
                  preview: message || g.preview,
                  previewAt: createdAt || new Date().toISOString(),
                  unreadCount:
                    groupId !== activeGroupId ? (g.unreadCount || 0) + 1 : 0,
                }
              : g
          )
        );
      };

      channel.subscribe("chat-messages", handler);
      subscriptions.push({ channel, handler });
    });

    return () => {
      subscriptions.forEach(({ channel, handler }) => {
        channel.unsubscribe("chat-messages", handler);
      });
    };
  }, [user?.id, groups, activeGroupId]);

  useEffect(() => {
    if (user?.id) {
      loadUserGroups();
    }
  }, [user?.id]);

  const loadUserGroups = async () => {
    try {
      setLoading(true);
      const response = await getGroupChatDetails(""); // fetch user's groups
      const userGroups = Array.isArray(response) ? response : [response];

      const withPreview = userGroups.map((grp) => {
        const attrs = grp.attributes || grp;
        const chatsData = attrs.chats?.data || [];

        let newestAttributes = null;
        if (chatsData.length > 0) {
          chatsData.sort((a, b) => {
            const at = new Date(a.attributes.createdAt);
            const bt = new Date(b.attributes.createdAt);
            return bt - at; // descending
          });
          newestAttributes = chatsData[0].attributes;
        }

        return {
          ...grp,
          preview: newestAttributes?.message || "",
          previewAt:
            newestAttributes?.createdAt || attrs.updatedAt || attrs.createdAt,
          unreadCount: grp.unreadCount || 0, // Initialize unread count
        };
      });

      withPreview.sort((a, b) => {
        return new Date(b.previewAt) - new Date(a.previewAt);
      });

      setGroups(withPreview);
    } catch (error) {
      console.error("Error loading groups:", error);
      Toast.show({ content: "Failed to load groups", icon: "fail" });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (values) => {
    try {
      setCreateLoading(true);

      const payload = {
        group_name: values.group_name,
        group_description: values.group_description,
        group_category: values.group_category,
        group_logo: values.group_logo?.[0]?.url || null,
        group_categorytype: values.group_category,
        users_permissions_users: user?.id,
      };

      const res = await createGroupChat(payload);

      console.log("Create group payload:", payload);

      Toast.show({ content: "Group created successfully!", icon: "success" });

      setShowCreateModal(false);
      form.resetFields();
      setSelectedCategory(null);

      await loadUserGroups();
    } catch (error) {
      console.error("Error creating group:", error);
      Toast.show({ content: "Failed to create group", icon: "fail" });
    } finally {
      setCreateLoading(false);
    }
  };

  const handleAddMembers = (group) => {
    setSelectedGroupForMembers(group);
    setShowAddMembersModal(true);
  };

  const handleCloseAddMembersModal = () => {
    setShowAddMembersModal(false);
    setSelectedGroupForMembers(null);
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();

    const diffMs = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
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

  const handleModalClose = () => {
    setShowCreateModal(false);
    setSelectedCategory(null);
    form.resetFields();
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#8b5cf6",
        }}
      >
        Loading groups...
      </div>
    );
  }

  const filtered = groups.filter((grp) => {
    const name = grp.attributes?.group_name || grp.group_name || "";
    return name.toLowerCase().includes(searchValue.toLowerCase());
  });

  const isAdmin = user?.userrole === "ADMIN";

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(10px)",
          padding: "16px",
          borderRadius: "0 0 20px 20px",
          marginBottom: "8px",
        }}
      >
        <SearchBar
          placeholder="Search groups..."
          value={searchValue}
          onChange={setSearchValue}
          style={{
            "--border-radius": "25px",
            "--background": "rgba(102,126,234,0.1)",
            "--border": "1px solid rgba(102,126,234,0.3)",
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
        {filtered.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px 20px",
              color: "#6b7280",
            }}
          >
            {searchValue ? "No groups found" : "No groups available"}
          </div>
        ) : (
          filtered.map((grp) => {
            const attrs = grp.attributes || grp;
            const name = attrs.group_name;
            return (
              <List.Item
                key={grp.id}
                prefix={
                  <div style={{ position: "relative" }}>
                    <Avatar
                      style={{
                        "--size": "50px",
                        background: "linear-gradient(45deg,#3b82f6,#8b5cf6)",
                        color: "white",
                      }}
                    >
                      <TeamOutline style={{ fontSize: 24 }} />
                    </Avatar>
                    {grp.unreadCount > 0 && (
                      <div
                        style={{
                          position: "absolute",
                          top: -4,
                          right: -4,
                          minWidth: 18,
                          height: 18,
                          borderRadius: "50%",
                          background: "#ef4444",
                          border: "2px solid white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 10,
                          color: "white",
                          fontWeight: "bold",
                          padding: "0 5px",
                        }}
                      >
                        {grp.unreadCount}
                      </div>
                    )}
                  </div>
                }
                extra={
                  isAdmin && (
                    <Button
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddMembers(grp);
                      }}
                      style={{
                        background: "linear-gradient(45deg,#10b981,#059669)",
                        border: "none",
                        minWidth: "32px",
                        height: "32px",
                        borderRadius: "16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "0",
                      }}
                    >
                      <UserOutline style={{ fontSize: 16, color: "white" }} />
                    </Button>
                  )
                }
                onClick={() => {
                  setActiveGroupId(grp.id);
                  setGroups((prev) =>
                    prev.map((g) =>
                      g.id === grp.id ? { ...g, unreadCount: 0 } : g
                    )
                  );

                  onOpenChat({
                    id: grp.id,
                    name,
                    isGroup: true,
                    receiverId: null,
                  });
                }}
                style={{
                  background: "rgba(255,255,255,0.9)",
                  backdropFilter: "blur(10px)",
                  margin: "4px 16px",
                  borderRadius: 16,
                  border: "1px solid rgba(59,130,246,0.2)",
                }}
              >
                <div
                  style={{ fontWeight: 600, color: "#1f2937", fontSize: 16 }}
                >
                  {name}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 4,
                    color: "#6b7280",
                    fontSize: 14,
                  }}
                >
                  <span
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      flex: 1,
                      marginRight: isAdmin ? "40px" : "0", // Add margin when admin to avoid overlap with button
                    }}
                  >
                    {grp.preview || "No messages yet"}
                  </span>
                  <span style={{ marginLeft: 8, whiteSpace: "nowrap" }}>
                    {formatTime(grp.previewAt)}
                  </span>
                </div>
              </List.Item>
            );
          })
        )}
      </List>

      {isAdmin && (
        <Button
          shape="rounded"
          size="large"
          style={{
            position: "fixed",
            bottom: 80,
            right: 20,
            background: "linear-gradient(45deg,#3b82f6,#8b5cf6)",
            border: "none",
          }}
          onClick={() => setShowCreateModal(true)}
        >
          <AddOutline style={{ fontSize: 24, color: "white" }} />
        </Button>
      )}

      {/* Add Members Modal */}
      <AddMembersModal
        visible={showAddMembersModal}
        onClose={handleCloseAddMembersModal}
        groupId={selectedGroupForMembers?.id}
        groupName={
          selectedGroupForMembers?.attributes?.group_name ||
          selectedGroupForMembers?.group_name
        }
      />

      {showCreateModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleModalClose();
            }
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "20px",
              width: "100%",
              maxWidth: "400px",
              maxHeight: "80vh",
              overflow: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h3 style={{ margin: 0, color: "#1f2937", fontSize: "18px" }}>
                Create New Group
              </h3>
              <Button
                fill="none"
                onClick={handleModalClose}
                style={{ padding: 0, minWidth: "auto" }}
              >
                <CloseOutline style={{ fontSize: 20, color: "#6b7280" }} />
              </Button>
            </div>

            <Form
              form={form}
              onFinish={handleCreateGroup}
              layout="vertical"
              style={{ "--border-inner": "none" }}
            >
              <Form.Item
                name="group_name"
                label="Group Name"
                rules={[{ required: true, message: "Please enter group name" }]}
              >
                <Input
                  placeholder="Enter group name"
                  style={{
                    "--border-radius": "8px",
                    "--border-color": "rgba(102,126,234,0.3)",
                  }}
                />
              </Form.Item>

              <Form.Item
                name="group_description"
                label="Group Description"
                rules={[
                  { required: true, message: "Please enter group description" },
                ]}
              >
                <TextArea
                  placeholder="Enter group description"
                  rows={3}
                  style={{
                    "--border-radius": "8px",
                    "--border-color": "rgba(102,126,234,0.3)",
                  }}
                />
              </Form.Item>

              <Form.Item
                name="group_category"
                label="Group Category"
                rules={[
                  { required: true, message: "Please select a group category" },
                ]}
              >
                <div>
                  <Button
                    onClick={() => setCategoryPickerVisible(true)}
                    style={{
                      "--text-color": selectedCategory ? "#000" : "#999",
                      "--background-color": "#fff",
                      "--border-radius": "8px",
                      "--border": "1px solid rgba(102,126,234,0.3)",
                      textAlign: "left",
                      touchAction: "none",
                      width: "100%",
                    }}
                  >
                    {selectedCategory || "Select category"}
                  </Button>
                  <Picker
                    columns={[
                      categoryOptions.map((value) => ({ label: value, value })),
                    ]}
                    visible={categoryPickerVisible}
                    onClose={() => setCategoryPickerVisible(false)}
                    onConfirm={(values) => {
                      const selectedValue = values[0];
                      setSelectedCategory(selectedValue);
                      form.setFieldsValue({ group_category: selectedValue });
                      setCategoryPickerVisible(false);
                    }}
                    title="Select Category"
                    confirmText="Confirm"
                    cancelText="Cancel"
                  />
                </div>
              </Form.Item>

              <Form.Item name="group_logo" label="Group Logo">
                <ImageUploader
                  maxCount={1}
                  style={{
                    "--border-radius": "8px",
                    "--border-color": "rgba(102,126,234,0.3)",
                  }}
                />
              </Form.Item>

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  marginTop: "24px",
                }}
              >
                <Button
                  block
                  onClick={handleModalClose}
                  style={{
                    background: "#f3f4f6",
                    color: "#6b7280",
                    border: "none",
                  }}
                >
                  Cancel
                </Button>
                <Button
                  block
                  type="submit"
                  loading={createLoading}
                  style={{
                    background: "linear-gradient(45deg,#3b82f6,#8b5cf6)",
                    border: "none",
                  }}
                >
                  Create Group
                </Button>
              </div>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
}
