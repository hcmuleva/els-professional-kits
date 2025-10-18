import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { CalendarOutlined, TeamOutlined } from "@ant-design/icons";
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  Divider,
  Row,
  Col,
  Radio,
  message,
} from "antd";
import { AuthContext, useAuth } from "../../../contexts/AuthContext";
import { customRegister } from "../../../services/auth";
import { getSingleUser, updateUserProfile } from "../../../services/user";
import { updateFamily } from "../../../services/families";
import gotra from "../../../data/gotra.json"; // Assuming gotra data is in JSON format

const { Option } = Select;

// Import reused options from centralized constants (or reuse below if not separated)
const genderOptions = [
  { value: "male", label: "Male", name_hi: "पुरुष" },
  { value: "female", label: "Female", name_hi: "महिला" },
];

const maritalOptions = [
  { value: "MARRIED", label: "Married", name_hi: "विवाहित" },
  { value: "SINGLE", label: "Unmarried", name_hi: "अविवाहित" },
  { value: "other", label: "Other", name_hi: "अन्य" },
];

const relationOptions = [
  { value: "father", label: "Father", name_hi: "पिता" },
  { value: "husband", label: "Husband", name_hi: "पति" },
];

const mukhiyarelationOptions = [
  { value: "father", label: "Father", name_hi: "पिता" },
  { value: "mother", label: "Mother", name_hi: "माता" },
  { value: "husband", label: "Husband", name_hi: "पति" },
  { value: "wife", label: "Wife", name_hi: "पत्नी" },
  { value: "son", label: "Son", name_hi: "पुत्र" },
  { value: "daughter", label: "Daughter", name_hi: "पुत्री" },
  { value: "brother", label: "Brother", name_hi: "भाई" },
  { value: "sister", label: "Sister", name_hi: "बहन" },
  { value: "grandfather", label: "Grandfather", name_hi: "दादा / नाना" },
  { value: "grandmother", label: "Grandmother", name_hi: "दादी / नानी" },
  { value: "uncle", label: "Uncle", name_hi: "चाचा / मामा" },
  { value: "aunt", label: "Aunt", name_hi: "चाची / मामी" },
  {
    value: "cousin_brother",
    label: "Cousin Brother",
    name_hi: "चचेरा भाई / ममेरा भाई",
  },
  {
    value: "cousin_sister",
    label: "Cousin Sister",
    name_hi: "चचेरी बहन / ममेरी बहन",
  },
  { value: "father_in_law", label: "Father-in-law", name_hi: "ससुर" },
  { value: "mother_in_law", label: "Mother-in-law", name_hi: "सास" },
  { value: "son_in_law", label: "Son-in-law", name_hi: "दामाद" },
  { value: "daughter_in_law", label: "Daughter-in-law", name_hi: "बहू" },
  {
    value: "brother_in_law",
    label: "Brother-in-law",
    name_hi: "देवर / साला / जीजा",
  },
  {
    value: "sister_in_law",
    label: "Sister-in-law",
    name_hi: "ननद / भाभी / साली",
  },
  { value: "nephew", label: "Nephew", name_hi: "भतीजा / भांजा" },
  { value: "self", label: "Self", name_hi: "स्वयं(मुखिया)" },
  { value: "niece", label: "Niece", name_hi: "भतीजी / भांजी" },
  { value: "other", label: "Other", name_hi: "अन्य" },
];

const educationOptions = [
  { value: "primary", label: "Primary", name_hi: "प्राथमिक" },
  { value: "secondary", label: "Secondary", name_hi: "माध्यमिक" },
  { value: "high", label: "High", name_hi: "उच्च" },
  { value: "graduate", label: "Graduate", name_hi: "स्नातक" },
  { value: "postgraduate", label: "Postgraduate", name_hi: "स्नातकोत्तर" },
  { value: "uneducated", label: "Uneducated", name_hi: "अशिक्षित" },
  { value: "other", label: "Other", name_hi: "अन्य" },
];

const bloodGroupOptions = [
  { value: "A+", label: "A+", name_hi: "ए+" },
  { value: "A-", label: "A-", name_hi: "ए-" },
  { value: "B+", label: "B+", name_hi: "बी+" },
  { value: "B-", label: "B-", name_hi: "बी-" },
  { value: "AB+", label: "AB+", name_hi: "एबी+" },
  { value: "AB-", label: "AB-", name_hi: "एबी-" },
  { value: "O+", label: "O+", name_hi: "ओ+" },
  { value: "O-", label: "O-", name_hi: "ओ -" },
  { value: "unknown", label: "Unknown", name_hi: "अज्ञात" },
];

