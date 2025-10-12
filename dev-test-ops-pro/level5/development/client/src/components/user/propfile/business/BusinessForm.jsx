import React from "react";
import { useEffect, useState } from "react";
import { createBusiness, updateBusiness } from "../../../../services/business";
import { useAuth } from "../../../../contexts/AuthContext";
import { Toast } from "antd-mobile";

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

const bussinessTypes = [
  { name: "SAREES", name_hi: "साड़ियाँ" },
  { name: "COSMETICS", name_hi: "कॉस्मेटिक्स" },
  { name: "Pharmacy", name_hi: "दवा की दुकान" },
  { name: "PLASTICS", name_hi: "प्लास्टिक" },
  { name: "STORE", name_hi: "दुकान" },
  { name: "HANDLOOM", name_hi: "हथकरघा" },
  { name: "ACCOUNTING & TAXATION SERVICES", name_hi: "लेखा एवं कर सेवाएँ" },
  { name: "ELECTRICALS", name_hi: "इलेक्ट्रिकल सामान" },
  { name: "SILK SAREES", name_hi: "रेशमी साड़ियाँ" },
  { name: "HOSIERY GOODS", name_hi: "होजरी सामान" },
  { name: "HARDWARE", name_hi: "हार्डवेयर" },
  { name: "PROVISION", name_hi: "प्रोविजन स्टोर" },
  { name: "JEWELLERS", name_hi: "जौहरी" },
  { name: "MEDICAL", name_hi: "मेडिकल" },
  { name: "DOCTOR", name_hi: "डॉक्टर" },
  { name: "TEXTILES", name_hi: "टेक्सटाइल" },
  { name: "PLASTICS & ACRYLICS", name_hi: "प्लास्टिक और ऐक्रेलिक" },
  { name: "PUMPS", name_hi: "पंप" },
  { name: "ELECTRICAL", name_hi: "बिजली का सामान" },
  { name: "SILK", name_hi: "रेशम" },
  { name: "ELECTRONICS", name_hi: "इलेक्ट्रॉनिक्स" },
  { name: "T", name_hi: "टी" },
  { name: "WATCHES", name_hi: "घड़ियाँ" },
  { name: "CHEMICALS", name_hi: "रसायन" },
  { name: "PLASTIC", name_hi: "प्लास्टिक" },
  { name: "JEWELLERY", name_hi: "जेवरात" },
  { name: "DEPARTMENTAL STORE", name_hi: "डिपार्टमेंटल स्टोर" },
  { name: "SUPER MARKET", name_hi: "सुपर मार्केट" },
  { name: "BAG INDUSTRIES", name_hi: "बैग उद्योग" },
  { name: "NewCategory", name_hi: "नई श्रेणी" },
  { name: "SILKS", name_hi: "रेशम" },
  { name: "PROVISIONS", name_hi: "प्रोविजन" },
  { name: "GLASS & PLYWOOD", name_hi: "कांच और प्लाईवुड" },
  { name: "FURNITURES", name_hi: "फर्नीचर" },
  { name: "READYMADE GARMENTS", name_hi: "रेडीमेड गारमेंट्स" },
  { name: "TEXTILE", name_hi: "टेक्सटाइल" },
  { name: "HENNA", name_hi: "मेहँदी" },
  { name: "TAX CONSULTANT", name_hi: "टैक्स कंसल्टेंट" },
  { name: "OTHER", name_hi: "अन्य" },
];
const businessroles = [
  {
    role: "owner",
    role_hi: "मालिक",
  },
  {
    role: "partner",
    role_hi: "पार्टनर",
  },
  {
    role: "service provider",
    role_hi: "सर्विस प्रोवाइडर",
  },
  {
    role: "contractor",
    role_hi: "कॉन्ट्रैक्टर",
  },
  {
    role: "manager",
    role_hi: "मैनेजर",
  },
  {
    role: "employee",
    role_hi: "एम्प्लॉयी",
  },
  {
    role: "consultant",
    role_hi: "कन्सल्टेंट",
  },
  {
    role: "investor",
    role_hi: "इन्वेस्टर",
  },

  {
    role: "distributor",
    role_hi: "डिस्ट्रीब्यूटर",
  },
  {
    role: "supplier",
    role_hi: "सप्लायर",
  },
  { role: "OTHER", role_hi: "अन्य" },
];
export default function BusinessForm({ editingBusiness = null, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "",
    subtype: "",
    subcategory: "",
    mobile_number_1: "",
    mobile_number_2: "",
    mobile_number_3: "",
  });
  const { user } = useAuth();

  useEffect(() => {
    console.log("BusinessForm editingBusiness changed:", editingBusiness);
    if (editingBusiness) {
      setFormData({
        name: editingBusiness.name || "",
        description: editingBusiness.description || "",
        type: editingBusiness.type || "",
        role: editingBusiness.role || "",
        mobile_number_1: editingBusiness.mobile_number_1 || "",
        mobile_number_2: editingBusiness.mobile_number_2 || "",
        mobile_number_3: editingBusiness.mobile_number_3 || "",
        websiteurl: editingBusiness.websiteurl || "",
        businessid: editingBusiness.businessid || "",
      });
    } else {
      // Reset form for new business
      setFormData({
        name: "",
        description: "",
        type: "",
        role: "",
        mobile_number_1: "",
        mobile_number_2: "",
        mobile_number_3: "",
        websiteurl: "",
        businessid: "",
      });
    }
  }, [editingBusiness]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted with data:", formData);
    console.log("Editing business ID:", editingBusiness?.id);

    const businessData = {
      ...formData,
      users_permissions_user: user.id,
    };

    console.log("Business data to send:", businessData);

    try {
      if (editingBusiness?.id) {
        console.log("Updating business with ID:", editingBusiness.id);
        const response = await updateBusiness(editingBusiness.id, businessData);
        console.log("Update response:", response);
        Toast.show({ content: "Business updated successfully" });
      } else {
        console.log("Creating new business");
        const response = await createBusiness(businessData);
        console.log("Create response:", response);
        Toast.show({ content: "Business created successfully" });
      }
      if (onClose) onClose(true);
    } catch (err) {
      console.error("Error saving business:", err);
      console.error("Error details:", err.response?.data || err.message);
      Toast.show({
        content: `Failed to save business: ${
          err.response?.data?.message || err.message
        }`,
      });
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div
      style={{
        backgroundColor: warmColors.background,
        // minHeight: "100vh",
        // padding: "20px",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          backgroundColor: warmColors.white,
          borderRadius: "12px",
          padding: "32px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
          border: `1px solid ${warmColors.border}`,
        }}
      >
        <form onSubmit={handleSubmit}>
          {/* Business Name */}
          <div style={{ marginBottom: "32px" }}>
            <label
              style={{
                display: "block",
                fontSize: "16px",
                fontWeight: "600",
                color: warmColors.primary,
                marginBottom: "8px",
              }}
            >
              व्यवसाय नाम(Business Name)
            </label>
            <input
              type="text"
              placeholder="व्यवसाय  का नाम लिखे"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              style={{
                width: "100%",
                padding: "16px",
                fontSize: "16px",
                border: `1px solid ${warmColors.border}`,
                borderRadius: "8px",
                backgroundColor: warmColors.lightBg,
                color: warmColors.textPrimary,
                outline: "none",
                transition: "border-color 0.2s ease",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = warmColors.accent;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = warmColors.border;
              }}
            />
          </div>

          {/* Business Type */}
          <div style={{ marginBottom: "32px" }}>
            <label
              style={{
                display: "block",
                fontSize: "16px",
                fontWeight: "600",
                color: warmColors.primary,
                marginBottom: "8px",
              }}
            >
              व्यवसाय (Business) Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleInputChange("type", e.target.value)}
              style={{
                width: "100%",
                padding: "16px",
                fontSize: "16px",
                border: `1px solid ${warmColors.border}`,
                borderRadius: "8px",
                backgroundColor: warmColors.lightBg,
                color: warmColors.textPrimary,
                outline: "none",
                transition: "border-color 0.2s ease",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = warmColors.accent;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = warmColors.border;
              }}
            >
              <option value="">Select Profession</option>
              {bussinessTypes.map((type) => (
                <option key={type.name} value={type.name}>
                  {type.name_hi} ({type.name})
                </option>
              ))}
            </select>
          </div>
          {formData.type === "OTHER" && (
            <div style={{ marginBottom: "32px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "16px",
                  fontWeight: "600",
                  color: warmColors.primary,
                  marginBottom: "8px",
                }}
              >
                व्यवसाय का नाम लिखे (business type)
              </label>
              <input
                type="text"
                placeholder="Describe your business"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                style={{
                  width: "100%",
                  padding: "16px",
                  fontSize: "16px",
                  border: `1px solid ${warmColors.border}`,
                  borderRadius: "8px",
                  backgroundColor: warmColors.lightBg,
                  color: warmColors.textPrimary,
                  outline: "none",
                  transition: "border-color 0.2s ease",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = warmColors.accent;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = warmColors.border;
                }}
              />
            </div>
          )}
          {/* Business Role */}
          <div style={{ marginBottom: "32px" }}>
            <label
              style={{
                display: "block",
                fontSize: "16px",
                fontWeight: "600",
                color: warmColors.primary,
                marginBottom: "8px",
              }}
            >
              व्यवसाय में भूमिका (Role in Business)
            </label>
            <select
              value={formData.role}
              onChange={(e) => handleInputChange("role", e.target.value)}
              style={{
                width: "100%",
                padding: "16px",
                fontSize: "16px",
                border: `1px solid ${warmColors.border}`,
                borderRadius: "8px",
                backgroundColor: warmColors.lightBg,
                color: warmColors.textPrimary,
                outline: "none",
                transition: "border-color 0.2s ease",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = warmColors.accent;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = warmColors.border;
              }}
            >
              <option value="">Select Role</option>
              {businessroles.map((item) => (
                <option key={item.role} value={item.role}>
                  {item.role_hi} ({item.role})
                </option>
              ))}
            </select>
          </div>

          {/* Conditional input if role is OTHER */}
          {formData.role === "OTHER" && (
            <div style={{ marginBottom: "32px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "16px",
                  fontWeight: "600",
                  color: warmColors.primary,
                  marginBottom: "8px",
                }}
              >
                रोल(your role)
              </label>
              <input
                type="text"
                placeholder="Describe your role"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                style={{
                  width: "100%",
                  padding: "16px",
                  fontSize: "16px",
                  border: `1px solid ${warmColors.border}`,
                  borderRadius: "8px",
                  backgroundColor: warmColors.lightBg,
                  color: warmColors.textPrimary,
                  outline: "none",
                  transition: "border-color 0.2s ease",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = warmColors.accent;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = warmColors.border;
                }}
              />
            </div>
          )}

          {/* Mobile Number 1 */}
          <div style={{ marginBottom: "32px" }}>
            <label
              style={{
                display: "block",
                fontSize: "16px",
                fontWeight: "600",
                color: warmColors.primary,
                marginBottom: "8px",
              }}
            >
              Mobile Number 1
            </label>
            <input
              type="tel"
              placeholder="Primary mobile number"
              value={formData.mobile_number_1}
              onChange={(e) =>
                handleInputChange("mobile_number_1", e.target.value)
              }
              style={{
                width: "100%",
                padding: "16px",
                fontSize: "16px",
                border: `1px solid ${warmColors.border}`,
                borderRadius: "8px",
                backgroundColor: warmColors.lightBg,
                color: warmColors.textPrimary,
                outline: "none",
                transition: "border-color 0.2s ease",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = warmColors.accent;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = warmColors.border;
              }}
            />
          </div>

          {/* Mobile Number 2 */}
          <div style={{ marginBottom: "32px" }}>
            <label
              style={{
                display: "block",
                fontSize: "16px",
                fontWeight: "600",
                color: warmColors.primary,
                marginBottom: "8px",
              }}
            >
              Mobile Number 2
            </label>
            <input
              type="tel"
              placeholder="Secondary mobile number"
              value={formData.mobile_number_2}
              onChange={(e) =>
                handleInputChange("mobile_number_2", e.target.value)
              }
              style={{
                width: "100%",
                padding: "16px",
                fontSize: "16px",
                border: `1px solid ${warmColors.border}`,
                borderRadius: "8px",
                backgroundColor: warmColors.lightBg,
                color: warmColors.textPrimary,
                outline: "none",
                transition: "border-color 0.2s ease",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = warmColors.accent;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = warmColors.border;
              }}
            />
          </div>

          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              justifyContent: "flex-end",
              marginTop: "40px",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "12px 24px",
                fontSize: "16px",
                fontWeight: "600",
                border: `2px solid ${warmColors.border}`,
                borderRadius: "8px",
                backgroundColor: warmColors.white,
                color: warmColors.textPrimary,
                cursor: "pointer",
                transition: "all 0.2s ease",
                outline: "none",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = warmColors.lightBg;
                e.currentTarget.style.borderColor = warmColors.accent;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = warmColors.white;
                e.currentTarget.style.borderColor = warmColors.border;
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: "12px 24px",
                fontSize: "16px",
                fontWeight: "600",
                border: "none",
                borderRadius: "8px",
                backgroundColor: warmColors.primary,
                color: warmColors.white,
                cursor: "pointer",
                transition: "background-color 0.2s ease",
                outline: "none",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = warmColors.secondary;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = warmColors.primary;
              }}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
