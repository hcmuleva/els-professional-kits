"use client";

import React, { useState, useEffect, useContext, useRef } from "react";
import {
  Form,
  Input,
  Button,
  Toast,
  Switch,
  TextArea,
  Card,
  Space,
  Dialog,
  ImageUploader,
} from "antd-mobile";
import { DeleteOutline, EditSOutline } from "antd-mobile-icons";
import { PlusOutlined } from "@ant-design/icons";
import AddressModal from "../../common/AddressModal";
import { AuthContext } from "../../../contexts/AuthContext";
import {
  createBusiness,
  getBusiness,
  updateBusiness,
  deleteBusiness,
} from "../../../services/business";
import { deleteUserAddress } from "../../../services/address";
import { getProfessionTypes } from "../../../services/profession";
import DateSelector from "../../common/DateSelector";
import { ProfessionSelector } from "../../common/ItemSelectors";


const bussinesstypes=[
  {name: "SAREES", name_hi: "साड़ियाँ"},
  {name: "COSMETICS", name_hi: "कॉस्मेटिक्स"},
  {name: "Pharmacy", name_hi: "दवा की दुकान"},
  {name: "PLASTICS", name_hi: "प्लास्टिक"},
  {name: "STORE", name_hi: "दुकान"},
  {name: "HANDLOOM", name_hi: "हथकरघा"},
  {name: "ACCOUNTING & TAXATION SERVICES", name_hi: "लेखा एवं कर सेवाएँ"},
  {name: "ELECTRICALS", name_hi: "इलेक्ट्रिकल सामान"},
  {name: "SILK SAREES", name_hi: "रेशमी साड़ियाँ"},
  {name: "HOSIERY GOODS", name_hi: "होजरी सामान"},
  {name: "HARDWARE", name_hi: "हार्डवेयर"},
  {name: "PROVISION", name_hi: "प्रोविजन स्टोर"},
  {name: "JEWELLERS", name_hi: "जौहरी"},
  {name: "MEDICAL", name_hi: "मेडिकल"},
  {name: "DOCTOR", name_hi: "डॉक्टर"},
  {name: "TEXTILES", name_hi: "टेक्सटाइल"},
  {name: "PLASTICS & ACRYLICS", name_hi: "प्लास्टिक और ऐक्रेलिक"},
  {name: "PUMPS", name_hi: "पंप"},
  {name: "MEDICAL", name_hi: "चिकित्सा"},
  {name: "ELECTRICAL", name_hi: "बिजली का सामान"},
  {name: "SILK", name_hi: "रेशम"},
  {name: "ELECTRONICS", name_hi: "इलेक्ट्रॉनिक्स"},
  {name: "T", name_hi: "टी"},
  {name: "WATCHES", name_hi: "घड़ियाँ"},
  {name: "CHEMICALS", name_hi: "रसायन"},
  {name: "PLASTIC", name_hi: "प्लास्टिक"},
  {name: "JEWELLERY", name_hi: "जेवरात"},
  {name: "DEPARTMENTAL STORE", name_hi: "डिपार्टमेंटल स्टोर"},
  {name: "SUPER MARKET", name_hi: "सुपर मार्केट"},
  {name: "BAG INDUSTRIES", name_hi: "बैग उद्योग"},
  {name: "NewCategory", name_hi: "नई श्रेणी"},
  {name: "SILKS", name_hi: "रेशम"},
  {name: "PROVISIONS", name_hi: "प्रोविजन"},
  {name: "GLASS & PLYWOOD", name_hi: "कांच और प्लाईवुड"},
  {name: "FURNITURES", name_hi: "फर्नीचर"},
  {name: "READYMADE GARMENTS", name_hi: "रेडीमेड गारमेंट्स"},
  {name: "TEXTILE", name_hi: "टेक्सटाइल"},
  {name: "HENNA", name_hi: "मेहँदी"},
  {name: "TAX CONSULTANT", name_hi: "टैक्स कंसल्टेंट"},
  {name: "OTHER", name_hi: "अन्य"} 
]
const BusinessInfo = () => {
  const { user } = useContext(AuthContext);
  const userId = user?.id;

  // State for business data and loading
  const [businessList, setBusinessList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedAddressType, setSelectedAddressType] = useState([]);
  const [editingAddress, setEditingAddress] = useState(null);
  const [selectedBusinessId, setSelectedBusinessId] = useState(null);
  const [selectedBusinessData, setSelectedBusinessData] = useState(null);
  const [professionsList, setProfessionsList] = useState([]);
  const [customdata, setCustomdata] = useState({
    start_date: "",
    end_date: "",
    profession: { type: "", category: "", subcategory: "", role: "" },
  });
  const formRef = useRef(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    domain: "",
    subdomain: "",
    is_registered: false,
    start_date: "",
    end_date: "",
    is_current: false,
    ownership_share: "",
    employee_count: "",
    websiteurl: "",
    is_website: false,
    social_links: "",
    description: "",
    type: "",
    subtype: "",
    category: "",
    subcategory: "",
    mobile_number_1: "",
    mobile_number_2: "",
    mobile_number_3: "",
    businessid: "",
    logo: null,
    documents: [],
    family: null,
  });

  useEffect(() => {
    console.log("Updated customdata", customdata);
  }, [customdata]);

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
      padding: "12px",
      backgroundColor: warmColors.background,
      minHeight: "100vh",
      boxSizing: "border-box",
      overflowX: "hidden",
      maxWidth: "100%",
    },
    formContainer: {
      backgroundColor: warmColors.white,
      borderRadius: "8px",
      padding: "16px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      marginBottom: "16px",
      border: `1px solid ${warmColors.accent}`,
      boxSizing: "border-box",
    },
    formHeader: {
      backgroundColor: warmColors.accent,
      color: warmColors.white,
      padding: "10px 12px",
      borderRadius: "6px",
      marginBottom: "16px",
      fontSize: "16px",
      fontWeight: "600",
      textAlign: "center",
    },
    sectionHeader: {
      fontSize: "18px",
      fontWeight: "600",
      marginBottom: "16px",
      color: warmColors.textPrimary,
      textAlign: "center",
      letterSpacing: "0.5px",
    },
    businessCard: {
      backgroundColor: warmColors.cardBg,
      borderRadius: "8px",
      padding: "16px",
      marginBottom: "12px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      color: "#3f3f46",
      boxSizing: "border-box",
      overflow: "hidden",
    },
    businessHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "12px",
    },
    businessTitle: {
      fontSize: "16px",
      fontWeight: "600",
      color: warmColors.textPrimary,
      margin: 0,
    },
    addAddressButton: {
      backgroundColor: warmColors.accent,
      border: "none",
      borderRadius: "6px",
      color: warmColors.white,
      fontSize: "11px",
      fontWeight: "500",
      height: "28px",
      padding: "0 10px",
      cursor: "pointer",
    },
    businessDetails: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "8px",
      marginBottom: "12px",
    },
    businessDetailItem: {
      backgroundColor: warmColors.lightBg,
      borderRadius: "6px",
      padding: "10px",
      border: `1px solid ${warmColors.border}`,
      boxSizing: "border-box",
    },
    businessDetailItemFull: {
      backgroundColor: warmColors.lightBg,
      borderRadius: "6px",
      padding: "10px",
      border: `1px solid ${warmColors.border}`,
      gridColumn: "1 / -1",
      boxSizing: "border-box",
    },
    detailLabel: {
      fontSize: "11px",
      fontWeight: "600",
      color: warmColors.textSecondary,
      marginBottom: "4px",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    detailValue: {
      fontSize: "12px",
      fontWeight: "500",
      color: "#3f3f46",
      lineHeight: "1.4",
      overflowWrap: "break-word",
      wordBreak: "break-word",
    },
    addressSection: {
      marginTop: "12px",
    },
    addressHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "8px",
      padding: "6px 0",
    },
    addressTitle: {
      fontSize: "14px",
      fontWeight: "600",
      margin: 0,
      color: warmColors.textSecondary,
    },
    addressCard: {
      marginBottom: "8px",
      borderRadius: "8px",
      backgroundColor: warmColors.white,
      border: "1px solid #e5e7eb",
      padding: "10px",
      boxSizing: "border-box",
      overflow: "hidden",
    },
    addressCardHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "6px",
    },
    addressType: {
      background: `linear-gradient(135deg, ${warmColors.success} 0%, #047857 100%)`,
      color: warmColors.white,
      padding: "3px 6px",
      borderRadius: "4px",
      fontSize: "9px",
      fontWeight: "600",
      textTransform: "uppercase",
    },
    addressActions: {
      display: "flex",
      gap: "6px",
    },
    actionButton: {
      padding: "5px 10px",
      borderRadius: "6px",
      fontSize: "11px",
      fontWeight: "500",
      border: "none",
      cursor: "pointer",
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
      gap: "6px",
      marginTop: "10px",
    },
    editButton: {
      backgroundColor: `${warmColors.primary}10`,
      color: warmColors.primary,
      border: `1px solid ${warmColors.primary}30`,
      borderRadius: "8px",
      fontSize: "11px",
      padding: "5px 10px",
    },
    deleteButton: {
      backgroundColor: `${warmColors.error}10`,
      color: warmColors.error,
      border: `1px solid ${warmColors.error}30`,
      borderRadius: "8px",
      fontSize: "11px",
      padding: "5px 10px",
    },
    noBusinessCard: {
      textAlign: "center",
      padding: "24px 16px",
      backgroundColor: warmColors.white,
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      color: "#6b7280",
    },
    input: {
      "--border-radius": "8px",
      "--border": `1px solid ${warmColors.border}`,
      "--background-color": warmColors.lightBg,
      "--padding-left": "12px",
      "--padding-right": "12px",
      "--font-size": "12px",
      "--placeholder-color": warmColors.textSecondary,
      "--color": warmColors.textPrimary,
    },
    formLabel: {
      fontSize: "12px",
      fontWeight: "600",
      color: warmColors.textPrimary,
    },
    formItem: {
      marginBottom: "12px",
    },
  };

  // Convert profession types to Cascader tree, filtered for BUSINESS
  const convertToCascaderTree = (professionList) => {
    if (!Array.isArray(professionList)) {
      console.error("professionList is not an array:", professionList);
      return [];
    }

    return professionList
      .filter((item) => item?.attributes?.profession_type?.type === "BUSINESS")
      .map((item) => {
        const profession_type = item.attributes?.profession_type;
        if (!profession_type) {
          console.warn("Missing profession_type for item:", item);
          return null;
        }

        return {
          label: profession_type.type,
          value: profession_type.type,
          children: (profession_type.categories || []).map((category) => ({
            label: category?.name_hi
              ? `${category.name_hi} / ${category.name}`
              : category?.name || "N/A",
            value: category?.name || "",
            children: (category?.subcategories || []).map((subcat) => ({
              label: subcat?.name_hi
                ? `${subcat.name_hi} / ${subcat.name}`
                : subcat?.name || "N/A",
              value: subcat?.name || "",
              children: (subcat?.roles || []).map((role) => ({
                label: role || "N/A",
                value: role || "",
              })),
            })),
          })),
        };
      })
      .filter(Boolean);
  };

  // Fetch business data from API
  const fetchBusinessData = async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const response = await getBusiness(userId);
      const data = Array.isArray(response.data)
        ? response.data.map((item) => ({
            id: item.id,
            name: item.attributes.name || "",
            role: item.attributes.role || "",
            domain: item.attributes.domain || "",
            subdomain: item.attributes.subdomain || "",
            is_registered: item.attributes.is_registered || false,
            start_date: item.attributes.start_date || "",
            end_date: item.attributes.end_date || "",
            is_current: item.attributes.is_current || false,
            ownership_share: item.attributes.ownership_share || "",
            employee_count: item.attributes.employee_count || "",
            websiteurl: item.attributes.websiteurl || "",
            is_website: item.attributes.is_website || false,
            social_links: item.attributes.social_links || {},
            description: item.attributes.description || "",
            type: item.attributes.type || "",
            subtype: item.attributes.subtype || "",
            category: item.attributes.category || "",
            subcategory: item.attributes.subcategory || "",
            mobile_number_1: item.attributes.mobile_number_1 || "",
            mobile_number_2: item.attributes.mobile_number_2 || "",
            mobile_number_3: item.attributes.mobile_number_3 || "",
            businessid: item.attributes.businessid || "",
            logo: item.attributes.logo?.data || null,
            documents: item.attributes.documents?.data || [],
            family: item.attributes.family?.data || null,
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
                }
              : null,
          }))
        : [];
      setBusinessList(data);
    } catch (error) {
      Toast.show({
        content: "Failed to fetch business data",
        icon: "fail",
        position: "center",
      });
      console.error("Error fetching business data:", error);
      setBusinessList([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch profession types
  useEffect(() => {
    const fetchProfessions = async () => {
      try {
        const resProfession = await getProfessionTypes();
        setProfessionsList(resProfession.data || []);
      } catch (err) {
        console.error("Failed to load professions:", err);
        Toast.show({
          icon: "fail",
          content: "Failed to load professions",
        });
      }
    };
    fetchProfessions();
    fetchBusinessData();
  }, [userId]);

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle file uploads
  const handleLogoUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("files", file);
      return { url: URL.createObjectURL(file) };
    } catch (error) {
      Toast.show({
        content: "Failed to upload logo",
        icon: "fail",
        position: "center",
      });
      return null;
    }
  };

  const handleDocumentsUpload = async (files) => {
    try {
      const uploadedFiles = await Promise.all(
        files.map(async (file) => {
          const formData = new FormData();
          formData.append("files", file);
          return { url: URL.createObjectURL(file) };
        })
      );
      return uploadedFiles.filter(Boolean);
    } catch (error) {
      Toast.show({
        content: "Failed to upload documents",
        icon: "fail",
        position: "center",
      });
      return [];
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      Toast.show({
        content: "Business name is required",
        position: "center",
        icon: "fail",
      });
      return;
    }

    const businessData = {
      users_permissions_user: userId,
      name: formData.name,
      role: customdata.profession.role || formData.role,
      domain: formData.domain,
      subdomain: formData.subdomain,
      is_registered: formData.is_registered,
      start_date: customdata.start_date || null,
      end_date: customdata.end_date || null,
      is_current: formData.is_current,
      ownership_share: formData.ownership_share
        ? Number(formData.ownership_share)
        : null,
      employee_count: formData.employee_count
        ? Number(formData.employee_count)
        : null,
      websiteurl: formData.websiteurl,
      is_website: formData.is_website,
      social_links: formData.social_links
        ? { link: formData.social_links }
        : {},
      description: formData.description,
      type: customdata.profession.type || formData.type,
      subtype: formData.subtype,
      category: customdata.profession.category || formData.category,
      subcategory: customdata.profession.subcategory || formData.subcategory,
      mobile_number_1: formData.mobile_number_1,
      mobile_number_2: formData.mobile_number_2,
      mobile_number_3: formData.mobile_number_3,
      businessid: formData.businessid,
      logo: formData.logo,
      documents: formData.documents,
      family: formData.family,
    };

    try {
      if (editingIndex !== null) {
        const businessId = businessList[editingIndex]?.id;
        if (!businessId) {
          throw new Error("Invalid business ID for editing");
        }
        const response = await updateBusiness(businessId, businessData);
        const updatedBusiness = {
          ...businessData,
          id: businessId,
          address: businessList[editingIndex].address, // Preserve address
          logo: response.data.attributes.logo?.data || businessData.logo,
          documents:
            response.data.attributes.documents?.data || businessData.documents,
          family: response.data.attributes.family?.data || businessData.family,
        };
        setBusinessList((prev) =>
          prev.map((item, i) => (i === editingIndex ? updatedBusiness : item))
        );
        Toast.show({
          content: "Business updated successfully",
          position: "center",
          icon: "success",
        });
      } else {
        const response = await createBusiness(businessData);
        const newBusiness = {
          id: response.data.id,
          name: response.data.attributes.name || "",
          role: response.data.attributes.role || "",
          domain: response.data.attributes.domain || "",
          subdomain: response.data.attributes.subdomain || "",
          is_registered: response.data.attributes.is_registered || false,
          start_date: response.data.attributes.start_date || "",
          end_date: response.data.attributes.end_date || "",
          is_current: response.data.attributes.is_current || false,
          ownership_share: response.data.attributes.ownership_share || "",
          employee_count: response.data.attributes.employee_count || "",
          websiteurl: response.data.attributes.websiteurl || "",
          is_website: response.data.attributes.is_website || false,
          social_links: response.data.attributes.social_links || {},
          description: response.data.attributes.description || "",
          type: response.data.attributes.type || "",
          subtype: response.data.attributes.subtype || "",
          category: response.data.attributes.category || "",
          subcategory: response.data.attributes.subcategory || "",
          mobile_number_1: response.data.attributes.mobile_number_1 || "",
          mobile_number_2: response.data.attributes.mobile_number_2 || "",
          mobile_number_3: response.data.attributes.mobile_number_3 || "",
          businessid: response.data.attributes.businessid || "",
          logo: response.data.attributes.logo?.data || null,
          documents: response.data.attributes.documents?.data || [],
          family: response.data.attributes.family?.data || null,
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
              }
            : null,
        };
        setBusinessList((prev) => [...prev, newBusiness]);
        Toast.show({
          content: "Business added successfully",
          position: "center",
          icon: "success",
        });
      }

      // Reset form and state
      setFormData({
        name: "",
        role: "",
        domain: "",
        subdomain: "",
        is_registered: false,
        start_date: "",
        end_date: "",
        is_current: false,
        ownership_share: "",
        employee_count: "",
        websiteurl: "",
        is_website: false,
        social_links: "",
        description: "",
        type: "",
        subtype: "",
        category: "",
        subcategory: "",
        mobile_number_1: "",
        mobile_number_2: "",
        mobile_number_3: "",
        businessid: "",
        logo: null,
        documents: [],
        family: null,
      });
      setCustomdata({
        start_date: "",
        end_date: "",
        profession: { type: "", category: "", subcategory: "", role: "" },
      });
      setShowForm(false);
      setEditingIndex(null);
    } catch (error) {
      Toast.show({
        content: "Failed to save business info",
        icon: "fail",
        position: "center",
      });
      console.error("Error saving business info:", error);
    }
  };

  const handleEdit = (index) => {
    if (index < 0 || index >= businessList.length) {
      Toast.show({
        content: "Invalid business record selected",
        icon: "fail",
        position: "center",
      });
      console.error(
        `Invalid index: ${index}, businessList length: ${businessList.length}`
      );
      return;
    }

    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

    const business = businessList[index];
    if (!business) {
      Toast.show({
        content: "Business record is missing required data",
        icon: "fail",
        position: "center",
      });
      console.error("Invalid business data:", business);
      return;
    }

    // Populate formData with all fields
    const updatedFormData = {
      name: business.name || "",
      role: business.role || "",
      domain: business.domain || "",
      subdomain: business.subdomain || "",
      is_registered: business.is_registered || false,
      start_date: business.start_date || "",
      end_date: business.end_date || "",
      is_current: business.is_current || false,
      ownership_share: business.ownership_share
        ? business.ownership_share.toString()
        : "",
      employee_count: business.employee_count
        ? business.employee_count.toString()
        : "",
      websiteurl: business.websiteurl || "",
      is_website: business.is_website || false,
      social_links: business.social_links?.link || "",
      description: business.description || "",
      type: business.type || "",
      subtype: business.subtype || "",
      category: business.category || "",
      subcategory: business.subcategory || "",
      mobile_number_1: business.mobile_number_1 || "",
      mobile_number_2: business.mobile_number_2 || "",
      mobile_number_3: business.mobile_number_3 || "",
      businessid: business.businessid || "",
      logo: business.logo || null,
      documents: business.documents || [],
      family: business.family || null,
    };

    // Update customdata for profession and dates
    const updatedCustomdata = {
      start_date: business.start_date || "",
      end_date: business.end_date || "",
      profession: {
        type: business.type || "",
        category: business.category || "",
        subcategory: business.subcategory || "",
        role: business.role || "",
      },
    };

    // Update state
    setFormData(updatedFormData);
    setCustomdata(updatedCustomdata);
    setEditingIndex(index);
    setShowForm(true);

    // Log for debugging
    console.log("Editing business:", business);
    console.log("Updated formData:", updatedFormData);
    console.log("Updated customdata:", updatedCustomdata);
  };

  // Handle delete button click
  const handleDelete = async (index) => {
    if (index < 0 || index >= businessList.length) {
      Toast.show({
        content: "Invalid business record selected",
        icon: "fail",
        position: "center",
      });
      return;
    }

    const business = businessList[index];
    Dialog.confirm({
      content: "Are you sure you want to delete this business record?",
      onConfirm: async () => {
        try {
          await deleteBusiness(business.id);
          setBusinessList((prev) => prev.filter((_, i) => i !== index));
          if (editingIndex === index) {
            setEditingIndex(null);
            setShowForm(false);
            setFormData({
              name: "",
              role: "",
              domain: "",
              subdomain: "",
              is_registered: false,
              start_date: "",
              end_date: "",
              is_current: false,
              ownership_share: "",
              employee_count: "",
              websiteurl: "",
              is_website: false,
              social_links: "",
              description: "",
              type: "",
              subtype: "",
              category: "",
              subcategory: "",
              mobile_number_1: "",
              mobile_number_2: "",
              mobile_number_3: "",
              businessid: "",
              logo: null,
              documents: [],
              family: null,
            });
            setCustomdata({
              start_date: "",
              end_date: "",
              profession: { type: "", category: "", subcategory: "", role: "" },
            });
          }
          Toast.show({
            content: "Business deleted successfully",
            position: "center",
            icon: "success",
          });
        } catch (error) {
          Toast.show({
            content: "Failed to delete business info",
            icon: "fail",
            position: "center",
          });
          console.error("Error deleting business info:", error);
        }
      },
    });
  };

  // Handle adding address to business
  const handleAddAddressToBusiness = (businessId) => {
    setSelectedBusinessId(businessId);
    setEditingAddress(null);
    setSelectedAddressType(["BUSINESS"]);
    const business = businessList.find((biz) => biz.id === businessId);
    setSelectedBusinessData(business || null);
    setShowAddressModal(true);
  };

  // Handle editing an address
  const handleEditAddress = (address, businessId) => {
    setSelectedBusinessId(businessId);
    setEditingAddress(address);
    setSelectedAddressType([address.addresstype]);
    const business = businessList.find((biz) => biz.id === businessId);
    setSelectedBusinessData(business || null);
    setShowAddressModal(true);
  };

  // Handle address save callback
  const handleAddressSaved = () => {
    fetchBusinessData();
    setShowAddressModal(false);
    setEditingAddress(null);
    setSelectedAddressType([]);
    setSelectedBusinessId(null);
    setSelectedBusinessData(null);
  };

  // Handle address deletion
  const handleDeleteAddress = async (addressId) => {
    Dialog.confirm({
      content: "Are you sure you want to delete this address?",
      onConfirm: async () => {
        try {
          await deleteUserAddress(addressId);
          Toast.show({
            content: "Address deleted successfully",
            icon: "success",
            position: "center",
          });
          fetchBusinessData();
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
    const parts = [
      address.housename,
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

  // Get addresses for a specific business record
  const getAddressesForBusiness = (businessId) => {
    const business = businessList.find((biz) => biz.id === businessId);
    return business?.address ? [business.address] : [];
  };

  // Render business list
  const renderBusinessList = () => {
    if (isLoading) {
      return (
        <Card style={styles.noBusinessCard}>
          <div>Loading business information...</div>
        </Card>
      );
    }

    if (!Array.isArray(businessList) || businessList.length === 0) {
      return (
        <Card style={styles.noBusinessCard}>
          <div>No business information added yet</div>
          <div style={{ fontSize: "12px", marginTop: "8px" }}>
            Add your first business record using the form above
          </div>
        </Card>
      );
    }

    return (
      <Space direction="vertical" block>
        {businessList.map((business, index) => {
          if (!business || !business.id) {
            console.warn(
              `Invalid business object at index ${index}:`,
              business
            );
            return null;
          }

          return (
            <Card key={business.id} style={styles.businessCard}>
              <div style={styles.businessHeader}>
                <h3 style={styles.businessTitle}>
                  💼 {business.name || "N/A"}
                </h3>
                <button
                  style={styles.addAddressButton}
                  onClick={() => handleAddAddressToBusiness(business.id)}
                >
                  + Add Address
                </button>
              </div>

              <div style={styles.businessDetails}>
                <div style={styles.businessDetailItem}>
                  <div style={styles.detailLabel}>Role</div>
                  <div style={styles.detailValue}>{business.role || "N/A"}</div>
                </div>
                <div style={styles.businessDetailItem}>
                  <div style={styles.detailLabel}>Domain</div>
                  <div style={styles.detailValue}>
                    {business.domain || "N/A"}
                  </div>
                </div>
                <div style={styles.businessDetailItem}>
                  <div style={styles.detailLabel}>Type</div>
                  <div style={styles.detailValue}>{business.type || "N/A"}</div>
                </div>
                <div style={styles.businessDetailItem}>
                  <div style={styles.detailLabel}>Registered</div>
                  <div style={styles.detailValue}>
                    {business.is_registered ? "Yes" : "No"}
                  </div>
                </div>
                <div style={styles.businessDetailItem}>
                  <div style={styles.detailLabel}>Current</div>
                  <div style={styles.detailValue}>
                    {business.is_current ? "Yes" : "No"}
                  </div>
                </div>
                {business.employee_count && (
                  <div style={styles.businessDetailItem}>
                    <div style={styles.detailLabel}>Employees</div>
                    <div style={styles.detailValue}>
                      {business.employee_count}
                    </div>
                  </div>
                )}
                {business.websiteurl && (
                  <div style={styles.businessDetailItem}>
                    <div style={styles.detailLabel}>Website</div>
                    <div style={styles.detailValue}>
                      <a
                        href={business.websiteurl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#3b82f6" }}
                      >
                        {business.websiteurl}
                      </a>
                    </div>
                  </div>
                )}
                {business.social_links?.link && (
                  <div style={styles.businessDetailItem}>
                    <div style={styles.detailLabel}>Social Link</div>
                    <div style={styles.detailValue}>
                      <a
                        href={business.social_links.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#3b82f6" }}
                      >
                        {business.social_links.link}
                      </a>
                    </div>
                  </div>
                )}
                {business.description && (
                  <div style={styles.businessDetailItemFull}>
                    <div style={styles.detailLabel}>Description</div>
                    <div style={styles.detailValue}>{business.description}</div>
                  </div>
                )}
                {business.logo && (
                  <div style={styles.businessDetailItem}>
                    <div style={styles.detailLabel}>Logo</div>
                    <img
                      src={business.logo.url}
                      alt="Business Logo"
                      style={{ maxWidth: "80px", borderRadius: "4px" }}
                    />
                  </div>
                )}
                {business.documents.length > 0 && (
                  <div style={styles.businessDetailItemFull}>
                    <div style={styles.detailLabel}>Documents</div>
                    <div style={styles.detailValue}>
                      {business.documents.map((doc, i) => (
                        <a
                          key={i}
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ display: "block", color: "#3b82f6" }}
                        >
                          Document {i + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div style={styles.actionButtons}>
                <Button
                  size="small"
                  style={styles.editButton}
                  onClick={() => handleEdit(index)}
                >
                  <EditSOutline fontSize={11} />
                  Edit
                </Button>
                <Button
                  size="small"
                  style={styles.deleteButton}
                  onClick={() => handleDelete(index)}
                >
                  <DeleteOutline fontSize={11} />
                  Delete
                </Button>
              </div>

              <div style={styles.addressSection}>
                <div style={styles.addressHeader}>
                  <h4 style={styles.addressTitle}>📍 Addresses</h4>
                </div>
                {getAddressesForBusiness(business.id).length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "10px",
                      backgroundColor: warmColors.lightBg,
                      borderRadius: "6px",
                      color: warmColors.textSecondary,
                      fontSize: "12px",
                    }}
                  >
                    No addresses added for this business record
                  </div>
                ) : (
                  <Space direction="vertical" block>
                    {getAddressesForBusiness(business.id).map((address) => (
                      <Card key={address.id} style={styles.addressCard}>
                        <div style={styles.addressCardHeader}>
                          <span style={styles.addressType}>
                            {address.addresstype || "N/A"}
                          </span>
                          <div style={styles.addressActions}>
                            <button
                              style={{
                                ...styles.actionButton,
                                ...styles.editAddressButton,
                              }}
                              onClick={() =>
                                handleEditAddress(address, business.id)
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
                              fontSize: "10px",
                              color: "#6b7280",
                              marginTop: "6px",
                            }}
                          >
                            📍 {address.latitude.toFixed(4)},{" "}
                            {address.longitude.toFixed(4)}
                          </div>
                        )}
                      </Card>
                    ))}
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
    <div style={styles.container} ref={formRef}>
      {!showForm && (
        <Button
          block
          style={{
            background: `linear-gradient(135deg, ${warmColors.primary} 0%, ${warmColors.secondary} 100%)`,
            border: "none",
            borderRadius: "8px",
            fontWeight: "600",
            color: warmColors.white,
            marginBottom: "12px",
            fontSize: "13px",
            padding: "8px",
          }}
          onClick={() => setShowForm(true)}
        >
          <PlusOutlined /> Add New Business Info
        </Button>
      )}

      {showForm && (
        <div style={styles.formContainer}>
          <div style={styles.formHeader}>
            {editingIndex !== null
              ? "Edit Business Info"
              : "Add New Business Info"}
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
                    borderRadius: "8px",
                    fontWeight: "600",
                    color: warmColors.white,
                    fontSize: "13px",
                    padding: "8px",
                  }}
                >
                  {editingIndex !== null
                    ? "Update Business Info"
                    : "Save Business Info"}
                </Button>
                <Button
                  block
                  onClick={() => {
                    setShowForm(false);
                    setEditingIndex(null);
                    setFormData({
                      name: "",
                      role: "",
                      domain: "",
                      subdomain: "",
                      is_registered: false,
                      start_date: "",
                      end_date: "",
                      is_current: false,
                      ownership_share: "",
                      employee_count: "",
                      websiteurl: "",
                      is_website: false,
                      social_links: "",
                      description: "",
                      type: "",
                      subtype: "",
                      category: "",
                      subcategory: "",
                      mobile_number_1: "",
                      mobile_number_2: "",
                      mobile_number_3: "",
                      businessid: "",
                      logo: null,
                      documents: [],
                      family: null,
                    });
                    setCustomdata({
                      start_date: "",
                      end_date: "",
                      profession: {
                        type: "",
                        category: "",
                        subcategory: "",
                        role: "",
                      },
                    });
                  }}
                  style={{
                    background: warmColors.lightBg,
                    border: `1px solid ${warmColors.border}`,
                    borderRadius: "8px",
                    color: warmColors.textSecondary,
                    fontSize: "13px",
                    padding: "8px",
                  }}
                >
                  Cancel
                </Button>
              </Space>
            }
          >
            <Form.Item
              label={<span style={styles.formLabel}>Business Name</span>}
              required
              style={styles.formItem}
            >
              <Input
                placeholder="Enter business name"
                value={formData.name}
                onChange={(val) => handleInputChange("name", val)}
                style={styles.input}
              />
            </Form.Item>

            <Form.Item label="Business Type">
              <ProfessionSelector
                professions={professionsList}
                customdata={customdata}
                setCustomdata={setCustomdata}
                setFormData={setFormData}
                convertToCascaderTree={convertToCascaderTree}
                field="profession"
              />
            </Form.Item>

            <Form.Item
              label={<span style={styles.formLabel}>Domain</span>}
              style={styles.formItem}
            >
              <Input
                placeholder="Business domain"
                value={formData.domain}
                onChange={(val) => handleInputChange("domain", val)}
                style={styles.input}
              />
            </Form.Item>

            <Form.Item
              label={<span style={styles.formLabel}>Subdomain</span>}
              style={styles.formItem}
            >
              <Input
                placeholder="Business subdomain"
                value={formData.subdomain}
                onChange={(val) => handleInputChange("subdomain", val)}
                style={styles.input}
              />
            </Form.Item>

            <Form.Item
              label={<span style={styles.formLabel}>Business ID</span>}
              style={styles.formItem}
            >
              <Input
                placeholder="Business registration ID"
                value={formData.businessid}
                onChange={(val) => handleInputChange("businessid", val)}
                style={styles.input}
              />
            </Form.Item>

            <Form.Item
              label={<span style={styles.formLabel}>Mobile Number 1</span>}
              style={styles.formItem}
            >
              <Input
                placeholder="Primary mobile number"
                value={formData.mobile_number_1}
                onChange={(val) => handleInputChange("mobile_number_1", val)}
                style={styles.input}
              />
            </Form.Item>

            <Form.Item
              label={<span style={styles.formLabel}>Mobile Number 2</span>}
              style={styles.formItem}
            >
              <Input
                placeholder="Secondary mobile number"
                value={formData.mobile_number_2}
                onChange={(val) => handleInputChange("mobile_number_2", val)}
                style={styles.input}
              />
            </Form.Item>

            <Form.Item
              label={<span style={styles.formLabel}>Mobile Number 3</span>}
              style={styles.formItem}
            >
              <Input
                placeholder="Third mobile number"
                value={formData.mobile_number_3}
                onChange={(val) => handleInputChange("mobile_number_3", val)}
                style={styles.input}
              />
            </Form.Item>

            <Form.Item
              label={<span style={styles.formLabel}>Ownership Share (%)</span>}
              style={styles.formItem}
            >
              <Input
                placeholder="Enter ownership percentage"
                type="number"
                value={formData.ownership_share}
                onChange={(val) => handleInputChange("ownership_share", val)}
                style={styles.input}
              />
            </Form.Item>

            <Form.Item
              label={<span style={styles.formLabel}>Employee Count</span>}
              style={styles.formItem}
            >
              <Input
                placeholder="Number of employees"
                type="number"
                value={formData.employee_count}
                onChange={(val) => handleInputChange("employee_count", val)}
                style={styles.input}
              />
            </Form.Item>

            <Form.Item
              label={<span style={styles.formLabel}>Website URL</span>}
              style={styles.formItem}
            >
              <Input
                placeholder="https://example.com"
                value={formData.websiteurl}
                onChange={(val) => handleInputChange("websiteurl", val)}
                style={styles.input}
              />
            </Form.Item>

            <Form.Item
              label={<span style={styles.formLabel}>Social Link</span>}
              style={styles.formItem}
            >
              <Input
                placeholder="https://example.com/profile"
                value={formData.social_links}
                onChange={(val) => handleInputChange("social_links", val)}
                style={styles.input}
              />
            </Form.Item>

            <Form.Item
              label={<span style={styles.formLabel}>Description</span>}
              style={styles.formItem}
            >
              <TextArea
                placeholder="Describe your business"
                value={formData.description}
                onChange={(val) => handleInputChange("description", val)}
                rows={4}
                style={styles.input}
              />
            </Form.Item>

            <Form.Item
              name="start_date"
              label={<span style={styles.formLabel}>Start Date</span>}
              style={styles.formItem}
            >
              <DateSelector
                fieldKey="start_date"
                customdata={customdata}
                setCustomdata={setCustomdata}
                setFormData={setFormData}
                displayFormat="DD-MM-YYYY"
              />
            </Form.Item>

            <Form.Item
              name="end_date"
              label={<span style={styles.formLabel}>End Date</span>}
              style={styles.formItem}
            >
              <DateSelector
                fieldKey="end_date"
                customdata={customdata}
                setCustomdata={setCustomdata}
                setFormData={setFormData}
                displayFormat="DD-MM-YYYY"
              />
            </Form.Item>

            <Form.Item
              label={<span style={styles.formLabel}>Is Registered</span>}
              style={styles.formItem}
            >
              <Switch
                checked={formData.is_registered}
                onChange={(val) => handleInputChange("is_registered", val)}
              />
            </Form.Item>

            <Form.Item
              label={<span style={styles.formLabel}>Is Current</span>}
              style={styles.formItem}
            >
              <Switch
                checked={formData.is_current}
                onChange={(val) => handleInputChange("is_current", val)}
              />
            </Form.Item>

            <Form.Item
              label={<span style={styles.formLabel}>Has Website</span>}
              style={styles.formItem}
            >
              <Switch
                checked={formData.is_website}
                onChange={(val) => handleInputChange("is_website", val)}
              />
            </Form.Item>

            <Form.Item
              label={<span style={styles.formLabel}>Logo</span>}
              style={styles.formItem}
            >
              <ImageUploader
                value={formData.logo ? [{ url: formData.logo.url }] : []}
                onChange={(files) => {
                  const file = files[0];
                  handleInputChange("logo", file ? { url: file.url } : null);
                }}
                upload={handleLogoUpload}
                maxCount={1}
              />
            </Form.Item>

            <Form.Item
              label={<span style={styles.formLabel}>Documents</span>}
              style={styles.formItem}
            >
              <ImageUploader
                value={formData.documents.map((doc) => ({ url: doc.url }))}
                onChange={(files) => handleInputChange("documents", files)}
                upload={handleDocumentsUpload}
                multiple
              />
            </Form.Item>
          </Form>
        </div>
      )}

      <div>
        <h2 style={styles.sectionHeader}>Your Business Information</h2>
        {renderBusinessList()}
      </div>

      <AddressModal
        visible={showAddressModal}
        onClose={() => {
          setShowAddressModal(false);
          setEditingAddress(null);
          setSelectedAddressType([]);
          setSelectedBusinessId(null);
          setSelectedBusinessData(null);
        }}
        addressType={selectedAddressType[0]}
        typeKey="businesses"
        typeId={selectedBusinessId}
        initialAddress={editingAddress}
        businessData={selectedBusinessData}
        onAddressSaved={handleAddressSaved}
      />
    </div>
  );
};

export default BusinessInfo;
