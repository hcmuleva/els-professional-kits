import React from "react";
import { Card } from "antd-mobile";

const AnimatedNumber = ({ value }) => (
  <div style={{ fontSize: "16px", fontWeight: "bold", color: "#fff", textAlign: "center" }}>
    {value.toLocaleString()}
  </div>
);

const GroupHeader = ({ groupInfo, memberCount = 0, adminCount = 0, onCardClick }) => {
  const groupData = {
    name: groupInfo?.name || "Temple Group",
    description: groupInfo?.description || "Temple Address goes here",
    image: groupInfo?.image || "/default-temple.jpg",
    memberCount,
    adminCount,
  };

  const cards = [
    { label: "Members", value: groupData.memberCount, type: "members" },
    { label: "Committees", value: groupData.adminCount, type: "committees" },
    { label: "Details", value: groupData.adminCount, type: "details" },
  ];

  return (
    <>
      <Card
        style={{
          margin: 0,
          borderRadius: "0 0 20px 20px",
          background: "linear-gradient(135deg,#5a200e 0%,#856945 30%,#664900 100%)",
          border: "none",
        }}
      >
        {/* Image */}
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 16, paddingBottom: 12 }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              overflow: "hidden",
              border: "3px solid rgba(255, 255, 255, 0.4)",
              background: "rgba(255, 255, 255, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {groupData.image !== "/default-temple.jpg" ? (
              <img
                src={groupData.image}
                alt={groupData.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div style={{ fontSize: 32, color: "#fff" }}>🏛️</div>
            )}
          </div>
        </div>

        {/* Name & Address */}
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <h1 style={{ margin: "0 0 6px", fontSize: 20, fontWeight: "bold", color: "#fff" }}>
            {groupData.name}
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: "rgba(255, 255, 255, 0.9)" }}>
            {groupData.description}
          </p>
        </div>

        {/* Cards */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            padding: "0 16px 16px 16px",
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {cards.map((item) => (
            <div
              key={item.label}
              onClick={() => onCardClick(item.type)}
              style={{
                minWidth: "100px",
                flex: "1 0 auto",
                background: "rgba(255, 255, 255, 0.25)",
                borderRadius: "12px",
                padding: "14px 8px",
                textAlign: "center",
                cursor: "pointer",
                border: "1px solid rgba(255, 255, 255, 0.3)",
              }}
            >
              <AnimatedNumber value={item.value} />
              <div
                style={{
                  fontSize: "11px",
                  color: "rgba(255, 255, 255, 0.9)",
                  marginTop: "2px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
};

export default GroupHeader;
