import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Row, Col, Card, Typography } from "antd";

const { Title } = Typography;

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
  textAlign: "center", // ✅ center align
};
export default function BonusToTemple() {
    const navigate = useNavigate();

    const {id} = useParams()
    const bonusdata=[
        {
            id: "temple",
            name: "मंदिर",
            icon: "🏯",
            path: id ? `/temple/${id}` : "/temple",
          },
        
         
         
          {
            id: "dharm",
            name: "धर्म",
            icon: "🕉️",
            path: "/generaltempleallinone",
          },
         
          
          {
            id: "newborn",
            name: "नवजात शिशु",
            icon: "👶",
            path: id ? `/templeachievements/${id}` : "/achievements",
          },
          {
            id: "passedaway",
            name: "स्वर्गवास",
            icon: "🕊️",
            path: "/passedaway",
          },
          {
            id: "familylist",
            name: "samgraid",
            icon: "👨‍👩‍👧‍👦",
            path: "/familylist",
          }
          
    ]
  return (
    <>
    <Row gutter={[16, 16]} style={gridStyle}>
      {bonusdata?.map((item, index) => (
        <Col xs={8} sm={8} md={6} lg={4} key={index}>
          <Card
            style={cardStyle}
            hoverable
            bordered={false}
            bodyStyle={{ padding: 0 }}
            onClick={() => navigate(item.path)}
          >
            <div style={cardContentStyle}>
              <div style={iconContainerStyle}>
                <span
                  role="img"
                  aria-label={item.name}
                  style={{ fontSize: 28 }}
                >
                  {item.icon}
                </span>
              </div>
              <Title level={5} style={cardTitleStyle}>
                {item.name}
              </Title>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  </>
  )
}
