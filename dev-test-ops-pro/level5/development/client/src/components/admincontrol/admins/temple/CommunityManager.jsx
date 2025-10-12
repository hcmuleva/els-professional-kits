import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Modal, Button } from "antd-mobile";
import AssignCommunityToTemple from "./AssignCommunityToTemple";
import CommunityList from "./community/CommunityList";

const warmColors = {
  primary: "#8B4513",
  secondary: "#A0522D",
  accent: "#CD853F",
  background: "#FAFAFA",
  cardBg: "#FFFFFF",
  textPrimary: "#2C2C2C",
  textSecondary: "#666666",
  border: "#E8E8E8",
  error: "#D32F2F",
  success: "#2E7D32",
};

const CommunityManager = () => {
  const { id } = useParams();
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => {
    setIsModalOpen(false);
    setRefreshTrigger((prev) => !prev); // Refresh only when modal closes
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: warmColors.background,
        padding: "16px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `radial-gradient(circle at 25% 25%, ${warmColors.primary}08 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, ${warmColors.accent}08 0%, transparent 50%)`,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Button
          onClick={handleOpen}
          block
          style={{
            background: `linear-gradient(135deg, ${warmColors.primary} 0%, ${warmColors.secondary} 100%)`,
            border: "none",
            fontWeight: "600",
            borderRadius: "16px",
            height: "48px",
            fontSize: "16px",
            color: warmColors.cardBg,
            boxShadow: `0 6px 20px ${warmColors.primary}40`,
            marginBottom: "24px",
          }}
        >
          नयी कमिटी बनाये
        </Button>

        <Modal
          visible={isModalOpen}
          onClose={handleClose}
          content={
            <div
              style={{
                backgroundColor: warmColors.cardBg,
                borderRadius: "16px",
                padding: "24px",
                boxShadow: `0 8px 32px ${warmColors.primary}12`,
              }}
            >
              <AssignCommunityToTemple id={id} onClose={handleClose} />
            </div>
          }
          closeOnMaskClick
          style={{
            "--border-radius": "16px",
            "--max-width": "90%",
          }}
        />

        <CommunityList refreshTrigger={refreshTrigger} />
      </div>
    </div>
  );
};

export default CommunityManager;
