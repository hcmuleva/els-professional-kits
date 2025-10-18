"use client"

import { Avatar, Button, Card, Popup, Space, Toast } from "antd-mobile"
import { CameraOutline, SetOutline } from "antd-mobile-icons"
import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import BasicInfoSection from "./BasicInfoSection"
import ProfilePhotoUpload from "../../common/ProfilePhotoUpload"
import EducationInfo from "./education/EducationInfo"
import ProfesstionInfo from "./profession/ProfesstionInfo"
import MyFamily from "../../dashboard/MyFamily"
import { AuthContext, useAuth } from "../../../contexts/AuthContext"
import { updateUserProfile } from "../../../services/user"
import AgricultureInfo from "./AgricultureInfo"
import BusinessCardList from "./business/BusinessCardList"
import ResetPasswordTab from "./ResetPasswordTab"
import SettingsView from "./SettingsView"
import ShareIcon from "../../share/ShareIcon"

const ProfileCard = () => {
  const [fileId, setFileId] = useState(null)
  // useAuth() directly and grab forceRefreshUser for post-save refresh
  const { jwt, user, logout, profileUpdated, setProfileUpdated, forceRefreshUser } = useAuth()

  // removed redundant authcontext usage - kept import to avoid changing your imports
  const authcontext = useContext(AuthContext)
  const navigate = useNavigate()

  // local avatar for immediate preview; seed from user
  const [avatar, setAvatar] = useState(user?.profilePicture?.url || null)
  // store previous avatar to rollback if server save fails
  const [prevAvatar, setPrevAvatar] = useState(user?.profilePicture?.url || null)

  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("basicInfo")
  const [showUpload, setShowUpload] = useState(false)
  const [logoutVisible, setLogoutVisible] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const [basicInfo, setBasicInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    dob: "",
  })

  // Professional warm color palette
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
  }

  // Professional styles
  const styles = {
    container: {
      background: warmColors.background,
      minHeight: "100vh",
      padding: "16px",
    },

    // Main profile card styles
    profileCardWrapper: {
      marginBottom: "20px",
    },
    profileCard: {
      background: warmColors.cardBg,
      borderRadius: "16px",
      border: `1px solid ${warmColors.border}`,
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
      overflow: "hidden",
    },
    profileContent: {
      padding: "24px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      position: "relative",
    },

    // Avatar section
    avatarSection: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginBottom: "20px",
    },
    avatarContainer: {
      position: "relative",
      marginBottom: "16px",
    },
    avatar: {
      width: "100px",
      height: "100px",
      borderRadius: "50%",
      border: `3px solid ${warmColors.primary}20`,
      objectFit: "cover",
      boxShadow: "0 4px 16px rgba(139, 69, 19, 0.15)",
    },
    avatarPlaceholder: {
      width: "100px",
      height: "100px",
      borderRadius: "50%",
      background: `${warmColors.primary}10`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: `3px solid ${warmColors.primary}20`,
      boxShadow: "0 4px 16px rgba(139, 69, 19, 0.15)",
    },
    cameraIcon: {
      fontSize: "32px",
      color: warmColors.textSecondary,
    },

    // Name section
    nameSection: {
      textAlign: "center",
      marginBottom: "20px",
    },
    userName: {
      color: warmColors.textPrimary,
      fontSize: "24px",
      fontWeight: "600",
      margin: "0 0 8px 0",
      lineHeight: "1.2",
    },
    userRole: {
      color: warmColors.textSecondary,
      fontSize: "14px",
      fontWeight: "500",
      margin: 0,
      backgroundColor: `${warmColors.primary}08`,
      padding: "4px 12px",
      borderRadius: "12px",
      display: "inline-block",
    },
    fatherName: {
      color: warmColors.textSecondary,
      fontSize: "13px",
      fontWeight: "400",
      margin: "4px 0 0 0",
    },

    // Button section
    buttonSection: {
      display: "flex",
      gap: "12px",
      width: "100%",
      maxWidth: "300px",
    },
    changePhotoButton: {
      flex: 1,
      background: `${warmColors.primary}10`,
      color: warmColors.primary,
      border: `1px solid ${warmColors.primary}30`,
      borderRadius: "10px",
      padding: "10px 16px",
      fontSize: "14px",
      fontWeight: "500",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "6px",
      transition: "all 0.2s ease",
    },
    logoutButton: {
      flex: 1,
      background: `${warmColors.error}10`,
      color: warmColors.error,
      border: `1px solid ${warmColors.error}30`,
      borderRadius: "10px",
      padding: "10px 16px",
      fontSize: "14px",
      fontWeight: "500",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "6px",
      transition: "all 0.2s ease",
    },

    // Upload container
    uploadContainer: {
      marginTop: "16px",
      background: warmColors.background,
      borderRadius: "12px",
      padding: "16px",
      border: `1px solid ${warmColors.border}`,
      width: "100%",
      maxWidth: "300px",
    },

    // Tab section
    tabCardWrapper: {
      marginBottom: "16px",
      padding: "0",
      margin: "0",
    },
    tabCard: {
      background: warmColors.cardBg,
      borderRadius: "16px",
      border: `1px solid ${warmColors.border}`,
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
      overflow: "hidden",
    },
    selectorContainer: {
      background: warmColors.cardBg,
      padding: "16px",
      display: "flex",
      justifyContent: "space-around",
      flexWrap: "wrap",
      gap: "8px",
      borderBottom: `1px solid ${warmColors.border}`,
    },
    selectorButton: {
      background: "transparent",
      color: warmColors.textSecondary,
      border: "none",
      borderRadius: "8px",
      padding: "8px 12px",
      fontSize: "13px",
      fontWeight: "500",
      cursor: "pointer",
      flex: "1",
      textAlign: "center",
      minWidth: "80px",
      transition: "all 0.2s ease",
    },
    selectorButtonActive: {
      background: `${warmColors.primary}10`,
      color: warmColors.primary,
      fontWeight: "600",
    },
    tabContent: {
      // padding: "20px",
      background: warmColors.cardBg,
    },

    // Enhanced Popup styles
    logoutPopup: {
      padding: "32px 24px",
      textAlign: "center",
      background: warmColors.cardBg,
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },
    popupTitle: {
      fontSize: "24px",
      fontWeight: "700",
      color: warmColors.textPrimary,
      marginBottom: "16px",
    },
    popupText: {
      fontSize: "16px",
      color: warmColors.textSecondary,
      marginBottom: "32px",
      lineHeight: "1.5",
    },
    logoutConfirmButton: {
      background: `linear-gradient(135deg, ${warmColors.error} 0%, #B71C1C 100%)`,
      color: "#ffffff",
      borderRadius: "12px",
      height: "52px",
      fontSize: "16px",
      fontWeight: "600",
      border: "none",
      marginBottom: "16px",
      transition: "all 0.3s ease",
      boxShadow: "0 4px 16px rgba(211, 47, 47, 0.3)",
    },
    cancelButton: {
      background: warmColors.cardBg,
      color: warmColors.textPrimary,
      border: `2px solid ${warmColors.border}`,
      borderRadius: "12px",
      height: "52px",
      fontSize: "16px",
      fontWeight: "500",
      transition: "all 0.3s ease",
    },
  }

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setAvatar(event.target?.result)
        Toast.show({
          content: "Photo uploaded successfully",
          position: "center",
          icon: "success",
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const updateBasicInfo = (info) => {
    setBasicInfo(info)
    Toast.show({
      content: "Basic info updated",
      position: "center",
      icon: "success",
    })
  }

  const handlePhotoClick = () => {
    setShowUpload(!showUpload)
  }

  // optimistic: set local preview + fileId, stash prev avatar for rollback
  const handleUploadSuccess = (newFileId, avatarUrl) => {
    setPrevAvatar(user?.profilePicture?.url || avatar) // stash server/current avatar
    setFileId(newFileId) // triggers useEffect to persist to server
    setAvatar(avatarUrl) // immediate preview
    setShowUpload(false)
    setProfileUpdated(true)
  }

  // Enhanced logout functionality
  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
      Toast.show({
        icon: "success",
        content: "Logged out successfully",
        position: "center",
        duration: 2000,
      })

      // Close the popup
      setLogoutVisible(false)
    } catch (error) {
      console.error("Logout failed:", error)
      Toast.show({
        icon: "fail",
        content: "Logout failed. Please try again.",
        position: "center",
        duration: 3000,
      })
    } finally {
      setIsLoggingOut(false)
    }
  }

  useEffect(() => {
    let cancelled = false

    const updateProfilePicture = async () => {
      if (!fileId) return

      try {
        setLoading(true)
        await updateUserProfile(user.id, { profilePicture: fileId })

        if (cancelled) return

        Toast.show({
          icon: "success",
          content: "Profile picture updated!",
          position: "center",
        })

        // after server save succeeds, fetch fresh user so UI reflects server truth
        if (typeof forceRefreshUser === "function") {
          try {
            await forceRefreshUser()
            // sync local avatar with server truth if available
            const freshUrl = (JSON.parse(localStorage.getItem("user")) || {}).profilePicture?.url
            if (freshUrl) setAvatar(freshUrl)
          } catch (e) {
            // non-fatal: we already showed optimistic preview
            console.warn("forceRefreshUser after upload failed", e)
          }
        }
      } catch (error) {
        console.error("Failed to update profile:", error)
        Toast.show({
          icon: "fail",
          content: "Failed to update profile picture",
          position: "center",
        })
        // rollback to previous avatar
        setAvatar(prevAvatar)
      } finally {
        if (!cancelled) setLoading(false)
        // clear fileId to avoid re-run; keep profileUpdated true as UI already changed
        setFileId(null)
      }
    }

    updateProfilePicture()

    return () => {
      cancelled = true
    }
    // intentionally include forceRefreshUser so it is available when running
  }, [fileId, user?.id, jwt, forceRefreshUser, prevAvatar])

  const tabs = [
    {
      key: "basicInfo",
      label: "👤 मुख्य जानकारी",
      component: <BasicInfoSection basicInfo={basicInfo} onUpdate={updateBasicInfo} />,
    },
    {
      key: "business",
      label: "🏢 व्यवसाय",
      component: <BusinessCardList />,
    },
    { key: "family", label: "👨‍👩‍👧‍👦 परिवार", component: <MyFamily /> },
    { key: "education", label: "🎓 शिक्षा", component: <EducationInfo /> },
    {
      key: "profession",
      label: "💼 कार्य",
      component: <ProfesstionInfo />,
    },
    {
      key: "agriculture",
      label: "🌾 खेती",
      component: <AgricultureInfo />,
    },
    {
      key: "resetPassword",
      label: "🔐 Reset Password",
      component: <ResetPasswordTab userId={user?.id} />,
    },
    {
      key: "settings",
      label: "⚙️ Settings",
      component: <SettingsView />,
    },
  ]

  const shareData = {
    title: `${[user?.first_name, user?.last_name].filter(Boolean).join(" ") || "User"}'s Profile`,
    description: `Connect with ${[user?.first_name, user?.last_name].filter(Boolean).join(" ") || "this user"} - ${user?.userrole || "USER"}`,
    url: `${window.location.origin}/share/user/${user?.id}`,
  }

  const handleShare = (platform) => {
    console.log(`Profile shared via ${platform}`)
    Toast.show({
      content: "Profile shared successfully!",
      position: "center",
      icon: "success",
    })
  }

  return (
    <div style={styles.container}>
      {/* Main Profile Card */}
      <div style={styles.profileCardWrapper}>
        <Card style={styles.profileCard}>
          <div style={styles.profileContent}>
            {/* Avatar Section */}
            <div style={styles.avatarSection}>
              <div style={styles.avatarContainer}>
                {avatar || user?.profilePicture?.url ? (
                  <Avatar src={avatar || user.profilePicture?.url} style={styles.avatar} />
                ) : (
                  <div style={styles.avatarPlaceholder}>
                    <CameraOutline style={styles.cameraIcon} />
                  </div>
                )}
              </div>

              {/* Name Section */}
              <div style={styles.nameSection}>
                <h2 style={styles.userName}>
                  {[user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
                    basicInfo.name ||
                    "Welcome, User"}{" "}
                </h2>
                {user?.father && <p style={styles.fatherName}>S/o {user.father}</p>}
                <p style={styles.userRole}>
                  {user?.userrole || "USER"} - ID: {user?.id}
                </p>
                <div style={{ marginTop: "12px" }}>
                  <ShareIcon
                    title={shareData.title}
                    description={shareData.description}
                    url={shareData.url}
                    onShare={handleShare}
                  />
                </div>
              </div>
            </div>

            {/* Button Section */}
            <div style={styles.buttonSection}>
              <Button onClick={handlePhotoClick} loading={loading} style={styles.changePhotoButton}>
                <CameraOutline fontSize={16} />
                {avatar ? "अपना फोटो" : "Upload Photo"}
              </Button>

              <Button onClick={() => setLogoutVisible(true)} loading={isLoggingOut} style={styles.logoutButton}>
                <SetOutline fontSize={16} />
                {isLoggingOut ? "Logging out..." : "लॉगआउट"}
              </Button>
            </div>

            {/* Upload Container */}
            {showUpload && (
              <div style={styles.uploadContainer}>
                <ProfilePhotoUpload setFileId={setFileId} setAvatar={setAvatar} onSuccess={handleUploadSuccess} />
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Enhanced Logout Popup */}
      <Popup
        visible={logoutVisible}
        onMaskClick={() => setLogoutVisible(false)}
        position="right"
        bodyStyle={{ width: "90vw" }}
      >
        <div style={styles.logoutPopup}>
          <h3 style={styles.popupTitle}>लॉगआउट</h3>
          <p style={styles.popupText}>क्या आप लॉगआउट होना चाहते हो.</p>
          <Space direction="vertical" block>
            <Button block onClick={handleLogout} loading={isLoggingOut} style={styles.logoutConfirmButton}>
              <SetOutline style={{ marginRight: "8px" }} />
              {isLoggingOut ? "Logging out..." : "Yes, Log Out"}
            </Button>
            <Button block onClick={() => setLogoutVisible(false)} style={styles.cancelButton} disabled={isLoggingOut}>
              Cancel
            </Button>
          </Space>
        </div>
      </Popup>

      {/* Tabs Card */}
      <div style={styles.tabCardWrapper}>
        <Card style={styles.tabCard}>
          <div style={styles.selectorContainer}>
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  ...styles.selectorButton,
                  ...(activeTab === tab.key ? styles.selectorButtonActive : {}),
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div style={styles.tabContent}>{tabs.find((tab) => tab.key === activeTab)?.component}</div>
        </Card>
      </div>
    </div>
  )
}

export default ProfileCard
