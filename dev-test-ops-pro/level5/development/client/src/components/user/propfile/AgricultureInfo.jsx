import React, { useState, useEffect, useContext } from "react";
import { Form, Input, Button, Toast, Card, Space, Dialog } from "antd-mobile";
import { DeleteOutline, EditSOutline } from "antd-mobile-icons";
import { PlusOutlined } from "@ant-design/icons";
import AddressModal from "../../common/AddressModal";
import {
  createAgriculture,
  getAgricultures,
  deleteAgriculture,
  updateAgriculture,
} from "../../../services/agriculture";
import { AuthContext } from "../../../contexts/AuthContext";
import { deleteUserAddress } from "../../../services/address";

const AgricultureInfo = () => {
  const { user } = useContext(AuthContext);
  const userId = user?.id;

  // State for agriculture data and loading
  const [agricultureList, setAgricultureList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedAddressType, setSelectedAddressType] = useState([]);
  const [editingAddress, setEditingAddress] = useState(null);
  const [selectedAgricultureId, setSelectedAgricultureId] = useState(null);
  const [selectedAgricultureData, setSelectedAgricultureData] = useState(null);

  // Form state with default values set to first option
  const [formData, setFormData] = useState({
    land_area: "0",
    land_unit: "ACRE", // Default to first option
    land_type: "IRRIGATED", // Default to first option
    ownership_type: "OWNED", // Default to first option
  });

  const addressTypeOptions = [
    { label: "कृषि पता (Agriculture Address)", value: "AGRICULTURE" },
  ];

  const landUnitOptions = [
    { label: "एकड़ (Acre)", value: "ACRE" },
    { label: "हेक्टेयर (Hectare)", value: "HECTARE" },
    { label: "बीघा (Bigha)", value: "BIGHA" },
    { label: "गुंठा (Guntha)", value: "GUNTHA" },
  ];

  const landTypeOptions = [
    { label: "सिंचित (Irrigated)", value: "IRRIGATED" },
    { label: "वर्षा आधारित (Rainfed)", value: "RAINFED" },
    { label: "शुष्क (Dry)", value: "DRY" },
    { label: "अन्य (Other)", value: "OTHER" },
  ];

  const ownershipTypeOptions = [
    { label: "ऑनर (Owned)", value: "OWNED" },
    { label: "पट्टे पर (Leased)", value: "LEASED" },
    { label: "साझा (Shared)", value: "SHARED" },
    { label: "सामुदायिक (Community)", value: "COMMUNITY" },
  ];

  // Professional warm color palette
  const warmColors = {
    primary: "#8B4513",
    secondary: "#A0522D",
    accent: "#CD853F",
    background: "#fef6f0",
    cardBg: "#f5e7db",
    textPrimary: "#7c2d12",
    textSecondary: "#9a3412",
    border: "#fed7aa",
    error: "#b91c1c",
    success: "#047857",
    lightBg: "#fff7ed",
    white: "#ffffff",
  };

  const styles = {
    container: {
      padding: "16px",
      backgroundColor: warmColors.background,
      minHeight: "100vh",
    },
    formContainer: {
      backgroundColor: warmColors.white,
      borderRadius: "8px",
      padding: "20px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      marginBottom: "24px",
      border: `1px solid ${warmColors.accent}`,
    },
    formHeader: {
      backgroundColor: warmColors.accent,
      color: warmColors.white,
      padding: "12px 16px",
      borderRadius: "6px",
      marginBottom: "20px",
      fontSize: "18px",
      fontWeight: "600",
      textAlign: "center",
    },
    sectionHeader: {
      fontSize: "20px",
      fontWeight: "600",
      marginBottom: "20px",
      color: warmColors.textPrimary,
      textAlign: "center",
      letterSpacing: "0.5px",
    },
    agricultureCard: {
      backgroundColor: warmColors.cardBg,
      borderRadius: "8px",
      padding: "20px",
      marginBottom: "16px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      color: "#3f3f46",
    },
    agricultureHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "16px",
    },
    agricultureTitle: {
      fontSize: "18px",
      fontWeight: "600",
      color: warmColors.textPrimary,
      margin: 0,
    },
    addAddressButton: {
      backgroundColor: warmColors.accent,
      border: "none",
      borderRadius: "6px",
      color: warmColors.white,
      fontSize: "12px",
      fontWeight: "500",
      height: "32px",
      padding: "0 12px",
      cursor: "pointer",
      transition: "background-color 0.2s",
    },
    agricultureDetails: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "12px",
      marginBottom: "16px",
    },
    agricultureDetailItem: {
      backgroundColor: warmColors.lightBg,
      borderRadius: "6px",
      padding: "12px",
      border: `1px solid ${warmColors.border}`,
    },
    agricultureDetailItemFull: {
      backgroundColor: warmColors.lightBg,
      borderRadius: "6px",
      padding: "12px",
      border: `1px solid ${warmColors.border}`,
      gridColumn: "1 / -1",
    },
    detailLabel: {
      fontSize: "12px",
      fontWeight: "600",
      color: warmColors.textSecondary,
      marginBottom: "4px",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    detailValue: {
      fontSize: "14px",
      fontWeight: "500",
      color: "#3f3f46",
      lineHeight: "1.4",
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
      margin: 0,
      color: warmColors.textSecondary,
    },
    addressCard: {
      marginBottom: "12px",
      borderRadius: "8px",
      backgroundColor: warmColors.white,
      border: `1px solid ${warmColors.border}`,
      padding: "12px",
    },
    addressCardHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "8px",
      flexWrap: "wrap",
      gap: "10px",
    },
    addressType: {
      background: `linear-gradient(135deg, ${warmColors.success} 0%, #047857 100%)`,
      color: warmColors.white,
      padding: "4px 8px",
      borderRadius: "4px",
      fontSize: "10px",
      fontWeight: "600",
      textTransform: "uppercase",
    },
    addressActions: {
      display: "flex",
      gap: "8px",
    },
    actionButton: {
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
      color: warmColors.white,
    },
    deleteAddressButton: {
      backgroundColor: warmColors.error,
      color: warmColors.white,
    },
    actionButtons: {
      display: "flex",
      gap: "8px",
      marginTop: "12px",
    },
    editButton: {
      backgroundColor: `${warmColors.primary}10`,
      color: warmColors.primary,
      border: `1px solid ${warmColors.primary}30`,
      borderRadius: "8px",
      fontSize: "12px",
      padding: "6px 12px",
    },
    deleteButton: {
      backgroundColor: `${warmColors.error}10`,
      color: warmColors.error,
      border: `1px solid ${warmColors.error}30`,
      borderRadius: "8px",
      fontSize: "12px",
      padding: "6px 12px",
    },
    noAgricultureCard: {
      textAlign: "center",
      padding: "48px 24px",
      backgroundColor: warmColors.white,
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      color: "#6b7280",
    },
    input: {
      "--border-radius": "10px",
      "--border": `2px solid ${warmColors.border}`,
      "--background-color": warmColors.lightBg,
      "--padding-left": "16px",
      "--padding-right": "16px",
      "--font-size": "14px",
      "--placeholder-color": warmColors.textSecondary,
      "--color": warmColors.textPrimary,
    },
    dropdown: {
      width: "100%",
      padding: "12px 16px",
      borderRadius: "10px",
      border: `2px solid ${warmColors.border}`,
      backgroundColor: warmColors.lightBg,
      color: warmColors.textPrimary,
      fontSize: "14px",
      fontFamily: "inherit",
      outline: "none",
      cursor: "pointer",
      appearance: "none",
      backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${warmColors.textSecondary.replace(
        "#",
        "%23"
      )}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 12px center",
      backgroundSize: "16px",
      paddingRight: "40px",
    },
  };

  // Fetch agriculture data from API
  const fetchAgricultureData = async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const response = await getAgricultures(userId);
      // Map API response to expected structure
      const data = Array.isArray(response.data)
        ? response.data.map((item) => ({
            id: item.id,
            land_area: item.attributes.land_area || 0,
            land_unit: item.attributes.land_unit || "",
            land_type: item.attributes.land_type || "",
            ownership_type: item.attributes.ownership_type || "",
            address: item.attributes.address?.data
              ? {
                  id: item.attributes.address.data.id,
                  addresstype:
                    item.attributes.address.data.attributes.addresstype || "",
                  housename:
                    item.attributes.address.data.attributes.housename || null,
                  landmark:
                    item.attributes.address.data.attributes.landmark || null,
                  tehsil: item.attributes.address.data.attributes.tehsil || "",
                  village:
                    item.attributes.address.data.attributes.village || null,
                  district:
                    item.attributes.address.data.attributes.district || "",
                  state: item.attributes.address.data.attributes.state || "",
                  pincode:
                    item.attributes.address.data.attributes.pincode || null,
                  latitude:
                    item.attributes.address.data.attributes.latitude || null,
                  longitude:
                    item.attributes.address.data.attributes.longitude || null,
                  country:
                    item.attributes.address.data.attributes.country || "",
                  address_raw:
                    item.attributes.address.data.attributes.address_raw || null,
                }
              : null,
          }))
        : [];
      setAgricultureList(data);
    } catch (error) {
      Toast.show({
        content: "Failed to fetch agriculture data",
        icon: "fail",
        position: "center",
      });
      console.error("Error fetching agriculture data:", error);
      setAgricultureList([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (
      !formData.land_area ||
      !formData.land_unit ||
      !formData.land_type ||
      !formData.ownership_type
    ) {
      Toast.show({
        content: "Please fill all required fields",
        position: "center",
        icon: "fail",
      });
      return;
    }

    if (
      !landUnitOptions.some((opt) => opt.value === formData.land_unit) ||
      !landTypeOptions.some((opt) => opt.value === formData.land_type) ||
      !ownershipTypeOptions.some((opt) => opt.value === formData.ownership_type)
    ) {
      Toast.show({
        content: "Invalid enumeration value selected",
        position: "center",
        icon: "fail",
      });
      return;
    }

    const agricultureData = {
      user: userId,
      land_area: Number(formData.land_area),
      land_unit: formData.land_unit,
      land_type: formData.land_type,
      ownership_type: formData.ownership_type,
      id: editingIndex !== null ? agricultureList[editingIndex].id : undefined,
    };

    try {
      if (editingIndex !== null) {
        await updateAgriculture(agricultureData.id, agricultureData);
        const updatedList = [...agricultureList];
        updatedList[editingIndex] = {
          ...agricultureData,
          address: agricultureList[editingIndex].address,
        };
        setAgricultureList(updatedList);
        Toast.show({
          content: "Agriculture info updated successfully",
          position: "center",
          icon: "success",
        });
      } else {
        const response = await createAgriculture(agricultureData);
        // Map the response to match agricultureList structure
        const newAgriculture = {
          id: response.data.id,
          land_area: response.data.attributes.land_area || 0,
          land_unit: response.data.attributes.land_unit || "",
          land_type: response.data.attributes.land_type || "",
          ownership_type: response.data.attributes.ownership_type || "",
          address: response.data.attributes.address?.data
            ? {
                id: response.data.attributes.address.data.id,
                addresstype:
                  response.data.attributes.address.data.attributes
                    .addresstype || "",
                housename:
                  response.data.attributes.address.data.attributes.housename ||
                  null,
                landmark:
                  response.data.attributes.address.data.attributes.landmark ||
                  null,
                tehsil:
                  response.data.attributes.address.data.attributes.tehsil || "",
                village:
                  response.data.attributes.address.data.attributes.village ||
                  null,
                district:
                  response.data.attributes.address.data.attributes.district ||
                  "",
                state:
                  response.data.attributes.address.data.attributes.state || "",
                pincode:
                  response.data.attributes.address.data.attributes.pincode ||
                  null,
                latitude:
                  response.data.attributes.address.data.attributes.latitude ||
                  null,
                longitude:
                  response.data.attributes.address.data.attributes.longitude ||
                  null,
                country:
                  response.data.attributes.address.data.attributes.country ||
                  "",
                address_raw:
                  response.data.attributes.address.data.attributes
                    .address_raw || null,
              }
            : null,
        };
        setAgricultureList((prev) => [...prev, newAgriculture]);
        Toast.show({
          content: "Agriculture info added successfully",
          position: "center",
          icon: "success",
        });
      }

      setFormData({
        land_area: "",
        land_unit: "ACRE",
        land_type: "IRRIGATED",
        ownership_type: "OWNED",
      });
      setShowForm(false);
      setEditingIndex(null);
    } catch (error) {
      Toast.show({
        content: "Failed to save agriculture info",
        icon: "fail",
        position: "center",
      });
      console.error("Error saving agriculture info:", error);
    }
  };

  // Handle edit button click
  const handleEdit = (index) => {
    if (index < 0 || index >= agricultureList.length) {
      Toast.show({
        content: "Invalid agriculture record selected",
        icon: "fail",
        position: "center",
      });
      console.error(
        `Invalid index: ${index}, agricultureList length: ${agricultureList.length}`
      );
      return;
    }

    const agriculture = agricultureList[index];
    if (!agriculture || agriculture.land_area === undefined) {
      Toast.show({
        content: "Agriculture record is missing required data",
        icon: "fail",
        position: "center",
      });
      console.error("Invalid agriculture data:", agriculture);
      return;
    }

    setFormData({
      land_area: agriculture.land_area.toString(),
      land_unit: agriculture.land_unit || "",
      land_type: agriculture.land_type || "",
      ownership_type: agriculture.ownership_type || "",
    });
    setEditingIndex(index);
    setShowForm(true);
  };

  // Handle delete button click
  const handleDelete = async (index) => {
    if (index < 0 || index >= agricultureList.length) {
      Toast.show({
        content: "Invalid agriculture record selected",
        icon: "fail",
        position: "center",
      });
      return;
    }

    const agriculture = agricultureList[index];
    Dialog.confirm({
      content:
        "Are you sure you want to delete this agriculture record and its associated address?",
      confirmText: "Delete",
      cancelText: "Cancel",
      onConfirm: async () => {
        try {
          // Delete the associated address if it exists
          if (agriculture.address && agriculture.address.id) {
            try {
              await deleteUserAddress(agriculture.address.id);
            } catch (addressError) {
              console.error("Error deleting address:", addressError);
              Toast.show({
                content: "Failed to delete associated address",
                icon: "fail",
                position: "center",
              });
              // Proceed with agriculture deletion even if address deletion fails
            }
          }

          // Delete the agriculture record
          await deleteAgriculture(agriculture.id);
          setAgricultureList((prev) => prev.filter((_, i) => i !== index));
          if (editingIndex === index) {
            setEditingIndex(null);
            setShowForm(false);
            setFormData({
              land_area: "",
              land_unit: "ACRE",
              land_type: "IRRIGATED",
              ownership_type: "OWNED",
            });
          }
          Toast.show({
            content:
              "Agriculture info and associated address deleted successfully",
            position: "center",
            icon: "success",
          });
        } catch (error) {
          Toast.show({
            content: "Failed to delete agriculture info",
            icon: "fail",
            position: "center",
          });
          console.error("Error deleting agriculture info:", error);
        }
      },
    });
  };

  // Handle adding address to agriculture
  const handleAddAddressToAgriculture = (agricultureId) => {
    setSelectedAgricultureId(agricultureId);
    setEditingAddress(null);
    setSelectedAddressType(["AGRICULTURE"]);
    const agriculture = agricultureList.find(
      (agri) => agri.id === agricultureId
    );
    setSelectedAgricultureData(agriculture || null);
    setShowAddressModal(true);
  };

  // Handle editing an address
  const handleEditAddress = (address, agricultureId) => {
    setSelectedAgricultureId(agricultureId);
    setEditingAddress(address);
    setSelectedAddressType([address.addresstype]);
    const agriculture = agricultureList.find(
      (agri) => agri.id === agricultureId
    );
    setSelectedAgricultureData(agriculture || null);
    setShowAddressModal(true);
  };

  // Handle address save callback
  const handleAddressSaved = (savedAddress) => {
    setAgricultureList((prevList) =>
      prevList.map((agri) =>
        agri.id === selectedAgricultureId
          ? {
              ...agri,
              address: {
                id: savedAddress.id,
                addresstype: savedAddress.addresstype,
                housename: savedAddress.housename || null,
                landmark: savedAddress.landmark || null,
                tehsil: savedAddress.tehsil || "",
                village: savedAddress.village || null,
                district: savedAddress.district || "",
                state: savedAddress.state || "",
                pincode: savedAddress.pincode || null,
                latitude: savedAddress.latitude || null,
                longitude: savedAddress.longitude || null,
                country: savedAddress.country || "",
                address_raw: savedAddress.address_raw || null,
              },
            }
          : agri
      )
    );
    setShowAddressModal(false);
    setEditingAddress(null);
    setSelectedAddressType([]);
    setSelectedAgricultureId(null);
    setSelectedAgricultureData(null);
    fetchAgricultureData(); // Refresh data to ensure consistency
  };

  // Handle address deletion
  const handleDeleteAddress = async (addressId) => {
    Dialog.confirm({
      content: "Are you sure you want to delete this address?",
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
          fetchAgricultureData();
        } catch (error) {
          Toast.show({
            content: "Failed to delete address",
            icon: "fail",
            position: "center",
          });
          console.error("Error deleting address:", error);
        }
      },
    });
  };

  // Format address for display
  const formatAddress = (address) => {
    if (!address) return "No address available";
    const parts = [
      address.housename,
      address.address_raw,
      address.village,
      address.landmark,
      address.tehsil,
      address.district,
      address.state,
      address.country,
      address.pincode,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "No address details";
  };

  // Get addresses for a specific agriculture record
  const getAddressesForAgriculture = (agricultureId) => {
    const agriculture = agricultureList.find(
      (agri) => agri.id === agricultureId
    );
    return agriculture?.address ? [agriculture.address] : [];
  };

  // Fetch data on component mount or userId change
  useEffect(() => {
    fetchAgricultureData();
  }, [userId]);

  // Render agriculture list
  const renderAgricultureList = () => {
    if (isLoading) {
      return (
        <Card style={styles.noAgricultureCard}>
          <div>Loading agriculture information...</div>
        </Card>
      );
    }

    if (!Array.isArray(agricultureList) || agricultureList.length === 0) {
      return (
        <Card style={styles.noAgricultureCard}>
          <div>No agriculture information added yet</div>
          <div style={{ fontSize: "14px", marginTop: "12px" }}>
            Add your first agriculture record using the form above
          </div>
        </Card>
      );
    }

    return (
      <Space direction="vertical" block>
        {agricultureList.map((agriculture, index) => {
          if (!agriculture || !agriculture.id) {
            console.warn(
              `Invalid agriculture object at index ${index}:`,
              agriculture
            );
            return null;
          }

          return (
            <Card key={agriculture.id} style={styles.agricultureCard}>
              <div style={styles.agricultureHeader}>
                <h3 style={styles.agricultureTitle}>
                  🌾 Land {index + 1}: {agriculture.land_area || "N/A"}{" "}
                  {landUnitOptions.find(
                    (opt) => opt.value === agriculture.land_unit
                  )?.label ||
                    agriculture.land_unit ||
                    "N/A"}
                </h3>
                <button
                  style={styles.addAddressButton}
                  onClick={() => handleAddAddressToAgriculture(agriculture.id)}
                >
                  + Add Address
                </button>
              </div>

              <div style={styles.agricultureDetails}>
                <div style={styles.agricultureDetailItem}>
                  <div style={styles.detailLabel}>Land Area</div>
                  <div style={styles.detailValue}>
                    {agriculture.land_area || "N/A"}{" "}
                    {landUnitOptions.find(
                      (opt) => opt.value === agriculture.land_unit
                    )?.label ||
                      agriculture.land_unit ||
                      "N/A"}
                  </div>
                </div>
                <div style={styles.agricultureDetailItem}>
                  <div style={styles.detailLabel}>Land Type</div>
                  <div style={styles.detailValue}>
                    {landTypeOptions.find(
                      (opt) => opt.value === agriculture.land_type
                    )?.label ||
                      agriculture.land_type ||
                      "N/A"}
                  </div>
                </div>
                <div style={styles.agricultureDetailItemFull}>
                  <div style={styles.detailLabel}>Ownership Type</div>
                  <div style={styles.detailValue}>
                    {ownershipTypeOptions.find(
                      (opt) => opt.value === agriculture.ownership_type
                    )?.label ||
                      agriculture.ownership_type ||
                      "N/A"}
                  </div>
                </div>
              </div>

              <div style={styles.actionButtons}>
                <Button
                  size="small"
                  style={styles.editButton}
                  onClick={() => handleEdit(index)}
                >
                  <EditSOutline fontSize={12} />
                  Edit
                </Button>
                <Button
                  size="small"
                  style={styles.deleteButton}
                  onClick={() => handleDelete(index)}
                >
                  <DeleteOutline fontSize={12} />
                  Delete
                </Button>
              </div>

              <div style={styles.addressSection}>
                <div style={styles.addressHeader}>
                  <h4 style={styles.addressTitle}>📍 Addresses</h4>
                </div>
                {getAddressesForAgriculture(agriculture.id).length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "12px",
                      backgroundColor: warmColors.lightBg,
                      borderRadius: "6px",
                      color: warmColors.textSecondary,
                      fontSize: "14px",
                    }}
                  >
                    No addresses added for this agriculture record
                  </div>
                ) : (
                  <Space direction="vertical" block>
                    {getAddressesForAgriculture(agriculture.id).map(
                      (address) => (
                        <Card key={address.id} style={styles.addressCard}>
                          <div style={styles.addressCardHeader}>
                            <span style={styles.addressType}>
                              {addressTypeOptions.find(
                                (opt) => opt.value === address.addresstype
                              )?.label ||
                                address.addresstype ||
                                "N/A"}
                            </span>
                            <div style={styles.addressActions}>
                              <button
                                style={{
                                  ...styles.actionButton,
                                  ...styles.editAddressButton,
                                }}
                                onClick={() =>
                                  handleEditAddress(address, agriculture.id)
                                }
                              >
                                Edit
                              </button>
                              <button
                                style={{
                                  ...styles.actionButton,
                                  ...styles.deleteAddressButton,
                                }}
                                onClick={() => handleDeleteAddress(address.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                          <div style={styles.detailValue}>
                            {formatAddress(address)}
                          </div>
                          {address.latitude && address.longitude && (
                            <div
                              style={{
                                fontSize: "12px",
                                color: "#6b7280",
                                marginTop: "8px",
                              }}
                            >
                              📍 {address.latitude.toFixed(4)},{" "}
                              {address.longitude.toFixed(4)}
                            </div>
                          )}
                        </Card>
                      )
                    )}
                  </Space>
                )}
              </div>
            </Card>
          );
        })}
      </Space>
    );
  };

  return (
    <div style={styles.container}>
      {!showForm && (
        <Button
          block
          style={{
            background: `linear-gradient(135deg, ${warmColors.primary} 0%, ${warmColors.secondary} 100%)`,
            border: "none",
            borderRadius: "10px",
            fontWeight: "600",
            color: warmColors.white,
            marginBottom: "16px",
          }}
          onClick={() => setShowForm(true)}
        >
          <PlusOutlined /> Add New Agriculture Info
        </Button>
      )}

      {showForm && (
        <div style={styles.formContainer}>
          <div style={styles.formHeader}>
            {editingIndex !== null
              ? "Edit Agriculture Info"
              : "Add New Agriculture Info"}
          </div>

          <Form
            onFinish={handleSubmit}
            footer={
              <Space direction="vertical" block>
                <Button
                  block
                  type="submit"
                  style={{
                    background: `linear-gradient(135deg, ${warmColors.primary} 0%, ${warmColors.secondary} 100%)`,
                    border: "none",
                    borderRadius: "10px",
                    fontWeight: "600",
                    color: warmColors.white,
                  }}
                >
                  {editingIndex !== null
                    ? "Update Agriculture Info"
                    : "Save Agriculture Info"}
                </Button>
                <Button
                  block
                  onClick={() => {
                    setShowForm(false);
                    setEditingIndex(null);
                    setFormData({
                      land_area: "",
                      land_unit: "ACRE",
                      land_type: "IRRIGATED",
                      ownership_type: "OWNED",
                    });
                  }}
                  style={{
                    background: warmColors.lightBg,
                    border: `1px solid ${warmColors.border}`,
                    borderRadius: "10px",
                    color: warmColors.textSecondary,
                  }}
                >
                  Cancel
                </Button>
              </Space>
            }
          >
            <Form.Item
              name="land_area"
              label="जमीन का क्षेत्रफल (Land Area)"
              rules={[
                {
                  required: true,
                  message:
                    "कृपया जमीन का क्षेत्रफल दर्ज करें (Please enter land area)",
                },
                {
                  pattern: /^\d+(\.\d+)?$/,
                  message:
                    "कृपया एक वैध संख्या दर्ज करें (Please enter a valid number)",
                },
              ]}
            >
              <Input
                placeholder="जमीन का क्षेत्रफल (Enter land area)"
                value={formData.land_area}
                onChange={(val) => handleInputChange("land_area", val)}
                style={styles.input}
              />
            </Form.Item>

            <Form.Item name="land_unit" label="जमीन की इकाई (Land Unit)">
              <select
                value={formData.land_unit}
                onChange={(e) => handleInputChange("land_unit", e.target.value)}
                style={styles.dropdown}
              >
                {landUnitOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Form.Item>

            <Form.Item name="land_type" label="जमीन का प्रकार (Land Type)">
              <select
                value={formData.land_type}
                onChange={(e) => handleInputChange("land_type", e.target.value)}
                style={styles.dropdown}
              >
                {landTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Form.Item>

            <Form.Item name="ownership_type" label="ऑनर(Ownership Type)">
              <select
                value={formData.ownership_type}
                onChange={(e) =>
                  handleInputChange("ownership_type", e.target.value)
                }
                style={styles.dropdown}
              >
                {ownershipTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Form.Item>
          </Form>
        </div>
      )}

      <div style={styles.sectionHeader}>🌾 Agriculture Information</div>
      {renderAgricultureList()}

      <AddressModal
        visible={showAddressModal}
        onClose={() => {
          setShowAddressModal(false);
          setEditingAddress(null);
          setSelectedAddressType([]);
          setSelectedAgricultureId(null);
          setSelectedAgricultureData(null);
        }}
        addressType={selectedAddressType[0]}
        typeKey="agricultures"
        typeId={selectedAgricultureId}
        initialAddress={editingAddress}
        agricultureData={selectedAgricultureData}
        onAddressSaved={handleAddressSaved}
      />
    </div>
  );
};

export default AgricultureInfo;
