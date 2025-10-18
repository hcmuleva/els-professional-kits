import React, { useContext, useEffect, useState } from "react";
import { Button, Card, Dialog, Form, Space, Toast, Grid } from "antd-mobile";
import { AuthContext } from "../../../../contexts/AuthContext";
import {
  getEducationData,
  getEducation,
  createEducation,
  updateEducation,
  deleteEducation,
} from "../../../../services/education";
import { deleteUserAddress } from "../../../../services/address";
import AddressModal from "../../../common/AddressModal";
import DateSelector from "../../../common/DateSelector";
import EducationPicker from "../../../common/EducationPicker";

export default function EducationInfo() {
  const addressTypeOptions = [
    { label: "Education Address", value: "EDUCATION" },
  ];

  const [form] = Form.useForm();
  const { user } = useContext(AuthContext);
  const userId = user?.id;
  const [educationData, setEducationData] = useState({ data: [] });
  const [userEducations, setUserEducations] = useState([]);
  const [customData, setCustomData] = useState({});
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedAddressType, setSelectedAddressType] = useState([]);
  const [editingAddress, setEditingAddress] = useState(null);
  const [selectedEducationId, setSelectedEducationId] = useState(null);
  const [editingEducationId, setEditingEducationId] = useState(null);
  const [selectedEducationData, setSelectedEducationData] = useState(null);

  const fetchUserEducations = async () => {
    try {
      const res = await getEducation(userId);
      console.log("User Educations:", res);
      setUserEducations(res?.user_educations || []);
    } catch (error) {
      console.error("Failed to fetch user educations:", error);
      Toast.show({
        content: "Failed to load education data",
        icon: "fail",
      });
    }
  };

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
          });
          fetchUserEducations();
        } catch (error) {
          Toast.show({
            content: "Failed to delete address",
            icon: "fail",
          });
        }
      },
    });
  };

  const handleDeleteEducation = async (educationId) => {
    Dialog.confirm({
      content: "Are you sure you want to delete this education record?",
      confirmText: "Delete",
      cancelText: "Cancel",
      onConfirm: async () => {
        try {
          await deleteEducation(educationId);
          Toast.show({
            content: "Education deleted successfully",
            icon: "success",
          });
          fetchUserEducations();
        } catch (error) {
          Toast.show({
            content: "Failed to delete education",
            icon: "fail",
          });
        }
      },
    });
  };

  const handleEditEducation = (education) => {
    setEditingEducationId(education.id);
    setCustomData({
      education: {
        educationType: education.type,
        educationTypeCode: education.type,
        level: education.level,
        branch: education.branch,
      },
      start_date: education.start_date,
      end_date: education.end_date,
    });
    setSelectedEducationData(education);
  };

  const handleAddAddressToEducation = (educationId) => {
    setSelectedEducationId(educationId);
    setEditingAddress(null);
    setSelectedAddressType(["EDUCATION"]);
    const education = userEducations.find((edu) => edu.id === educationId);
    setSelectedEducationData(education || null);
    setShowAddressModal(true);
  };

  const handleEditAddress = (address, educationId) => {
    setSelectedEducationId(educationId);
    setEditingAddress(address);
    setSelectedAddressType([address.addresstype]);
    const education = userEducations.find((edu) => edu.id === educationId);
    setSelectedEducationData(education || null);
    setShowAddressModal(true);
  };

  const handleAddressSaved = () => {
    fetchUserEducations();
    setShowAddressModal(false);
    setEditingAddress(null);
    setSelectedAddressType([]);
    setSelectedEducationId(null);
    setSelectedEducationData(null);
  };

  const formatAddress = (address) => {
    const parts = [
      address.landmark,
      address.tehsil,
      address.village,
      address.district,
      address.state,
      address.country,
      address.pincode,
    ].filter(Boolean);
    return parts.join(", ");
  };

  const getAddressesForEducation = (educationId) => {
    const education = userEducations.find((edu) => edu.id === educationId);
    return education?.address ? [education.address] : [];
  };

  useEffect(() => {
    const getEducationDataAndUserEducations = async () => {
      try {
        const [educationRes, userEducationRes] = await Promise.all([
          getEducationData(),
          getEducation(userId),
        ]);

        setEducationData(educationRes || { data: [] });
        setUserEducations(userEducationRes?.user_educations || []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        Toast.show({
          content: "Failed to load education data",
          icon: "fail",
        });
      }
    };
    getEducationDataAndUserEducations();
  }, [userId]);

  const handleEducationChange = (selected) => {
    console.log("Selected Education:", selected);
    setCustomData((prev) => ({
      ...prev,
      education: selected,
    }));
  };

  const handleEducationSubmit = async () => {
    const { education, start_date, end_date } = customData;

    if (!education || !start_date || !end_date) {
      Toast.show({
        content: "All fields are required",
        icon: "fail",
      });
      return;
    }

    const educationPayload = {
      type: education.educationType,
      level: education.level,
      branch: education.branch,
      start_date,
      end_date,
      user: userId,
    };

    console.log("Education Payload:", educationPayload);

    try {
      if (editingEducationId) {
        await updateEducation(editingEducationId, educationPayload);
        Toast.show({
          content: "Education updated successfully",
          icon: "success",
        });
      } else {
        await createEducation(educationPayload);
        Toast.show({
          content: "Education added successfully",
          icon: "success",
        });
      }

      setCustomData({});
      setEditingEducationId(null);
      setSelectedEducationData(null);
      fetchUserEducations();
    } catch (error) {
      console.error("Failed to save education:", error);
      Toast.show({
        content: `Failed to ${editingEducationId ? "update" : "add"} education`,
        icon: "fail",
      });
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#fef6f0",
        minHeight: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Add/Edit Education Form */}
      <Card
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          marginBottom: "16px",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
            color: "#ffffff",
            padding: "16px",
            textAlign: "center",
            fontSize: "18px",
            fontWeight: "700",
            letterSpacing: "0.5px",
            marginBottom: "20px",
            boxShadow: "0 2px 4px rgba(249, 115, 22, 0.2)",
          }}
        >
          🎓 {editingEducationId ? "Edit Education" : "Add New Education"}
        </div>

        <div>
          <Form form={form} layout="vertical">
            {/* Education Selection */}
            <div
              style={{
                backgroundColor: "#fef7f0",
                borderRadius: "10px",
                padding: "16px",
                marginBottom: "16px",
                border: "1px solid #fed7aa",
              }}
            >
              <h4
                style={{
                  color: "#9a3412",
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                📚 Education Details
              </h4>

              <Form.Item style={{ marginBottom: "0", width: "100%" }}>
                <EducationPicker
                  value={customData.education || null}
                  onChange={handleEducationChange}
                  educations={educationData}
                  multiSelect={false}
                  placeholder="Select your education qualification"
                />
              </Form.Item>
            </div>

            {/* Date Selection */}
            <div
              style={{
                backgroundColor: "#f0f9ff",
                borderRadius: "10px",
                padding: "16px",
                marginBottom: "16px",
                border: "1px solid #bae6fd",
              }}
            >
              <h4
                style={{
                  color: "#1e40af",
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                📅 Duration
              </h4>

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  flexDirection: "row",
                }}
              >
                <div style={{}}>
                  <label
                    style={{
                      color: "#1e40af",
                      fontSize: "12px",
                      fontWeight: "600",
                      display: "block",
                      marginBottom: "6px",
                    }}
                  >
                    Start Date *
                  </label>
                  <div
                    style={{
                      backgroundColor: "#f0f9ff",
                      border: "2px solid #bae6fd",
                      borderRadius: "8px",
                      minHeight: "40px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <DateSelector
                      fieldKey="start_date"
                      customdata={customData}
                      setCustomdata={setCustomData}
                      placeholder="Start Date"
                    />
                  </div>
                </div>

                <div style={{}}>
                  <label
                    style={{
                      color: "#1e40af",
                      fontSize: "12px",
                      fontWeight: "600",
                      display: "block",
                      marginBottom: "6px",
                    }}
                  >
                    End Date *
                  </label>
                  <div
                    style={{
                      backgroundColor: "#f0f9ff",
                      border: "2px solid #bae6fd",
                      borderRadius: "8px",
                      minHeight: "40px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <DateSelector
                      fieldKey="end_date"
                      customdata={customData}
                      setCustomdata={setCustomData}
                      placeholder="End Date"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              {editingEducationId && (
                <Button
                  onClick={() => {
                    setCustomData({});
                    setEditingEducationId(null);
                    setSelectedEducationData(null);
                  }}
                  style={{
                    width: "120px",
                    height: "44px",
                    borderRadius: "10px",
                    border: "2px solid #f97316",
                    backgroundColor: "transparent",
                    color: "#f97316",
                    fontSize: "14px",
                    fontWeight: "600",
                    boxShadow: "0 2px 4px rgba(249, 115, 22, 0.2)",
                  }}
                >
                  Cancel
                </Button>
              )}
              <Button
                onClick={handleEducationSubmit}
                disabled={
                  !customData.education ||
                  !customData.start_date ||
                  !customData.end_date
                }
                style={{
                  width: "140px",
                  borderRadius: "10px",
                  background:
                    "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
                  border: "none",
                  color: "#ffffff",
                  fontSize: "14px",
                  fontWeight: "600",
                  boxShadow: "0 4px 8px rgba(249, 115, 22, 0.3)",
                  opacity:
                    !customData.education ||
                    !customData.start_date ||
                    !customData.end_date
                      ? 0.6
                      : 1,
                }}
              >
                {editingEducationId ? "📝 Update" : "➕ Add Education"}
              </Button>
            </div>
          </Form>
        </div>
      </Card>

      {/* Education Records Section */}
      <Card
        title={
          <div
            style={{
              textAlign: "center",
              color: "#7c2d12",
              fontSize: "18px",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            🎓 Your Education Records
          </div>
        }
        style={{
          borderRadius: "12px",
          border: "1px solid #fed7aa",
          backgroundColor: "#f5e7db",
        }}
      >
        {userEducations.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "32px 16px",
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              border: "2px dashed #d1d5db",
              color: "#6b7280",
            }}
          >
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>🎓</div>
            <div
              style={{
                fontWeight: "500",
                marginBottom: "6px",
                fontSize: "16px",
              }}
            >
              No education records yet
            </div>
            <div style={{ fontSize: "14px" }}>
              Add your first education record using the form above
            </div>
          </div>
        ) : (
          <Space direction="vertical" block>
            {userEducations.map((education) => (
              <Card
                key={education.id}
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "10px",
                  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                  overflow: "hidden",
                }}
              >
                {/* Education Header */}
                <div
                  style={{
                    backgroundColor: "#f8fafc",
                    padding: "16px",
                    borderBottom: "1px solid #e5e7eb",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "8px",
                  }}
                >
                  <h3
                    style={{
                      color: "#7c2d12",
                      fontSize: "16px",
                      fontWeight: "600",
                      margin: "0",
                      flex: "1 1 auto",
                      minWidth: "150px",
                    }}
                  >
                    🎓 {education.type} Education
                  </h3>

                  <div
                    style={{
                      display: "flex",
                      gap: "6px",
                      flexWrap: "wrap",
                    }}
                  >
                    <button
                      onClick={() => handleAddAddressToEducation(education.id)}
                      style={{
                        backgroundColor: "#10b981",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontWeight: "500",
                        height: "30px",
                        padding: "0 10px",
                        cursor: "pointer",
                        transition: "background-color 0.2s",
                      }}
                    >
                      📍 Address
                    </button>
                    <button
                      onClick={() => handleEditEducation(education)}
                      style={{
                        backgroundColor: "#3b82f6",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontWeight: "500",
                        height: "30px",
                        padding: "0 10px",
                        cursor: "pointer",
                        transition: "background-color 0.2s",
                      }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDeleteEducation(education.id)}
                      style={{
                        backgroundColor: "#ef4444",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontWeight: "500",
                        height: "30px",
                        padding: "0 10px",
                        cursor: "pointer",
                        transition: "background-color 0.2s",
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>

                {/* Education Details */}
                <div style={{ padding: "16px" }}>
                  <Grid columns={2} gap={8}>
                    {education.type && (
                      <Grid.Item>
                        <div
                          style={{
                            backgroundColor: "#fef7f0",
                            borderRadius: "6px",
                            padding: "10px",
                            border: "1px solid #fed7aa",
                            height: "100%",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "11px",
                              fontWeight: "600",
                              color: "#9a3412",
                              marginBottom: "4px",
                              textTransform: "uppercase",
                            }}
                          >
                            Type
                          </div>
                          <div
                            style={{
                              fontSize: "13px",
                              fontWeight: "500",
                              color: "#3f3f46",
                              wordBreak: "break-word",
                            }}
                          >
                            {education.type}
                          </div>
                        </div>
                      </Grid.Item>
                    )}

                    {education.level && (
                      <Grid.Item>
                        <div
                          style={{
                            backgroundColor: "#fef7f0",
                            borderRadius: "6px",
                            padding: "10px",
                            border: "1px solid #fed7aa",
                            height: "100%",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "11px",
                              fontWeight: "600",
                              color: "#9a3412",
                              marginBottom: "4px",
                              textTransform: "uppercase",
                            }}
                          >
                            Level
                          </div>
                          <div
                            style={{
                              fontSize: "13px",
                              fontWeight: "500",
                              color: "#3f3f46",
                              wordBreak: "break-word",
                            }}
                          >
                            {education.level}
                          </div>
                        </div>
                      </Grid.Item>
                    )}

                    {education.start_date && (
                      <Grid.Item>
                        <div
                          style={{
                            backgroundColor: "#f0f9ff",
                            borderRadius: "6px",
                            padding: "10px",
                            border: "1px solid #bae6fd",
                            height: "100%",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "11px",
                              fontWeight: "600",
                              color: "#1e40af",
                              marginBottom: "4px",
                              textTransform: "uppercase",
                            }}
                          >
                            Start Date
                          </div>
                          <div
                            style={{
                              fontSize: "13px",
                              fontWeight: "500",
                              color: "#3f3f46",
                            }}
                          >
                            {education.start_date}
                          </div>
                        </div>
                      </Grid.Item>
                    )}

                    {education.end_date && (
                      <Grid.Item>
                        <div
                          style={{
                            backgroundColor: "#f0f9ff",
                            borderRadius: "6px",
                            padding: "10px",
                            border: "1px solid #bae6fd",
                            height: "100%",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "11px",
                              fontWeight: "600",
                              color: "#1e40af",
                              marginBottom: "4px",
                              textTransform: "uppercase",
                            }}
                          >
                            End Date
                          </div>
                          <div
                            style={{
                              fontSize: "13px",
                              fontWeight: "500",
                              color: "#3f3f46",
                            }}
                          >
                            {education.end_date}
                          </div>
                        </div>
                      </Grid.Item>
                    )}

                    {education.branch && (
                      <Grid.Item span={2}>
                        <div
                          style={{
                            backgroundColor: "#f0fdf4",
                            borderRadius: "6px",
                            padding: "10px",
                            border: "1px solid #bbf7d0",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "11px",
                              fontWeight: "600",
                              color: "#15803d",
                              marginBottom: "4px",
                              textTransform: "uppercase",
                            }}
                          >
                            Branch/Specialization
                          </div>
                          <div
                            style={{
                              fontSize: "13px",
                              fontWeight: "500",
                              color: "#3f3f46",
                              wordBreak: "break-word",
                            }}
                          >
                            {education.branch}
                          </div>
                        </div>
                      </Grid.Item>
                    )}
                  </Grid>

                  {/* Address Section */}
                  <div
                    style={{
                      marginTop: "16px",
                      padding: "12px",
                      backgroundColor: "#f9fafb",
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    <h4
                      style={{
                        color: "#374151",
                        fontSize: "14px",
                        fontWeight: "600",
                        marginBottom: "12px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      📍 Institution Address
                    </h4>

                    {getAddressesForEducation(education.id).length === 0 ? (
                      <div
                        style={{
                          textAlign: "center",
                          padding: "16px",
                          backgroundColor: "#ffffff",
                          borderRadius: "6px",
                          border: "2px dashed #d1d5db",
                          color: "#6b7280",
                          fontSize: "13px",
                        }}
                      >
                        No address added for this institution
                      </div>
                    ) : (
                      <Space direction="vertical" block>
                        {getAddressesForEducation(education.id).map(
                          (address) => (
                            <div
                              key={address.id}
                              style={{
                                backgroundColor: "#ffffff",
                                border: "1px solid #e5e7eb",
                                borderRadius: "6px",
                                padding: "12px",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "flex-start",
                                  marginBottom: "8px",
                                  flexWrap: "wrap",
                                  gap: "6px",
                                }}
                              >
                                <span
                                  style={{
                                    backgroundColor: "#10b981",
                                    color: "#ffffff",
                                    padding: "3px 8px",
                                    borderRadius: "4px",
                                    fontSize: "10px",
                                    fontWeight: "600",
                                    textTransform: "uppercase",
                                  }}
                                >
                                  {address.addresstype}
                                </span>
                                <div
                                  style={{
                                    display: "flex",
                                    gap: "4px",
                                  }}
                                >
                                  <button
                                    onClick={() =>
                                      handleEditAddress(address, education.id)
                                    }
                                    style={{
                                      padding: "4px 8px",
                                      borderRadius: "4px",
                                      fontSize: "10px",
                                      fontWeight: "500",
                                      border: "none",
                                      cursor: "pointer",
                                      backgroundColor: "#3b82f6",
                                      color: "#ffffff",
                                    }}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteAddress(address.id)
                                    }
                                    style={{
                                      padding: "4px 8px",
                                      borderRadius: "4px",
                                      fontSize: "10px",
                                      fontWeight: "500",
                                      border: "none",
                                      cursor: "pointer",
                                      backgroundColor: "#ef4444",
                                      color: "#ffffff",
                                    }}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                              <div
                                style={{
                                  fontSize: "13px",
                                  color: "#374151",
                                  lineHeight: "1.4",
                                  wordBreak: "break-word",
                                }}
                              >
                                {formatAddress(address)}
                              </div>
                              {address.latitude && address.longitude && (
                                <div
                                  style={{
                                    fontSize: "11px",
                                    color: "#6b7280",
                                    marginTop: "6px",
                                  }}
                                >
                                  📍 {address.latitude.toFixed(4)},{" "}
                                  {address.longitude.toFixed(4)}
                                </div>
                              )}
                            </div>
                          )
                        )}
                      </Space>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </Space>
        )}
      </Card>

      <AddressModal
        visible={showAddressModal}
        onClose={() => {
          setShowAddressModal(false);
          setEditingAddress(null);
          setSelectedAddressType([]);
          setSelectedEducationId(null);
          setSelectedEducationData(null);
        }}
        addressType={selectedAddressType[0]}
        typeKey="user_education"
        typeId={selectedEducationId}
        initialAddress={editingAddress}
        educationData={selectedEducationData}
        onAddressSaved={handleAddressSaved}
      />
    </div>
  );
}
