import React, { useEffect, useState } from "react";
import { Card, Typography, Select, Row, Col } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext, useAuth } from "../../../contexts/AuthContext";
import { getTempleSubcategories } from "../../../services/temple";

const { Title } = Typography;
const { Option } = Select;

const gridStyle = {
  padding: "12px",
};

const cardStyle = {
  textAlign: "center",
  borderRadius: 12,
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
};

const cardContentStyle = {
  padding: 16,
};

const iconContainerStyle = {
  width: 50,
  height: 50,
  margin: "0 auto 12px",
  fontSize: 32,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "50%",
  backgroundColor: "#f5f5f5",
};

const cardTitleStyle = {
  fontSize: 12,
  marginBottom: 4,
  fontWeight: 500,
};

export default function UserTempleController() {
  const { id } = useParams();
  const [communityData, setCommunityData] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const { user } = useAuth(AuthContext);
  const temples = user?.temples || [];
  const [selectedTempleId, setSelectedTempleId] = useState(
    id ? Number(id) : temples?.[0]?.id
  );

  useEffect(() => {
    if (id && Number(id) !== selectedTempleId) {
      setSelectedTempleId(Number(id));
    }
  }, [id]);

  const fetchAssignedCommunities = async () => {
    setLoading(true);
    try {
      const response = await getTempleSubcategories(id);
      const subcategories =
        response?.data?.attributes?.subcategories?.data || [];
      const mappedData = subcategories.map((subcategory) => ({
        id: subcategory.id,
        name: subcategory.attributes.name,
        icon: subcategory.attributes.icon,
        name_hi: subcategory.attributes.name_hi,
      }));
      setCommunityData(mappedData);
    } catch (err) {
      console.error("Error fetching assigned communities", err);
      setCommunityData([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAssignedCommunities();
  }, [id]);

  const handleTempleChange = (value) => {
    setSelectedTempleId(value);
    // navigate(`/usertemple/${value}`); // Uncomment if navigation is desired
  };

  const selectedTemple = temples.find(
    (temple) => temple.id === selectedTempleId
  );

  return (
    <div style={{ padding: 24 }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={3}>
            {selectedTemple ? `${selectedTemple.title} मंदिर` : "मंदिर"}
          </Title>
        </Col>
        {temples.length > 1 && (
          <Col>
            <Select
              value={selectedTempleId}
              onChange={handleTempleChange}
              style={{ width: 250 }}
              placeholder="मंदिर चुनें"
            >
              {temples.map((temple) => (
                <Option key={temple.id} value={temple.id}>
                  {temple.title}
                </Option>
              ))}
            </Select>
          </Col>
        )}
      </Row>
      <Row gutter={[16, 16]} style={gridStyle}>
        {communityData.map((item, index) => (
          <Col xs={8} sm={8} md={6} lg={4} key={index}>
            <Card
              style={cardStyle}
              hoverable
              bordered={false}
              bodyStyle={{ padding: 0 }}
              onClick={() =>
                navigate(`/usertemple/${id}/subcategory/${item.id}`)
              }
            >
              <div style={cardContentStyle}>
                <div style={iconContainerStyle}>
                  <span role="img" aria-label="icon" style={{ fontSize: 28 }}>
                    {item.icon}
                  </span>
                </div>
                <Title level={5} style={cardTitleStyle}>
                  {item.name_hi}
                </Title>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
