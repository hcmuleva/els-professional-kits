import { Dialog, Toast } from "antd-mobile";

export default function BusinessCard({
  business,
  onEdit,
  onDelete,
  onAddAddress,
  onEditAddress,
  onDeleteAddress,
  formatAddress,
  getAddressesForBusiness,
}) {
  console.log("BusinessCard business:", business);

  // Extract business attributes
  const businessData = business?.attributes || {};
  const addresses = getAddressesForBusiness ? getAddressesForBusiness() : [];

  // Generate initials for logo
  const getInitials = (name, type) => {
    if (!name && !type) return "N/A";
    if (name && !type) return name.slice(0, 2).toUpperCase();
    if (!name && type) return type.slice(0, 2).toUpperCase();
    return (name.charAt(0) + type.charAt(0)).toUpperCase();
  };

  // Get address type color with gradient
  const getAddressTypeColor = (type) => {
    switch (type) {
      case "BUSINESS":
        return "linear-gradient(135deg, #f97316 0%, #ea580c 100%)"; // Coral gradient
      default:
        return "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)"; // Neutral gray gradient
    }
  };

  // Styles object - Mobile responsive
  const styles = {
    card: {
      width: "100%",
      maxWidth: "350px",
      minHeight: "280px",
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      padding: "16px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      border: "1px solid #fed7aa",
      transition: "all 0.2s ease",
      position: "relative",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      margin: "0 auto",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "16px",
    },
    logoSection: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      flex: 1,
    },
    logo: {
      width: "48px",
      height: "48px",
      backgroundColor: "#f97316",
      borderRadius: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#ffffff",
      fontSize: "18px",
      fontWeight: "bold",
      flexShrink: 0,
    },
    nameSection: {
      flex: 1,
      minWidth: 0, // Allows text to wrap
    },
    name: {
      fontSize: "16px",
      fontWeight: "bold",
      color: "#1f2937",
      margin: "0 0 4px 0",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      wordBreak: "break-word",
    },
    type: {
      fontSize: "13px",
      color: "#6b7280",
      margin: "0",
      fontStyle: "italic",
    },
    actionButtons: {
      display: "flex",
      gap: "6px",
      flexShrink: 0,
    },
    actionButton: {
      width: "32px",
      height: "32px",
      backgroundColor: "#f3f4f6",
      border: "1px solid #e5e7eb",
      borderRadius: "6px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      transition: "all 0.2s ease",
      fontSize: "14px",
    },
    actionButtonHover: {
      backgroundColor: "#e5e7eb",
    },
    deleteButton: {
      backgroundColor: "#fef2f2",
      border: "1px solid #fecaca",
    },
    deleteButtonHover: {
      backgroundColor: "#fee2e2",
    },
    role: {
      fontSize: "18px",
      fontWeight: "bold",
      color: "#1f2937",
      margin: "0 0 16px 0",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      wordBreak: "break-word",
    },
    contactGrid: {
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: "8px",
      fontSize: "11px",
      color: "#4b5563",
      lineHeight: "1.4",
      marginBottom: "16px",
    },
    contactGridDesktop: {
      gridTemplateColumns: "1fr 1fr",
    },
    contactItem: {
      marginBottom: "4px",
      wordBreak: "break-word",
    },
    contactLabel: {
      fontWeight: "600",
      marginRight: "4px",
    },
    addressSection: {
      marginTop: "16px",
    },
    addressHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "12px",
      padding: "8px 0",
    },
    addressTitle: {
      fontSize: "16px",
      fontWeight: "600",
      margin: "0",
      color: "#9a3412",
    },
    addressCard: {
      marginBottom: "12px",
      borderRadius: "8px",
      backgroundColor: "#fff7ed",
      border: "1px solid #fed7aa",
      padding: "12px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    },
    addressCardHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "8px",
      flexWrap: "wrap",
      gap: "8px",
    },
    addressType: {
      padding: "4px 8px",
      borderRadius: "4px",
      fontSize: "10px",
      fontWeight: "600",
      textTransform: "uppercase",
      color: "#ffffff",
    },
    addressActions: {
      display: "flex",
      gap: "6px",
      flexShrink: 0,
    },
    addressActionButton: {
      padding: "6px 12px",
      borderRadius: "6px",
      fontSize: "12px",
      fontWeight: "500",
      border: "none",
      cursor: "pointer",
      transition: "background-color 0.2s",
    },
    editAddressButton: {
      backgroundColor: "#3b82f6",
      color: "#ffffff",
    },
    editAddressButtonHover: {
      backgroundColor: "#2563eb",
    },
    deleteAddressButton: {
      backgroundColor: "#b91c1c",
      color: "#ffffff",
    },
    deleteAddressButtonHover: {
      backgroundColor: "#991b1b",
    },
    addressText: {
      fontSize: "14px",
      color: "#3f3f46",
      lineHeight: "1.4",
      wordBreak: "break-word",
    },
    locationText: {
      fontSize: "12px",
      color: "#6b7280",
      marginTop: "8px",
      wordBreak: "break-all",
    },
    noAddressCard: {
      marginTop: "12px",
      padding: "12px",
      backgroundColor: "#fef2f2",
      borderRadius: "6px",
      border: "1px solid #fecaca",
      textAlign: "center",
    },
    noAddressText: {
      fontSize: "12px",
      color: "#dc2626",
      fontStyle: "italic",
      marginBottom: "8px",
    },
    addAddressButton: {
      fontSize: "12px",
      padding: "8px 16px",
      backgroundColor: "#f97316",
      color: "#ffffff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontWeight: "500",
    },
  };

  // Check if screen is mobile (you can adjust this breakpoint)
  const isMobile = window.innerWidth < 768;

  return (
    <div
      style={styles.card}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.15)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
      }}
    >
      {/* Header with Logo, Name, and Actions */}
      <div style={styles.header}>
        <div style={styles.logoSection}>
          <div style={styles.logo}>
            {getInitials(businessData?.name, businessData?.type)}
          </div>
          <div style={styles.nameSection}>
            <h3 style={styles.name}>{businessData?.name || "N/A"}</h3>
            <p style={styles.type}>{businessData?.type || "N/A"}</p>
          </div>
        </div>

        <div style={styles.actionButtons}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            style={styles.actionButton}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor =
                styles.actionButtonHover.backgroundColor)
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor =
                styles.actionButton.backgroundColor)
            }
            title="Edit Business"
          >
            ✏️
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            style={{
              ...styles.actionButton,
              ...styles.deleteButton,
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor =
                styles.deleteButtonHover.backgroundColor)
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor =
                styles.deleteButton.backgroundColor)
            }
            title="Delete Business"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Role */}
      <div>
        <h2 style={styles.role}>{businessData?.role || "N/A"}</h2>
      </div>

      {/* Contact Information */}
      <div
        style={{
          ...styles.contactGrid,
          ...(isMobile ? {} : styles.contactGridDesktop),
        }}
      >
        <div>
          {businessData?.mobile_number_1 && (
            <div style={styles.contactItem}>
              <span style={styles.contactLabel}>Phone:</span>
              {businessData?.mobile_number_1}
            </div>
          )}
          {businessData?.mobile_number_2 && (
            <div style={styles.contactItem}>
              <span style={styles.contactLabel}>Mobile:</span>
              {businessData?.mobile_number_2}
            </div>
          )}
        </div>
        <div>
          {businessData?.websiteurl && (
            <div style={styles.contactItem}>
              <span style={styles.contactLabel}>Website:</span>
              {businessData?.websiteurl}
            </div>
          )}
          {businessData?.businessid && (
            <div style={styles.contactItem}>
              <span style={styles.contactLabel}>Business ID:</span>
              {businessData?.businessid}
            </div>
          )}
        </div>
      </div>

      {/* Address Section */}
      <div style={styles.addressSection}>
        <div style={styles.addressHeader}>
          <h3 style={styles.addressTitle}>📍 Address:</h3>
        </div>

        {addresses.length > 0 ? (
          addresses.map((address) => (
            <div key={address.id} style={styles.addressCard}>
              <div style={styles.addressCardHeader}>
                <span
                  style={{
                    ...styles.addressType,
                    background: getAddressTypeColor(address.addresstype),
                  }}
                >
                  {address.addresstype}
                </span>
                <div style={styles.addressActions}>
                  <button
                    style={{
                      ...styles.addressActionButton,
                      ...styles.editAddressButton,
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        styles.editAddressButtonHover.backgroundColor)
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        styles.editAddressButton.backgroundColor)
                    }
                    onClick={() => onEditAddress(address)}
                  >
                    Edit
                  </button>
                  <button
                    style={{
                      ...styles.addressActionButton,
                      ...styles.deleteAddressButton,
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        styles.deleteAddressButtonHover.backgroundColor)
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        styles.deleteAddressButton.backgroundColor)
                    }
                    onClick={() => onDeleteAddress(address.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div style={styles.addressText}>{formatAddress(address)}</div>
              {address.latitude && address.longitude && (
                <div style={styles.locationText}>
                  📍 {address.latitude.toFixed(4)},{" "}
                  {address.longitude.toFixed(4)}
                </div>
              )}
            </div>
          ))
        ) : (
          <div style={styles.noAddressCard}>
            <div style={styles.noAddressText}>No address added</div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddAddress();
              }}
              style={styles.addAddressButton}
            >
              Add Address
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
