"use client"

import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Spin, Alert, Typography } from "antd"
import TestComponent from "./TestComponent"
import UserCard from "../user/propfile/UserCard"
import { getSingleUser } from "../../services/user"

const { Title } = Typography

const ShareableCard = () => {
  const { userid } = useParams()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchUserData = async (userId) => {
    try {
     
      const res = await getSingleUser(userId)
      const userData =  res.data || []

      return {
        id: userData.id?.toString() || userId,
        name:
          userData.first_name && userData.last_name
            ? `${userData.first_name} ${userData.last_name}`
            : userData.username || "Unknown User",
        mobile: userData.mobile || "",
        gotra: userData.gotra || "",
        age: userData.age || null,
        templeName: userData.temples && userData.temples.length > 0 ? userData.temples[0].title : "",
        maritalStatus: userData.marital_status || userData.marital || "",
        profession:
          userData.user_professions && userData.user_professions.length > 0
            ? `${userData.user_professions[0].role} (${userData.user_professions[0].profession_type})`
            : userData.occupation || "",
        profilePicture: userData.profilePicture,
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
      throw error
    }
  }

  useEffect(() => {
    const loadUserData = async () => {
      if (!userid) {
        setError("No user ID provided")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        try {
          const userData = await fetchUserData(userid)
          setUser(userData)
        } catch (apiError) {
          console.warn("API call failed, using mock data:", apiError)    
        }
      } catch (error) {
        setError("Failed to load user data")
        console.error("Error loading user data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [userid])

  const styles = {
    container: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #F8F9FA 0%, #FFFFFF 100%)",
      padding: "20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    content: {
      width: "100%",
      maxWidth: "420px",
    },
    header: {
      textAlign: "center",
      marginBottom: "24px",
    },
    title: {
      color: "#2C2C2C",
      fontSize: "28px",
      fontWeight: "700",
      marginBottom: "8px",
    },
    subtitle: {
      color: "#666666",
      fontSize: "16px",
      fontWeight: "400",
    },
    errorCard: {
      background: "#FFFFFF",
      borderRadius: "16px",
      padding: "24px",
      textAlign: "center",
      boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
      border: "1px solid #E8E8E8",
    },
    loadingCard: {
      background: "#FFFFFF",
      borderRadius: "16px",
      padding: "40px",
      textAlign: "center",
      boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
      border: "1px solid #E8E8E8",
    },
  }

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.content}>
          <div style={styles.loadingCard}>
            <Spin size="large" />
            <div style={{ marginTop: "16px", color: "#666" }}>Loading user profile...</div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div style={styles.container}>
        <div style={styles.content}>
          <div style={styles.errorCard}>
            <Alert message="Error" description={error || "User not found"} type="error" showIcon />
            <div style={{ marginTop: "16px" }}>
              <TestComponent />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.header}>
          <Title level={2} style={styles.title}>
            Profile Card
          </Title>
          <div style={styles.subtitle}>Connect with {user.name}</div>
        </div>

        <UserCard
          user={user}
          showShareIcon={true}
          showBackButton={true}
          onShare={() => console.log("Profile shared")}
        />
      </div>
    </div>
  )
}

export default ShareableCard
