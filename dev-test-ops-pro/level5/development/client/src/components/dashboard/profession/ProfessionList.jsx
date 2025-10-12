import React, { useEffect, useState } from "react";
import {
  Card,
  SearchBar,
  Tag,
  Space,
  Loading,
  Empty,
  NavBar,
  Toast,
} from "antd-mobile";
import { UserOutline, PhoneOutline, GlobalOutline } from "antd-mobile-icons";
import { PhoneOutlined, LinkOutlined, IdcardOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { getProfessionsUser } from "../../../services/profession";

export default function ProfessionList() {
  const location = useLocation();
  const selectedProfession = location.state?.selectedProfession;
  const templeId = location.state?.templeId || null;
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
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
    if (!selectedProfession?.profession_type) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const data = await getProfessionsUser(
          selectedProfession.profession_type,
          templeId
        );
        setUsers(data?.data || []);
        setFilteredUsers(data?.data || []);
      } catch (err) {
        Toast.show({
          icon: "fail",
          content: "Failed to load profession users",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedProfession?.profession_type]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter((item) => {
      const user = item.attributes.user?.data?.attributes;
      const profession = item.attributes;
      const searchFields = [
        user?.first_name?.toLowerCase(),
        user?.last_name?.toLowerCase(),
        user?.gotra?.toLowerCase(),
        profession?.profession_type?.toLowerCase(),
        profession?.category?.toLowerCase(),
        profession?.subcategory?.toLowerCase(),
        profession?.role?.toLowerCase(),
      ].filter(Boolean);

      return searchFields.some((field) =>
        field.includes(searchTerm.toLowerCase())
      );
    });

    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const formatUserDetails = (user) => {
    if (!user?.data?.attributes) return null;
    const userData = user.data.attributes;
    return {
      name: `${userData.first_name || ""} ${userData.last_name || ""}`.trim(),
      father: userData.father,
      gotra: userData.gotra,
      gender: userData.gender,
      mobile: userData.mobile,
      marital_status: userData.marital_status,
      age: userData.age,
    };
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
            Loading Professionals...
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
        Profession Directory
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
          <h3
            style={{
              margin: 0,
              fontSize: "18px",
              fontWeight: "600",
              color: warmColors.textPrimary,
            }}
          >
            {selectedProfession?.profession_type?.toUpperCase() ||
              "PROFESSIONS"}
          </h3>
          <p
            style={{
              margin: "4px 0 12px 0",
              fontSize: "12px",
              color: warmColors.textSecondary,
            }}
          >
            {filteredUsers.length} professionals found
          </p>
          <SearchBar
            placeholder="Search professionals..."
            value={searchTerm}
            onChange={setSearchTerm}
            style={{
              "--adm-color-primary": warmColors.primary,
              "--border-radius": "8px",
            }}
          />
        </div>
      </Card>

      {/* User Cards */}
      {filteredUsers.length === 0 ? (
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
                ? `No professionals found for "${searchTerm}"`
                : `No ${selectedProfession?.profession_type} professionals found`
            }
            style={{ padding: "40px 0" }}
            image={
              <IdcardOutlined style={{ fontSize: 48, color: "#d9d9d9" }} />
            }
          />
        </Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {filteredUsers.map((item) => {
            const user = item.attributes.user?.data?.attributes;
            const profession = item.attributes;
            const userDetails = formatUserDetails(item.attributes.user);

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
                  {/* Avatar */}
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
                    <UserOutline
                      style={{
                        fontSize: "24px",
                        color: warmColors.secondary,
                      }}
                    />
                  </div>
                  {/* User Name and Profession */}
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
                      {userDetails?.name || "Unknown User"} (ID: {item.id})
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
                        {profession.profession_type || "Unspecified"}
                      </Tag>
                      {profession.category && (
                        <Tag
                          color={warmColors.accent}
                          style={{
                            fontSize: "10px",
                            padding: "2px 6px",
                            border: "none",
                          }}
                        >
                          {profession.category}
                        </Tag>
                      )}
                      {profession.subcategory && (
                        <Tag
                          color={warmColors.success}
                          style={{
                            fontSize: "10px",
                            padding: "2px 6px",
                            border: "none",
                          }}
                        >
                          {profession.subcategory}
                        </Tag>
                      )}
                      {profession.role && (
                        <Tag
                          color={warmColors.warning}
                          style={{
                            fontSize: "10px",
                            padding: "2px 6px",
                            border: "none",
                          }}
                          encompass
                        >
                          {profession.role}
                        </Tag>
                      )}
                    </Space>
                  </div>
                </div>

                {/* User Details */}
                <div
                  style={{
                    backgroundColor: `${warmColors.primary}05`,
                    borderRadius: "8px",
                    padding: "12px",
                  }}
                >
                  {/* User Details */}
                  {userDetails && (
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
                          {userDetails.name || "Unknown User"}
                        </span>
                        {userDetails.father && (
                          <span style={{ marginLeft: "4px" }}>
                            (S/o {userDetails.father})
                          </span>
                        )}
                        {(userDetails.gotra ||
                          userDetails.gender ||
                          userDetails.marital_status ||
                          userDetails.age) && (
                          <div
                            style={{
                              fontSize: "11px",
                              color: warmColors.textSecondary,
                            }}
                          >
                            {userDetails.gotra && `Gotra: ${userDetails.gotra}`}
                            {userDetails.gotra &&
                              (userDetails.gender ||
                                userDetails.marital_status ||
                                userDetails.age) &&
                              " • "}
                            {userDetails.gender && userDetails.gender}
                            {userDetails.gender &&
                              (userDetails.marital_status || userDetails.age) &&
                              " • "}
                            {userDetails.marital_status &&
                              userDetails.marital_status}
                            {userDetails.marital_status &&
                              userDetails.age &&
                              " • "}
                            {userDetails.age && `${userDetails.age} years`}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Contact Information */}
                  {userDetails?.mobile && (
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
                        {userDetails.mobile}
                      </span>
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
