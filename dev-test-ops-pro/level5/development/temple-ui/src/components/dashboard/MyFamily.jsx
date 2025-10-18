import React, { useState, useEffect } from "react";
import {
  Card,
  SearchBar,
  Button,
  Tag,
  Space,
  Loading,
  ErrorBlock,
  Empty,
  Badge,
  NavBar,
} from "antd-mobile";
import {
  SearchOutline,
  UserOutline,
  TeamOutline,
  MailOutline,
  CalendarOutline,
  HeartOutline,
  AddSquareOutline,
} from "antd-mobile-icons";
import {
  BankOutlined,
  PhoneOutlined,
  RotateLeftOutlined,
  IdcardOutlined,
  DeleteOutlined,
  EditOutlined,
  LockOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { fetchFamilies, updateFamily } from "../../services/families";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import AddFamilyMukhiyaDialog from "./AddFamilyMukhiyaDialog";
import { fetchUserAddresses } from "../../services/address";
import { message, Modal } from "antd";
import { deleteSingleUser } from "../../services/user";

export default function MyFamily() {
  const { familyadminId, templeadminId } = useParams();
  const [familyData, setFamilyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const templeId = templeadminId
    ? templeadminId
    : user?.temples?.length
    ? user.temples[0].id
    : null;
  const navigate = useNavigate();
  const [showMukhiyaDialog, setShowMukhiyaDialog] = useState(false);
  const familyId = familyadminId
    ? familyadminId
    : localStorage.getItem("familyId");

  // Updated warm orange color palette matching address component
  const styles = {
    container: {
      minHeight: "100vh",
      backgroundColor: "#fef6f0",
      position: "relative",
    },
    headerCard: {
      backgroundColor: "#f97316",
      borderRadius: "0px",
      padding: "20px 16px",
      marginBottom: "0px",
      boxShadow: "0 4px 16px rgba(249, 115, 22, 0.3)",
      position: "relative",
    },
    headerTitle: {
      fontSize: "20px",
      fontWeight: "700",
      color: "#ffffff",
      marginBottom: "8px",
      textAlign: "center",
    },
    headerSubtitle: {
      fontSize: "14px",
      color: "#fff7ed",
      fontWeight: "500",
      textAlign: "center",
    },
    searchCard: {
      backgroundColor: "#ffffff",
      borderRadius: "8px",
      padding: "16px",
      marginBottom: "16px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      border: "1px solid #e5e7eb",
      margin: "16px",
    },
    controlsCard: {
      backgroundColor: "#ffffff",
      borderRadius: "8px",
      padding: "20px",
      marginBottom: "16px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      border: "1px solid #e5e7eb",
      margin: "0 16px 16px 16px",
    },
    mukhiyaSection: {
      backgroundColor: "#f5e7db",
      padding: "16px",
      borderRadius: "8px",
      marginBottom: "16px",
      border: "1px solid #fed7aa",
    },
    mukhiyaInfo: {
      textAlign: "center",
      backgroundColor: "#ffffff",
      padding: "16px",
      borderRadius: "8px",
      border: "1px solid #e5e7eb",
      marginBottom: "16px",
    },
    mukhiyaName: {
      fontWeight: "600",
      fontSize: "16px",
      color: "#7c2d12",
      marginBottom: "4px",
    },
    mukhiyaTitle: {
      fontSize: "14px",
      color: "#f97316",
      fontWeight: "500",
      marginBottom: "8px",
    },
    primaryButton: {
      backgroundColor: "#f97316",
      border: "none",
      borderRadius: "8px",
      color: "#ffffff",
      fontSize: "14px",
      fontWeight: "600",
      height: "48px",
      width: "100%",
      cursor: "pointer",
      transition: "all 0.2s",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      marginBottom: "12px",
    },
    secondaryButton: {
      backgroundColor: "#ea580c",
      border: "none",
      borderRadius: "8px",
      color: "#ffffff",
      fontSize: "14px",
      fontWeight: "600",
      height: "48px",
      width: "100%",
      cursor: "pointer",
      transition: "all 0.2s",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
    },
    memberCard: {
      backgroundColor: "#ffffff",
      borderRadius: "8px",
      padding: "20px",
      marginBottom: "16px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      border: "1px solid #e5e7eb",
      margin: "0 16px 16px 16px",
    },
    memberHeader: {
      display: "flex",
      alignItems: "center",
      marginBottom: "16px",
    },
    memberAvatar: {
      fontSize: "32px",
      marginRight: "16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "64px",
      height: "64px",
      borderRadius: "12px",
      backgroundColor: "#f5e7db",
      border: "2px solid #fed7aa",
      overflow: "hidden",
    },
    memberInfo: {
      flex: 1,
    },
    memberName: {
      fontSize: "18px",
      fontWeight: "600",
      color: "#111827",
      marginBottom: "4px",
    },
    memberId: {
      fontSize: "12px",
      color: "#6b7280",
      fontWeight: "500",
    },
    memberDetails: {
      backgroundColor: "#f8fafc",
      borderRadius: "8px",
      padding: "16px",
      border: "1px solid #e2e8f0",
    },
    detailRow: {
      display: "flex",
      alignItems: "center",
      marginBottom: "12px",
    },
    detailIcon: {
      color: "#f97316",
      marginRight: "12px",
      fontSize: "16px",
      minWidth: "20px",
    },
    detailText: {
      color: "#374151",
      fontSize: "14px",
      fontWeight: "500",
    },
    actionButtons: {
      display: "flex",
      gap: "8px",
      marginTop: "16px",
      flexWrap: "wrap",
    },
    actionButton: {
      padding: "8px 12px",
      borderRadius: "6px",
      fontSize: "12px",
      fontWeight: "500",
      border: "none",
      cursor: "pointer",
      transition: "all 0.2s",
      display: "flex",
      alignItems: "center",
      gap: "4px",
    },
    editButton: {
      backgroundColor: "#3b82f6",
      color: "#ffffff",
    },
    passwordButton: {
      backgroundColor: "#f59e0b",
      color: "#ffffff",
    },
    addressButton: {
      backgroundColor: "#f97316",
      color: "#ffffff",
    },
    deleteButton: {
      backgroundColor: "#dc2626",
      color: "#ffffff",
    },
    emptyState: {
      textAlign: "center",
      padding: "40px 20px",
      backgroundColor: "#ffffff",
      borderRadius: "8px",
      border: "2px dashed #fed7aa",
      color: "#9a3412",
      margin: "16px",
    },
    emptyStateIcon: {
      fontSize: "48px",
      marginBottom: "16px",
    },
    emptyStateText: {
      fontSize: "16px",
      fontWeight: "500",
      marginBottom: "8px",
    },
    emptyStateSubtext: {
      fontSize: "14px",
      color: "#6b7280",
    },
    loadingContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "60vh",
      backgroundColor: "#fef6f0",
    },
    loadingText: {
      marginTop: "16px",
      color: "#7c2d12",
      fontSize: "16px",
      fontWeight: "600",
    },
    errorCard: {
      backgroundColor: "#ffffff",
      borderRadius: "8px",
      padding: "20px",
      margin: "16px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      border: "1px solid #e5e7eb",
    },
    addressSection: {
      marginBottom: "12px",
    },
    addressTitle: {
      color: "#111827",
      fontSize: "14px",
      fontWeight: "600",
      marginBottom: "8px",
    },
    addressItem: {
      display: "flex",
      alignItems: "flex-start",
      marginBottom: "8px",
    },
    addressType: {
      fontSize: "12px",
      fontWeight: "600",
      color: "#f97316",
      marginRight: "8px",
      minWidth: "80px",
    },
    addressText: {
      color: "#374151",
      fontSize: "13px",
      fontWeight: "500",
      flex: 1,
    },
  };

  const handleAddMukhiya = async (userId, familyId) => {
    try {
      await updateFamily(familyId, { mukhiya: userId, temple: templeId });
      await loadFamily();
      setShowMukhiyaDialog(false);
    } catch (error) {
      setError("Failed to add mukhiya. Please try again.");
    }
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Smooth scrolling
    });
  }, []);

  const getFilteredMembers = () => {
    if (!familyData?.data?.attributes?.members?.data) return [];
    const members = familyData.data.attributes.members.data;
    if (!searchTerm) return members;

    return members.filter((member) => {
      const fullName =
        `${member.attributes.first_name} ${member.attributes.last_name}`.toLowerCase();
      const email = member.attributes.email?.toLowerCase() || "";
      const mobile = member.attributes.mobile || "";
      const profession =
        member.attributes.profession?.toLowerCase() ||
        member.attributes.occupation?.toLowerCase() ||
        "";
      const gotra = member.attributes.gotra?.toLowerCase() || "";
      return (
        fullName.includes(searchTerm.toLowerCase()) ||
        email.includes(searchTerm.toLowerCase()) ||
        mobile.includes(searchTerm) ||
        profession.includes(searchTerm.toLowerCase()) ||
        gotra.includes(searchTerm.toLowerCase())
      );
    });
  };

  const loadFamily = async () => {
    try {
      setLoading(true);
      setError(null);
      if (!familyId) {
        setError("No family ID found in storage");
        return;
      }
      const data = await fetchFamilies(familyId);
      // Fetch addresses for each member
      const membersWithAddresses = await Promise.all(
        data.data.attributes.members.data.map(async (member) => {
          const addresses = await fetchUserAddresses(member.id);
          return { ...member, addresses: addresses?.addresses || [] };
        })
      );
      setFamilyData({
        ...data,
        data: {
          ...data.data,
          attributes: {
            ...data.data.attributes,
            members: { data: membersWithAddresses },
          },
        },
      });
    } catch (err) {
      setError(err.message || "Failed to load family data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFamily();
  }, []);

  const handleDelete = async (userId) => {
    Modal.confirm({
      title: "Confirm Delete",
      content: "Are you sure you want to delete this member?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          await deleteSingleUser(userId);
          message.success("Member deleted successfully");
          await loadFamily();
        } catch (error) {
          message.error("Failed to delete member");
        }
      },
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getGenderIcon = (gender) => {
    return gender === "Male" ? "👨" : gender === "Female" ? "👩" : "👤";
  };

  const formatAddress = (address) => {
    const parts = [
      address.landmark,
      address.tehsil,
      address.district,
      address.state,
      address.country,
      address.pincode,
    ].filter(Boolean);
    return parts.join(", ");
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <Loading size="large" color="#f97316" />
          <div style={styles.loadingText}>Loading Family Details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorCard}>
          <ErrorBlock
            status="default"
            title="Error Loading Family"
            description={error}
          />
          <button style={styles.primaryButton} onClick={loadFamily}>
            <RotateLeftOutlined /> Try Again
          </button>
        </div>
      </div>
    );
  }

  const filteredMembers = getFilteredMembers();
  const familyInfo = familyData?.data?.attributes;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.headerCard}>
        <button
          style={{
            position: "absolute",
            left: "16px",
            top: "50%",
            transform: "translateY(-50%)",
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            borderRadius: "8px",
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: "600",
            padding: "8px 12px",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
        <div
          style={{
            textAlign: "center",
            paddingLeft: "60px",
            paddingRight: "60px",
          }}
        >
          <h1 style={styles.headerTitle}>
            👨‍👩‍👧‍👦 {familyInfo?.family_name || "Family"}
          </h1>
          <p style={styles.headerSubtitle}>
            {familyInfo?.members?.data?.length || 0} Members • Family Management
          </p>
        </div>
      </div>

      {/* Search */}
      <div style={styles.searchCard}>
        <SearchBar
          placeholder="Search by name, email, mobile, profession, or gotra..."
          value={searchTerm}
          onChange={setSearchTerm}
          style={{
            "--border-radius": "8px",
            "--background": "#f8fafc",
            "--border": "1px solid #e2e8f0",
          }}
        />
      </div>

      {/* Controls */}
      <div style={styles.controlsCard}>
        <div style={styles.mukhiyaSection}>
          <h3
            style={{
              fontSize: "16px",
              fontWeight: "600",
              color: "#9a3412",
              marginBottom: "12px",
            }}
          >
            👑 Family Head (मुखिया)
          </h3>
          {familyInfo?.mukhiya?.data ? (
            <div style={styles.mukhiyaInfo}>
              <div style={styles.mukhiyaName}>
                {familyInfo?.mukhiya?.data?.attributes?.first_name}{" "}
                {familyInfo?.mukhiya?.data?.attributes?.last_name}
              </div>
              <div style={styles.mukhiyaTitle}>Family Head (मुखिया)</div>
              {familyInfo?.mukhiya?.data?.attributes?.mobile && (
                <div style={{ fontSize: "12px", color: "#6b7280" }}>
                  📱 {familyInfo.mukhiya.data.attributes.mobile}
                </div>
              )}
            </div>
          ) : (
            <button
              style={styles.primaryButton}
              onClick={() => setShowMukhiyaDialog(true)}
            >
              <UserOutline />
              <div>
                <div>परिवार के मुखिया का चयन करें</div>
                <div style={{ fontSize: "12px", opacity: 0.9 }}>
                  Select Family Head
                </div>
              </div>
            </button>
          )}
        </div>
        {familyInfo?.mukhiya?.data && (
          <button
            style={styles.secondaryButton}
            onClick={() =>
              navigate(
                `/familyregister/${familyData?.data?.id}/temple/${templeId}`
              )
            }
          >
            <AddSquareOutline />
            <div>
              <div>परिवार के सदस्य जोड़ें</div>
              <div style={{ fontSize: "12px", opacity: 0.9 }}>
                Add Family Members
              </div>
            </div>
          </button>
        )}
      </div>

      {/* Members List */}
      {filteredMembers.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyStateIcon}>👥</div>
          <div style={styles.emptyStateText}>
            {searchTerm
              ? `No members found for "${searchTerm}"`
              : "No family members found"}
          </div>
          <div style={styles.emptyStateSubtext}>
            {!searchTerm && "Start by adding family members"}
          </div>
        </div>
      ) : (
        <div>
          {filteredMembers?.map((member) => (
            <div key={member.id} style={styles.memberCard}>
              <div style={styles.memberHeader}>
                <div style={styles.memberAvatar}>
                  {member?.attributes?.profilePicture?.data?.attributes?.url ? (
                    <img
                      src={member.attributes.profilePicture.data.attributes.url}
                      alt="Profile"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "10px",
                      }}
                    />
                  ) : (
                    getGenderIcon(member.attributes.gender)
                  )}
                </div>
                <div style={styles.memberInfo}>
                  <div style={styles.memberName}>
                    {member.attributes.first_name} {member.attributes.last_name}
                  </div>
                  <div style={styles.memberId}>ID: {member.id}</div>
                </div>
              </div>

              <div style={styles.memberDetails}>
                {member.attributes.gotra && (
                  <div style={styles.detailRow}>
                    <UserOutline style={styles.detailIcon} />
                    <span style={styles.detailText}>
                      गोत्र / Gotra: {member.attributes.gotra}
                    </span>
                  </div>
                )}

                <div style={styles.detailRow}>
                  <IdcardOutlined style={styles.detailIcon} />
                  <span style={styles.detailText}>
                    लिंग / Gender: {member.attributes.gender}
                  </span>
                </div>

                {member.attributes.email && (
                  <div style={styles.detailRow}>
                    <MailOutline style={styles.detailIcon} />
                    <span style={styles.detailText}>
                      ईमेल / Email: {member.attributes.email}
                    </span>
                  </div>
                )}

                {member.attributes.mobile && (
                  <div style={styles.detailRow}>
                    <PhoneOutlined style={styles.detailIcon} />
                    <span style={styles.detailText}>
                      मोबाइल / Mobile: {member.attributes.mobile}
                    </span>
                  </div>
                )}

                {member.attributes.dob && (
                  <div style={styles.detailRow}>
                    <CalendarOutline style={styles.detailIcon} />
                    <span style={styles.detailText}>
                      जन्म तिथि / DOB: {formatDate(member.attributes.dob)} • आयु
                      / Age: {member.attributes.age}
                    </span>
                  </div>
                )}

                {(member.attributes.profession ||
                  member.attributes.occupation) && (
                  <div style={styles.detailRow}>
                    <BankOutlined style={styles.detailIcon} />
                    <span style={styles.detailText}>
                      व्यवसाय / Occupation:{" "}
                      {member.attributes.profession ||
                        member.attributes.occupation}
                    </span>
                  </div>
                )}

                {member.attributes.marital_status && (
                  <div style={styles.detailRow}>
                    <HeartOutline style={styles.detailIcon} />
                    <span style={styles.detailText}>
                      वैवाहिक स्थिति / Marital Status:{" "}
                      {member.attributes.marital_status}
                    </span>
                  </div>
                )}

                {member.attributes.father && (
                  <div style={styles.detailRow}>
                    <UserOutline style={styles.detailIcon} />
                    <span style={styles.detailText}>
                      पिता / Father: {member.attributes.father}
                    </span>
                  </div>
                )}

                {member.attributes.husband && (
                  <div style={styles.detailRow}>
                    <UserOutline style={styles.detailIcon} />
                    <span style={styles.detailText}>
                      पति / Husband: {member.attributes.husband}
                    </span>
                  </div>
                )}

                {member.attributes.blood_group && (
                  <div style={styles.detailRow}>
                    <HeartOutline style={styles.detailIcon} />
                    <span style={styles.detailText}>
                      रक्त समूह / Blood Group: {member.attributes.blood_group}
                    </span>
                  </div>
                )}

                {member.attributes.education_name && (
                  <div style={styles.detailRow}>
                    <BankOutlined style={styles.detailIcon} />
                    <span style={styles.detailText}>
                      शिक्षा / Education: {member.attributes.education_name}
                    </span>
                  </div>
                )}

                {member.addresses?.length > 0 && (
                  <div style={styles.addressSection}>
                    <div style={styles.addressTitle}>पता / Addresses:</div>
                    {member.addresses.map((address) => (
                      <div key={address.id} style={styles.addressItem}>
                        <span style={styles.addressType}>
                          {address.addresstype}:
                        </span>
                        <span style={styles.addressText}>
                          {formatAddress(address)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div style={styles.actionButtons}>
                  <button
                    style={{ ...styles.actionButton, ...styles.editButton }}
                    onClick={() =>
                      navigate(
                        `/familyregister/${familyData?.data?.id}/temple/${templeId}/edit/${member.id}`
                      )
                    }
                  >
                    <EditOutlined /> संपादित
                  </button>

                  <button
                    style={{ ...styles.actionButton, ...styles.passwordButton }}
                    onClick={() =>
                      navigate(
                        `/adminreset/templeadminId/${templeId}/familyid/${familyId}/userid/${member.id}`
                      )
                    }
                  >
                    <LockOutlined /> पासवर्ड
                  </button>

                  <button
                    style={{ ...styles.actionButton, ...styles.addressButton }}
                    onClick={() => navigate(`/address/edit/${member.id}`)}
                  >
                    <EnvironmentOutlined /> पता
                  </button>

                  <button
                    style={{ ...styles.actionButton, ...styles.deleteButton }}
                    onClick={() => handleDelete(member.id)}
                  >
                    <DeleteOutlined /> हटाएँ
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showMukhiyaDialog && (
        <AddFamilyMukhiyaDialog
          visible={showMukhiyaDialog}
          onClose={() => setShowMukhiyaDialog(false)}
          familyId={familyData?.data?.id}
          templeId={templeId}
          onAddMukhiya={handleAddMukhiya}
        />
      )}
    </div>
  );
}
