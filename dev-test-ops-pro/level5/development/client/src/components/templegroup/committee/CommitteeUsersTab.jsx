import React, { useState } from "react";
import { Card, Avatar, Button, Tag, Space, Badge, Selector } from "antd-mobile";
import {
  TeamOutline,
  UserOutline,
  MailOutline,
  CalendarOutline,
  FilterOutline,
} from "antd-mobile-icons";
import { PhoneOutlined } from "@ant-design/icons";

const demoMaleImage = "https://example.com/demo-male.jpg";
const demoFemaleImage = "https://example.com/demo-female.jpg";

const CommitteeUsersTab = ({ committeeUsers, getAvailableRoles }) => {
  const [selectedRole, setSelectedRole] = useState("all");

  const getAvatarSource = (user) => {
    if (user.gender === "Female") return null;
    if (user.avatar) return user.avatar;
    return user.gender === "Male" ? demoMaleImage : demoFemaleImage;
  };

  const roleOptions = [
    { label: `All (${committeeUsers.length})`, value: "all" },
    ...getAvailableRoles().map((role) => ({
      label: `${role.charAt(0).toUpperCase() + role.slice(1)} (${
        committeeUsers.filter((user) => user.role === role).length
      })`,
      value: role,
    })),
  ];

  const filteredUsers =
    selectedRole === "all"
      ? committeeUsers
      : committeeUsers.filter((user) => user.role === selectedRole);

  return (
    <div style={{ padding: "16px 0" }}>
      <div
        style={{
          marginBottom: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <h3 style={{ margin: 0, color: "#333" }}>Committee Members</h3>
          <Badge
            content={filteredUsers.length}
            style={{ backgroundColor: "#ff6b35", marginLeft: "8px" }}
          >
            <TeamOutline style={{ fontSize: "20px", color: "#666" }} />
          </Badge>
        </div>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}
        >
          <FilterOutline
            style={{ fontSize: "16px", marginRight: "8px", color: "#666" }}
          />
          <span style={{ fontSize: "14px", color: "#333", fontWeight: "500" }}>
            Filter by Role
          </span>
        </div>
        <Selector
          options={roleOptions}
          value={[selectedRole]}
          onChange={(arr) => setSelectedRole(arr[0] || "all")}
          style={{
            "--border-radius": "6px",
            "--checked-color": "#ff6b3530",
            "--font-size": "12px",
          }}
        />
      </div>

      <div>
        {filteredUsers.map((user) => (
          <Card
            key={user.id}
            style={{
              marginBottom: "12px",
              borderRadius: "8px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
            }}
          >
            <div style={{ padding: "16px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "12px",
                }}
              >
                <Avatar
                  src={getAvatarSource(user)}
                  style={{ marginRight: "12px" }}
                  size={40}
                >
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "4px",
                    }}
                  >
                    <h4 style={{ margin: 0, color: "#333", fontSize: "16px" }}>
                      {user.name}
                    </h4>
                    <div style={{ marginLeft: "auto" }}>
                      <Tag
                        color={user.status === "active" ? "success" : "default"}
                        style={{ fontSize: "10px" }}
                      >
                        {user.status.toUpperCase()}
                      </Tag>
                    </div>
                  </div>
                  <Space>
                    <Tag color="primary" style={{ fontSize: "10px" }}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Tag>
                    {user.committee_role && (
                      <Tag color="warning" style={{ fontSize: "10px" }}>
                        {user.committee_role.charAt(0).toUpperCase() +
                          user.committee_role.slice(1)}
                      </Tag>
                    )}
                  </Space>
                </div>
              </div>

              <div
                style={{ fontSize: "14px", color: "#666", lineHeight: "1.4" }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "4px",
                  }}
                >
                  <MailOutline
                    style={{ marginRight: "8px", fontSize: "14px" }}
                  />
                  <span>{user.email}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "4px",
                  }}
                >
                  <PhoneOutlined
                    style={{ marginRight: "8px", fontSize: "14px" }}
                  />
                  <span>{user.phone}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "12px",
                    color: "#999",
                  }}
                >
                  <CalendarOutline
                    style={{ marginRight: "8px", fontSize: "12px" }}
                  />
                  <span>
                    Joined:{" "}
                    {user.joinedDate
                      ? new Date(user.joinedDate).toLocaleDateString("en-IN")
                      : "N/A"}
                  </span>
                </div>
              </div>

              <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
                <Button
                  size="small"
                  fill="outline"
                  style={{ flex: 1, fontSize: "12px" }}
                >
                  View Profile
                </Button>
                <Button
                  size="small"
                  fill="outline"
                  style={{ flex: 1, fontSize: "12px" }}
                >
                  Message
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div
          style={{ textAlign: "center", padding: "40px 20px", color: "#666" }}
        >
          <UserOutline
            style={{ fontSize: "48px", color: "#ddd", marginBottom: "16px" }}
          />
          <p>No members found</p>
          <p style={{ fontSize: "14px" }}>
            {selectedRole === "all"
              ? "No members in this committee"
              : "No members with this role"}
          </p>
        </div>
      )}
    </div>
  );
};

export default CommitteeUsersTab;
