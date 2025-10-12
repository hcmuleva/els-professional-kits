"use client"

import React from "react"
import { Card, Avatar, Typography } from "antd"
import {
  QrcodeOutlined,
  PhoneOutlined,
  UserOutlined,
  BankOutlined,
  ShopOutlined,
} from "@ant-design/icons"
import ShareIcon from "./ShareIcon"

const { Text, Title } = Typography

const UserCard = ({ user, showShareIcon = false, onShare }) => {
  // Red maroon theme colors
  const theme = {
    primary: "#8B0000", // Dark red
    secondary: "#A52A2A", // Brown red
    accent: "#DC143C", // Crimson
    background: "#FFF5F5", // Light red background
    cardBg: "#FFFFFF",
    textPrimary: "#2C2C2C",
    textSecondary: "#666666",
    border: "#E8E8E8",
  }

  const styles = {
    card: {
      background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`,
      borderRadius: "20px",
      border: "none",
      boxShadow: "0 8px 24px rgba(139, 0, 0, 0.3)",
      overflow: "hidden",
      maxWidth: "350px",
      margin: "0 auto",
    },
    cardBody: {
      padding: "24px",
      textAlign: "center",
      background: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(10px)",
    },
    header: {
      background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`,
      padding: "20px",
      textAlign: "center",
      position: "relative",
    },
    avatar: {
      width: "100px",
      height: "100px",
      border: "4px solid rgba(255, 255, 255, 0.3)",
      boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
    },
    name: {
      color: "white",
      fontSize: "24px",
      fontWeight: "700",
      margin: "16px 0 8px 0",
      textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
    },
    id: {
      color: "rgba(255, 255, 255, 0.9)",
      fontSize: "14px",
      fontWeight: "500",
      background: "rgba(255, 255, 255, 0.2)",
      padding: "4px 12px",
      borderRadius: "12px",
      display: "inline-block",
    },
    infoSection: {
      marginTop: "20px",
    },
    infoItem: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "12px 16px",
      margin: "8px 0",
      background: theme.background,
      borderRadius: "12px",
      border: `1px solid ${theme.border}`,
    },
    infoLabel: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      color: theme.textSecondary,
      fontSize: "14px",
      fontWeight: "500",
    },
    infoValue: {
      color: theme.textPrimary,
      fontSize: "14px",
      fontWeight: "600",
    },
    qrSection: {
      marginTop: "20px",
      padding: "16px",
      background: theme.background,
      borderRadius: "12px",
      border: `1px solid ${theme.border}`,
    },
    qrPlaceholder: {
      width: "120px",
      height: "120px",
      background: "white",
      border: `2px solid ${theme.primary}`,
      borderRadius: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto",
    },
    shareButton: {
      position: "absolute",
      top: "16px",
      right: "16px",
      background: "rgba(255, 255, 255, 0.2)",
      border: "none",
      borderRadius: "50%",
      width: "40px",
      height: "40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  }

  const shareData = {
    title: `${user?.name}'s Profile`,
    description: `Connect with ${user?.name} - ${
      user?.profession || "Professional"
    }`,
    url: `${window.location.origin}/usercard-qr/${user?.id}`,
  }

  return (
    <Card style={styles.card} bodyStyle={{ padding: 0 }}>
      {/* Header with gradient background */}
      <div style={styles.header}>
        {showShareIcon && (
          <div style={styles.shareButton}>
            <ShareIcon
              title={shareData.title}
              description={shareData.description}
              url={shareData.url}
              onShare={onShare}
            />
          </div>
        )}

        <Avatar
          src={user?.profilePicture?.url}
          style={styles.avatar}
          icon={<UserOutlined />}
        />
        <Title level={3} style={styles.name}>
          {user.name}
        </Title>
        <div style={styles.id}>ID: {user.id}</div>
      </div>

      {/* Card Body */}
      <div style={styles.cardBody}>
        <div style={styles.infoSection}>
          {/* Phone */}
          <div style={styles.infoItem}>
            <div style={styles.infoLabel}>
              <PhoneOutlined style={{ color: theme.primary }} />
              <span>Phone</span>
            </div>
            <Text style={styles.infoValue}>
              {user.phone || "Not provided"}
            </Text>
          </div>

          {/* Gotra */}
          {user.gotra && (
            <div style={styles.infoItem}>
              <div style={styles.infoLabel}>
                <UserOutlined style={{ color: theme.primary }} />
                <span>Gotra</span>
              </div>
              <Text style={styles.infoValue}>{user.gotra}</Text>
            </div>
          )}

          {/* Profession */}
          {user.profession && (
            <div style={styles.infoItem}>
              <div style={styles.infoLabel}>
                <BankOutlined style={{ color: theme.primary }} />
                <span>Profession</span>
              </div>
              <Text style={styles.infoValue}>{user.profession}</Text>
            </div>
          )}

          {/* Business */}
          {user.business && (
            <div style={styles.infoItem}>
              <div style={styles.infoLabel}>
                <ShopOutlined style={{ color: theme.primary }} />
                <span>Business</span>
              </div>
              <Text style={styles.infoValue}>{user.business}</Text>
            </div>
          )}

          {/* Agriculture */}
          {user.agriculture && (
            <div style={styles.infoItem}>
              <div style={styles.infoLabel}>
                <span>🌾</span>
                <span>Agriculture</span>
              </div>
              <Text style={styles.infoValue}>{user.agriculture}</Text>
            </div>
          )}
        </div>

        {/* QR Code Section */}
        <div style={styles.qrSection}>
          <Text
            style={{
              color: theme.textSecondary,
              fontSize: "12px",
              marginBottom: "12px",
              display: "block",
            }}
          >
            Scan QR Code to Connect
          </Text>
          <div style={styles.qrPlaceholder}>
            <QrcodeOutlined style={{ fontSize: "48px", color: theme.primary }} />
          </div>
        </div>
      </div>
    </Card>
  )
}

export default UserCard
