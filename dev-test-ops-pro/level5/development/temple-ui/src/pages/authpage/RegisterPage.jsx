import { Button, Input, NavBar, Radio, Space, Toast } from "antd-mobile";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Form, Select } from "antd";
import { AuthContext } from "../../contexts/AuthContext";
import TempleSelect from "./TempleSelect";
import {
  getStoredTempleData,
  markTempleIdAsUsed,
  clearStoredTempleId,
} from "../../DeepLinkHandler";
import { customRegister } from "../../services/auth";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { getGotraData } from "../../services/gotra";
import dayjs from "dayjs";
import calculateAge from "../../utils/calculateAge";
import { getTempleById } from "../../services/temple";

const professionsList = [
  { name: "STUDENT", name_hi: "छात्र" },
  { name: "JOB", name_hi: "नौकरी" },
  { name: "BUSINESS", name_hi: "व्यवसाय" },
  { name: "FACULTY", name_hi: "शिक्षक" },
  { name: "FACTORY", name_hi: "कारखाना" },
  { name: "CULSENTENCY", name_hi: "सलाहकार" },
  { name: "CONTRACTOR", name_hi: "ठेकेदार" },
  { name: "COMPANY", name_hi: "कंपनी" },
  { name: "AGRICULTURE", name_hi: "कृषि" },
  { name: "HOUSEWIFE", name_hi: "गृहिणी" },
  { name: "BEROJGAR", name_hi: "बेरोजगार" },
  { name: "SCIENTIST", name_hi: "वैज्ञानिक" },
  { name: "POET", name_hi: "कवि" },
  { name: "ARTIST", name_hi: "कलाकार" },
  { name: "WRITER", name_hi: "लेखक" },
  { name: "ACTOR", name_hi: "अभिनेता" },
  { name: "DANCER", name_hi: "नर्तक" },
  { name: "MUSIC", name_hi: "संगीतकार" },
  { name: "KATHAVACHAK", name_hi: "कथावाचक" },
  { name: "DISTRIBUTOR", name_hi: "वितरक" },
  { name: "SUPPLIER", name_hi: "आपूर्तिकर्ता" },
  { name: "RETIRED", name_hi: "सेवानिवृत्त" },
  { name: "KHETI", name_hi: "खेती" },
  { name: "OTHER", name_hi: "अन्य" },
];

const maritalOptions = [
  { value: "MARRIED", label: "Married", name_hi: "विवाहित" },
  { value: "SINGLE", label: "Unmarried", name_hi: "अविवाहित" },
  { value: "OTHER", label: "Other", name_hi: "अन्य" },
];

