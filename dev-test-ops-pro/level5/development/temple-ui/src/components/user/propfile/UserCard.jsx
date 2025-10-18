"use client"

import React from "react"
import { Card, Avatar, Typography, Button } from "antd"
import {
  QrcodeOutlined,
  PhoneOutlined,
  UserOutlined,
  BankOutlined,
  CalendarOutlined,
  HomeOutlined,
  HeartOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons"
import { useNavigate } from "react-router-dom"
import ShareIcon from "../../share/ShareIcon"
import { useAuth } from "../../../contexts/AuthContext"

const { Text, Title } = Typography

const UserCard = ({ user, showShareIcon = false, showBackButton = false, onShare }) => {
  const navigate = useNavigate()
  const {isAuthenticated} = useAuth()

  const theme = {
    primary: "#8B0000", // Dark red - kept for accents only
    secondary: "#6B4423", // Brown for subtle accents
    accent: "#DC143C", // Crimson for highlights
    background: "#FFFFFF", // Pure white background
    cardBg: "#FFFFFF", // White card background
    lightGray: "#F8F9FA", // Light gray for sections
    textPrimary: "#2C2C2C",
    textSecondary: "#666666",
    border: "#E8E8E8",
  }

  const styles = {
    card: {
      background: theme.cardBg,
      borderRadius: "16px",
      border: `1px solid ${theme.border}`,
      boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
      overflow: "hidden",
      maxWidth: "380px",
      margin: "0 auto",
    },
    cardBody: {
      padding: "24px",
      textAlign: "center",
      background: theme.cardBg,
    },
    header: {
      background: `linear-gradient(135deg, ${theme.lightGray} 0%, #FFFFFF 100%)`,
      padding: "24px 20px 20px 20px",
      textAlign: "center",
      position: "relative",
      borderBottom: `1px solid ${theme.border}`,
    },
    avatar: {
      width: "90px",
      height: "90px",
      border: `3px solid ${theme.primary}`,
      boxShadow: "0 2px 8px rgba(139, 0, 0, 0.15)",
    },
    name: {
      color: theme.textPrimary,
      fontSize: "22px",
      fontWeight: "700",
      margin: "16px 0 8px 0",
    },
    id: {
      color: theme.textSecondary,
      fontSize: "13px",
      fontWeight: "500",
      background: theme.lightGray,
      padding: "4px 12px",
      borderRadius: "12px",
      display: "inline-block",
    },
    backButton: {
      position: "absolute",
      top: "16px",
      left: "16px",
      background: theme.lightGray,
      border: `1px solid ${theme.border}`,
      borderRadius: "8px",
      width: "40px",
      height: "40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    infoSection: {
      marginTop: "20px",
    },
    infoItem: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "14px 16px",
      margin: "8px 0",
      background: theme.background,
      borderRadius: "10px",
      border: `1px solid ${theme.border}`,
    },
    infoLabel: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
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
      marginTop: "24px",
      padding: "20px",
      background: theme.lightGray,
      borderRadius: "12px",
      border: `1px solid ${theme.border}`,
    },
    qrPlaceholder: {
      width: "100px",
      height: "100px",
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
      background: theme.lightGray,
      border: `1px solid ${theme.border}`,
      borderRadius: "8px",
      width: "40px",
      height: "40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  }

  const shareData = {
    title: `${user.name}'s Profile`,
    description: `Connect with ${user.name} - ${user.profession || "Professional"}`,
    url: `${window.location.origin}/usercard-qr/${user.id}`,
  }

  const handleBackClick = () => {
    if ( isAuthenticated ){
      navigate("/profile")
    } else {
      navigate("/register")
    }
  }

  return (
    <Card style={styles.card} bodyStyle={{ padding: 0 }}>
      {/* Header */}
      <div style={styles.header}>
        {showBackButton && (
          <Button
            style={styles.backButton}
            onClick={handleBackClick}
            icon={<ArrowLeftOutlined style={{ color: theme.textSecondary }} />}
          />
        )}

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

        <Avatar src={user.profilePicture?.url} style={styles.avatar} icon={<UserOutlined />} />
        <Title level={3} style={styles.name}>
          {user.name}
        </Title>
        <div style={styles.id}>ID: {user.id}</div>
      </div>

      {/* Body */}
      <div style={styles.cardBody}>
        <div style={styles.infoSection}>
          {/* Mobile */}
          <div style={styles.infoItem}>
            <div style={styles.infoLabel}>
              <PhoneOutlined style={{ color: theme.primary }} />
              <span>Mobile</span>
            </div>
            <Text style={styles.infoValue}>{user.mobile || "Not provided"}</Text>
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

          {/* Age */}
          {user.age && (
            <div style={styles.infoItem}>
              <div style={styles.infoLabel}>
                <CalendarOutlined style={{ color: theme.primary }} />
                <span>Age</span>
              </div>
              <Text style={styles.infoValue}>{user.age} years</Text>
            </div>
          )}

          {/* Temple */}
          {user.templeName && (
            <div style={styles.infoItem}>
              <div style={styles.infoLabel}>
                <HomeOutlined style={{ color: theme.primary }} />
                <span>Temple</span>
              </div>
              <Text style={styles.infoValue}>{user.templeName}</Text>
            </div>
          )}

          {/* Marital Status */}
          {user.maritalStatus && (
            <div style={styles.infoItem}>
              <div style={styles.infoLabel}>
                <HeartOutlined style={{ color: theme.primary }} />
                <span>Marital Status</span>
              </div>
              <Text style={styles.infoValue}>{user.maritalStatus}</Text>
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
        </div>

        {/* QR Section */}
        <div style={styles.qrSection}>
          <Text style={{ color: theme.textSecondary, fontSize: "12px", marginBottom: "12px", display: "block" }}>
            Scan QR Code to Connect
          </Text>
          <div style={styles.qrPlaceholder}>
            <QrcodeOutlined style={{ fontSize: "40px", color: theme.primary }} />
          </div>
        </div>
      </div>
    </Card>
  )
}

export default UserCard
