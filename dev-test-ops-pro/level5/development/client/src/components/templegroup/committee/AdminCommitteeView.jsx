import React, { useState } from "react";
import {
  Tabs,
  Button,
  Tag,
  Toast,
  Card,
  List,
  SearchBar,
  Selector,
  Loading,
  Avatar,
  Divider,
  NavBar,
} from "antd-mobile";
import {
  FileOutline,
  TeamOutline,
  AddOutline,
  UserOutline,
} from "antd-mobile-icons";
import AboutTab from "./AboutTab";
import CommitteeUsersTab from "./CommitteeUsersTab";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchPaginatedUsersList,
  updateUserProfile,
} from "../../../services/user";
import {
  addUserToCommittee,
  getSingleCommittee,
  updateSingleCommittee,
} from "../../../services/committee";

const AdminCommitteeView = ({
  committee,
  committeeUsers = [],
  setCommitteeUsers,
  getAvailableRoles,
  activeTab,
  setActiveTab,
}) => {
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [availableUsers, setAvailableUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const { orgId, committeeId } = useParams();
  const navigate = useNavigate();
  const fetchAvailableUsers = async (query = "") => {
    setUsersLoading(true);
    try {
      if (!orgId || isNaN(orgId)) {
        Toast.show({ content: "Invalid organization ID", position: "top" });
        setAvailableUsers([]);
        return;
      }

      const filters = { orgId, committee_role: { $eq: null } };
      if (query) {
        filters.$or = [
          { first_name: { $containsi: query } },
          { last_name: { $containsi: query } },
          { email: { $containsi: query } },
        ];
      }

      const response = await fetchPaginatedUsersList(0, 50, filters);
      const users = Array.isArray(response.data) ? response.data : [];

      if (!users.length) {
        setAvailableUsers([]);
        Toast.show({ content: "No available users found", position: "top" });
        return;
      }

      const processedUsers = users.map((user) => ({
        id: user.id,
        name: `${user.first_name || "Unknown"} ${user.last_name || ""}`.trim(),
        email: user.email || "N/A",
        mobile: user.mobile || "N/A",
        age: user.age || "N/A",
        gender: user.gender || "N/A",
        avatar: `https://ui-avatars.com/api/?name=${
          user.first_name || "User"
        }+${user.last_name || ""}&background=007bff&color=fff`,
      }));

      setAvailableUsers(processedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      Toast.show({ content: "Failed to load users", position: "top" });
      setAvailableUsers([]);
    } finally {
      setUsersLoading(false);
    }
  };

  const handleAddUser = async () => {
    if (!selectedUser || !selectedRole) {
      Toast.show({ content: "Please select a user and role", position: "top" });
      return;
    }

    setIsAddingUser(true);
    try {
      await updateUserProfile(selectedUser.id, {
        committee_role: selectedRole,
      });

      await addUserToCommittee(committeeId, selectedUser.id);

      const response = await getSingleCommittee(committeeId);

      const processedUsers =
        response.data?.attributes?.users?.data?.map((user) => ({
          id: user.id,
          name: `${user.attributes.first_name || "Unknown"} ${
            user.attributes.last_name || ""
          }`.trim(),
          email: user.attributes.email || "N/A",
          phone: user.attributes.mobile || "N/A",
          role: user.attributes.committee_role || selectedRole,
          avatar: `https://ui-avatars.com/api/?name=${
            user.attributes.first_name || "User"
          }+${user.attributes.last_name || ""}&background=ff6b35&color=fff`,
          joinedDate: user.attributes.createdAt,
          status:
            user.attributes.userstatus === "APPROVED" ? "active" : "inactive",
          age: user.attributes.age || null,
          gender: user.attributes.gender || "N/A",
          addresses: user.attributes.addresses?.data || [],
        })) || [];

      setCommitteeUsers(processedUsers);
      Toast.show({ content: "User added successfully", position: "top" });

      // Reset UI
      setShowAddUserModal(false);
      setSelectedUser(null);
      setSelectedRole("");
      setSearchQuery("");
      setAvailableUsers([]);
    } catch (error) {
      console.error("Add User Error:", error);
      Toast.show({ content: "Failed to add user", position: "top" });
    } finally {
      setIsAddingUser(false);
    }
  };

  const AddUserModal = () => (
    <Card
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "90%",
        maxWidth: "90%",
        maxHeight: "90vh",
        borderRadius: "16px",
        overflow: "hidden",
        zIndex: 1000,
        boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
      }}
    >
      <div style={{ padding: "16px", background: "#fff" }}>
        <h3
          style={{
            margin: "0 0 16px 0",
            fontSize: "18px",
            textAlign: "center",
            color: "#333",
          }}
        >
          Add Member to Committee
        </h3>
        <div
          style={{
            position: "sticky",
            top: 0,
            background: "#fff",
            zIndex: 10,
            paddingBottom: "8px",
          }}
        >
          <SearchBar
            placeholder="Search users by name or email"
            value={searchQuery}
            onChange={(value) => {
              setSearchQuery(value);
              fetchAvailableUsers(value);
            }}
            style={{ marginBottom: "16px", "--border-radius": "8px" }}
          />
          <h4 style={{ margin: "0 0 8px 0", color: "#333", fontSize: "14px" }}>
            Select Role:
          </h4>
          <Selector
            options={getAvailableRoles().map((role) => ({
              label: role.charAt(0).toUpperCase() + role.slice(1),
              value: role,
            }))}
            value={selectedRole ? [selectedRole] : []}
            onChange={(arr) => setSelectedRole(arr[0] || "")}
            style={{ marginBottom: "16px", "--border-radius": "6px" }}
          />
          {selectedUser && (
            <div
              style={{
                padding: "8px",
                background: "#f0f8ff",
                borderRadius: "8px",
                marginBottom: "16px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <Avatar src={selectedUser.avatar} size={32} />
                <div>
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#333",
                    }}
                  >
                    {selectedUser.name}
                  </span>
                  <p style={{ margin: "0", fontSize: "12px", color: "#666" }}>
                    Selected for role: {selectedRole || "None"}
                  </p>
                </div>
              </div>
            </div>
          )}
          <Divider style={{ margin: "8px 0" }} />
        </div>
        <div
          style={{ maxHeight: "40vh", overflowY: "auto", marginBottom: "16px" }}
        >
          <h4 style={{ margin: "0 0 8px 0", color: "#333", fontSize: "14px" }}>
            Select User:
          </h4>
          {usersLoading ? (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <Loading />
            </div>
          ) : availableUsers.length > 0 ? (
            <List>
              {availableUsers.map((user) => (
                <List.Item
                  key={user.id}
                  prefix={<Avatar src={user.avatar} size={40} />}
                  description={
                    <div>
                      <p
                        style={{ margin: "0", fontSize: "12px", color: "#666" }}
                      >
                        {user.email}
                      </p>
                      <p
                        style={{ margin: "0", fontSize: "12px", color: "#666" }}
                      >
                        Phone: {user.mobile}
                      </p>
                      <p
                        style={{ margin: "0", fontSize: "12px", color: "#666" }}
                      >
                        Age: {user.age} • Gender: {user.gender}
                      </p>
                    </div>
                  }
                  clickable
                  onClick={() => setSelectedUser(user)}
                  style={{
                    backgroundColor:
                      selectedUser?.id === user.id ? "#e6f7ff" : "transparent",
                    borderRadius: "8px",
                    marginBottom: "8px",
                  }}
                >
                  <span style={{ fontSize: "14px", fontWeight: "500" }}>
                    {user.name}
                  </span>
                </List.Item>
              ))}
            </List>
          ) : (
            <p style={{ textAlign: "center", color: "#666", padding: "20px" }}>
              <UserOutline style={{ fontSize: "24px", marginBottom: "8px" }} />
              <br />
              No available users found
            </p>
          )}
        </div>
        <div
          style={{
            display: "flex",
            gap: "12px",
            position: "sticky",
            bottom: 0,
            background: "#fff",
            paddingTop: "8px",
          }}
        >
          <Button
            block
            fill="outline"
            onClick={() => {
              setShowAddUserModal(false);
              setSelectedUser(null);
              setSelectedRole("");
              setSearchQuery("");
              setAvailableUsers([]);
            }}
            style={{ "--border-radius": "6px" }}
          >
            Cancel
          </Button>
          <Button
            block
            color="primary"
            onClick={handleAddUser}
            disabled={!selectedUser || !selectedRole || isAddingUser}
            loading={isAddingUser}
            style={{ "--border-radius": "6px" }}
          >
            Add Member
          </Button>
        </div>
      </div>
    </Card>
  );

  const tabs = [
    {
      key: "about",
      title: "About",
      icon: <FileOutline />,
      content: (
        <AboutTab
          committee={committee}
          committeeUsers={committeeUsers}
          getAvailableRoles={getAvailableRoles}
        />
      ),
    },
    {
      key: "users",
      title: "Members",
      icon: <TeamOutline />,
      content: (
        <div style={{ padding: "16px 0" }}>
          <Button
            color="primary"
            size="small"
            onClick={() => {
              setShowAddUserModal(true);
              fetchAvailableUsers();
            }}
            style={{ marginBottom: "16px", "--border-radius": "6px" }}
          >
            <AddOutline style={{ marginRight: "4px" }} />
            Add Member
          </Button>
          <CommitteeUsersTab
            committeeUsers={committeeUsers}
            getAvailableRoles={getAvailableRoles}
          />
        </div>
      ),
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        paddingBottom: "60px",
      }}
    >
      <NavBar
        onBack={() => navigate(-1)}
        style={{
          background: "#fff",
          fontWeight: 600,
          fontSize: "16px",
          borderBottom: "1px solid #eee",
          paddingTop: "10px",
        }}
      >
        <div
          style={{
            background: "#fff",

            marginBottom: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h1
            style={{
              margin: 0,
              color: "#333",
              fontSize: "18px",
              textAlign: "center",
            }}
          >
            {committee.committeeName}
          </h1>
          <div style={{ textAlign: "center", marginTop: "4px" }}>
            <Tag color="success" style={{ fontSize: "10px" }}>
              ADMIN VIEW
            </Tag>
          </div>
        </div>
      </NavBar>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        style={{
          "--active-line-color": "#ff6b35",
          "--active-title-color": "#ff6b35",
          "--title-font-size": "14px",
          background: "#fff",
          margin: "0 8px",
          borderRadius: "12px",
        }}
      >
        {tabs.map((item) => (
          <Tabs.Tab
            key={item.key}
            title={
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "2px",
                }}
              >
                {item.icon}
                <span style={{ fontSize: "12px" }}>{item.title}</span>
              </div>
            }
          >
            <div
              style={{
                padding: "0 16px 16px",
                background: "#fff",
                margin: "0 8px",
                borderRadius: "0 0 12px 12px",
              }}
            >
              {item.content}
            </div>
          </Tabs.Tab>
        ))}
      </Tabs>
      {showAddUserModal && <AddUserModal />}
    </div>
  );
};

export default AdminCommitteeView;
