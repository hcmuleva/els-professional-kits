import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Toast,
  Card,
  Space,
  Dialog,
  Loading,
} from "antd-mobile";
import { Select } from "antd";
import {
  fetchUserAddresses,
  deleteUserAddress,
  updateUserAddress,
  createUserAddress,
} from "../../../services/address";
import AddressModal from "../../common/AddressModal";

const addressTypeOptions = [
  { name: "CURRENT", name_hi: "वर्तमान पता" },
  { name: "PERMANENT", name_hi: "स्थायी पता" },
  { name: "HOME", name_hi: "मूल निवास" },
];

export default function AdminAddressReset() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [selectedAddressType, setSelectedAddressType] = useState("");
  const [userInfo, setUserInfo] = useState(null);

  // Warm color palette consistent with your existing component
  const styles = {
    container: {
      padding: "16px",
      backgroundColor: "#fef6f0",
      minHeight: "100vh",
    },
    headerCard: {
      backgroundColor: "#f97316",
      borderRadius: "8px",
      padding: "20px",
      marginBottom: "20px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      position: "relative",
    },
    backButton: {
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
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },
    backButtonHover: {
      backgroundColor: "rgba(255, 255, 255, 0.3)",
      transform: "translateY(-50%) scale(1.02)",
    },
    headerContent: {
      textAlign: "center",
      paddingLeft: "80px",
      paddingRight: "80px",
    },
    headerTitle: {
      fontSize: "20px",
      fontWeight: "700",
      color: "#ffffff",
      marginBottom: "8px",
    },
    headerSubtitle: {
      fontSize: "14px",
      color: "#fff7ed",
      fontWeight: "500",
    },
    addressSection: {
      marginBottom: "24px",
    },
    sectionHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "16px",
      padding: "12px 0",
      borderBottom: "2px solid #fed7aa",
    },
    sectionTitle: {
      fontSize: "18px",
      fontWeight: "600",
      color: "#7c2d12",
      margin: 0,
    },
    addSection: {
      backgroundColor: "#f5e7db",
      borderRadius: "8px",
      padding: "16px",
      marginBottom: "20px",
      border: "1px solid #fed7aa",
    },
    addSectionTitle: {
      fontSize: "16px",
      fontWeight: "600",
      color: "#9a3412",
      marginBottom: "12px",
    },
    addForm: {
      display: "flex",
      gap: "12px",
      alignItems: "flex-end",
      flexWrap: "wrap",
    },
    selectContainer: {
      flex: "1",
      minWidth: "200px",
    },
    selectLabel: {
      fontSize: "13px",
      fontWeight: "600",
      color: "#9a3412",
      marginBottom: "4px",
      display: "block",
    },
    addButton: {
      backgroundColor: "#f97316",
      border: "none",
      borderRadius: "6px",
      color: "#ffffff",
      fontSize: "14px",
      fontWeight: "600",
      height: "40px",
      padding: "0 20px",
      cursor: "pointer",
      transition: "background-color 0.2s",
    },
    addButtonHover: {
      backgroundColor: "#ea580c",
    },
    addressCard: {
      backgroundColor: "#ffffff",
      borderRadius: "8px",
      padding: "16px",
      marginBottom: "12px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      border: "1px solid #e5e7eb",
    },
    addressCardHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "12px",
    },
    addressType: {
      color: "#ffffff",
      padding: "6px 12px",
      borderRadius: "6px",
      fontSize: "12px",
      fontWeight: "600",
      textTransform: "uppercase",
    },
    addressActions: {
      display: "flex",
      gap: "8px",
    },
    actionButton: {
      padding: "8px 16px",
      borderRadius: "6px",
      fontSize: "12px",
      fontWeight: "500",
      border: "none",
      cursor: "pointer",
      transition: "background-color 0.2s",
    },
    editButton: {
      backgroundColor: "#3b82f6",
      color: "#ffffff",
    },
    editButtonHover: {
      backgroundColor: "#2563eb",
    },
    deleteButton: {
      backgroundColor: "#dc2626",
      color: "#ffffff",
    },
    deleteButtonHover: {
      backgroundColor: "#b91c1c",
    },
    addressContent: {
      fontSize: "14px",
      color: "#374151",
      lineHeight: "1.5",
      marginBottom: "8px",
    },
    addressCoords: {
      fontSize: "12px",
      color: "#6b7280",
      fontStyle: "italic",
    },
    emptyState: {
      textAlign: "center",
      padding: "40px 20px",
      backgroundColor: "#ffffff",
      borderRadius: "8px",
      border: "2px dashed #fed7aa",
      color: "#9a3412",
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
      justifyContent: "center",
      alignItems: "center",
      minHeight: "200px",
    },
    errorCard: {
      backgroundColor: "#fee2e2",
      border: "1px solid #fecaca",
      borderRadius: "8px",
      padding: "16px",
      textAlign: "center",
      color: "#dc2626",
    },
    statsCard: {
      backgroundColor: "#ffffff",
      borderRadius: "8px",
      padding: "16px",
      marginBottom: "20px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      border: "1px solid #e5e7eb",
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))",
      gap: "12px",
    },
    statItem: {
      textAlign: "center",
      padding: "8px",
      backgroundColor: "#f8fafc",
      borderRadius: "6px",
      border: "1px solid #e2e8f0",
    },
    statValue: {
      fontSize: "16px",
      fontWeight: "700",
      color: "#f97316",
      marginBottom: "2px",
    },
    statLabel: {
      fontSize: "10px",
      color: "#64748b",
      fontWeight: "500",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const getAddressTypeColor = (type) => {
    switch (type) {
      case "CURRENT":
        return "#059669";
      case "PERMANENT":
        return "#f59e0b";
      case "HOME":
        return "#f97316";
      default:
        return "#6b7280";
    }
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

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await fetchUserAddresses(userId);
      setAddresses(response?.addresses || []);

      // You might want to fetch user info as well
      // const userResponse = await fetchUserById(userId);
      // setUserInfo(userResponse);
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
      Toast.show({
        content: "Failed to load addresses",
        icon: "fail",
        position: "center",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = () => {
    if (!selectedAddressType) {
      Toast.show({
        content: "Please select an address type first",
        icon: "fail",
        position: "center",
      });
      return;
    }
    setEditingAddress(null);
    setShowAddressModal(true);
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setSelectedAddressType(address.addresstype);
    setShowAddressModal(true);
  };

  const handleDeleteAddress = async (addressId) => {
    Dialog.confirm({
      content:
        "Are you sure you want to delete this address? This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      onConfirm: async () => {
        try {
          await deleteUserAddress(addressId);
          Toast.show({
            content: "Address deleted successfully",
            icon: "success",
            position: "center",
          });
          fetchAddresses();
        } catch (error) {
          console.error("Failed to delete address:", error);
          Toast.show({
            content: "Failed to delete address",
            icon: "fail",
            position: "center",
          });
        }
      },
    });
  };

  const handleAddressSaved = () => {
    fetchAddresses();
    setShowAddressModal(false);
    setEditingAddress(null);
    setSelectedAddressType("");
  };

  const getAddressTypeStats = () => {
    const stats = {
      total: addresses.length,
      current: addresses.filter((addr) => addr.addresstype === "CURRENT")
        .length,
      permanent: addresses.filter((addr) => addr.addresstype === "PERMANENT")
        .length,
      home: addresses.filter((addr) => addr.addresstype === "HOME").length,
    };
    return stats;
  };

  useEffect(() => {
    if (userId) {
      fetchAddresses();
    }
  }, [userId]);

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <Loading />
        </div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div style={styles.container}>
        <div style={styles.errorCard}>
          <h3>Error: No User ID Provided</h3>
          <p>Please provide a valid user ID to manage addresses.</p>
        </div>
      </div>
    );
  }

  const stats = getAddressTypeStats();

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.headerCard}>
        <button
          style={styles.backButton}
          onClick={handleGoBack}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor =
              styles.backButtonHover.backgroundColor;
            e.currentTarget.style.transform = styles.backButtonHover.transform;
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor =
              styles.backButton.backgroundColor;
            e.currentTarget.style.transform = styles.backButton.transform;
          }}
        >
          ← Back
        </button>
        <div style={styles.headerContent}>
          <h1 style={styles.headerTitle}>🏠 Address Management</h1>
          <p style={styles.headerSubtitle}>
            Managing addresses for User ID: {userId}
          </p>
        </div>
      </div>

      {/* Stats Card */}
      <div style={styles.statsCard}>
        <div style={styles.statsGrid}>
          <div style={styles.statItem}>
            <div style={styles.statValue}>{stats.total}</div>
            <div style={styles.statLabel}>Total</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statValue}>{stats.current}</div>
            <div style={styles.statLabel}>Current</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statValue}>{stats.permanent}</div>
            <div style={styles.statLabel}>Permanent</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statValue}>{stats.home}</div>
            <div style={styles.statLabel}>Home</div>
          </div>
        </div>
      </div>

      {/* Add Address Section */}
      <div style={styles.addSection}>
        <h3 style={styles.addSectionTitle}>➕ Add New Address</h3>
        <div style={styles.addForm}>
          <div style={styles.selectContainer}>
            <label style={styles.selectLabel}>Address Type / पता प्रकार:</label>
            <Select
              placeholder="Select address type"
              value={selectedAddressType}
              onChange={setSelectedAddressType}
              style={{ width: "100%", height: "40px" }}
            >
              {addressTypeOptions.map((option) => (
                <Select.Option key={option.name} value={option.name}>
                  {option.name_hi} ({option.name})
                </Select.Option>
              ))}
            </Select>
          </div>
          <button
            style={styles.addButton}
            onClick={handleAddAddress}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor =
                styles.addButtonHover.backgroundColor)
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor =
                styles.addButton.backgroundColor)
            }
          >
            Add Address
          </button>
        </div>
      </div>

      {/* Addresses Section */}
      <div style={styles.addressSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>📍 User Addresses</h2>
        </div>

        {addresses.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyStateIcon}>🏠</div>
            <div style={styles.emptyStateText}>No addresses found</div>
            <div style={styles.emptyStateSubtext}>
              Add the first address using the form above
            </div>
          </div>
        ) : (
          <Space direction="vertical" block>
            {addresses.map((address) => (
              <Card key={address.id} style={styles.addressCard}>
                <div style={styles.addressCardHeader}>
                  <span
                    style={{
                      ...styles.addressType,
                      backgroundColor: getAddressTypeColor(address.addresstype),
                    }}
                  >
                    {address.addresstype}
                    {addressTypeOptions.find(
                      (opt) => opt.name === address.addresstype
                    ) &&
                      ` - ${
                        addressTypeOptions.find(
                          (opt) => opt.name === address.addresstype
                        ).name_hi
                      }`}
                  </span>
                  <div style={styles.addressActions}>
                    <button
                      style={{
                        ...styles.actionButton,
                        ...styles.editButton,
                      }}
                      onClick={() => handleEditAddress(address)}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          styles.editButtonHover.backgroundColor)
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          styles.editButton.backgroundColor)
                      }
                    >
                      ✏️ Edit
                    </button>
                    <button
                      style={{
                        ...styles.actionButton,
                        ...styles.deleteButton,
                      }}
                      onClick={() => handleDeleteAddress(address.id)}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          styles.deleteButtonHover.backgroundColor)
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          styles.deleteButton.backgroundColor)
                      }
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>

                <div style={styles.addressContent}>
                  <strong>Address:</strong> {formatAddress(address)}
                </div>

                {address.latitude && address.longitude && (
                  <div style={styles.addressCoords}>
                    📍 Coordinates: {address.latitude.toFixed(6)},{" "}
                    {address.longitude.toFixed(6)}
                  </div>
                )}
              </Card>
            ))}
          </Space>
        )}
      </div>

      {/* Address Modal */}
      <AddressModal
        visible={showAddressModal}
        onClose={() => {
          setShowAddressModal(false);
          setEditingAddress(null);
          setSelectedAddressType("");
        }}
        addressType={selectedAddressType}
        typeKey="user"
        typeId={userId}
        initialAddress={editingAddress}
        onAddressSaved={handleAddressSaved}
      />
    </div>
  );
}
