import React from "react";
import { Table, Input, Row, Col, Typography, Space, Button } from "antd";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

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
  { value: "niece", label: "Niece", name_hi: "भतीजी / भांजी" },
  { value: "self", label: "Self", name_hi: "स्वयं" },
  { value: "other", label: "Other", name_hi: "अन्य" },
];

const inputStyle = {
  width: "150px",
  borderBottom: "1px dotted #000",
  background: "transparent",
};

const FamilySurveyForm = ({ data }) => {
  const navigate = useNavigate();
  const current = data.currentAddress || {};
  const home = data.homeAddress || {};

  const getRelationInHindi = (value, member) => {
    if (member.relationToHead === "self") return "मुखिया";
    const relation = mukhiyarelationOptions.find((r) => r.value === value);
    return relation?.name_hi || value;
  };

  const columns = [
    {
      title: "क्र.",
      dataIndex: "serialNo",
      key: "serialNo",
      width: 40,
      align: "center",
      render: (text, record, index) => index + 1,
    },
    { title: "नाम", dataIndex: "name", key: "name", width: 150 },
    {
      title: "मुखिया से सम्बन्ध",
      dataIndex: "relationship",
      key: "relationship",
      width: 150,
      render: (text, record) => getRelationInHindi(text, record),
    },
    { title: "उम्र", dataIndex: "age", key: "age", width: 100 },
    { title: "लिंग", dataIndex: "gender", key: "gender", width: 60 },
    { title: "शिक्षा", dataIndex: "education", key: "education", width: 80 },
    {
      title: "विवाहित है / नहीं",
      dataIndex: "maritalStatus",
      key: "maritalStatus",
      width: 100,
    },
    {
      title: "व्यवसाय/ नौकरी",
      dataIndex: "occupation",
      key: "occupation",
      width: 120,
    },
    { title: "मोबाईल न.", dataIndex: "mobileNo", key: "mobileNo", width: 120 },
    {
      title: "ब्लड ग्रुप",
      dataIndex: "blood_group",
      key: "blood_group",
      width: 120,
    },
  ];

  return (
    <>
      <Button onClick={() => navigate(-1)}>Back (वापस जाएं)</Button>
      <div
        style={{
          padding: 20,
          fontFamily: "Arial",
          background: "#fff",
        }}
      >
        {/* Top Header */}
        <Row justify="space-between" align="top">
          <Col span={4}>
            <img
              src="https://hphmeelan.s3.us-east-1.amazonaws.com/aayimataphoto_8dd4377aab.jpg"
              alt="Ganesh"
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                border: "2px solid #000",
              }}
            />{" "}
            background: "#fff",
          </Col>
          <Col span={16} style={{ textAlign: "center" }}>
            <Title level={2} style={{ color: "#d4af37", margin: 0 }}>
              श्री आई माताजी की कृपा
            </Title>
            <Title
              level={1}
              style={{ color: "#e91e63", fontWeight: "bold", margin: 5 }}
            >
              {data.templeName || ""}
            </Title>
            <Text
              style={{ fontSize: 18, fontWeight: "bold", color: "#1976d2" }}
            >
              {data.templeAddress || ""}
            </Text>
          </Col>
          <Col span={4}>
            <img
              src="https://hphmeelan.s3.us-east-1.amazonaws.com/19thdiwansahab_93b7fca991.jpeg"
              alt="Diwan Ji"
              style={{
                width: 80,
                height: 100,
                border: "2px solid #000",
                borderRadius: 10,
              }}
            />
          </Col>
        </Row>

        {/* Survey Info */}
        <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
          <Col span={12}>
            <Text strong>क्रमांक:</Text>{" "}
            <Input value={data.serialNo} style={inputStyle} bordered={false} />
          </Col>
          <Col span={12}>
            <Text strong>दिनांक:</Text>{" "}
            <Input value={data.date} style={inputStyle} bordered={false} />
            <img
              src={data.profilePictureUrl}
              alt="मुखिया"
              style={{
                width: 80,
                height: 80,
                marginLeft: 20,
                border: "2px solid red",
              }}
            />
          </Col>
        </Row>

        <Row gutter={[16, 8]}>
          <Col span={24}>
            <Space>
              <Text strong>मुखिया का नाम</Text>
              <Input
                value={data.headName}
                style={{ width: 300, ...inputStyle }}
                bordered={false}
              />
              <Text strong>गोत्र</Text>
              <Input value={data.gotra} style={inputStyle} bordered={false} />
            </Space>
          </Col>
        </Row>

        <Row gutter={[16, 8]}>
          <Col span={24}>
            <Space>
              <Text strong>पिताजी</Text>
              <Input
                value={data.fatherName}
                style={{ width: 300, ...inputStyle }}
                bordered={false}
              />
              <Text strong>मोबाइल</Text>
              <Input
                value={data.mobileNo}
                style={inputStyle}
                bordered={false}
              />
            </Space>
          </Col>
        </Row>

        {/* CURRENT ADDRESS */}
        <Row gutter={[16, 8]}>
          <Col span={24}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Text strong>वर्तमान पता (Current Address)</Text>
              <Space wrap>
                <Text strong>गृह नाम</Text>
                <Input
                  value={current.housename}
                  style={inputStyle}
                  bordered={false}
                />
                <Text strong>गांव</Text>
                <Input
                  value={current.village}
                  style={inputStyle}
                  bordered={false}
                />
                <Text strong>जिला</Text>
                <Input
                  value={current.district}
                  style={inputStyle}
                  bordered={false}
                />
                <Text strong>राज्य</Text>
                <Input
                  value={current.state}
                  style={inputStyle}
                  bordered={false}
                />
                <Text strong>पिनकोड</Text>
                <Input
                  value={current.pincode}
                  style={inputStyle}
                  bordered={false}
                />
              </Space>
            </Space>
          </Col>
        </Row>

        {/* Family Members */}
        <Table
          columns={columns}
          dataSource={data.familyMembers}
          pagination={false}
          bordered
          size="small"
          rowKey="serialNo"
          style={{ marginTop: 30, marginBottom: 30 }}
        />

        {/* Summary Counts */}
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Text strong>व्यवसाय (संख्या):</Text>{" "}
            <Input value={data.business1} style={inputStyle} bordered={false} />
          </Col>
          <Col span={12}>
            <Text strong>नौकरी (संख्या):</Text>{" "}
            <Input
              value={data.jobDetails1}
              style={inputStyle}
              bordered={false}
            />
          </Col>
        </Row>

        {/* HOME ADDRESS near signature */}
        <Row style={{ marginTop: 40 }}>
          <Col span={24}>
            <Text strong>मूल निवास(Home Address):</Text>
            <div
              style={{
                height: 60,
                borderBottom: "1px dotted #000",
                marginTop: 10,
              }}
            >
              <Text>
                {[
                  home.housename,
                  home.village,
                  home.tehsil,
                  home.district,
                  home.state,
                  home.country,
                  home.pincode ? `पिन: ${home.pincode}` : "",
                ]
                  .filter(Boolean)
                  .join(", ") || "उपलब्ध नहीं"}
              </Text>
            </div>
          </Col>
        </Row>

        {/* Footer Signatures */}
        <Row justify="space-between" style={{ marginTop: 30 }}>
          <Col span={8}>
            <Text strong>मुखिया के हस्ताक्षर</Text>
          </Col>
          <Col span={8} style={{ textAlign: "center" }}>
            <Text strong>सचिव</Text>
          </Col>
          <Col span={8} style={{ textAlign: "right" }}>
            <Text strong>अध्यक्ष</Text>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default FamilySurveyForm;
