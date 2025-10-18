import { PhoneFill, UserOutline } from "antd-mobile-icons";
import React from "react";

export default function CommunityCard({ communityData, communityRole }) {
  const communityDetails = communityData;
  const userProfile = communityDetails.icon || "https://demo.adminkit.io/img/avatars/avatar-4.jpg";
  const name = communityDetails?.name;

  const startDate = communityDetails?.startdate || "N/A";
  const endDate = communityDetails?.enddate || "N/A";

  return (
    <div
      key={communityDetails.id}
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
      {/* Left icon */}
      <div
        style={{
          width: "70px",
          height: "70px",
          borderRadius: "12px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
          fontSize: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f0f0f0",
        }}
      >
        {communityData?.icon}
      </div>

      {/* Center content */}
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
          <PhoneFill style={{ fontSize: "14px", color: "#800000" }} />
          {communityDetails?.type}
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
          <UserOutline style={{ fontSize: "14px", color: "#800000" }} />
          {communityRole?.name}
        </div>
      </div>

      {/* Right column for start and end dates */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          fontSize: "13px",
          color: "#666",
          minWidth: "100px",
        }}
      >
        <div><strong>Start:</strong> {startDate}</div>
        <div><strong>End:</strong> {endDate}</div>
      </div>
    </div>
  );
}
