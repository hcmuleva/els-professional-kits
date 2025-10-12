// Dashboard Component
import { Card, Row, Col, Typography, Badge, Button } from "antd";
import {
  UserOutlined,
  BankOutlined,
  FireOutlined,
  MessageOutlined,
  CalendarOutlined,
  ThunderboltOutlined,
  GlobalOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  QuestionCircleFilled,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { getSingleOrg } from "../../services/org";
import {
  getTempleById,
  getTempleLists,
  getTempleSubcategories,
} from "../../services/temple";
import DashboardCoreTeam from "./DashboardCoreTeam";
import FirstTimeUserCard from "../../components/common/FirstTimeUserCard";

const { Title, Text } = Typography;

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, totalUnreadCount, resetNotifications } =
    useContext(AuthContext);
  const [dashboardItems, setDashboardItems] = useState([]);
  const [templeInfo, setTempleInfo] = useState([]);

  const firstTimeUserCardDismissed = localStorage.getItem(
    "firstTimeUserCardDismissed"
  );
  // Professional warm color palette
  const warmColors = {
    primary: "#8B4513",
    secondary: "#A0522D",
    accent: "#CD853F",
    background: "#FAFAFA",
    cardBg: "#FFFFFF",
    textPrimary: "#2C2C2C",
    textSecondary: "#666666",
    border: "#E8E8E8",
  };

  const templeId =
    user?.temples?.length > 0
      ? user.temples[0]?.id
      : Array.isArray(user?.temples)
      ? null
      : user?.temples;

  useEffect(() => {
    const templeFetch = async () => {
      const response = await getTempleById(templeId);
      console.log("response getTempleSubcategories", response?.data);
      // const res = await getTempleLists();
      const info = response?.data?.attributes;
      setTempleInfo(info);
    };
    templeFetch();
  }, []);

  // Extract temple data from templeInfo
  const templeImage = templeInfo?.images?.data?.[0]?.attributes;
  const templeAddress = templeInfo?.address?.data?.attributes;

  // Handle navigation-based notification reset
  useEffect(() => {
    if (location.pathname.startsWith("/userannouncements")) {
      console.log("📢 Resetting notifications due to navigation to viewer");
      resetNotifications();
    }
  }, [location.pathname, resetNotifications]);

  const allDashboardItems = [
    {
      id: 1,
      title: "सामाजिक जानकारी",
      subtitle: "संपर्क, प्रोफ़ाइल",
      icon: GlobalOutlined,
      backgroundColor: `${warmColors.primary}15`,
      iconColor: warmColors.primary,
      path: "/janganana",
    },
    {
      id: 2,
      title: "मेरा परिवार",
      subtitle: "परिवार के सदस्य",
      icon: UserOutlined,
      backgroundColor: `${warmColors.secondary}15`,
      iconColor: warmColors.secondary,
      path: "/myfamily",
    },
    {
      id: 3,
      title: "बड़ेर",
      subtitle: "हमारा बड़ेर",
      icon: BankOutlined,
      backgroundColor: `${warmColors.accent}15`,
      iconColor: warmColors.accent,
      path: `/usertemple/${templeId}`,
    },
    {
      id: 4,
      title: "घोषणा",
      subtitle: "आपके मैसेज",
      icon: MessageOutlined,
      backgroundColor: `${warmColors.secondary}15`,
      iconColor: warmColors.secondary,
      path: "/templeuserannouncment",
    },
    // {
    //   id: 5,
    //   title: "मंदिर सूची",
    //   subtitle: "सभी मंदिर",
    //   icon: CalendarOutlined,
    //   backgroundColor: `${warmColors.primary}15`,
    //   iconColor: warmColors.primary,
    //   path: "/templelist",
    // },
    // {
    //   id: 6,
    //   title: "कार्यक्रम",
    //   subtitle: "सामाजिक गतिविधियाँ",
    //   icon: CalendarOutlined,
    //   backgroundColor: `${warmColors.secondary}15`,
    //   iconColor: warmColors.secondary,
    //   path: "/events",
    // },
    // {
    //   id: 7,
    //   title: "कार्यक्रम",
    //   subtitle: "कार्यक्रम की जानकारी",
    //   icon: ThunderboltOutlined,
    //   backgroundColor: `${warmColors.accent}15`,
    //   iconColor: warmColors.accent,
    //   path: "/activity-view",
    // },
    {
      id: 8,
      title: "धर्म",
      subtitle: "धार्मिक सेवाएँ",
      icon: FireOutlined,
      backgroundColor: `${warmColors.primary}15`,
      iconColor: warmColors.primary,
      path: "/dharm",
    },
    {
      id: 9,
      title: "परिवार",
      subtitle: "सभी परिवार",
      icon: TeamOutlined,
      backgroundColor: `${warmColors.info}15`,
      iconColor: warmColors.info,
      path: "/all-family",
    },
    // {
    //   id: 10,
    //   title: "संस्कार",
    //   subtitle: "संस्कार-शिविर",
    //   icon: TeamOutlined,
    //   backgroundColor: `${warmColors.info}15`,
    //   iconColor: warmColors.info,
    //   path: "/hcmquizapp",
    // },
    // {
    //   id: 11,
    //   title: "MyCard",
    //   subtitle: "ShareCard",
    //   icon: TeamOutlined,
    //   backgroundColor: `${warmColors.info}15`,
    //   iconColor: warmColors.info,
    //   path: "/mycard",
    // },
    // {
    //   id: 12,
    //   title: "सवाल और जवाब",
    //   subtitle: "सवाल और जवाब",
    //   icon: QuestionCircleFilled,
    //   backgroundColor: `${warmColors.secondary}15`,
    //   iconColor: warmColors.secondary,
    //   path: "/questionarea",
    // },
  ];

  useEffect(() => {
    const isPendingStatus = user?.userstatus === "PENDING";
    // const filteredItems = isPendingStatus
    //   ? allDashboardItems.filter((item) => item.id === 1 || item.id === 8)
    //   : allDashboardItems;
    const filteredItems = isPendingStatus
      ? allDashboardItems.filter((item) => item.id === 8)
      : allDashboardItems;
    setDashboardItems(filteredItems);
  }, [user?.userstatus]);

  const handleGetDirections = () => {
    if (templeAddress?.latitude && templeAddress?.longitude) {
      const mapsUrl = `https://maps.google.com/maps?q=${templeAddress.latitude},${templeAddress.longitude}`;
      window.open(mapsUrl, "_blank");
    }
  };

  const formatAddress = (address) => {
    if (!address) return "Address not available";
    const parts = [
      address.housename,
      address.landmark,
      address.village,
      address.tehsil,
      address.district,
      address.state,
      address.pincode,
      address.country,
    ].filter(Boolean);
    return parts.join(", ");
  };

  return (
    <div style={{ backgroundColor: warmColors.background, minHeight: "100vh" }}>
      {firstTimeUserCardDismissed && (
        <FirstTimeUserCard
          navigate={navigate}
          warmColors={warmColors}
          user={user}
        />
      )}
      {/* Professional Temple Banner */}
      <div
        style={{
          margin: "16px",
          borderRadius: "24px",
          overflow: "hidden",
          backgroundColor: warmColors.cardBg,
          boxShadow: `0 12px 36px ${warmColors.primary}20`,
          border: `1px solid ${warmColors.border}`,
        }}
      >
        {/* Main Banner Section */}
        <div
          style={{
            position: "relative",
            background: `linear-gradient(135deg, ${warmColors.primary} 0%, ${warmColors.secondary} 100%)`,
            color: "white",
            minHeight: "170px",
            display: "flex",
            alignItems: "center",
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
              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(255,255,255,0.08) 0%, transparent 50%)`,
              pointerEvents: "none",
            }}
          />

          {/* Temple Image */}
          {templeImage?.url && (
            <div
              style={{
                position: "absolute",
                right: "24px",
                top: "24px",
                bottom: "24px",
                width: "120px",
                height: "120px", // Ensure square aspect ratio
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                zIndex: 2,
              }}
            >
              <img
                src={templeImage.url}
                alt={templeImage.alternativeText || "Temple"}
                style={{
                  width: "100%",
                  height: "100%",
                  objectPosition: "center",
                }}
              />
            </div>
          )}

          {/* Content */}
          <div
            style={{
              padding: "24px",
              flex: 1,
              zIndex: 1,
              maxWidth: templeImage?.url ? "calc(100% - 160px)" : "100%",
            }}
          >
            <div
              style={{
                fontSize: "18px",
                fontWeight: "700",
                marginBottom: "8px",
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              {templeInfo?.title || "Welcome to Emeelan"}
            </div>
            {/* <div
              style={{
                fontSize: "16px",
                opacity: 0.9,
                marginBottom: "16px",
                fontWeight: "400",
              }}
            >
              {templeInfo?.subtitle || "Connect with your community"}
            </div> */}
            {/* <div
              style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "rgba(255,255,255,0.95)",
                marginBottom: "16px",
              }}
            >
              Welcome, {user?.first_name || "Guest"}!
            </div> */}
          </div>
        </div>

        {/* Address Section */}
        {templeAddress && (
          <div
            style={{
              padding: "20px 24px",
              backgroundColor: warmColors.cardBg,
              borderTop: `1px solid ${warmColors.border}`,
            }}
          >
            <Row gutter={[16, 12]} align="middle">
              <Col xs={24} md={18}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                  }}
                >
                  <EnvironmentOutlined
                    style={{
                      fontSize: "18px",
                      color: warmColors.primary,
                      marginTop: "2px",
                    }}
                  />
                  <div>
                    <Text
                      style={{
                        color: warmColors.textPrimary,
                        fontSize: "14px",
                        fontWeight: "500",
                        display: "block",
                        marginBottom: "4px",
                      }}
                    >
                      Temple Address
                    </Text>
                    <Text
                      style={{
                        color: warmColors.textSecondary,
                        fontSize: "13px",
                        lineHeight: "1.5",
                      }}
                    >
                      {formatAddress(templeAddress)}
                    </Text>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        )}
      </div>

      {/* Dashboard Items */}
      <div
        style={{
          padding: "0 16px 24px 16px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <Row gutter={[12, 6]} justify="center">
          <Col xs={24} style={{ marginBottom: "4px" }}>
            <DashboardCoreTeam templeId={templeId} subcategoryId={141} />
          </Col>
          {dashboardItems.map((item) => {
            const IconComponent = item.icon;
            const isAnnouncementTab = item.id === 4;

            return (
              <Col
                xs={12}
                sm={6}
                md={6}
                lg={6}
                xl={6}
                key={item.id}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Badge
                  count={isAnnouncementTab ? totalUnreadCount : 0}
                  style={{
                    backgroundColor:
                      totalUnreadCount > 0 ? "#ef4444" : warmColors.primary,
                  }}
                  showZero={false}
                >
                  <Card
                    hoverable
                    style={{
                      borderRadius: "16px",
                      border: `1px solid ${warmColors.border}`,
                      boxShadow: `0 4px 12px ${warmColors.primary}15`,
                      transition: "all 0.3s ease",
                      height: "140px",
                      cursor: "pointer",
                      width: "140px",
                      backgroundColor: warmColors.cardBg,
                    }}
                    styles={{
                      body: {
                        padding: "0",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      },
                    }}
                    onClick={() => navigate(item.path)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow = `0 8px 24px ${warmColors.primary}25`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = `0 4px 12px ${warmColors.primary}15`;
                    }}
                  >
                    <div
                      style={{
                        textAlign: "center",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: item.backgroundColor,
                          height: "70px",
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "16px 16px 0 0",
                          marginBottom: "12px",
                          flexShrink: 0,
                        }}
                      >
                        <IconComponent
                          style={{
                            fontSize: "28px",
                            color: item.iconColor,
                            display: "block",
                          }}
                        />
                      </div>

                      <div
                        style={{
                          padding: "0 12px 16px 12px",
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                        }}
                      >
                        <Title
                          level={5}
                          style={{
                            color: warmColors.textPrimary,
                            marginBottom: "4px",
                            fontSize: "13px",
                            fontWeight: 600,
                            lineHeight: 1.2,
                          }}
                        >
                          {item.title}
                        </Title>
                        <Text
                          style={{
                            color: warmColors.textSecondary,
                            fontSize: "11px",
                            lineHeight: 1.3,
                            display: "block",
                          }}
                        >
                          {item.subtitle}
                        </Text>
                      </div>
                    </div>
                  </Card>
                </Badge>
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
};

export default Dashboard;
