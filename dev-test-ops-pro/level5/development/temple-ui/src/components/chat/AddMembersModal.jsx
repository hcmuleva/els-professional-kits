import { Button, List, SearchBar, Toast, Avatar } from "antd-mobile";
import { useState, useEffect, useCallback } from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { updateGroupChat } from "../../services/chat";
import { fetchPaginatedUsersList } from "../../services/user";

export default function AddMembersPanel({
  visible,
  onClose,
  groupId,
  groupName,
  orgId,
}) {
  const [users, setUsers] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [addingUsers, setAddingUsers] = useState(new Set());
  const [start, setStart] = useState(0);
  const [limit] = useState(20);
  const [hasMore, setHasMore] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);

  const loadUsers = useCallback(
    async (startIndex = 0, reset = false) => {
      if (!visible || loading || (!hasMore && !reset)) return;

      try {
        setLoading(true);

        const filters = {
          groupId: groupId,
        };

        if (searchValue.trim()) {
          filters.$or = [
            { username: { $containsi: searchValue.trim() } },
            { email: { $containsi: searchValue.trim() } },
            { first_name: { $containsi: searchValue.trim() } },
            { last_name: { $containsi: searchValue.trim() } },
          ];
        }

        const response = await fetchPaginatedUsersList(
          startIndex,
          limit,
          filters
        );

        const newUsers = Array.isArray(response.data) ? response.data : [];

        const mappedUsers = newUsers.map((user) => ({
          id: user.id,
          first_name: user.first_name || "",
          last_name: user.last_name || "",
          username: user.username || "",
          email: user.email || "",
          avatar: user.photos?.url || null,
          profile_picture: user.profilePicture?.url || null,
        }));

        setUsers((prev) => {
          const updatedUsers = reset ? mappedUsers : [...prev, ...mappedUsers];
          return updatedUsers;
        });
        setStart(startIndex + limit);
        setHasMore(response.pagination?.total > startIndex + limit);
        setTotalUsers(response.pagination?.total || 0);
      } catch (error) {
        console.error("Error loading users:", error);
        Toast.show({ content: "Failed to load users", icon: "fail" });
      } finally {
        setLoading(false);
      }
    },
    [visible, searchValue, limit]
  );

  useEffect(() => {
    if (visible) {
      console.log("Panel visible, loading users...");
      const debounce = setTimeout(
        () => {
          loadUsers(0, true);
        },
        searchValue ? 500 : 0
      );
      return () => clearTimeout(debounce);
    } else {
      console.log("Panel closed, resetting state...");
      setUsers([]);
      setSearchValue("");
      setStart(0);
      setHasMore(true);
      setAddingUsers(new Set());
      setTotalUsers(0);
    }
  }, [visible, searchValue, loadUsers]);

  const handleAddUser = async (userId, username) => {
    try {
      setAddingUsers((prev) => new Set([...prev, userId]));

      await updateGroupChat(userId, groupId);

      Toast.show({
        content: `${username} added to group successfully`,
        icon: "success",
      });

      setUsers((prev) => prev.filter((user) => user.id !== userId));
      setTotalUsers((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error adding user to group:", error);
      Toast.show({
        content: `Failed to add ${username} to group`,
        icon: "fail",
      });
    } finally {
      setAddingUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const loadMoreUsers = useCallback(() => {
    if (!loading && hasMore) {
      console.log("Loading more users...");
      loadUsers(start, false);
    }
  }, [loading, hasMore, start, loadUsers]);

  const getUserDisplayName = (user) => {
    const { first_name, last_name, username, email } = user;
    return first_name || last_name
      ? `${first_name || ""} ${last_name || ""}`.trim()
      : username || email || "Unknown User";
  };

  const getUserInitials = (user) => {
    const { first_name, last_name, username } = user;
    return first_name || last_name
      ? `${first_name?.[0] || ""}${last_name?.[0] || ""}`.toUpperCase()
      : username?.[0]?.toUpperCase() || "U";
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "white",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "16px",
          borderBottom: "1px solid rgba(0,0,0,0.1)",
          background: "rgba(255, 255, 255, 0.95)",
        }}
      >
        <Button fill="none" onClick={onClose} style={{ marginRight: "8px" }}>
          <ArrowLeftOutlined style={{ fontSize: "20px", color: "#1f2937" }} />
        </Button>
        <h1
          style={{
            fontSize: "18px",
            fontWeight: 600,
            color: "#1f2937",
            margin: 0,
          }}
        >
          Add Members to {groupName || "Group"}
        </h1>
      </div>

      {/* Search Bar */}
      <div style={{ padding: "16px" }}>
        <SearchBar
          placeholder="Search users by name, username, or email"
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

      {/* User List */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "8px 0",
          background: "white",
        }}
        onScroll={(e) => {
          const { scrollTop, scrollHeight, clientHeight } = e.target;
          if (
            scrollHeight - scrollTop <= clientHeight + 50 &&
            !loading &&
            hasMore
          ) {
            loadMoreUsers();
          }
        }}
      >
        <List
          style={{
            "--background": "transparent",
            "--border-top": "none",
            "--border-bottom": "none",
            width: "100%",
          }}
        >
          {users.length === 0 && !loading ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px 20px",
                color: "#6b7280",
              }}
            >
              {searchValue ? "No users found" : "No users available"}
            </div>
          ) : (
            users.map((user, index) => {
              const isAdding = addingUsers.has(user.id);
              const displayName = getUserDisplayName(user);
              const userEmail = user.email || "No email";

              return (
                <List.Item
                  key={`${user.id}-${index}`}
                  prefix={
                    <Avatar
                      style={{
                        "--size": "45px",
                        background: "linear-gradient(45deg, #3b82f6, #8b5cf6)",
                        color: "white",
                      }}
                    >
                      {getUserInitials(user)}
                    </Avatar>
                  }
                  extra={
                    <Button
                      size="small"
                      loading={isAdding}
                      disabled={isAdding}
                      onClick={() => handleAddUser(user.id, displayName)}
                      style={{
                        background: isAdding
                          ? "#d1d5db"
                          : "linear-gradient(45deg, #10b981, #059669)",
                        color: "white",
                        border: "none",
                        borderRadius: "12px",
                        minWidth: "70px",
                        height: "32px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {isAdding ? "Adding..." : "Add"}
                    </Button>
                  }
                  style={{
                    background: "rgba(255,255,255,0.9)",
                    margin: "4px 16px",
                    borderRadius: "12px",
                    border: "1px solid rgba(59,130,246,0.2)",
                    padding: "8px",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 600,
                      color: "#1f2937",
                      fontSize: 15,
                    }}
                  >
                    {displayName}
                  </div>
                  <div
                    style={{
                      color: "#6b7280",
                      fontSize: 13,
                      marginTop: 2,
                    }}
                  >
                    {userEmail}
                  </div>
                </List.Item>
              );
            })
          )}
          {loading && (
            <div
              style={{
                textAlign: "center",
                padding: "20px",
                color: "#8b5cf6",
              }}
            >
              Loading users...
            </div>
          )}
        </List>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "16px",
          borderTop: "1px solid rgba(0,0,0,0.1)",
          background: "white",
        }}
      >
        <div
          style={{
            textAlign: "center",
            color: "#6b7280",
            fontSize: 12,
          }}
        >
          {users.length > 0 ? (
            <>
              Showing {users.length} of {totalUsers} users
              {hasMore && !loading && (
                <span style={{ marginLeft: 8 }}>• Scroll for more</span>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
