"use client";

import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Toast,
  Card,
  Space,
  Dialog,
  Divider,
  Selector,
  Grid,
} from "antd-mobile";
import { useAuth } from "../../../contexts/AuthContext";
import { updateUserProfile } from "../../../services/user";
import DateSelector from "../../common/DateSelector";
import AddressModal from "../../common/AddressModal";
import {
  fetchUserAddresses,
  deleteUserAddress,
} from "../../../services/address";
import { Select } from "antd";

const occupationOptions = [
  { value: "business", label: "Business", name_hi: "व्यवसाय" },
  { value: "job", label: "Job", name_hi: "नौकरी" },
  { value: "farmer", label: "Farmer", name_hi: "किसान" },
  { value: "teacher", label: "Teacher", name_hi: "शिक्षक" },
  { value: "doctor", label: "Doctor", name_hi: "डॉक्टर" },
  { value: "engineer", label: "Engineer", name_hi: "इंजीनियर" },
  { value: "lawyer", label: "Lawyer", name_hi: "वकील" },
  { value: "shopkeeper", label: "Shopkeeper", name_hi: "दुकानदार" },
  { value: "housewife", label: "Housewife", name_hi: "गृहिणी" },
  { value: "student", label: "Student", name_hi: "छात्र" },
  { value: "retired", label: "Retired", name_hi: "सेवानिवृत्त" },
  { value: "unemployed", label: "Unemployed", name_hi: "बेरोजगार" },
  { value: "other", label: "Other", name_hi: "अन्य" },
];

const educationOptions = [
  { value: "UNEDUCATED", label: "Uneducated", name_hi: "अशिक्षित" },
  { value: "I", label: "I", name_hi: "कक्षा I" },
  { value: "II", label: "II", name_hi: "कक्षा II" },
  { value: "III", label: "III", name_hi: "कक्षा III" },
  { value: "IV", label: "IV", name_hi: "कक्षा IV" },
  { value: "V", label: "V", name_hi: "कक्षा V" },
  { value: "VI", label: "VI", name_hi: "कक्षा VI" },
  { value: "VII", label: "VII", name_hi: "कक्षा VII" },
  { value: "VIII", label: "VIII", name_hi: "कक्षा VIII" },
  { value: "IX", label: "IX", name_hi: "कक्षा IX" },
  { value: "X", label: "X", name_hi: "कक्षा X" },
  { value: "XI", label: "XI", name_hi: "कक्षा XI" },
  { value: "XII", label: "XII", name_hi: "कक्षा XII" },
  { value: "UNDERGRADUATE", label: "Undergraduate", name_hi: "स्नातक" },
  { value: "POSTGRADUATE", label: "Postgraduate", name_hi: "स्नातकोत्तर" },
  { value: "PhD", label: "PhD", name_hi: "पीएचडी" },
  { value: "DIPLOMA", label: "Diploma", name_hi: "डिप्लोमा" },
  { value: "Other", label: "Other", name_hi: "अन्य" },
];

const addressTypeOptions = [
  { name: "CURRENT", name_hi: "वर्तमान पता" },
  { name: "PERMANENT", name_hi: "स्थायी पता" },
  { name: "HOME", name_hi: "मूल निवास" },
];

