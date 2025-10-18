import React, { useState } from "react";
import { Avatar, Button } from "antd";
import { PhoneOutlined, UserOutlined } from "@ant-design/icons";
import UserDetailModal from "./UserDetailModal";
import ChangeStatusModal from "./ChangeStatusModal";
import { changeuserstatus } from "../../../../services/temple";
import { message } from "antd";

let profileImg = null;
try {
  profileImg = require("/logo.svg"); // optional image
} catch (e) {
  profileImg = null;
}

const UserCard = ({ user, onStatusChange }) => {
  const [detailOpen, setDetailOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);
  const [loading, setLoading] = useState(false);

  console.log("UserCard user:", user);
  const name = `${currentUser.first_name || ""} ${
    currentUser.last_name || ""
  }`.trim();
  const handleStatusChange = async (newStatus) => {
    try {
      setLoading(true);
      const response = await changeuserstatus({
        userid: user.id,
        userstatus: newStatus,
      });
      message.success("User status updated");
      if (onStatusChange) {
        onStatusChange();
      }
    } catch (error) {
      message.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        key={currentUser.id}
        className="admin-card"
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px",
          backgroundColor: "#fff",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          marginBottom: "12px",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", gap: 12 }}>
          <Avatar
            src={profileImg || undefined}
            icon={!profileImg && <UserOutlined />}
            size={70}
            style={{
              borderRadius: "12px",
              boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
            }}
            alt="Profile"
          />

          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#333",
                marginBottom: "6px",
                lineHeight: "1.4",
              }}
            >
              {name}
            </div>
            <div
              style={{
                fontSize: "14px",
                color: "#777",
                marginBottom: "6px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <PhoneOutlined style={{ fontSize: "14px", color: "#800000" }} />
              {currentUser?.MobileNumber || "—"}
            </div>
            <div
              style={{
                fontSize: "14px",
                color: "#999",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <UserOutlined style={{ fontSize: "14px", color: "#800000" }} />
              {currentUser?.address?.village || "—"} -{" "}
              {currentUser?.address?.state || "—"}
            </div>
            <div
              style={{
                fontSize: "13px",
                fontWeight: "500",
                color: "#555",
                marginTop: "8px",
              }}
            >
              Age: {currentUser.age || "—"} | Status:{" "}
              {currentUser.userstatus || "—"}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <Button size="small" onClick={() => setDetailOpen(true)}>
            Details
          </Button>
          <Button
            size="small"
            type="primary"
            onClick={() => setStatusOpen(true)}
          >
            Change Status
          </Button>
        </div>
      </div>

      <UserDetailModal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        user={currentUser}
      />
      <ChangeStatusModal
        userId={currentUser.id}
        currentStatus={currentUser.userstatus}
        open={statusOpen}
        onClose={() => setStatusOpen(false)}
        onStatusChange={handleStatusChange}
      />
    </>
  );
};

export default UserCard;
