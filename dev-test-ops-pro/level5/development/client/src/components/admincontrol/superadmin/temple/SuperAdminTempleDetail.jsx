import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Input, Toast, Form } from "antd-mobile";
import { Typography, Card, Spin } from "antd";
import {
  LeftOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import AssignSubcategoryModal from "./AssignSubcategoryModal";
import AddressModal from "../../../common/AddressModal";
import { getTempleById, updateTemple } from "../../../../services/temple";
import { deleteUserAddress } from "../../../../services/address";
import ImageUploaderSingle from "../../../fileupload/ImageUploaderSingle";

const { Title } = Typography;

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

const cardStyle = {
  borderRadius: "16px",
  boxShadow: `0 4px 16px ${warmColors.primary}12`,
  backgroundColor: warmColors.cardBg,
  border: `1px solid ${warmColors.border}`,
  marginBottom: "16px",
};

const buttonStyle = {
  backgroundColor: warmColors.primary,
  borderColor: warmColors.primary,
  borderRadius: "12px",
  fontWeight: "600",
  color: "white",
};

const inputStyle = {
  borderRadius: "8px",
  border: `1px solid ${warmColors.border}`,
  backgroundColor: warmColors.cardBg,
};

const SuperAdminTempleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [temple, setTemple] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Address modal states
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    images: [],
    qr_images: [],
  });

  const addressTypeOptions = [{ label: "Temple Address", value: "TEMPLE" }];

  useEffect(() => {
    getTempleById(id).then((data) => {
      setTemple(data?.data);
      if (data?.data) {
        setFormData({
          title: data.data.attributes.title || "",
          subtitle: data.data.attributes.subtitle || "",
          images:
            data.data.attributes.images?.data?.map((img) => ({
              url: img.attributes.url,
              name: img.attributes.name,
              id: img.id,
            })) || [],
          qr_images:
            data.data.attributes.qr_images?.data?.map((img) => ({
              url: img.attributes.url,
              name: img.attributes.name,
              id: img.id,
            })) || [],
        });
      }
      setLoading(false);
    });
  }, [id]);

  const handleUpdate = async () => {
    try {
      setUpdating(true);
      const updateData = {
        title: formData.title,
        subtitle: formData.subtitle,
        images: formData.images.map((img) => img.id),
        qr_images: formData.qr_images.map((img) => img.id),
      };

      await updateTemple(id, updateData);
      Toast.show("मंदिर सफलतापूर्वक अपडेट हुआ!");
      setIsEditing(false);

      // Refresh temple data
      const updatedTemple = await getTempleById(id);
      setTemple(updatedTemple?.data);
    } catch (error) {
      Toast.show("अपडेट में त्रुटि हुई!");
      console.error("Update error:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original temple data
    setFormData({
      title: temple?.attributes.title || "",
      subtitle: temple?.attributes.subtitle || "",
      images:
        temple?.attributes.images?.data?.map((img) => ({
          url: img.attributes.url,
          name: img.attributes.name,
          id: img.id,
        })) || [],
      qr_images:
        temple?.attributes.qr_images?.data?.map((img) => ({
          url: img.attributes.url,
          name: img.attributes.name,
          id: img.id,
        })) || [],
    });
    setIsEditing(false);
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    setShowAddressModal(true);
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setShowAddressModal(true);
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      await deleteUserAddress(addressId);
      Toast.show("पता सफलतापूर्वक हटाया गया!");

      // Refresh temple data
      const updatedTemple = await getTempleById(id);
      setTemple(updatedTemple?.data);
    } catch (error) {
      Toast.show("पता हटाने में त्रुटि हुई!");
      console.error("Delete address error:", error);
    }
  };

  const handleAddressSaved = async () => {
    setShowAddressModal(false);
    setEditingAddress(null);

    // Refresh temple data to get updated address
    const updatedTemple = await getTempleById(id);
    setTemple(updatedTemple?.data);
    Toast.show("पता सफलतापूर्वक सेव हुआ!");
  };

  const formatAddress = (address) => {
    if (!address) return "पता उपलब्ध नहीं";

    const addressData = address.data?.attributes || address;
    const parts = [
      addressData.housename,
      addressData.address_raw,
      addressData.village,
      addressData.landmark,
      addressData.tehsil,
      addressData.district,
      addressData.state,
      addressData.country,
      addressData.pincode,
    ].filter(Boolean);

    return parts.length > 0 ? parts.join(", ") : "पता विवरण उपलब्ध नहीं";
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: warmColors.background,
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "16px",
        backgroundColor: warmColors.background,
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background pattern */}
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
          maxWidth: "600px",
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header with back button */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "24px",
            gap: "12px",
          }}
        >
          <Button
            onClick={() => navigate(-1)}
            style={{
              backgroundColor: "transparent",
              color: warmColors.primary,
              border: `1px solid ${warmColors.primary}`,
              borderRadius: "12px",
              padding: "8px",
              minWidth: "auto",
              height: "40px",
              width: "40px",
            }}
          >
            <LeftOutlined />
          </Button>

          <Title
            level={3}
            style={{
              color: warmColors.textPrimary,
              fontWeight: "700",
              margin: 0,
              flex: 1,
              background: `linear-gradient(135deg, ${warmColors.primary} 0%, ${warmColors.secondary} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            मंदिर विवरण
          </Title>

          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              style={{
                backgroundColor: "transparent",
                color: warmColors.primary,
                border: `1px solid ${warmColors.primary}`,
                borderRadius: "12px",
                padding: "8px 16px",
                height: "40px",
              }}
            >
              <EditOutlined style={{ marginRight: "4px" }} />
              संपादित करें
            </Button>
          ) : (
            <div style={{ display: "flex", gap: "8px" }}>
              <Button
                onClick={handleUpdate}
                loading={updating}
                style={{
                  ...buttonStyle,
                  padding: "8px 16px",
                  height: "40px",
                }}
              >
                <SaveOutlined style={{ marginRight: "4px" }} />
                सेव करें
              </Button>
              <Button
                onClick={handleCancel}
                style={{
                  backgroundColor: "transparent",
                  color: warmColors.error,
                  border: `1px solid ${warmColors.error}`,
                  borderRadius: "12px",
                  padding: "8px 16px",
                  height: "40px",
                }}
              >
                <CloseOutlined style={{ marginRight: "4px" }} />
                रद्द करें
              </Button>
            </div>
          )}
        </div>

        {/* Temple Details Card */}
        <Card style={cardStyle}>
          <div style={{ padding: "20px" }}>
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: warmColors.textPrimary,
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                मंदिर का नाम
              </label>
              {isEditing ? (
                <Input
                  value={formData.title}
                  onChange={(val) =>
                    setFormData((prev) => ({ ...prev, title: val }))
                  }
                  style={inputStyle}
                  placeholder="मंदिर का नाम दर्ज करें"
                />
              ) : (
                <div
                  style={{
                    fontSize: "16px",
                    color: warmColors.textPrimary,
                    fontWeight: "500",
                  }}
                >
                  {temple?.attributes.title || "नाम उपलब्ध नहीं"}
                </div>
              )}
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: warmColors.textPrimary,
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                उपशीर्षक
              </label>
              {isEditing ? (
                <Input
                  value={formData.subtitle}
                  onChange={(val) =>
                    setFormData((prev) => ({ ...prev, subtitle: val }))
                  }
                  style={inputStyle}
                  placeholder="उपशीर्षक दर्ज करें"
                />
              ) : (
                <div
                  style={{
                    fontSize: "14px",
                    color: warmColors.textSecondary,
                    lineHeight: "1.5",
                  }}
                >
                  {temple?.attributes.subtitle || "कोई उपशीर्षक नहीं"}
                </div>
              )}
            </div>

            {isEditing && (
              <>
                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: warmColors.textPrimary,
                      display: "block",
                      marginBottom: "8px",
                    }}
                  >
                    मंदिर की तस्वीर
                  </label>
                  <ImageUploaderSingle
                    value={formData.images}
                    onChange={(images) =>
                      setFormData((prev) => ({ ...prev, images }))
                    }
                    onUploadSuccess={(image) =>
                      console.log("Image uploaded:", image)
                    }
                    onRemove={() => console.log("Image removed")}
                  />
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: warmColors.textPrimary,
                      display: "block",
                      marginBottom: "8px",
                    }}
                  >
                    QR कोड इमेज
                  </label>
                  <ImageUploaderSingle
                    value={formData.qr_images}
                    onChange={(qr_images) =>
                      setFormData((prev) => ({ ...prev, qr_images }))
                    }
                    onUploadSuccess={(image) =>
                      console.log("QR Image uploaded:", image)
                    }
                    onRemove={() => console.log("QR Image removed")}
                  />
                </div>
              </>
            )}

            {!isEditing && (
              <>
                {/* Display current images */}
                {temple?.attributes.images?.data?.length > 0 && (
                  <div style={{ marginBottom: "20px" }}>
                    <label
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: warmColors.textPrimary,
                        display: "block",
                        marginBottom: "8px",
                      }}
                    >
                      मंदिर की तस्वीर
                    </label>
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        flexWrap: "wrap",
                      }}
                    >
                      {temple.attributes.images.data.map((img, index) => (
                        <img
                          key={index}
                          src={img.attributes.url}
                          alt="Temple"
                          style={{
                            width: "80px",
                            height: "80px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            border: `1px solid ${warmColors.border}`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {temple?.attributes.qr_images?.data?.length > 0 && (
                  <div style={{ marginBottom: "20px" }}>
                    <label
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: warmColors.textPrimary,
                        display: "block",
                        marginBottom: "8px",
                      }}
                    >
                      QR कोड इमेज
                    </label>
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        flexWrap: "wrap",
                      }}
                    >
                      {temple.attributes.qr_images.data.map((img, index) => (
                        <img
                          key={index}
                          src={img.attributes.url}
                          alt="QR Code"
                          style={{
                            width: "80px",
                            height: "80px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            border: `1px solid ${warmColors.border}`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </Card>

        {/* Address Card */}
        <Card style={cardStyle}>
          <div style={{ padding: "20px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <Title
                level={4}
                style={{
                  margin: 0,
                  color: warmColors.textPrimary,
                  fontSize: "16px",
                  fontWeight: "600",
                }}
              >
                📍 मंदिर का पता
              </Title>
              <Button
                onClick={handleAddAddress}
                style={{
                  ...buttonStyle,
                  fontSize: "12px",
                  padding: "4px 12px",
                  height: "32px",
                }}
              >
                {temple?.attributes.address?.data
                  ? "पता एडिट करें"
                  : "+ पता जोड़ें"}
              </Button>
            </div>

            {temple?.attributes.address?.data ? (
              <div
                style={{
                  backgroundColor: warmColors.background,
                  borderRadius: "8px",
                  padding: "16px",
                  border: `1px solid ${warmColors.border}`,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "12px",
                  }}
                >
                  <span
                    style={{
                      background: warmColors.success,
                      color: "#fff",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "10px",
                      fontWeight: "600",
                    }}
                  >
                    TEMPLE
                  </span>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <Button
                      size="small"
                      onClick={() =>
                        handleEditAddress(temple.attributes.address.data)
                      }
                      style={{
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        background: "#3b82f6",
                        color: "#fff",
                        border: "none",
                      }}
                    >
                      <EditOutlined style={{ fontSize: "12px" }} /> एडिट
                    </Button>
                    <Button
                      size="small"
                      onClick={() =>
                        handleDeleteAddress(temple.attributes.address.data.id)
                      }
                      style={{
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        background: "#b91c1c",
                        color: "#fff",
                        border: "none",
                      }}
                    >
                      <DeleteOutlined style={{ fontSize: "12px" }} /> डिलीट
                    </Button>
                  </div>
                </div>

                <div
                  style={{
                    fontSize: "14px",
                    color: warmColors.textPrimary,
                    lineHeight: "1.5",
                    marginBottom: "8px",
                  }}
                >
                  {formatAddress(temple.attributes.address)}
                </div>

                {temple.attributes.address.data.attributes.latitude &&
                  temple.attributes.address.data.attributes.longitude && (
                    <div
                      style={{
                        fontSize: "12px",
                        color: warmColors.textSecondary,
                        marginTop: "8px",
                      }}
                    >
                      📍{" "}
                      {temple.attributes.address.data.attributes.latitude.toFixed(
                        4
                      )}
                      ,{" "}
                      {temple.attributes.address.data.attributes.longitude.toFixed(
                        4
                      )}
                    </div>
                  )}
              </div>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "24px",
                  color: warmColors.textSecondary,
                  fontSize: "14px",
                  backgroundColor: warmColors.background,
                  borderRadius: "8px",
                  border: `1px solid ${warmColors.border}`,
                }}
              >
                कोई पता जोड़ा नहीं गया है
              </div>
            )}
          </div>
        </Card>

        {/* Subcategories Card */}
        <Card style={cardStyle}>
          <div style={{ padding: "20px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <Title
                level={4}
                style={{
                  margin: 0,
                  color: warmColors.textPrimary,
                  fontSize: "16px",
                  fontWeight: "600",
                }}
              >
                असाइन की गई उप श्रेणियां
              </Title>
              <Button
                onClick={() => setShowModal(true)}
                style={{
                  ...buttonStyle,
                  fontSize: "12px",
                  padding: "4px 12px",
                  height: "32px",
                }}
              >
                उप श्रेणी असाइन करें
              </Button>
            </div>

            {temple?.attributes.subcategories?.data?.length > 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                {temple.attributes.subcategories.data.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      padding: "12px 16px",
                      backgroundColor: warmColors.background,
                      borderRadius: "8px",
                      border: `1px solid ${warmColors.border}`,
                      fontSize: "14px",
                      color: warmColors.textPrimary,
                    }}
                  >
                    {item.attributes.name}
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "24px",
                  color: warmColors.textSecondary,
                  fontSize: "14px",
                }}
              >
                कोई उप श्रेणी असाइन नहीं की गई
              </div>
            )}
          </div>
        </Card>

        {/* Modals */}
        <AssignSubcategoryModal
          templeId={id}
          open={showModal}
          onClose={() => setShowModal(false)}
        />

        <AddressModal
          visible={showAddressModal}
          onClose={() => {
            setShowAddressModal(false);
            setEditingAddress(null);
          }}
          addressType="TEMPLE"
          typeKey="temple"
          typeId={id}
          initialAddress={
            editingAddress
              ? {
                  ...editingAddress.attributes,
                  id: editingAddress.id,
                }
              : null
          }
          onAddressSaved={handleAddressSaved}
        />
      </div>
    </div>
  );
};

export default SuperAdminTempleDetail;