const RegisterPage = ({ extraData }) => {
  const [form] = Form.useForm();
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  
  // Password visibility
  const [passwordVisible, setPasswordVisible] = useState(false);
  
  // Temple selection
  const [selectedTempleId, setSelectedTempleId] = useState(null);
  const [showTempleSelect, setShowTempleSelect] = useState(false);
  
  // Gotra data
  const [gotra, setGotra] = useState([]);
  
  // Age and DOB handling
  const [age, setAge] = useState("");
  const [dob, setDob] = useState("");
  const [customdata, setCustomdata] = useState({});
  
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const location = useLocation();
  
  // Family and registration type
  const storedFamilyId = localStorage.getItem("familyId");
  const registerType = location.state?.registerType;
  
  // URL parameters
  const searchParams = new URLSearchParams(location.search);
  const orgidFromURL = searchParams.get("orgid");
  const templeIdFromURL = searchParams.get("templeId");
  const orgidFromStorage = localStorage.getItem("ref_orgid");

  // Deep link data (preserve from new code)
  const deepLinkData = getStoredTempleData();
  const deepLinkTempleId = deepLinkData?.templeId;
  const isFromDeepLink = deepLinkData && !deepLinkData.used;
  const isTempleIdLocked = Boolean(isFromDeepLink);

  // Temple ID logic (from new code)
  const templeId = useMemo(() => {
    if (isFromDeepLink && deepLinkTempleId) {
      setShowTempleSelect(false);
      return deepLinkTempleId;
    }
    if (selectedTempleId) {
      setShowTempleSelect(false);
      return selectedTempleId;
    }
    if (templeIdFromURL) {
      return templeIdFromURL;
    }
    const fallbackTempleId =
      orgidFromURL ||
      orgidFromStorage ||
      extraData?.templeId ||
      id ||
      user?.temples?.[0]?.id;

    if (fallbackTempleId) {
      return fallbackTempleId;
    }
    setShowTempleSelect(true);
    return null;
  }, [
    isFromDeepLink,
    deepLinkTempleId,
    selectedTempleId,
    templeIdFromURL,
    orgidFromURL,
    orgidFromStorage,
    extraData?.templeId,
    id,
    user,
  ]);

  // User status and created by logic
  let userstatus = extraData?.userstatus || "PENDING";
  const createdby = extraData?.createdby || user?.id || null;

  // Fetch gotra data based on temple ID (from new code)
  // useEffect(() => {
  //   const fetchGotraData = async (templeId) => {
  //     try {
  //       const response = await getTempleById(templeId)
  //       console.log("Response for gotra fetch:", response);
  //       console.log("temple res",response?.data?.attributes?.gotra?.data?.attributes.gotra_data?.Gotra )
  //       setGotra(response?.data?.attributes?.gotra?.data?.attributes.gotra_data?.Gotra || []);
  //     } catch (err) {
  //       Toast.show({
  //         icon: "fail",
  //         content: "Failed to load gotra data",
  //       });
  //     }
  //   };

  //   if (deepLinkTempleId || selectedTempleId || templeId) {
  //     fetchGotraData(deepLinkTempleId || selectedTempleId || templeId);
  //   }
  // }, [deepLinkTempleId, selectedTempleId, templeId]);

  useEffect(() => {
    if (orgidFromStorage) {
      localStorage.removeItem("ref_orgid");
    }
  }, [orgidFromStorage]);

  // // Handle temple selection (from new code with gotra refetch)
  // const handleTempleSelect = async (value) => {
  //   setSelectedTempleId(value);
  //   setShowTempleSelect(false);
  //   // Reset gotra form field
  //   form.setFieldsValue({ gotra: undefined });
  //   // Refetch gotra data for the new temple ID
  //   try {
  //     const response = await getTempleById(value)
  //     setGotra(response?.data?.attributes?.gotra?.data?.attributes.gotra_data?.Gotra || []);
  //   } catch (err) {
  //     Toast.show({
  //       icon: "fail",
  //       content: "Failed to load gotra data",
  //     });
  //   }
  // };

  // Age and DOB handling functions (from old code)
  const calculateDob = (ageValue) => {
    if (!ageValue || isNaN(ageValue)) return "";
    const birthYear = dayjs().year() - parseInt(ageValue);
    return dayjs().year(birthYear).format("YYYY-MM-DD");
  };

  const handleAgeChange = (value) => {
    const newAge = value;
    const calculatedDob = calculateDob(newAge);

    setAge(newAge);
    setDob(calculatedDob);

    form.setFieldsValue({
      age: newAge,
      dob: calculatedDob ? dayjs(calculatedDob) : null,
    });

    setCustomdata((prev) => ({
      ...prev,
      age: newAge,
      dob: calculatedDob,
    }));
  };

  useEffect(() => {
    if (customdata?.dob) {
      setDob(customdata.dob);
      setAge(calculateAge(customdata.dob));
    } else if (customdata?.age) {
      setAge(customdata.age);
      setDob(calculateDob(customdata.age));
    }
  }, [customdata?.dob, customdata?.age]);

  // Generate random string function (from old code)
  function generateRandomString(length = 5) {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      result += chars[randomIndex];
    }
    return result;
  }

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
    warning: "#faad14",
  };

  const handleSubmit = () => {
    if (!privacyChecked) {
      Toast.show({
        icon: "fail",
        content: (
          <div>
            <div>You must accept the privacy policy to continue</div>
            <div>जारी रखने के लिए आपको गोपनीयता नीति स्वीकार करनी होगी</div>
          </div>
        ),
      });
      return;
    }
    form.submit();
  };

  // Enhanced onFinish with family creation logic (merged from both)
  const onFinish = async (values) => {
    if (loading || isDisabled) return;
    
    // if (!templeId) {
    //   Toast.show({
    //     icon: "fail",
    //     content: "Please select a temple before proceeding",
    //   });
    //   return;
    // }

    try {
      setLoading(true);
      setIsDisabled(true);
      
      // Generate random email
      const randomTwoDigitNumber = Math.floor(Math.random() * 90) + 10;
      values["email"] = randomTwoDigitNumber + values.mobile + "@hph.com";
      
      const userPayload = {
        ...values,
        username: values.mobile,
        role: 1,
        userstatus: userstatus,
        createdby: createdby,
        // temples: templeId ? [Number(templeId)] : [],
        userrole: "USER",
        // gotra: values.gotra,
        profession: values.profession,
        marital_status: values.marital_status,
        age: age || calculateAge(dob),
        dob: dob,
      };

      // Family creation logic (from old code)
      if (registerType === "FAMILY" && storedFamilyId) {
        // Case 1: User registering into existing family
        userPayload.familyId = Number(storedFamilyId);
        userPayload.createdby = user?.id;
        userPayload.userstatus = "APPROVED"; // Family members are approved
      } else {
        // Case 2: Create new family
        const familyId = generateRandomString(5);
        userPayload.family_name = userPayload.gotra
          ? `${values?.first_name}-${values?.father}-${userPayload.gotra}`
          : familyId;
      }

      await customRegister(userPayload);

      // Clean up deep link data (from new code)
      // if (deepLinkTempleId) {
      //   localStorage.removeItem("deep_link_templeId");
      //   markTempleIdAsUsed();
      // }

      Toast.show({
        icon: "success",
        content: "Registration successful",
      });
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);
      Toast.show({
        icon: "fail",
        content: err.message || "Registration failed",
      });
    } finally {
      setLoading(false);
      setIsDisabled(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: warmColors.background,
        position: "relative",
      }}
    >
      {/* Subtle background pattern */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `radial-gradient(circle at 25% 25%, ${warmColors.primary}06 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, ${warmColors.accent}06 0%, transparent 50%)`,
          pointerEvents: "none",
        }}
      />

      {storedFamilyId && (
        <NavBar
          style={{
            backgroundColor: warmColors.primary,
            color: "white",
            "--adm-color-text": "white",
          }}
          onBack={() => navigate(-1)}
        >
          GO BACK
        </NavBar>
      )}

      <div style={{ padding: "24px 16px", position: "relative", zIndex: 1 }}>
        {/* Header Section */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div
            style={{
              width: "80px",
              height: "80px",
              background: `linear-gradient(135deg, ${warmColors.primary} 0%, ${warmColors.secondary} 100%)`,
              borderRadius: "20px",
              margin: "0 auto 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 8px 24px ${warmColors.primary}30`,
              overflow: "hidden",
            }}
          >
            <img
              src="/logo.svg"
              alt="Emeelan Logo"
              style={{
                width: "50px",
                height: "50px",
                objectFit: "contain",
              }}
              onError={(e) => {
                e.target.style.display = "none";
                e.target.parentElement.innerHTML =
                  '<span style="fontSize: 32px; color: white">🏠</span>';
              }}
            />
          </div>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "700",
              color: warmColors.textPrimary,
              marginBottom: "8px",
              lineHeight: "1.2",
            }}
          >
            <span
              style={{
                fontSize: "32px",
                background: `linear-gradient(135deg, ${warmColors.primary} 0%, ${warmColors.secondary} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              सीरवी समाज
            </span>
          </h1>
          <p
            style={{
              color: warmColors.textSecondary,
              fontSize: "16px",
              fontWeight: "400",
            }}
          >
            सीरवी समाज में आपका स्वागत है
            {storedFamilyId ? " as a family member" : ""}
          </p>
        </div>

        {/* Temple Selection Section */}
       
        {/* Show selected temple info */}
        {templeId && !showTempleSelect && (
          <div
            style={{
              backgroundColor: warmColors.cardBg,
              borderRadius: "16px",
              padding: "16px",
              marginBottom: "24px",
              border: `1px solid ${warmColors.accent}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <p
                style={{
                  color: warmColors.textSecondary,
                  fontSize: "14px",
                  margin: 0,
                }}
              >
                Selected Temple:
              </p>
              <p
                style={{
                  color: warmColors.primary,
                  fontSize: "16px",
                  fontWeight: "600",
                  margin: 0,
                }}
              >
                Temple ID: {templeId}
                {isTempleIdLocked && (
                  <span
                    style={{
                      fontSize: "12px",
                      color: warmColors.warning,
                      fontWeight: "normal",
                      marginLeft: "8px",
                    }}
                  >
                    (From Invitation Link)
                  </span>
                )}
              </p>
            </div>

            {/* <div style={{ display: "flex", gap: "8px" }}>
              {!isTempleIdLocked && (
                <Button
                  size="small"
                  color="primary"
                  fill="outline"
                  onClick={() => {
                    setSelectedTempleId(null);
                    setShowTempleSelect(true);
                  }}
                  style={{
                    "--border-color": warmColors.primary,
                    color: warmColors.primary,
                  }}
                >
                  Change
                </Button>
              )}

              {isTempleIdLocked && (
                <Button
                  size="small"
                  color="danger"
                  fill="outline"
                  onClick={() => {
                    clearStoredTempleId(); // Clear deep link data
                    setSelectedTempleId(null);
                    setShowTempleSelect(true);
                    // Reset gotra
                    form.setFieldsValue({ gotra: undefined });
                    setGotra([]);
                  }}
                >
                  Remove Link
                </Button>
              )}
            </div> */}
          </div>
        )}


        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            gender: "Male",
          }}
          style={{ display: "flex", flexDirection: "column", gap: "24px" }}
        >
          <div
            style={{
              backgroundColor: warmColors.cardBg,
              borderRadius: "24px",
              padding: "24px",
              boxShadow: "0 8px 32px rgba(139, 69, 19, 0.12)",
              border: `1px solid ${warmColors.border}`,
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "600",
                color: warmColors.primary,
                marginBottom: "4px",
              }}
            >
              Personal Information
            </h2>

            <Form.Item
              name="first_name"
              label={
                <span
                  style={{ color: warmColors.textPrimary, fontWeight: "500" }}
                >
                  आपका नाम
                </span>
              }
              rules={[
                { required: true, message: "Please enter your first name" },
              ]}
            >
              <Input
                placeholder="Enter your first name"
                style={{
                  "--border-radius": "16px",
                  "--border": `2px solid ${warmColors.border}`,
                  "--background-color": warmColors.background,
                  "--padding-left": "16px",
                  "--padding-right": "16px",
                  "--font-size": "16px",
                  height: "52px",
                  "--placeholder-color": warmColors.textSecondary,
                  "--color": warmColors.textPrimary,
                }}
                onFocus={(e) => {
                  e.target.style.setProperty(
                    "--border",
                    `2px solid ${warmColors.primary}`
                  );
                  e.target.style.setProperty(
                    "--background-color",
                    warmColors.cardBg
                  );
                }}
                onBlur={(e) => {
                  e.target.style.setProperty(
                    "--border",
                    `2px solid ${warmColors.border}`
                  );
                  e.target.style.setProperty(
                    "--background-color",
                    warmColors.background
                  );
                }}
              />
            </Form.Item>

            <Form.Item
              name="father"
              label={
                <span
                  style={{ color: warmColors.textPrimary, fontWeight: "500" }}
                >
                  पिताजी का नाम
                </span>
              }
            >
              <Input
                placeholder="Enter father name"
                style={{
                  "--border-radius": "16px",
                  "--border": `2px solid ${warmColors.border}`,
                  "--background-color": warmColors.background,
                  "--padding-left": "16px",
                  "--padding-right": "16px",
                  "--font-size": "16px",
                  height: "52px",
                  "--placeholder-color": warmColors.textSecondary,
                  "--color": warmColors.textPrimary,
                }}
                onFocus={(e) => {
                  e.target.style.setProperty(
                    "--border",
                    `2px solid ${warmColors.primary}`
                  );
                  e.target.style.setProperty(
                    "--background-color",
                    warmColors.cardBg
                  );
                }}
                onBlur={(e) => {
                  e.target.style.setProperty(
                    "--border",
                    `2px solid ${warmColors.border}`
                  );
                  e.target.style.setProperty(
                    "--background-color",
                    warmColors.background
                  );
                }}
              />
            </Form.Item>

            <Form.Item
              name="age"
              label={
                <span
                  style={{ color: warmColors.textPrimary, fontWeight: "500" }}
                >
                  आयु (Age)
                </span>
              }
              rules={[
                {
                  pattern: /^[0-9]{1,3}$/,
                  message: "Enter a valid age (1-999)",
                },
              ]}
            >
              <Input
                placeholder="Enter your age"
                type="number"
                value={age}
                onChange={handleAgeChange}
                style={{
                  "--border-radius": "16px",
                  "--border": `2px solid ${warmColors.border}`,
                  "--background-color": warmColors.background,
                  "--padding-left": "16px",
                  "--padding-right": "16px",
                  "--font-size": "16px",
                  height: "52px",
                  "--placeholder-color": warmColors.textSecondary,
                  "--color": warmColors.textPrimary,
                }}
                onFocus={(e) => {
                  e.target.style.setProperty(
                    "--border",
                    `2px solid ${warmColors.primary}`
                  );
                  e.target.style.setProperty(
                    "--background-color",
                    warmColors.cardBg
                  );
                }}
                onBlur={(e) => {
                  e.target.style.setProperty(
                    "--border",
                    `2px solid ${warmColors.border}`
                  );
                  e.target.style.setProperty(
                    "--background-color",
                    warmColors.background
                  );
                }}
                min="1"
                max="120"
              />
            </Form.Item>

            <Form.Item
              name="gender"
              label={
                <span
                  style={{ color: warmColors.textPrimary, fontWeight: "500" }}
                >
                  लिंग (Gender)
                </span>
              }
            >
              <Radio.Group>
                <div style={{ display: "flex", gap: "32px" }}>
                  <Radio
                    value="Male"
                    style={{
                      color: warmColors.textPrimary,
                      "--adm-color-primary": warmColors.primary,
                    }}
                  >
                    पुरुष
                  </Radio>
                  <Radio
                    value="Female"
                    style={{
                      color: warmColors.textPrimary,
                      "--adm-color-primary": warmColors.primary,
                    }}
                  >
                    महिला
                  </Radio>
                </div>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              name="mobile"
              label={
                <span
                  style={{ color: warmColors.textPrimary, fontWeight: "500" }}
                >
                  मोबाइल
                </span>
              }
              rules={[
                { required: true, message: "Please enter your mobile number" },
                {
                  pattern: /^[0-9]{10}$/,
                  message: "Enter 10 digit mobile number",
                },
              ]}
            >
              <Input
                placeholder="Enter mobile number"
                type="tel"
                style={{
                  "--border-radius": "16px",
                  "--border": `2px solid ${warmColors.border}`,
                  "--background-color": warmColors.background,
                  "--padding-left": "16px",
                  "--padding-right": "16px",
                  "--font-size": "16px",
                  height: "52px",
                  "--placeholder-color": warmColors.textSecondary,
                  "--color": warmColors.textPrimary,
                }}
                onFocus={(e) => {
                  e.target.style.setProperty(
                    "--border",
                    `2px solid ${warmColors.primary}`
                  );
                  e.target.style.setProperty(
                    "--background-color",
                    warmColors.cardBg
                  );
                }}
                onBlur={(e) => {
                  e.target.style.setProperty(
                    "--border",
                    `2px solid ${warmColors.border}`
                  );
                  e.target.style.setProperty(
                    "--background-color",
                    warmColors.background
                  );
                }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={
                <span
                  style={{ color: warmColors.textPrimary, fontWeight: "500" }}
                >
                  पासवर्ड
                </span>
              }
              rules={[
                { required: true, message: "Please enter your password" },
                { min: 6, message: "Password must be at least 6 characters" },
              ]}
            >
              <div style={{ position: "relative" }}>
                <Input
                  placeholder="Create password"
                  type={passwordVisible ? "text" : "password"}
                  style={{
                    "--border-radius": "16px",
                    "--border": `2px solid ${warmColors.border}`,
                    "--background-color": warmColors.background,
                    "--padding-left": "16px",
                    "--padding-right": "50px",
                    "--font-size": "16px",
                    height: "52px",
                    "--placeholder-color": warmColors.textSecondary,
                    "--color": warmColors.textPrimary,
                  }}
                  onFocus={(e) => {
                    e.target.style.setProperty(
                      "--border",
                      `2px solid ${warmColors.primary}`
                    );
                    e.target.style.setProperty(
                      "--background-color",
                      warmColors.cardBg
                    );
                  }}
                  onBlur={(e) => {
                    e.target.style.setProperty(
                      "--border",
                      `2px solid ${warmColors.border}`
                    );
                    e.target.style.setProperty(
                      "--background-color",
                      warmColors.background
                    );
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    right: "16px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    color: warmColors.primary,
                    padding: "8px",
                    borderRadius: "8px",
                    transition: "all 0.2s ease",
                  }}
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  {passwordVisible ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                </div>
              </div>
            </Form.Item>

            {/* <Form.Item
              name="gotra"
              label={
                <span
                  style={{ color: warmColors.textPrimary, fontWeight: "500" }}
                >
                  गोत्र
                </span>
              }
              rules={[{ required: true, message: "Please select your gotra" }]}
            >
              <Select
                showSearch
                placeholder="Select Gotra"
                options={gotra.map((item) => ({
                  value: item.EName,
                  label: `${item.HName} (${item.EName})`,
                }))}
                style={{
                  height: "52px",
                  borderRadius: "16px",
                }}
              />
            </Form.Item> */}

            <Form.Item
              name="marital_status"
              label={
                <span
                  style={{ color: warmColors.textPrimary, fontWeight: "500" }}
                >
                  वैवाहिक स्थिति
                </span>
              }
            >
              <Select
                placeholder="Select marital status"
                style={{ height: "52px", borderRadius: "16px" }}
              >
                {maritalOptions.map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.name_hi} ({option.label})
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="profession"
              label={
                <span
                  style={{ color: warmColors.textPrimary, fontWeight: "500" }}
                >
                  व्यवसाय
                </span>
              }
            >
              {professionsList.length > 0 ? (
                <Select
                  showSearch
                  placeholder="Select profession"
                  options={professionsList.map((item) => ({
                    value: item.name,
                    label: `${item.name_hi} (${item.name})`,
                  }))}
                  style={{
                    height: "52px",
                    borderRadius: "16px",
                  }}
                />
              ) : (
                <Button
                  loading
                  block
                  disabled
                  style={{
                    color: warmColors.textSecondary,
                    "--background-color": warmColors.background,
                    "--border-color": warmColors.border,
                    height: "52px",
                    borderRadius: "16px",
                  }}
                >
                  Loading professions...
                </Button>
              )}
            </Form.Item>
          </div>

          {/* Privacy Policy Checkbox */}
          <Form.Item name="privacyPolicy" valuePropName="checked">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <input
                type="checkbox"
                checked={privacyChecked}
                onChange={(e) => setPrivacyChecked(e.target.checked)}
                style={{
                  marginRight: "8px",
                  width: "16px",
                  height: "16px",
                  accentColor: warmColors.primary,
                }}
              />
              <span
                style={{ color: warmColors.textSecondary, fontSize: "14px" }}
              >
                I agree to the{" "}
                <a
                  href="https://emeelan.com/eksamaj/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: warmColors.primary,
                    textDecoration: "underline",
                  }}
                >
                  Privacy Policy
                </a>{" "}
                / मैं{" "}
                <a
                  href="https://emeelan.com/eksamaj/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: warmColors.primary,
                    textDecoration: "underline",
                  }}
                >
                  गोपनीयता नीति
                </a>{" "}
                से सहमत हूँ
              </span>
            </div>
          </Form.Item>

          {/* Submit Button */}
          <Button
            block
            color="primary"
            loading={loading}
            onClick={handleSubmit}
            disabled={isDisabled}
            style={{
              marginTop: "0",
              background: `linear-gradient(135deg, ${warmColors.primary} 0%, ${warmColors.secondary} 100%)`,
              border: "none",
              fontWeight: "600",
              borderRadius: "16px",
              height: "52px",
              fontSize: "16px",
              boxShadow: `0 6px 20px ${warmColors.primary}40`,
              transition: "all 0.3s ease",
              color: "white",
            }}
          >
            {loading ? "Processing..." : "Create Account / खाता बनाएं"}
          </Button>

          {!storedFamilyId && (
            <div
              style={{
                textAlign: "center",
                marginTop: "24px",
                color: warmColors.textSecondary,
                fontSize: "15px",
              }}
            >
              Already have an account?{" "}
              <span
                style={{
                  color: warmColors.primary,
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "color 0.2s ease",
                }}
                onClick={() => navigate("/login", { replace: true })}
                onMouseEnter={(e) =>
                  (e.target.style.color = warmColors.secondary)
                }
                onMouseLeave={(e) =>
                  (e.target.style.color = warmColors.primary)
                }
              >
                Sign In
              </span>
            </div>
          )}
        </Form>
      </div>
      <Space style={{marginBottom:"35px"}}/>
      
    </div>
  );
};

export default RegisterPage;