const occupationOptions = [
  { value: "shopkeeper", label: "Shopkeeper", name_hi: "दुकानदार" },
  { value: "student", label: "Student", name_hi: "छात्र" },
  { value: "housewife", label: "Housewife", name_hi: "गृहिणी" },
  { value: "job", label: "Job", name_hi: "नौकरी" },
  { value: "business", label: "Business", name_hi: "व्यवसाय" },
  { value: "farmer", label: "Farmer", name_hi: "किसान" },
  { value: "teacher", label: "Teacher", name_hi: "शिक्षक" },
  { value: "doctor", label: "Doctor", name_hi: "डॉक्टर" },
  { value: "engineer", label: "Engineer", name_hi: "इंजीनियर" },
  { value: "lawyer", label: "Lawyer", name_hi: "वकील" },
  { value: "retired", label: "Retired", name_hi: "सेवानिवृत्त" },
  { value: "unemployed", label: "Unemployed", name_hi: "बेरोजगार" },
  { value: "other", label: "Other", name_hi: "अन्य" },
];

export default function FamilyRegisterPage() {
  const { familyId, templeId, userId } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [editingUserId, setEditingUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth(AuthContext);

  const age = Form.useWatch("age", form);
  const relation_name = Form.useWatch("relation_name", form);

  console.log(familyId, "familyId");

  // Warm color palette consistent with AdminAddressReset
  const styles = {
    container: {
      padding: "16px",
      backgroundColor: "#fef6f0",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
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
    formCard: {
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      border: "1px solid #e5e7eb",
      padding: "24px",
    },
    formSection: {
      marginBottom: "24px",
    },
    sectionTitle: {
      fontSize: "16px",
      fontWeight: "600",
      color: "#7c2d12",
      marginBottom: "16px",
      paddingBottom: "8px",
      borderBottom: "2px solid #fed7aa",
    },
    submitButton: {
      backgroundColor: "#f97316",
      borderColor: "#f97316",
      height: "48px",
      fontSize: "16px",
      fontWeight: "600",
      borderRadius: "8px",
    },
    radioGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },
    radioOption: {
      padding: "8px 12px",
      borderRadius: "6px",
      transition: "background-color 0.2s",
    },
    formLabel: {
      fontSize: "14px",
      fontWeight: "600",
      color: "#7c2d12",
    },
    selectStyle: {
      borderRadius: "6px",
    },
    inputStyle: {
      borderRadius: "6px",
    },
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (!userId) return;
    setEditingUserId(userId);
    (async () => {
      const res = await getSingleUser(userId);
      const data = res?.data;
      if (data) form.setFieldsValue({ ...data });
    })();
  }, [userId]);

  useEffect(() => {
    if (!isNaN(age)) {
      const a = parseInt(age);
      let group = "adult";
      if (a <= 12) group = "child";
      else if (a <= 19) group = "teenager";
      else if (a >= 60) group = "senior";
      form.setFieldsValue({ age_group: group });
    }
  }, [age]);

  const handleAddMukhiya = async (userId, familyId, templeId) => {
    try {
      await updateFamily(familyId, { mukhiya: userId, temple: templeId });
    } catch (error) {
      console.log("Error updating family with mukhiya:", error);
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    const data = {
      ...values,
      age: isNaN(Number(values.age)) ? 999 : Number(values.age),
    };
    try {
      if (editingUserId) {
        await updateUserProfile(editingUserId, data);
        if (values.relationship === "self" && familyId && templeId) {
          await handleAddMukhiya(editingUserId, familyId, templeId);
        }
        message.success("Updated");
      } else {
        const suffix = Math.floor(Math.random() * 90) + 10;
        const uname = `${user?.username}${suffix}`;
        await customRegister({
          ...data,
          username: uname,
          email: `${uname}@hph.com`,
          password: "welcome",
          role: 1,
          familyId,
          temples: templeId ? [Number(templeId)] : [],
          createdby: user?.id,
          userstatus: "APPROVED",
        });
        message.success("Registered");
      }
      form.resetFields();
      navigate(-1);
    } catch (err) {
      message.error("Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={{ width: "100%", maxWidth: 800 }}>
        {/* Header */}
        <div style={styles.headerCard}>
          <button
            style={styles.backButton}
            onClick={handleGoBack}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor =
                "rgba(255, 255, 255, 0.3)";
              e.currentTarget.style.transform = "translateY(-50%) scale(1.02)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor =
                "rgba(255, 255, 255, 0.2)";
              e.currentTarget.style.transform = "translateY(-50%)";
            }}
          >
            ← वापस जाये
          </button>
          <div style={styles.headerContent}>
            <h1 style={styles.headerTitle}>👨‍👩‍👧‍👦 Family Registration</h1>
            <p style={styles.headerSubtitle}>
              {editingUserId
                ? "सदस्य जानकारी संपादित करें"
                : "अपने परिवार की जानकारी भरे"}
            </p>
          </div>
        </div>

        {/* Form Card */}
        <Card style={styles.formCard}>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            size="large"
            initialValues={{ relation_name: "father" }}
          >
            {/* Relationship Section */}
            <div style={styles.formSection}>
              <h3 style={styles.sectionTitle}>👥 Relationship Information</h3>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label={<span style={styles.formLabel}>संबंध</span>}
                    name="relation_name"
                  >
                    <Radio.Group style={styles.radioGroup}>
                      {relationOptions.map((opt) => (
                        <Radio
                          key={opt.value}
                          value={opt.value}
                          style={styles.radioOption}
                        >
                          {opt.name_hi} / {opt.label}
                        </Radio>
                      ))}
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={
                      <span style={styles.formLabel}>मुखिया से संबंध</span>
                    }
                    name="relationship"
                  >
                    <Select
                      placeholder="मुखिया से संबंध"
                      style={styles.selectStyle}
                    >
                      {mukhiyarelationOptions.map((opt) => (
                        <Option key={opt.value} value={opt.value}>
                          {opt.name_hi} / {opt.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </div>

            {/* Personal Information Section */}
            <div style={styles.formSection}>
              <h3 style={styles.sectionTitle}>👤 Personal Information</h3>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="first_name"
                    label={<span style={styles.formLabel}>नाम / Name</span>}
                    rules={[{ required: true }]}
                  >
                    <Input style={styles.inputStyle} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name={relation_name === "husband" ? "husband" : "father"}
                    label={
                      <span style={styles.formLabel}>
                        {relation_name === "husband"
                          ? "पति का नाम"
                          : "पिता का नाम"}
                      </span>
                    }
                  >
                    <Input style={styles.inputStyle} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="age"
                    label={<span style={styles.formLabel}>आयु</span>}
                    rules={[{ required: true }]}
                  >
                    <Input
                      prefix={<CalendarOutlined />}
                      type="number"
                      style={styles.inputStyle}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="gotra"
                    label={<span style={styles.formLabel}>गोत्र</span>}
                  >
                    <Select
                      showSearch
                      placeholder="Select Gotra"
                      options={gotra?.Gotra.map((item) => ({
                        value: item.EName,
                        label: `${item.HName} (${item.EName})`,
                      }))}
                      style={styles.selectStyle}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="gender"
                    label={<span style={styles.formLabel}>लिंग</span>}
                    rules={[{ required: true }]}
                  >
                    <Select style={styles.selectStyle}>
                      {genderOptions.map((opt) => (
                        <Option key={opt.value} value={opt.value}>
                          {opt.name_hi} / {opt.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="marital_status"
                    label={<span style={styles.formLabel}>वैवाहिक स्थिति</span>}
                    rules={[{ required: true }]}
                  >
                    <Select style={styles.selectStyle}>
                      {maritalOptions.map((opt) => (
                        <Option key={opt.value} value={opt.value}>
                          {opt.name_hi} / {opt.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </div>

            {/* Additional Information Section */}
            <div style={styles.formSection}>
              <h3 style={styles.sectionTitle}>📋 Additional Information</h3>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="education_name"
                    label={<span style={styles.formLabel}>शिक्षा</span>}
                  >
                    <Select style={styles.selectStyle}>
                      {educationOptions.map((opt) => (
                        <Option key={opt.value} value={opt.value}>
                          {opt.name_hi} / {opt.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="mobile"
                    label={<span style={styles.formLabel}>मोबाईल न.</span>}
                  >
                    <Input style={styles.inputStyle} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="blood_group"
                    label={<span style={styles.formLabel}>रक्त समूह</span>}
                  >
                    <Select style={styles.selectStyle}>
                      {bloodGroupOptions.map((opt) => (
                        <Option key={opt.value} value={opt.value}>
                          {opt.name_hi} / {opt.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="occupation"
                    label={<span style={styles.formLabel}>व्यवसाय</span>}
                  >
                    <Select style={styles.selectStyle}>
                      {occupationOptions.map((opt) => (
                        <Option key={opt.value} value={opt.value}>
                          {opt.name_hi} / {opt.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </div>

            {/* Submit Button */}
            <Form.Item style={{ marginTop: "32px" }}>
              <Button
                type="primary"
                htmlType="submit"
                block
                icon={<TeamOutlined />}
                loading={loading}
                style={styles.submitButton}
              >
                {editingUserId ? "अपडेट करें" : "रजिस्टर करें"}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
}
