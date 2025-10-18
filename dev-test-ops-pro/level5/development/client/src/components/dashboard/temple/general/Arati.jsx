import React from "react";
import { Card, Typography, Divider, Space } from "antd";
import { FireOutlined, HeartOutlined, StarOutlined } from "@ant-design/icons";
import AayimatajiArti from "./AayimatajiArti";

const { Title, Text } = Typography;

const Arati = () => {
  const aratiVerses = [
    {
      id: 1,
      lines: [
        "आरती बोलो सब मिल भाई, आरती गावो सब मिल भाई,",
        "जय आई श्री अंम्बे माई, जय आई श्री दुर्गे माई,",
        "जय आईं श्री अंम्बे माई, जय आई श्री दुर्गे माई।।",
      ],
    },
    {
      id: 2,
      lines: [
        "राव बिका घर अम्बापुर में, अवतार लियो जगदम्बे माई,",
        "ब्याव करन खिलजी चढ़ आयो, तौबा कर कर जान बचाई,",
        "जय आईं श्री अंम्बे माई, जय आई श्री दुर्गे माई।।",
      ],
    },
    {
      id: 3,
      lines: [
        "नारलाई में दियो परचो भारी, पत्थर शिला माँ अधर धराई,",
        "डायलाणा मे बडलो तो हडालो, छाया करी जगदम्बे माई,",
        "जय आईं श्री अंम्बे माई, जय आई श्री दुर्गे माई।।",
      ],
    },
    {
      id: 4,
      lines: [
        "भेसाणा मे किना भाटा, बिलाड़ा मे माँ ज्योति समाई,",
        "मेवाड़ धरा रायमलजी पाई, हिन्दूवा सूरज लाज बचाई,",
        "जय आईं श्री अंम्बे माई, जय आई श्री दुर्गे माई।।",
      ],
    },
    {
      id: 5,
      lines: [
        "जाणोजी रो पूरीयो मनोरथ, माधवजी सु मेल कराई,",
        "माही बीज दिवान पद राजे, भादवी बीज ने ज्योति जगाई,",
        "जय आईं श्री अंम्बे माई, जय आई श्री दुर्गे माई।।",
      ],
    },
    {
      id: 6,
      lines: [
        "रोहित दिवानजी ने जोधाणा सु, मिली रियासत मान बढाई,",
        "हरिदासजी पानी पर चाल्या, अचरज करीयो अहिल्याबाई,",
        "जय आईं श्री अंम्बे माई, जय आई श्री दुर्गे माई।।",
      ],
    },
    {
      id: 7,
      lines: [
        "मंदिर बिलाडा मे परचो भारी, अखण्ड ज्योत सु केसर पाई,",
        "मालवा मेवाड़ गुजरात देशरा, घर घर में तेरी रहा यश गाई,",
        "जय आईं श्री अंम्बे माई, जय आई श्री दुर्गे माई।।",
      ],
    },
    {
      id: 8,
      lines: [
        "जो कोई आईजी री आरती गावे, मन वांछित फल पल में पावे,",
        "आईजी री आरती सुनावे, जय आईं श्री अंम्बे माई, जय आई श्री दुर्गे माई।।",
      ],
    },
    {
      id: 9,
      lines: [
        "जय आई श्री अंम्बे माई, जय आई श्री दुर्गे माई, आरती बोलो सब मिल भाई,",
        "आरती गावो सब मिल भाई, जय आईं श्री अंम्बे माई, जय आई श्री दुर्गे माई।।",
      ],
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f0f2f5",
        padding: "16px",
        fontFamily: 'Inter, "Noto Serif Devanagari", sans-serif',
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
       
          <div style={{ textAlign: "center", padding: "16px" }}>
            <Space direction="vertical" size="middle">
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <FireOutlined style={{ fontSize: "24px", color: "#ff6b6b" }} />
                <Title
                  level={2}
                  style={{
                    margin: 0,
                    color: "#1f2937",
                    fontSize: "24px",
                    fontWeight: "600",
                  }}
                >
                  माताजी की आरती
                </Title>
                <FireOutlined style={{ fontSize: "24px", color: "#ff6b6b" }} />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "6px",
                }}
              >
                {[...Array(5)].map((_, i) => (
                  <StarOutlined
                    key={i}
                    style={{ color: "#f59e0b", fontSize: "16px" }}
                  />
                ))}
              </div>
              <Text style={{ color: "#6b7280", fontSize: "16px" }}>
                श्री अम्बे माता की महिमा
              </Text>
            </Space>
          </div>
          <Divider style={{ borderColor: "#e5e7eb", margin: "16px 0" }} />
          <div style={{ padding: "0 16px" }}>
            {aratiVerses.map((verse) => (
              <div key={verse.id} style={{ marginBottom: "16px" }}>
               
                  <div
                    style={{
                      position: "absolute",
                      top: "8px",
                      right: "8px",
                      background: "#ff6b6b",
                      color: "#ffffff",
                      borderRadius: "50%",
                      width: "24px",
                      height: "24px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                  >
                    {verse.id}
                  </div>
                  <Space
                    direction="vertical"
                    size="middle"
                    style={{ width: "100%" }}
                  >
                    {verse.lines.map((line, lineIndex) => (
                      <div key={lineIndex} style={{ textAlign: "center" }}>
                        <Text
                          style={{
                            fontSize: "14px",
                            fontWeight: line.includes("जय आई") ? "600" : "500",
                            color: line.includes("जय आई")
                              ? "#ff6b6b"
                              : "#1f2937",
                            lineHeight: "1.8",
                            display: "block",
                            padding: "2px 0",
                          }}
                        >
                          {line}
                        </Text>
                      </div>
                    ))}
                  </Space>
               
              </div>
            ))}
          </div>
          <Divider style={{ borderColor: "#e5e7eb", margin: "16px 0" }} />
          <div style={{ textAlign: "center", padding: "16px" }}>
            <Space direction="vertical" size="middle">
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                  alignItems: "center",
                }}
              >
                <HeartOutlined style={{ color: "#ff6b6b", fontSize: "16px" }} />
                <Text
                  style={{
                    color: "#1f2937",
                    fontSize: "16px",
                    fontWeight: "600",
                  }}
                >
                  जय माता दी • हर हर महादेव
                </Text>
                <HeartOutlined style={{ color: "#ff6b6b", fontSize: "16px" }} />
              </div>
              <Text style={{ color: "#6b7280", fontSize: "14px" }}>
                सर्वमंगल मांगल्ये शिवे सर्वार्थसाधिके
              </Text>
            </Space>
          </div>
          <Divider style={{ borderColor: "#e5e7eb", margin: "16px 0" }} />     
          <AayimatajiArti/>      
      </div>
    </div>
  );
};

export default Arati;
