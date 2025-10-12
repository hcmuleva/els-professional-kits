import React from "react";
import { Card, Typography, Button, Row, Col, message } from "antd";
import { ShareAltOutlined, LinkOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const demoContent = {
  imageUrl: "https://hphmeelan.s3.us-east-1.amazonaws.com/aayimataphoto_8dd4377aab.jpg",
  title: "सीरवी समाज - डिजिटल सामाजिक मंच",
  description: "🌐 सीरवी समाज का पहला डिजिटल प्लेटफॉर्म\n\n✅ स्वचालित जनगणना\n✅ संस्कार शिविर की जानकारी\n✅ विश्वभर के समाजजनों से जुड़ें\n✅ समाज का सम्पूर्ण इतिहास एक स्थान पर\n\nअभी जुड़ें:",
  link: "https://seervisamaj.org/invite"  // This should be your website URL, not image path
};

export default function SharableCard() {
    const [imageError, setImageError] = React.useState(false);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: demoContent.title,
          text: `${demoContent.title}\n\n${demoContent.description}\n${demoContent.link}`,
          url: demoContent.link
        });
      } else {
        await navigator.clipboard.writeText(
          `${demoContent.title}\n\n${demoContent.description}\n${demoContent.link}`
        );
        message.success('लिंक क्लिपबोर्ड पर कॉपी हो गया!');
      }
    } catch (err) {
      console.error('Share failed:', err);
      message.error('शेयर करने में त्रुटि हुई');
    }
  };

  const handleWhatsAppShare = () => {
    const message = encodeURIComponent(
      `${demoContent.title}\n\n${demoContent.description}\n${demoContent.link}`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(demoContent.link)
      .then(() => message.success('लिंक कॉपी हो गया!'))
      .catch(() => message.error('कॉपी करने में त्रुटि'));
  };

  return (
    <Card
      style={{
        width: "100%",
        maxWidth: 400,
        margin: "20px auto",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 4px 8px rgba(139, 69, 19, 0.2)",
        borderColor: "#8B4513"
      }}
      cover={
        <div style={{ height: 220, overflow: "hidden" }}>
        <img
  src={imageError ? "/default-image.jpg" : demoContent.imageUrl}
  alt={demoContent.title}
  style={{ width: "100%", height: "100%", objectFit: "cover" }}
  onError={() => {
    console.error("Failed to load image:", demoContent.imageUrl);
    setImageError(true);
  }}
/>
        </div>
      }
    >
      <Title 
        level={4} 
        style={{ 
          color: "#8B4513",
          textAlign: "center",
          marginBottom: 16
        }}
      >
        {demoContent.title}
      </Title>
      
      <Paragraph style={{ 
        whiteSpace: "pre-line",
        fontSize: 15,
        lineHeight: 1.6,
        marginBottom: 20
      }}>
        {demoContent.description}
      </Paragraph>

      <div style={{ 
        background: "#FFF8E1", 
        padding: 10,
        borderRadius: 8,
        marginBottom: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <span style={{ 
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          paddingRight: 10
        }}>
          {demoContent.link}
        </span>
        <Button 
          icon={<LinkOutlined />} 
          type="text" 
          onClick={copyLink}
        />
      </div>

      <Row gutter={12}>
        <Col span={12}>
          <Button
            icon={<ShareAltOutlined />}
            block
            style={{
              background: "#8B4513",
              color: "white",
              border: "none",
              height: 40
            }}
            onClick={handleShare}
          >
            शेयर करें
          </Button>
        </Col>
        <Col span={12}>
          <Button
            icon={
              <img 
                src="https://cdn-icons-png.flaticon.com/512/124/124034.png" 
                alt="WhatsApp" 
                style={{ width: 20, marginRight: 5 }} 
              />
            }
            block
            style={{
              background: "#25D366",
              color: "white",
              border: "none",
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            onClick={handleWhatsAppShare}
          >
            WhatsApp
          </Button>
        </Col>
      </Row>
    </Card>
  );
}