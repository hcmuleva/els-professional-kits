import React, { useEffect, useState } from "react";
import {
  Card,
  SearchBar,
  Tag,
  Space,
  Loading,
  Empty,
  NavBar,
  Badge,
  Toast,
} from "antd-mobile";
import {
  LocationOutline,
  UserOutline,
  PhoneOutline,
  GlobalOutline,
  ShopbagOutline,
} from "antd-mobile-icons";
import { PhoneOutlined, LinkOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { getFilteredBusinessData } from "../../../services/business";
import { Button } from "antd";

export default function BusinessList() {
  const location = useLocation();
  const selectedBusiness = location.state?.selectedBusiness;
  const templeId = location.state?.templeId;
  const [businesses, setBusinesses] = useState([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const warmColors = {
    primary: "#d2691e",
    secondary: "#daa520",
    accent: "#cd853f",
    background: "#fef7e7",
    cardBg: "#ffffff",
    textPrimary: "#5d4037",
    textSecondary: "#8d6e63",
    border: "#f4e4bc",
    success: "#52c41a",
    warning: "#faad14",
    error: "#ff4d4f",
  };

  useEffect(() => {
    if (!selectedBusiness?.type) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const data = await getFilteredBusinessData(
          selectedBusiness.type,
          templeId
        );
        setBusinesses(data?.data || []);
        setFilteredBusinesses(data?.data || []);
      } catch (err) {
        Toast.show({ icon: "fail", content: "Failed to load businesses" });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedBusiness?.type]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredBusinesses(businesses);
      return;
    }

    const filtered = businesses.filter((item) => {
      const business = item.attributes;
      const ownerDetails = getOwnerDetails(business.users_permissions_user);
      const searchFields = [
        business.name?.toLowerCase(),
        business.type?.toLowerCase(),
        business.subtype?.toLowerCase(),
        business.category?.toLowerCase(),
        ownerDetails?.name?.toLowerCase(),
        ownerDetails?.gotra?.toLowerCase(),
      ].filter(Boolean);

      return searchFields.some((field) =>
        field.includes(searchTerm.toLowerCase())
      );
    });

    setFilteredBusinesses(filtered);
  }, [searchTerm, businesses]);

  const formatAddress = (address) => {
    if (!address?.data?.attributes) return "Address not available";

    const addr = address.data.attributes;
    const parts = [
      addr.housename,
      addr.landmark,
      addr.village,
      addr.tehsil,
      addr.district,
      addr.state,
      addr.pincode ? `PIN: ${addr.pincode}` : null,
      addr.country,
    ].filter(Boolean);

    return parts.join(", ");
  };

  const formatPhone = (business) => {
    const phones = [
      business.mobile_number_1,
      business.mobile_number_2,
      business.mobile_number_3,
    ].filter(Boolean);

    return phones.length > 0 ? phones.join(", ") : null;
  };

  const getOwnerDetails = (user) => {
    if (!user?.data?.attributes) return null;
    const userData = user.data.attributes;
    return {
      name: `${userData.first_name || ""} ${userData.last_name || ""}`.trim(),
      father: userData.father,
      gotra: userData.gotra,
      gender: userData.gender,
      profession: userData.profession,
    };
  };

  const handleMapView = () => {
    navigate(`/map/business`, {
      state: {
        selectedBusiness: {
          type: selectedBusiness.type,
        },
        templeId: templeId,
      },
    });
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: warmColors.background,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <Loading size="large" color={warmColors.primary} />
          <div
            style={{
              marginTop: "16px",
              color: warmColors.textPrimary,
              fontSize: "16px",
              fontWeight: "500",
            }}
          >
            Loading Businesses...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: warmColors.background,
        padding: "16px",
      }}
    >
      <NavBar
        style={{
          backgroundColor: warmColors.primary,
          color: "white",
          "--adm-color-text": "white",
        }}
        onBack={() => navigate(-1)}
      >
        Business Directory
      </NavBar>

      {/* Header */}
      <Card
        style={{
          marginBottom: "16px",
          borderRadius: "8px",
          border: `1px solid ${warmColors.border}`,
          boxShadow: "0 2px 8px rgba(210, 105, 30, 0.08)",
          background: warmColors.cardBg,
        }}
      >
        <div style={{ padding: "12px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: "18px",
                fontWeight: "600",
                color: warmColors.textPrimary,
              }}
            >
              {selectedBusiness?.type?.toUpperCase() || "BUSINESSES"}
            </h3>
            <Button
              onClick={handleMapView}
              style={{
                background: warmColors.accent,
                border: "none",
                borderRadius: "6px",
                color: "white",
                fontSize: "12px",
                fontWeight: "600",
                padding: "4px 12px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <LocationOutline style={{ fontSize: "14px" }} />
              Map View
            </Button>
          </div>
          <p
            style={{
              margin: "4px 0 12px 0",
              fontSize: "12px",
              color: warmColors.textSecondary,
            }}
          >
            {filteredBusinesses.length} businesses found
          </p>
          <SearchBar
            placeholder="Search businesses..."
            value={searchTerm}
            onChange={setSearchTerm}
            style={{
              "--adm-color-primary": warmColors.primary,
              "--border-radius": "8px",
            }}
          />
        </div>
      </Card>

      {/* Business Cards */}
      {filteredBusinesses.length === 0 ? (
        <Card
          style={{
            borderRadius: "12px",
            border: `1px solid ${warmColors.border}`,
            boxShadow: "0 4px 16px rgba(210, 105, 30, 0.1)",
            background: warmColors.cardBg,
          }}
        >
          <Empty
            description={
              searchTerm
                ? `No businesses found for "${searchTerm}"`
                : `No ${selectedBusiness?.type} businesses found`
            }
            style={{ padding: "40px 0" }}
            image={
              <ShopbagOutline style={{ fontSize: 48, color: "#d9d9d9" }} />
            }
          />
        </Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {filteredBusinesses.map((item) => {
            const business = item.attributes;
            const ownerDetails = getOwnerDetails(
              business.users_permissions_user
            );
            const phoneNumber = formatPhone(business);
            const address = formatAddress(business.address);

            return (
              <Card
                key={item.id}
                style={{
                  borderRadius: "12px",
                  border: `1px solid ${warmColors.border}`,
                  boxShadow: "0 4px 16px rgba(210, 105, 30, 0.1)",
                  background: warmColors.cardBg,
                  padding: "16px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    marginBottom: "12px",
                  }}
                >
                  {/* Logo */}
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "8px",
                      backgroundColor: `${warmColors.secondary}20`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "12px",
                      flexShrink: 0,
                    }}
                  >
                    {business.logo?.data ? (
                      <img
                        src={business.logo.data.attributes.url}
                        alt={business.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                    ) : (
                      <ShopbagOutline
                        style={{
                          fontSize: "24px",
                          color: warmColors.secondary,
                        }}
                      />
                    )}
                  </div>
                  {/* Business Name and Type */}
                  <div style={{ flex: 1 }}>
                    <h4
                      style={{
                        margin: 0,
                        fontSize: "16px",
                        fontWeight: "600",
                        color: warmColors.textPrimary,
                        marginBottom: "4px",
                      }}
                    >
                      {business.name || "Business Name Not Available"} (ID:{" "}
                      {item.id})
                    </h4>
                    <Space size={4} wrap>
                      <Tag
                        color={warmColors.primary}
                        style={{
                          fontSize: "10px",
                          padding: "2px 6px",
                          border: "none",
                        }}
                      >
                        {business.type}
                      </Tag>
                      {business.subtype && (
                        <Tag
                          color={warmColors.accent}
                          style={{
                            fontSize: "10px",
                            padding: "2px 6px",
                            border: "none",
                          }}
                        >
                          {business.subtype}
                        </Tag>
                      )}
                      {business.category && (
                        <Tag
                          color={warmColors.success}
                          style={{
                            fontSize: "10px",
                            padding: "2px 6px",
                            border: "none",
                          }}
                        >
                          {business.category}
                        </Tag>
                      )}
                      {business.is_current !== null && (
                        <Tag
                          color={
                            business.is_current ? warmColors.success : "#d9d9d9"
                          }
                          style={{
                            fontSize: "10px",
                            padding: "2px 6px",
                            border: "none",
                          }}
                        >
                          {business.is_current ? "Active" : "Inactive"}
                        </Tag>
                      )}
                    </Space>
                  </div>
                </div>

                {/* Business Details */}
                <div
                  style={{
                    backgroundColor: `${warmColors.primary}05`,
                    borderRadius: "8px",
                    padding: "12px",
                  }}
                >
                  {/* Address */}
                  {address && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        marginBottom: "8px",
                      }}
                    >
                      <LocationOutline
                        style={{
                          fontSize: "14px",
                          color: warmColors.primary,
                          marginRight: "8px",
                          marginTop: "2px",
                        }}
                      />
                      <span
                        style={{
                          fontSize: "12px",
                          color: warmColors.textSecondary,
                          lineHeight: 1.4,
                        }}
                      >
                        {address}
                      </span>
                    </div>
                  )}

                  {/* Owner Details */}
                  {ownerDetails && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        marginBottom: "8px",
                      }}
                    >
                      <UserOutline
                        style={{
                          fontSize: "14px",
                          color: warmColors.primary,
                          marginRight: "8px",
                          marginTop: "2px",
                        }}
                      />
                      <div
                        style={{
                          fontSize: "12px",
                          color: warmColors.textSecondary,
                        }}
                      >
                        <span style={{ fontWeight: 500 }}>
                          {ownerDetails.name || "Unknown Owner"}
                        </span>
                        {ownerDetails.father && (
                          <span style={{ marginLeft: "4px" }}>
                            (S/o {ownerDetails.father})
                          </span>
                        )}
                        {(ownerDetails.gotra ||
                          ownerDetails.gender ||
                          ownerDetails.profession) && (
                          <div
                            style={{
                              fontSize: "11px",
                              color: warmColors.textSecondary,
                            }}
                          >
                            {ownerDetails.gotra &&
                              `Gotra: ${ownerDetails.gotra}`}
                            {ownerDetails.gotra &&
                              (ownerDetails.gender ||
                                ownerDetails.profession) &&
                              " • "}
                            {ownerDetails.gender && ownerDetails.gender}
                            {ownerDetails.gender &&
                              ownerDetails.profession &&
                              " • "}
                            {ownerDetails.profession && ownerDetails.profession}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Contact Information */}
                  {phoneNumber && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "8px",
                      }}
                    >
                      <PhoneOutlined
                        style={{
                          fontSize: "14px",
                          color: warmColors.success,
                          marginRight: "8px",
                        }}
                      />
                      <span
                        style={{
                          fontSize: "12px",
                          color: warmColors.textSecondary,
                        }}
                      >
                        {phoneNumber}
                      </span>
                    </div>
                  )}

                  {/* Website and Social Links */}
                  {(business.websiteurl || business.social_links) && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "8px",
                        marginBottom: "8px",
                      }}
                    >
                      {business.websiteurl && (
                        <a
                          href={business.websiteurl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: "12px",
                            color: warmColors.primary,
                            textDecoration: "none",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <GlobalOutline
                            style={{
                              fontSize: "14px",
                              marginRight: "6px",
                            }}
                          />
                          Website
                        </a>
                      )}
                      {business.social_links && (
                        <a
                          href={business.social_links}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: "12px",
                            color: warmColors.primary,
                            textDecoration: "none",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <LinkOutlined
                            style={{
                              fontSize: "14px",
                              marginRight: "6px",
                            }}
                          />
                          Social Media
                        </a>
                      )}
                    </div>
                  )}

                  {/* Description */}
                  {business.description && (
                    <div
                      style={{
                        fontSize: "11px",
                        color: warmColors.textSecondary,
                        lineHeight: 1.4,
                        fontStyle: "italic",
                        marginTop: "8px",
                      }}
                    >
                      {business.description}
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
