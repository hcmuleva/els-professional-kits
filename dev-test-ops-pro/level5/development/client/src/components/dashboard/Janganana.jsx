import React, { useEffect, useState } from "react";
import { Table, Typography, Row, Col, Card, Spin, Alert } from "antd";
import {
  TeamOutlined,
  BarChartOutlined,
  IdcardOutlined,
  BookOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { NavBar } from "antd-mobile";
import { useNavigate } from "react-router-dom";
import { getUserCounts } from "../../services/userInfoApi";
import { useAuth } from "../../contexts/AuthContext";

const { Title } = Typography;

export default function Janganana() {
  const [data, setData] = useState({
    userCounts: [],
    businesses: [],
    professions: [],
    gotraCounts: [],
    educationCounts: [],
    agricultureCounts: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const templeId = user?.temples?.[0]?.id;

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

  // Updated normalizeData function to include agricultureCounts
  const normalizeData = (data) => {
    const demographicSummary = {
      maleAdult: 0,
      femaleAdult: 0,
      boyKid: 0,
      girlKid: 0,
      unspecified: 0,
      totalPopulation: 0,
      ageGroups: {
        age_0_10: 0,
        age_11_20: 0,
        age_21_30: 0,
        age_31_40: 0,
        age_41_50: 0,
        age_51_60: 0,
        age_61_plus: 0,
      },
    };

    // Process userCounts data
    data.userCounts.forEach((item) => {
      const group = item.group ? item.group.toLowerCase() : "";
      const total = parseInt(item.total || 0);

      demographicSummary.totalPopulation += total;

      if (group.includes("male_adult")) {
        demographicSummary.maleAdult += total;
      } else if (group.includes("female_adult")) {
        demographicSummary.femaleAdult += total;
      } else if (group.includes("boy_kid")) {
        demographicSummary.boyKid += total;
      } else if (group.includes("girl_kid")) {
        demographicSummary.girlKid += total;
      } else if (group.includes("unspecified")) {
        demographicSummary.unspecified += total;
      }

      demographicSummary.ageGroups.age_0_10 += parseInt(item.age_0_10 || 0);
      demographicSummary.ageGroups.age_11_20 += parseInt(item.age_11_20 || 0);
      demographicSummary.ageGroups.age_21_30 += parseInt(item.age_21_30 || 0);
      demographicSummary.ageGroups.age_31_40 += parseInt(item.age_31_40 || 0);
      demographicSummary.ageGroups.age_41_50 += parseInt(item.age_41_50 || 0);
      demographicSummary.ageGroups.age_51_60 += parseInt(item.age_51_60 || 0);
      demographicSummary.ageGroups.age_61_plus +=
        parseInt(item.age_61_70 || 0) +
        parseInt(item.age_71_80 || 0) +
        parseInt(item.age_81_90 || 0) +
        parseInt(item.age_91_100 || 0) +
        parseInt(item.age_101_110 || 0);
    });

    return {
      ...data,
      demographicSummary,
      businesses: data.businesses
        .filter(
          (item) => item.type && item.type.trim() && item.type.trim() !== ""
        )
        .map((item) => ({
          ...item,
          type: item.type.trim().toUpperCase(),
          count: parseInt(item.count || 0),
        }))
        .sort((a, b) => b.count - a.count),
      professions: data.professions
        .filter((item) => item.profession_type && item.profession_type.trim())
        .map((item) => ({
          ...item,
          profession_type: item.profession_type.trim().toUpperCase(),
          count: parseInt(item.count || 0),
        }))
        .sort((a, b) => b.count - a.count),
      educationCounts: data.educationCounts
        ?.filter((item) => item.education_level && item.education_level.trim())
        .map((item) => ({
          ...item,
          education_level: item.education_level.trim().toUpperCase(),
          count: parseInt(item.count || 0),
        }))
        .sort((a, b) => b.count - a.count) || [],
      gotraCounts:
        data.gotraCounts
          ?.filter((item) => item.gotra && item.gotra.trim())
          .map((item) => ({
            ...item,
            gotra: item.gotra.trim().toUpperCase(),
            total: parseInt(item.total || 0),
          }))
          .sort((a, b) => b.total - a.total) || [],
      agricultureCounts: data.agricultureCounts
        ?.filter((item) => item.land_unit && item.land_unit.trim())
        .map((item) => ({
          ...item,
          land_unit: item.land_unit.trim().toUpperCase(),
          totalUsers: parseInt(item.totalUsers || 0),
          totalLandArea: parseInt(item.totalLandArea || 0),
        }))
        .sort((a, b) => b.totalUsers - a.totalUsers) || [],
    };
  };

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        console.log("Fetching user counts for templeId:", templeId);
        const res = await getUserCounts(templeId);
        const json = await res.json();
        setData(normalizeData(json));
      } catch (err) {
        setError("जनगणना डेटा लोड करने में विफल।");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, [user]);

  // Create demographic table data
  const createDemographicData = () => {
    const { demographicSummary } = data;

    const demographicData = [
      {
        key: "पुरुष (वयस्क) 👨",
        count: demographicSummary.maleAdult,
        percentage:
          demographicSummary.totalPopulation > 0
            ? (
                (demographicSummary.maleAdult /
                  demographicSummary.totalPopulation) *
                100
              ).toFixed(1)
            : 0,
      },
      {
        key: "महिला (वयस्क) 👩",
        count: demographicSummary.femaleAdult,
        percentage:
          demographicSummary.totalPopulation > 0
            ? (
                (demographicSummary.femaleAdult /
                  demographicSummary.totalPopulation) *
                100
              ).toFixed(1)
            : 0,
      },
      {
        key: "लड़का (बच्चा) 👦",
        count: demographicSummary.boyKid,
        percentage:
          demographicSummary.totalPopulation > 0
            ? (
                (demographicSummary.boyKid /
                  demographicSummary.totalPopulation) *
                100
              ).toFixed(1)
            : 0,
      },
      {
        key: "लड़की (बच्चा) 👧",
        count: demographicSummary.girlKid,
        percentage:
          demographicSummary.totalPopulation > 0
            ? (
                (demographicSummary.girlKid /
                  demographicSummary.totalPopulation) *
                100
              ).toFixed(1)
            : 0,
      },
      {
        key: "अनिर्दिष्ट 👤",
        count: demographicSummary.unspecified,
        percentage:
          demographicSummary.totalPopulation > 0
            ? (
                (demographicSummary.unspecified /
                  demographicSummary.totalPopulation) *
                100
              ).toFixed(1)
            : 0,
      },
    ];

    return demographicData;
  };

  // Create age group data
  const createAgeGroupData = () => {
    const { ageGroups } = data.demographicSummary;
    const totalAgeData = Object.values(ageGroups).reduce(
      (sum, count) => sum + count,
      0
    );

    const ageData = [
      {
        key: "बच्चे (0-10) 👶",
        count: ageGroups.age_0_10,
        percentage:
          totalAgeData > 0
            ? ((ageGroups.age_0_10 / totalAgeData) * 100).toFixed(1)
            : 0,
      },
      {
        key: "किशोर (11-20) 🧑",
        count: ageGroups.age_11_20,
        percentage:
          totalAgeData > 0
            ? ((ageGroups.age_11_20 / totalAgeData) * 100).toFixed(1)
            : 0,
      },
      {
        key: "युवा (21-30) 👨‍💼",
        count: ageGroups.age_21_30,
        percentage:
          totalAgeData > 0
            ? ((ageGroups.age_21_30 / totalAgeData) * 100).toFixed(1)
            : 0,
      },
      {
        key: "प्रौढ़ (31-40) 👩‍💼",
        count: ageGroups.age_31_40,
        percentage:
          totalAgeData > 0
            ? ((ageGroups.age_31_40 / totalAgeData) * 100).toFixed(1)
            : 0,
      },
      {
        key: "मध्यम आयु (41-50) 👨‍🦳",
        count: ageGroups.age_41_50,
        percentage:
          totalAgeData > 0
            ? ((ageGroups.age_41_50 / totalAgeData) * 100).toFixed(1)
            : 0,
      },
      {
        key: "वरिष्ठ (51-60) 👩‍🦳",
        count: ageGroups.age_51_60,
        percentage:
          totalAgeData > 0
            ? ((ageGroups.age_51_60 / totalAgeData) * 100).toFixed(1)
            : 0,
      },
      {
        key: "बुजुर्ग (61+) 👴",
        count: ageGroups.age_61_plus,
        percentage:
          totalAgeData > 0
            ? ((ageGroups.age_61_plus / totalAgeData) * 100).toFixed(1)
            : 0,
      },
    ];

    return ageData;
  };

  const demographicColumns = [
    {
      title: "श्रेणी",
      dataIndex: "key",
      key: "key",
      width: 180,
      render: (text) => (
        <span style={{ color: warmColors.textPrimary, fontWeight: 500 }}>
          {text}
        </span>
      ),
    },
    {
      title: "संख्या",
      dataIndex: "count",
      key: "count",
      width: 80,
      align: "center",
      render: (text) => (
        <span style={{ color: warmColors.textSecondary, fontWeight: 600 }}>
          {text}
        </span>
      ),
    },
    {
      title: "प्रतिशत",
      dataIndex: "percentage",
      key: "percentage",
      width: 80,
      align: "center",
      render: (text) => (
        <span style={{ color: warmColors.primary, fontWeight: 500 }}>
          {text}%
        </span>
      ),
    },
  ];

  const businessColumns = [
    {
      title: "व्यवसाय का प्रकार",
      dataIndex: "type",
      key: "type",
      width: 200,
      render: (text) => (
        <span style={{ color: warmColors.textPrimary, fontWeight: 500 }}>
          {text}
        </span>
      ),
    },
    {
      title: "गिनती",
      dataIndex: "count",
      key: "count",
      width: 80,
      align: "center",
      render: (text) => (
        <span style={{ color: warmColors.textSecondary, fontWeight: 600 }}>
          {text}
        </span>
      ),
    },
  ];

  const professionColumns = [
    {
      title: "पेशे का प्रकार",
      dataIndex: "profession_type",
      key: "profession_type",
      width: 200,
      render: (text) => (
        <span style={{ color: warmColors.textPrimary, fontWeight: 500 }}>
          {text}
        </span>
      ),
    },
    {
      title: "गिनती",
      dataIndex: "count",
      key: "count",
      width: 80,
      align: "center",
      render: (text) => (
        <span style={{ color: warmColors.textSecondary, fontWeight: 600 }}>
          {text}
        </span>
      ),
    },
  ];

  const educationColumns = [
    {
      title: "शिक्षा स्तर",
      dataIndex: "education_level",
      key: "education_level",
      width: 200,
      render: (text) => (
        <span style={{ color: warmColors.textPrimary, fontWeight: 500 }}>
          {text}
        </span>
      ),
    },
    {
      title: "गिनती",
      dataIndex: "count",
      key: "count",
      width: 80,
      align: "center",
      render: (text) => (
        <span style={{ color: warmColors.textSecondary, fontWeight: 600 }}>
          {text}
        </span>
      ),
    },
  ];

  const agricultureColumns = [
    {
      title: "भूमि इकाई",
      dataIndex: "land_unit",
      key: "land_unit",
      width: 150,
      render: (text) => (
        <span style={{ color: warmColors.textPrimary, fontWeight: 500 }}>
          {text}
        </span>
      ),
    },
    {
      title: "उपयोगकर्ता",
      dataIndex: "totalUsers",
      key: "totalUsers",
      width: 80,
      align: "center",
      render: (text) => (
        <span style={{ color: warmColors.textSecondary, fontWeight: 600 }}>
          {text}
        </span>
      ),
    },
    {
      title: "कुल क्षेत्र",
      dataIndex: "totalLandArea",
      key: "totalLandArea",
      width: 100,
      align: "center",
      render: (text) => (
        <span style={{ color: warmColors.textSecondary, fontWeight: 600 }}>
          {text}
        </span>
      ),
    },
  ];

  const gotraColumns = [
    {
      title: "गोत्र",
      dataIndex: "gotra",
      key: "gotra",
      width: 200,
      render: (text) => (
        <span style={{ color: warmColors.textPrimary, fontWeight: 500 }}>
          {text}
        </span>
      ),
    },
    {
      title: "संख्या",
      dataIndex: "total",
      key: "total",
      width: 80,
      align: "center",
      render: (text) => (
        <span style={{ color: warmColors.textSecondary, fontWeight: 600 }}>
          {text}
        </span>
      ),
    },
  ];

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
        <Spin
          size="large"
          tip="जनगणना डेटा लोड हो रहा है..."
          style={{ color: warmColors.primary }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: warmColors.background,
          padding: "20px",
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
          जनगणना
        </NavBar>
        <Alert
          message="त्रुटि"
          description={error}
          type="error"
          showIcon
          style={{
            marginTop: "16px",
            borderRadius: "8px",
            border: `1px solid ${warmColors.error}`,
            background: warmColors.cardBg,
          }}
        />
      </div>
    );
  }

  const demographicData = createDemographicData();
  const ageGroupData = createAgeGroupData();

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
        जनगणना
      </NavBar>

      <div style={{ marginTop: "16px" }}>
        <Title
          level={2}
          style={{
            marginBottom: "24px",
            color: warmColors.textPrimary,
            textAlign: "center",
          }}
        >
          📊 जनगणना रिपोर्ट
        </Title>

        {/* Population Summary Card */}
        <Card
          style={{
            marginBottom: "24px",
            borderRadius: "12px",
            border: `1px solid ${warmColors.border}`,
            boxShadow: "0 4px 12px rgba(210, 105, 30, 0.1)",
            background: `linear-gradient(135deg, ${warmColors.primary}15, ${warmColors.secondary}10)`,
          }}
          bodyStyle={{ padding: "20px", textAlign: "center" }}
        >
          <Title level={3} style={{ color: warmColors.textPrimary, margin: 0 }}>
            कुल जनसंख्या: {data.demographicSummary?.totalPopulation || 0}
          </Title>
        </Card>

        <Row gutter={[16, 24]} align="top">
          {/* Demographic Data */}
          <Col xs={24} lg={12}>
            <Card
              title={
                <span
                  style={{
                    color: warmColors.textPrimary,
                    fontSize: "16px",
                    fontWeight: "600",
                  }}
                >
                  <TeamOutlined
                    style={{ marginRight: "8px", color: warmColors.primary }}
                  />
                  जनसांख्यिकी वितरण
                </span>
              }
              bordered={false}
              style={{
                borderRadius: "12px",
                border: `1px solid ${warmColors.border}`,
                boxShadow: "0 2px 8px rgba(210, 105, 30, 0.08)",
                background: warmColors.cardBg,
              }}
              headStyle={{
                background: `${warmColors.primary}05`,
                borderBottom: `1px solid ${warmColors.border}`,
              }}
              bodyStyle={{ padding: "16px" }}
            >
              <Table
                dataSource={demographicData}
                columns={demographicColumns}
                pagination={false}
                rowKey="key"
                size="small"
                bordered
                style={{ background: warmColors.cardBg, marginBottom: "16px" }}
                rowClassName={() => "ant-table-row-warm"}
              />
            </Card>
          </Col>

          {/* Age Group Data */}
          <Col xs={24} lg={12}>
            <Card
              title={
                <span
                  style={{
                    color: warmColors.textPrimary,
                    fontSize: "16px",
                    fontWeight: "600",
                  }}
                >
                  <TeamOutlined
                    style={{ marginRight: "8px", color: warmColors.primary }}
                  />
                  आयु समूह वितरण
                </span>
              }
              bordered={false}
              style={{
                borderRadius: "12px",
                border: `1px solid ${warmColors.border}`,
                boxShadow: "0 2px 8px rgba(210, 105, 30, 0.08)",
                background: warmColors.cardBg,
              }}
              headStyle={{
                background: `${warmColors.primary}05`,
                borderBottom: `1px solid ${warmColors.border}`,
              }}
              bodyStyle={{ padding: "16px" }}
            >
              <Table
                dataSource={ageGroupData}
                columns={demographicColumns}
                pagination={false}
                rowKey="key"
                size="small"
                bordered
                style={{ background: warmColors.cardBg }}
                rowClassName={() => "ant-table-row-warm"}
              />
            </Card>
          </Col>

          {/* Gotra Data */}
          <Col xs={24} lg={12}>
            <Card
              title={
                <span
                  style={{
                    color: warmColors.textPrimary,
                    fontSize: "16px",
                    fontWeight: "600",
                  }}
                >
                  <TeamOutlined
                    style={{ marginRight: "8px", color: warmColors.primary }}
                  />
                  गोत्र वितरण ({data.gotraCounts?.length || 0})
                </span>
              }
              bordered={false}
              style={{
                borderRadius: "12px",
                border: `1px solid ${warmColors.border}`,
                boxShadow: "0 2px 8px rgba(210, 105, 30, 0.08)",
                background: warmColors.cardBg,
              }}
              headStyle={{
                background: `${warmColors.primary}05`,
                borderBottom: `1px solid ${warmColors.border}`,
              }}
              bodyStyle={{ padding: "16px" }}
            >
              <Table
                dataSource={data.gotraCounts || []}
                columns={gotraColumns}
                pagination={{ pageSize: 8, showSizeChanger: false }}
                rowKey={(record, index) => `gotra-${index}`}
                size="small"
                bordered
                style={{ background: warmColors.cardBg }}
                rowClassName={() => "ant-table-row-warm"}
                scroll={{ y: 300 }}
              />
            </Card>
          </Col>

          {/* Business Data */}
          <Col xs={24} lg={12}>
            <Card
              title={
                <span
                  style={{
                    color: warmColors.textPrimary,
                    fontSize: "16px",
                    fontWeight: "600",
                  }}
                >
                  <BarChartOutlined
                    style={{ marginRight: "8px", color: warmColors.primary }}
                  />
                  व्यवसाय के आधार पर ({data.businesses?.length || 0})
                </span>
              }
              bordered={false}
              style={{
                borderRadius: "12px",
                border: `1px solid ${warmColors.border}`,
                boxShadow: "0 2px 8px rgba(210, 105, 30, 0.08)",
                background: warmColors.cardBg,
              }}
              headStyle={{
                background: `${warmColors.primary}05`,
                borderBottom: `1px solid ${warmColors.border}`,
              }}
              bodyStyle={{ padding: "16px" }}
            >
              <div
                style={{
                  marginBottom: "12px",
                  textAlign: "center",
                  fontSize: "12px",
                  color: warmColors.textSecondary,
                  fontStyle: "italic",
                  padding: "8px",
                  background: `${warmColors.primary}05`,
                  borderRadius: "6px",
                  border: `1px dashed ${warmColors.border}`,
                }}
              >
                📍 व्यवसाय स्थान और विवरण देखने के लिए क्लिक करें
              </div>
              <Table
                dataSource={data.businesses || []}
                columns={businessColumns}
                pagination={{ pageSize: 8, showSizeChanger: false }}
                rowKey={(record, index) => `biz-${index}`}
                size="small"
                bordered
                style={{ background: warmColors.cardBg }}
                rowClassName={() => "ant-table-row-warm"}
                scroll={{ y: 300 }}
                onRow={(record) => ({
                  onClick: () => {
                    navigate("/businesslist", {
                      state: { selectedBusiness: record, templeId: templeId },
                    });
                  },
                  style: { cursor: "pointer" },
                })}
              />
            </Card>
          </Col>

          {/* Education Data */}
          <Col xs={24} lg={12}>
            <Card
              title={
                <span
                  style={{
                    color: warmColors.textPrimary,
                    fontSize: "16px",
                    fontWeight: "600",
                  }}
                >
                  <BookOutlined
                    style={{ marginRight: "8px", color: warmColors.primary }}
                  />
                  शिक्षा के आधार पर ({data.educationCounts?.length || 0})
                </span>
              }
              bordered={false}
              style={{
                borderRadius: "12px",
                border: `1px solid ${warmColors.border}`,
                boxShadow: "0 2px 8px rgba(210, 105, 30, 0.08)",
                background: warmColors.cardBg,
              }}
              headStyle={{
                background: `${warmColors.primary}05`,
                borderBottom: `1px solid ${warmColors.border}`,
              }}
              bodyStyle={{ padding: "16px" }}
            >
              <div
                style={{
                  marginBottom: "12px",
                  textAlign: "center",
                  fontSize: "12px",
                  color: warmColors.textSecondary,
                  fontStyle: "italic",
                  padding: "8px",
                  background: `${warmColors.primary}05`,
                  borderRadius: "6px",
                  border: `1px dashed ${warmColors.border}`,
                }}
              >
                📍 उपयोगकर्ता सूची देखने के लिए शिक्षा स्तर पर क्लिक करें
              </div>
              <Table
                dataSource={data.educationCounts || []}
                columns={educationColumns}
                pagination={{ pageSize: 8, showSizeChanger: false }}
                rowKey={(record, index) => `edu-${index}`}
                size="small"
                bordered
                style={{ background: warmColors.cardBg }}
                rowClassName={() => "ant-table-row-warm"}
                scroll={{ y: 300 }}
                onRow={(record) => ({
                  onClick: () => {
                    navigate("/education-list", {
                      state: { selectedEducation: record, templeId: templeId },
                    });
                  },
                  style: { cursor: "pointer" },
                })}
              />
            </Card>
          </Col>

          {/* Agriculture Data */}
          <Col xs={24} lg={12}>
            <Card
              title={
                <span
                  style={{
                    color: warmColors.textPrimary,
                    fontSize: "16px",
                    fontWeight: "600",
                  }}
                >
                  <EnvironmentOutlined
                    style={{ marginRight: "8px", color: warmColors.primary }}
                  />
                  कृषि भूमि के आधार पर ({data.agricultureCounts?.length || 0})
                </span>
              }
              bordered={false}
              style={{
                borderRadius: "12px",
                border: `1px solid ${warmColors.border}`,
                boxShadow: "0 2px 8px rgba(210, 105, 30, 0.08)",
                background: warmColors.cardBg,
              }}
              headStyle={{
                background: `${warmColors.primary}05`,
                borderBottom: `1px solid ${warmColors.border}`,
              }}
              bodyStyle={{ padding: "16px" }}
            >
              <div
                style={{
                  marginBottom: "12px",
                  textAlign: "center",
                  fontSize: "12px",
                  color: warmColors.textSecondary,
                  fontStyle: "italic",
                  padding: "8px",
                  background: `${warmColors.primary}05`,
                  borderRadius: "6px",
                  border: `1px dashed ${warmColors.border}`,
                }}
              >
                📍 उपयोगकर्ता सूची देखने के लिए भूमि इकाई पर क्लिक करें
              </div>
              <Table
                dataSource={data.agricultureCounts || []}
                columns={agricultureColumns}
                pagination={{ pageSize: 8, showSizeChanger: false }}
                rowKey={(record, index) => `agri-${index}`}
                size="small"
                bordered
                style={{ background: warmColors.cardBg }}
                rowClassName={() => "ant-table-row-warm"}
                scroll={{ y: 300 }}
                onRow={(record) => ({
                  onClick: () => {
                    navigate("/agriculture-list", {
                      state: { selectedAgriculture: record, templeId: templeId },
                    });
                  },
                  style: { cursor: "pointer" },
                })}
              />
            </Card>
          </Col>

          {/* Profession Data */}
          <Col xs={24} lg={12}>
            <Card
              title={
                <span
                  style={{
                    color: warmColors.textPrimary,
                    fontSize: "16px",
                    fontWeight: "600",
                  }}
                >
                  <IdcardOutlined
                    style={{ marginRight: "8px", color: warmColors.primary }}
                  />
                  पेशे के आधार पर ({data.professions?.length || 0})
                </span>
              }
              bordered={false}
              style={{
                borderRadius: "12px",
                border: `1px solid ${warmColors.border}`,
                boxShadow: "0 2px 8px rgba(210, 105, 30, 0.08)",
                background: warmColors.cardBg,
              }}
              headStyle={{
                background: `${warmColors.primary}05`,
                borderBottom: `1px solid ${warmColors.border}`,
              }}
              bodyStyle={{ padding: "16px" }}
            >
              <div
                style={{
                  marginBottom: "12px",
                  textAlign: "center",
                  fontSize: "12px",
                  color: warmColors.textSecondary,
                  fontStyle: "italic",
                  padding: "8px",
                  background: `${warmColors.primary}05`,
                  borderRadius: "6px",
                  border: `1px dashed ${warmColors.border}`,
                }}
              >
                📍 उपयोगकर्ता सूची देखने के लिए पेशे पर क्लिक करें
              </div>
              <Table
                dataSource={data.professions || []}
                columns={professionColumns}
                pagination={{ pageSize: 8, showSizeChanger: false }}
                rowKey={(record, index) => `prof-${index}`}
                size="small"
                bordered
                style={{ background: warmColors.cardBg }}
                rowClassName={() => "ant-table-row-warm"}
                scroll={{ y: 300 }}
                onRow={(record) => ({
                  onClick: () => {
                    navigate("/professionlist", {
                      state: { selectedProfession: record, templeId: templeId },
                    });
                  },
                  style: { cursor: "pointer" },
                })}
              />
            </Card>
          </Col>
        </Row>

        {/* Data Accuracy Note */}
        <Card
          style={{
            marginTop: "24px",
            borderRadius: "12px",
            border: `1px solid ${warmColors.warning}`,
            background: `${warmColors.warning}08`,
          }}
          bodyStyle={{ padding: "16px", textAlign: "center" }}
        >
          <div style={{ color: warmColors.textSecondary, fontSize: "14px" }}>
            <strong style={{ color: warmColors.warning }}>📝 टिप्पणी:</strong>{" "}
            कुछ डेटा अधूरा हो सकता है क्योंकि उपयोगकर्ताओं ने सभी फ़ील्ड नहीं
            भरे हैं या उन्हें उचित भूमिकाएं असाइन नहीं की गई हैं।
          </div>
        </Card>
      </div>

      <style jsx>{`
        .ant-table-row-warm {
          background: ${warmColors.cardBg} !important;
        }
        .ant-table-row-warm:hover > td {
          background: ${warmColors.primary}05 !important;
        }
        .ant-table-thead > tr > th {
          background: ${warmColors.primary}10 !important;
          color: ${warmColors.textPrimary} !important;
          font-weight: chiếm
          border-bottom: 1px solid ${warmColors.border} !important;
          padding: 12px 8px !important;
          font-size: 13px !important;
          text-align: center !important;
        }
        .ant-table-tbody > tr > td {
          border-bottom: 1px solid ${warmColors.border} !important;
          color: ${warmColors.textSecondary} !important;
          padding: 10px 8px !important;
          font-size: 13px !important;
        }
        .ant-table-tbody > tr:hover > td {
          background: ${warmColors.primary}08 !important;
        }
        .ant-card {
          transition: all 0.3s ease !important;
        }
        .ant-card:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 4px 16px rgba(210, 105, 30, 0.12) !important;
        }
      `}</style>
    </div>
  );
}