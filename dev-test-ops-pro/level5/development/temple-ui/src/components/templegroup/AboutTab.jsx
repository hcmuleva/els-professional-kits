import React from "react";
import { Card, Button, Avatar, Tag } from "antd-mobile";
import {
  LocationOutline,
  MailOutline,
  CalendarOutline,
  TeamOutline,
  UserContactOutline,
  GlobalOutline,
  ClockCircleOutline,
  StarOutline,
  HeartOutline,
} from "antd-mobile-icons";
import { PhoneOutlined } from "@ant-design/icons";

const AboutTab = ({ groupInfo }) => {
  const {
    name,
    image,
    memberCount,
    adminCount,
    description,
    location,
    phone,
    email,
    established,
  } = groupInfo;

  // Mock data for additional information
  const additionalInfo = {
    website: "www.radhakrishnatemple.org",
    timings: {
      morning: "5:00 AM - 12:00 PM",
      evening: "4:00 PM - 9:00 PM",
    },
    festivals: [
      "Janmashtami",
      "Holi",
      "Diwali",
      "Govardhan Puja",
      "Radha Ashtami",
    ],
    services: [
      "Daily Aarti",
      "Bhajan Sandhya",
      "Spiritual Discourse",
      "Prasadam Distribution",
      "Yoga Classes",
      "Meditation Sessions",
    ],
    priests: [
      {
        name: "Pandit Radhey Shyam Ji",
        role: "Head Priest",
        experience: "25 years",
        avatar:
          "https://ui-avatars.com/api/?name=Radhey+Shyam&background=D97706&color=fff",
      },
      {
        name: "Pandit Govind Das Ji",
        role: "Senior Priest",
        experience: "18 years",
        avatar:
          "https://ui-avatars.com/api/?name=Govind+Das&background=92400E&color=fff",
      },
      {
        name: "Pandit Krishna Murari Ji",
        role: "Assistant Priest",
        experience: "12 years",
        avatar:
          "https://ui-avatars.com/api/?name=Krishna+Murari&background=A16207&color=fff",
      },
    ],
    achievements: [
      "Spiritual Community Excellence Award 2023",
      "Cultural Heritage Preservation Award 2022",
      "Community Service Recognition 2021",
    ],
  };

  const InfoCard = ({ icon, title, content, gradient = false }) => (
    <Card
      style={{
        margin: "12px 16px",
        borderRadius: "16px",
        background: gradient
          ? "linear-gradient(135deg, #FED7AA 0%, #FDBA74 100%)"
          : "rgba(255, 255, 255, 0.9)",
        border: "1px solid rgba(217, 119, 6, 0.2)",
        boxShadow: "0 4px 20px rgba(217, 119, 6, 0.1)",
        overflow: "hidden",
      }}
    >
      <div style={{ padding: "20px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "16px",
            paddingBottom: "12px",
            borderBottom: gradient
              ? "2px solid rgba(255, 255, 255, 0.3)"
              : "2px solid rgba(217, 119, 6, 0.1)",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              background: gradient
                ? "rgba(255, 255, 255, 0.25)"
                : "linear-gradient(135deg, #D97706 0%, #92400E 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "12px",
              boxShadow: "0 4px 12px rgba(217, 119, 6, 0.25)",
            }}
          >
            {React.cloneElement(icon, {
              style: { fontSize: "20px", color: "white" },
            })}
          </div>
          <h3
            style={{
              margin: 0,
              fontSize: "18px",
              fontWeight: "600",
              color: gradient ? "rgba(92, 64, 14, 0.9)" : "#92400E",
              letterSpacing: "-0.3px",
            }}
          >
            {title}
          </h3>
        </div>
        <div
          style={{
            color: gradient ? "rgba(92, 64, 14, 0.8)" : "#A16207",
            fontSize: "15px",
            lineHeight: "1.6",
          }}
        >
          {content}
        </div>
      </div>
    </Card>
  );

  return (
    <div style={{ paddingBottom: "20px", background: "transparent" }}>
      {/* Temple Hero Section */}
      <Card
        style={{
          margin: "16px",
          borderRadius: "20px",
          background: "linear-gradient(135deg, #D97706 0%, #92400E 100%)",
          border: "none",
          boxShadow: "0 8px 32px rgba(217, 119, 6, 0.3)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "0",
            right: "0",
            fontSize: "120px",
            opacity: "0.1",
            color: "white",
            transform: "rotate(15deg)",
            userSelect: "none",
          }}
        >
          🕉️
        </div>
        <div style={{ padding: "24px", position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <Avatar
              src={image}
              size={80}
              style={{
                marginRight: "20px",
                border: "4px solid rgba(255, 255, 255, 0.3)",
              }}
            />
            <div>
              <h1
                style={{
                  margin: "0 0 8px 0",
                  fontSize: "24px",
                  fontWeight: "700",
                  color: "white",
                  letterSpacing: "-0.5px",
                }}
              >
                {name}
              </h1>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <Tag
                  style={{
                    background: "rgba(255, 255, 255, 0.2)",
                    color: "white",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    borderRadius: "8px",
                    fontWeight: "600",
                  }}
                >
                  🏛️ Temple
                </Tag>
                <Tag
                  style={{
                    background: "rgba(255, 255, 255, 0.2)",
                    color: "white",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    borderRadius: "8px",
                    fontWeight: "600",
                  }}
                >
                  🕉️ Spiritual Center
                </Tag>
              </div>
            </div>
          </div>
          <p
            style={{
              margin: 0,
              fontSize: "16px",
              color: "rgba(255, 255, 255, 0.9)",
              lineHeight: "1.6",
              fontStyle: "italic",
            }}
          >
            "{description}"
          </p>
        </div>
      </Card>

      {/* Quick Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "12px",
          margin: "0 16px 16px 16px",
        }}
      >
        {[
          { icon: "👥", label: "Members", value: memberCount },
          { icon: "👨‍💼", label: "Admins", value: adminCount },
          { icon: "📅", label: "Established", value: established },
          {
            icon: "🏆",
            label: "Years Active",
            value: new Date().getFullYear() - parseInt(established),
          },
        ].map((stat, index) => (
          <Card
            key={index}
            style={{
              borderRadius: "16px",
              background: "rgba(255, 255, 255, 0.9)",
              border: "1px solid rgba(217, 119, 6, 0.2)",
              boxShadow: "0 4px 16px rgba(217, 119, 6, 0.1)",
              textAlign: "center",
              padding: "16px 12px",
            }}
          >
            <div style={{ fontSize: "24px", marginBottom: "8px" }}>
              {stat.icon}
            </div>
            <div
              style={{
                fontSize: "20px",
                fontWeight: "700",
                color: "#92400E",
                marginBottom: "4px",
              }}
            >
              {stat.value}
            </div>
            <div
              style={{ fontSize: "12px", color: "#A16207", fontWeight: "500" }}
            >
              {stat.label}
            </div>
          </Card>
        ))}
      </div>

      {/* Contact Information */}
      <InfoCard
        icon={<LocationOutline />}
        title="Temple Location"
        content={
          <div>
            <div style={{ fontWeight: "600", marginBottom: "8px" }}>
              {location}
            </div>
            <div style={{ fontSize: "14px", opacity: "0.8" }}>
              A sacred place of worship in the heart of Krishna's holy land
            </div>
          </div>
        }
        gradient={true}
      />

      <InfoCard
        icon={<PhoneOutlined />}
        title="Contact Details"
        content={
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div>📞 {phone}</div>
            <div>📧 {email}</div>
            <div>🌐 {additionalInfo.website}</div>
          </div>
        }
      />

      {/* Temple Timings */}
      <InfoCard
        icon={<ClockCircleOutline />}
        title="Temple Timings"
        content={
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px",
                background: "rgba(217, 119, 6, 0.1)",
                borderRadius: "12px",
              }}
            >
              <span style={{ fontWeight: "600" }}>🌅 Morning Darshan</span>
              <span>{additionalInfo.timings.morning}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px",
                background: "rgba(217, 119, 6, 0.1)",
                borderRadius: "12px",
              }}
            >
              <span style={{ fontWeight: "600" }}>🌅 Evening Darshan</span>
              <span>{additionalInfo.timings.evening}</span>
            </div>
          </div>
        }
        gradient={true}
      />

      {/* Temple Priests */}
      <InfoCard
        icon={<UserContactOutline />}
        title="Temple Priests"
        content={
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {additionalInfo.priests.map((priest, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "16px",
                  background: "rgba(217, 119, 6, 0.05)",
                  borderRadius: "12px",
                  border: "1px solid rgba(217, 119, 6, 0.1)",
                }}
              >
                <Avatar
                  src={priest.avatar}
                  size={50}
                  style={{
                    marginRight: "16px",
                    border: "2px solid rgba(217, 119, 6, 0.3)",
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontWeight: "600",
                      color: "#92400E",
                      marginBottom: "4px",
                    }}
                  >
                    {priest.name}
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#A16207",
                      marginBottom: "2px",
                    }}
                  >
                    {priest.role}
                  </div>
                  <div style={{ fontSize: "12px", color: "#D97706" }}>
                    {priest.experience} experience
                  </div>
                </div>
              </div>
            ))}
          </div>
        }
      />

      {/* Services & Activities */}
      <InfoCard
        icon={<StarOutline />}
        title="Temple Services"
        content={
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "12px",
            }}
          >
            {additionalInfo.services.map((service, index) => (
              <div
                key={index}
                style={{
                  padding: "12px",
                  background: "rgba(217, 119, 6, 0.1)",
                  borderRadius: "12px",
                  textAlign: "center",
                  fontSize: "14px",
                  fontWeight: "500",
                  border: "1px solid rgba(217, 119, 6, 0.2)",
                }}
              >
                {service}
              </div>
            ))}
          </div>
        }
        gradient={true}
      />

      {/* Festivals Celebrated */}
      <InfoCard
        icon={<HeartOutline />}
        title="Major Festivals"
        content={
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {additionalInfo.festivals.map((festival, index) => (
              <Tag
                key={index}
                style={{
                  background:
                    "linear-gradient(135deg, #FED7AA 0%, #FDBA74 100%)",
                  color: "#92400E",
                  border: "1px solid rgba(217, 119, 6, 0.3)",
                  borderRadius: "20px",
                  padding: "8px 16px",
                  fontWeight: "600",
                  fontSize: "14px",
                }}
              >
                🎉 {festival}
              </Tag>
            ))}
          </div>
        }
      />

      {/* Achievements */}
      <InfoCard
        icon={<GlobalOutline />}
        title="Achievements & Recognition"
        content={
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {additionalInfo.achievements.map((achievement, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "12px",
                  background: "rgba(217, 119, 6, 0.1)",
                  borderRadius: "12px",
                  border: "1px solid rgba(217, 119, 6, 0.2)",
                }}
              >
                <div
                  style={{
                    fontSize: "20px",
                    marginRight: "12px",
                    color: "#D97706",
                  }}
                >
                  🏆
                </div>
                <div style={{ fontWeight: "500" }}>{achievement}</div>
              </div>
            ))}
          </div>
        }
        gradient={true}
      />

      {/* Contact Action */}
      <div style={{ padding: "0 16px", marginTop: "20px" }}>
        <Button
          style={{
            "--background-color":
              "linear-gradient(135deg, #D97706 0%, #92400E 100%)",
            "--border": "none",
            "--border-radius": "16px",
            color: "white",
            fontWeight: "600",
            padding: "16px",
            fontSize: "16px",
            width: "100%",
            boxShadow: "0 8px 24px rgba(217, 119, 6, 0.3)",
          }}
        >
          🙏 Contact Temple Management
        </Button>
      </div>
    </div>
  );
};

export default AboutTab;
