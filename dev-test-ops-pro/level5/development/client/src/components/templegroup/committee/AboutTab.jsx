import React from "react";
import { Card, Tag, Space } from "antd-mobile";
import {
  FileOutline,
  TeamOutline,
  CalendarOutline,
  StarOutline,
} from "antd-mobile-icons";

const AboutTab = ({ committee, committeeUsers, getAvailableRoles }) => (
  <div style={{ padding: "16px 0" }}>
    <Card
      style={{
        marginBottom: "16px",
        borderRadius: "12px",
        background: "linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)",
        color: "white",
      }}
    >
      <div style={{ padding: "20px", textAlign: "center" }}>
        <div
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 12px",
          }}
        >
          <TeamOutline style={{ fontSize: "28px" }} />
        </div>
        <h2 style={{ margin: "0 0 8px 0", fontSize: "20px" }}>
          {committee?.committeeName || "Unnamed Committee"}
        </h2>
        <p style={{ margin: 0, opacity: 0.9, fontSize: "14px" }}>
          {committee?.type
            ? committee.type.charAt(0).toUpperCase() + committee.type.slice(1)
            : "Unknown"}{" "}
          Committee
        </p>
      </div>
    </Card>

    <Card style={{ marginBottom: "16px", borderRadius: "8px" }}>
      <div style={{ padding: "16px" }}>
        <h3 style={{ margin: "0 0 16px 0", color: "#333" }}>
          Committee Details
        </h3>
        <div style={{ marginBottom: "12px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <FileOutline style={{ marginRight: "8px", color: "#ff6b35" }} />
            <span style={{ fontWeight: "500", color: "#333" }}>Category:</span>
          </div>
          <p style={{ margin: "0 0 0 24px", color: "#666" }}>
            {committee?.subtype
              ? committee.subtype.charAt(0).toUpperCase() +
                committee.subtype.slice(1)
              : "Unknown"}
          </p>
        </div>
        <div style={{ marginBottom: "12px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <CalendarOutline style={{ marginRight: "8px", color: "#ff6b35" }} />
            <span style={{ fontWeight: "500", color: "#333" }}>Created:</span>
          </div>
          <p style={{ margin: "0 0 0 24px", color: "#666" }}>
            {committee?.createdAt
              ? new Date(committee.createdAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "N/A"}
          </p>
        </div>
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <StarOutline style={{ marginRight: "8px", color: "#ff6b35" }} />
            <span style={{ fontWeight: "500", color: "#333" }}>
              Available Roles:
            </span>
          </div>
          <div style={{ margin: "8px 0 0 24px" }}>
            {getAvailableRoles().length > 0 ? (
              <Space wrap>
                {getAvailableRoles().map((role, index) => (
                  <Tag
                    key={index}
                    color="primary"
                    style={{ marginBottom: "4px" }}
                  >
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </Tag>
                ))}
              </Space>
            ) : (
              <p style={{ color: "#666", fontSize: "14px" }}>
                No roles available
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>

    <Card style={{ borderRadius: "8px" }}>
      <div style={{ padding: "16px" }}>
        <h3 style={{ margin: "0 0 16px 0", color: "#333" }}>Statistics</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          <div
            style={{
              textAlign: "center",
              padding: "12px",
              background: "#f5f5f5",
              borderRadius: "8px",
            }}
          >
            <div
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                color: "#ff6b35",
                marginBottom: "4px",
              }}
            >
              {committeeUsers.filter((user) => user.status === "active").length}
            </div>
            <div style={{ fontSize: "12px", color: "#666" }}>
              Active Members
            </div>
          </div>
          <div
            style={{
              textAlign: "center",
              padding: "12px",
              background: "#f5f5f5",
              borderRadius: "8px",
            }}
          >
            <div
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                color: "#ff6b35",
                marginBottom: "4px",
              }}
            >
              {committeeUsers.length}
            </div>
            <div style={{ fontSize: "12px", color: "#666" }}>Total Members</div>
          </div>
        </div>
      </div>
    </Card>
  </div>
);

export default AboutTab;