const BasicInfoSection = ({ onUpdate }) => {
  const { user, setUser } = useAuth();
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressType, setSelectedAddressType] = useState([]);
  const [editingAddress, setEditingAddress] = useState(null);
  const [occupation, setOccupation] = useState(user?.occupation || "student");
  const [education, setEducation] = useState(user?.education_level || "OTHER");
  const [dob, setDob] = useState(user?.dob || "");

  // Format user data for form
  const formatUserData = (user) => ({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    dob: user?.dob || "",
    father: user?.father || "",
    mother: user?.mother || "",
    email: user?.email || "",
    mobile: user?.mobile || "",
    occupation: user?.occupation || "student",
    education_level: user?.education_level || "",
  });

  const handleSubmit = async (values) => {
    try {
      const submitData = {
        ...values,
        education_level: education,
        occupation: occupation,
        dob: dob || values.dob,
      };

      const response = await updateUserProfile(user.id, submitData);

      setUser({
        ...user,
        ...submitData,
      });
      setIsEditing(false);
      Toast.show({
        content: "Profile updated successfully",
        icon: "success",
        position: "center",
      });
    } catch (error) {
      Toast.show({
        content: "Failed to update profile",
        icon: "fail",
        position: "center",
      });
    }
  };

  const handleCancel = () => {
    const userData = formatUserData(user);
    form.setFieldsValue(userData);
    setDob(userData.dob);
    setOccupation(userData.occupation);
    setIsEditing(false);
  };

  const fetchAddresses = async () => {
    try {
      const res = await fetchUserAddresses(user?.id);
      setAddresses(res?.addresses || []);
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
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
          fetchAddresses();
        } catch (error) {
          Toast.show({ content: "Failed to delete address", icon: "fail" });
        }
      },
    });
  };

  const handleAddAddress = () => {
    if (selectedAddressType.length === 0) {
      Toast.show({
        content: "Please select an address type first",
        icon: "fail",
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

  const handleAddressSaved = () => {
    fetchAddresses();
    setShowAddressModal(false);
    setEditingAddress(null);
    setSelectedAddressType([]);
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

  const getEducationDisplay = (educationValue) => {
    const option = educationOptions.find(
      (opt) => opt.value === educationValue
    );

    return option
      ? `${option.name_hi} (${option.label})`
      : educationValue || "Not set";
  };

  const getOccupationDisplay = (occupationValue) => {
    const option = occupationOptions.find(
      (opt) => opt.value === occupationValue
    );
    return option
      ? `${option.name_hi} (${option.label})`
      : occupationValue || "Not set";
  };

  useEffect(() => {
    if (user) {
      const userData = formatUserData(user);
      form.setFieldsValue(userData);
      setOccupation(userData.occupation);
      setDob(userData.dob);
      fetchAddresses();
    }
  }, [user, form]);

  if (!isEditing) {
    return (
      <div
        style={{
          backgroundColor: "#fef6f0",
          minHeight: "100vh",
        }}
      >
        {/* Basic Info Card */}
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
              👤 मुख्य जानकारी
            </div>
          }
          style={{
            marginBottom: "16px",
            borderRadius: "12px",
            border: "1px solid #fed7aa",
            backgroundColor: "#f5e7db",
          }}
        >
          <Grid columns={2} gap={8}>
            <Grid.Item>
              <div
                style={{
                  backgroundColor: "#fff7ed",
                  borderRadius: "8px",
                  padding: "12px",
                  border: "1px solid #fed7aa",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    color: "#9a3412",
                    marginBottom: "6px",
                    textTransform: "uppercase",
                  }}
                >
                  आपका नाम
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#3f3f46",
                    wordBreak: "break-word",
                  }}
                >
                  {user?.first_name || "Not set"}
                </div>
              </div>
            </Grid.Item>

            <Grid.Item>
              <div
                style={{
                  backgroundColor: "#fff7ed",
                  borderRadius: "8px",
                  padding: "12px",
                  border: "1px solid #fed7aa",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    color: "#9a3412",
                    marginBottom: "6px",
                    textTransform: "uppercase",
                  }}
                >
                  उप नाम
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#3f3f46",
                    wordBreak: "break-word",
                  }}
                >
                  {user?.last_name || "Not set"}
                </div>
              </div>
            </Grid.Item>

            <Grid.Item>
              <div
                style={{
                  backgroundColor: "#fff7ed",
                  borderRadius: "8px",
                  padding: "12px",
                  border: "1px solid #fed7aa",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    color: "#9a3412",
                    marginBottom: "6px",
                    textTransform: "uppercase",
                  }}
                >
                  पिताजी का नाम
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#3f3f46",
                    wordBreak: "break-word",
                  }}
                >
                  {user?.father || "Not set"}
                </div>
              </div>
            </Grid.Item>

            <Grid.Item>
              <div
                style={{
                  backgroundColor: "#fff7ed",
                  borderRadius: "8px",
                  padding: "12px",
                  border: "1px solid #fed7aa",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    color: "#9a3412",
                    marginBottom: "6px",
                    textTransform: "uppercase",
                  }}
                >
                  माताजी का नाम
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#3f3f46",
                    wordBreak: "break-word",
                  }}
                >
                  {user?.mother || "Not set"}
                </div>
              </div>
            </Grid.Item>

            <Grid.Item span={2}>
              <div
                style={{
                  backgroundColor: "#fff7ed",
                  borderRadius: "8px",
                  padding: "12px",
                  border: "1px solid #fed7aa",
                }}
              >
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    color: "#9a3412",
                    marginBottom: "6px",
                    textTransform: "uppercase",
                  }}
                >
                  ईमेल
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#3f3f46",
                    wordBreak: "break-word",
                  }}
                >
                  {user?.email || "Not set"}
                </div>
              </div>
            </Grid.Item>

            <Grid.Item>
              <div
                style={{
                  backgroundColor: "#fff7ed",
                  borderRadius: "8px",
                  padding: "12px",
                  border: "1px solid #fed7aa",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    color: "#9a3412",
                    marginBottom: "6px",
                    textTransform: "uppercase",
                  }}
                >
                  शिक्षा
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#3f3f46",
                    wordBreak: "break-word",
                  }}
                >
                  {getEducationDisplay(user?.education_level)}
                </div>
              </div>
            </Grid.Item>

            <Grid.Item>
              <div
                style={{
                  backgroundColor: "#fff7ed",
                  borderRadius: "8px",
                  padding: "12px",
                  border: "1px solid #fed7aa",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    color: "#9a3412",
                    marginBottom: "6px",
                    textTransform: "uppercase",
                  }}
                >
                  मोबाइल
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#3f3f46",
                    wordBreak: "break-word",
                  }}
                >
                  {user?.mobile || "Not set"}
                </div>
              </div>
            </Grid.Item>

            <Grid.Item>
              <div
                style={{
                  backgroundColor: "#fff7ed",
                  borderRadius: "8px",
                  padding: "12px",
                  border: "1px solid #fed7aa",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    color: "#9a3412",
                    marginBottom: "6px",
                    textTransform: "uppercase",
                  }}
                >
                  व्यवसाय
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#3f3f46",
                    wordBreak: "break-word",
                  }}
                >
                  {getOccupationDisplay(user?.occupation)}
                </div>
              </div>
            </Grid.Item>

            <Grid.Item>
              <div
                style={{
                  backgroundColor: "#fff7ed",
                  borderRadius: "8px",
                  padding: "12px",
                  border: "1px solid #fed7aa",
                }}
              >
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    color: "#9a3412",
                    marginBottom: "6px",
                    textTransform: "uppercase",
                  }}
                >
                  जन्म तारीख
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#3f3f46",
                    wordBreak: "break-word",
                  }}
                >
                  {user?.dob || "Not set"}
                </div>
              </div>
            </Grid.Item>
          </Grid>

          <Button
            block
            onClick={() => setIsEditing(true)}
            style={{
              marginTop: "16px",
              backgroundColor: "#f97316",
              border: "none",
              borderRadius: "8px",
              height: "44px",
              fontSize: "14px",
              fontWeight: "600",
              color: "#ffffff",
            }}
          >
            ✏️ Edit Profile
          </Button>
        </Card>

        {/* Addresses Section */}
        <Card
          title={
            <div
              style={{
                color: "#7c2d12",
                fontSize: "16px",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              📍 पता: वर्तमान/मूल निवास के लिए सेलेक्ट करे
            </div>
          }
          style={{
            borderRadius: "12px",
            border: "1px solid #fed7aa",
            backgroundColor: "#f5e7db",
          }}
        >
          {/* Address Type Selector */}
          <div style={{ marginBottom: "16px" }}>
            <div
              style={{
                fontSize: "13px",
                fontWeight: "600",
                color: "#9a3412",
                marginBottom: "8px",
              }}
            >
              पता प्रकार चुनें (Select Address Type):
            </div>
            <div
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <Select
                placeholder="पता प्रकार चुनें"
                options={addressTypeOptions.map((option) => ({
                  value: option.name,
                  label: `${option.name_hi} (${option.name})`,
                }))}
                value={selectedAddressType}
                onChange={setSelectedAddressType}
                style={{
                  width: "200px",
                  borderRadius: "6px",
                  border: "1px solid #fed7aa",
                  backgroundColor: "#fff7ed",
                }}
              />
              <Button
                onClick={handleAddAddress}
                style={{
                  backgroundColor: "#f97316",
                  border: "none",
                  borderRadius: "6px",
                  color: "#ffffff",
                  fontSize: "12px",
                  fontWeight: "500",
                  height: "32px",
                  padding: "0 16px",
                }}
              >
                + यहां क्लिक करे
              </Button>
            </div>
          </div>

          {/* Address Cards */}
          <Space direction="vertical" block>
            {addresses.map((address) => (
              <Card
                key={address.id}
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "8px",
                  }}
                >
                  <span
                    style={{
                      backgroundColor: getAddressTypeColor(address.addresstype),
                      color: "#ffffff",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "10px",
                      fontWeight: "600",
                      textTransform: "uppercase",
                    }}
                  >
                    {address.addresstype}
                  </span>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button
                      onClick={() => handleEditAddress(address)}
                      style={{
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "11px",
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
                      onClick={() => handleDeleteAddress(address.id)}
                      style={{
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "11px",
                        fontWeight: "500",
                        border: "none",
                        cursor: "pointer",
                        backgroundColor: "#b91c1c",
                        color: "#ffffff",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    color: "#3f3f46",
                    lineHeight: "1.4",
                  }}
                >
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
            ))}

            {addresses.length === 0 && (
              <Card
                style={{
                  textAlign: "center",
                  padding: "24px",
                  backgroundColor: "#ffffff",
                  borderRadius: "8px",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                  color: "#6b7280",
                  border: "2px dashed #d1d5db",
                }}
              >
                <div style={{ fontSize: "16px", marginBottom: "8px" }}>📍</div>
                <div style={{ fontWeight: "500", marginBottom: "4px" }}>
                  No addresses added yet
                </div>
                <div style={{ fontSize: "12px" }}>
                  Select an address type above and tap "Add" to create your
                  first address
                </div>
              </Card>
            )}
          </Space>
        </Card>

        {/* Address Modal */}
        <AddressModal
          visible={showAddressModal}
          onClose={() => {
            setShowAddressModal(false);
            setEditingAddress(null);
            setSelectedAddressType([]);
          }}
          addressType={selectedAddressType}
          typeKey="user"
          typeId={user?.id}
          initialAddress={editingAddress}
          onAddressSaved={handleAddressSaved}
        />
      </div>
    );
  }

  // Edit Form
  return (
    <div
      style={{
        backgroundColor: "#fef6f0",
        minHeight: "100vh",
      }}
    >
      <Card
        title={
          <div
            style={{
              textAlign: "center",
              backgroundColor: "#f97316",
              color: "#ffffff",
              padding: "12px",
              borderRadius: "8px",
              fontSize: "18px",
              fontWeight: "600",
            }}
          >
            ✏️ Edit Profile
          </div>
        }
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={formatUserData(user)}
        >
          <Grid columns={2} gap={0}>
            <Grid.Item>
              <Form.Item
                name="first_name"
                label={
                  <span
                    style={{
                      color: "#9a3412",
                      fontSize: "13px",
                      fontWeight: "600",
                    }}
                  >
                    First Name *
                  </span>
                }
                rules={[{ required: true, message: "First name is required" }]}
              >
                <Input
                  placeholder="Enter first name"
                  style={{
                    borderRadius: "6px",
                    border: "1px solid #fed7aa",
                    backgroundColor: "#fff7ed",
                  }}
                />
              </Form.Item>
            </Grid.Item>

            <Grid.Item>
              <Form.Item
                name="last_name"
                label={
                  <span
                    style={{
                      color: "#9a3412",
                      fontSize: "13px",
                      fontWeight: "600",
                    }}
                  >
                    Last Name *
                  </span>
                }
                rules={[{ required: true, message: "Last name is required" }]}
              >
                <Input
                  placeholder="Enter last name"
                  style={{
                    borderRadius: "6px",
                    border: "1px solid #fed7aa",
                    backgroundColor: "#fff7ed",
                  }}
                />
              </Form.Item>
            </Grid.Item>

            <Grid.Item>
              <Form.Item
                name="father"
                label={
                  <span
                    style={{
                      color: "#9a3412",
                      fontSize: "13px",
                      fontWeight: "600",
                    }}
                  >
                    Father's Name
                  </span>
                }
              >
                <Input
                  placeholder="Enter father's name"
                  style={{
                    borderRadius: "6px",
                    border: "1px solid #fed7aa",
                    backgroundColor: "#fff7ed",
                  }}
                />
              </Form.Item>
            </Grid.Item>

            <Grid.Item>
              <Form.Item
                name="mother"
                label={
                  <span
                    style={{
                      color: "#9a3412",
                      fontSize: "13px",
                      fontWeight: "600",
                    }}
                  >
                    Mother's Name
                  </span>
                }
              >
                <Input
                  placeholder="Enter mother's name"
                  style={{
                    borderRadius: "6px",
                    border: "1px solid #fed7aa",
                    backgroundColor: "#fff7ed",
                  }}
                />
              </Form.Item>
            </Grid.Item>

            <Grid.Item span={2}>
              <Form.Item
                name="email"
                label={
                  <span
                    style={{
                      color: "#9a3412",
                      fontSize: "13px",
                      fontWeight: "600",
                    }}
                  >
                    Email Address
                  </span>
                }
              >
                <Input
                  placeholder="Enter email address"
                  style={{
                    borderRadius: "6px",
                    border: "1px solid #fed7aa",
                    backgroundColor: "#fff7ed",
                  }}
                />
              </Form.Item>
            </Grid.Item>

            <Grid.Item>
              <Form.Item
                name="mobile"
                label={
                  <span
                    style={{
                      color: "#9a3412",
                      fontSize: "13px",
                      fontWeight: "600",
                    }}
                  >
                    Mobile Number
                  </span>
                }
                rules={[
                  {
                    pattern: /^[0-9]{10}$/,
                    message: "Enter a valid 10-digit mobile number",
                  },
                ]}
              >
                <Input
                  placeholder="Enter 10-digit mobile number"
                  type="tel"
                  style={{
                    borderRadius: "6px",
                    border: "1px solid #fed7aa",
                    backgroundColor: "#fff7ed",
                  }}
                />
              </Form.Item>
            </Grid.Item>


            <Grid.Item>
              <Form.Item
                name="education_level"
                label={
                  <span
                    style={{
                      color: "#9a3412",
                      fontSize: "13px",
                      fontWeight: "600",
                    }}
                  >
                    शिक्षा/education
                  </span>
                }
              >
                <Select
                  placeholder="शिक्षा / education"
                  value={education}
                  onChange={setEducation}
                  style={{
                    width: "100%",
                    borderRadius: "6px",
                  }}
                >
                  {educationOptions.map((option) => (
                    <Select.Option key={option.value} value={option.value}>
                      {option.name_hi} ({option.label})
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Grid.Item>



            <Grid.Item>
              <Form.Item
                name="occupation"
                label={
                  <span
                    style={{
                      color: "#9a3412",
                      fontSize: "13px",
                      fontWeight: "600",
                    }}
                  >
                    व्यवसाय/नौकरी
                  </span>
                }
              >
                <Select
                  placeholder="व्यवसाय/ नौकरी / Occupation"
                  value={occupation}
                  onChange={setOccupation}
                  style={{
                    width: "100%",
                    borderRadius: "6px",
                  }}
                >
                  {occupationOptions.map((option) => (
                    <Select.Option key={option.value} value={option.value}>
                      {option.name_hi} ({option.label})
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Grid.Item>

            <Grid.Item >
              <Form.Item
                name="dob"
                label={
                  <span
                    style={{
                      color: "#9a3412",
                      fontSize: "13px",
                      fontWeight: "600",
                    }}
                  >
                    Date of Birth
                  </span>
                }
              >
                <DateSelector
                  fieldKey="dob"
                  customdata={dob}
                  setCustomdata={setDob}
                  setFormData={(values) => form.setFieldsValue(values)}
                  displayFormat="DD-MM-YYYY"
                />
              </Form.Item>
            </Grid.Item>
          </Grid>

          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "24px",
            }}
          >
            <Button
              onClick={handleCancel}
              style={{
                flex: 1,
                height: "44px",
                borderRadius: "8px",
                border: "1px solid #f97316",
                backgroundColor: "transparent",
                color: "#f97316",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              style={{
                flex: 1,
                height: "44px",
                borderRadius: "8px",
                backgroundColor: "#f97316",
                border: "none",
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              💾 Save
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default BasicInfoSection;
