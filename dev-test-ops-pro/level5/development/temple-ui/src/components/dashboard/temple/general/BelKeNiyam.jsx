import React from "react";
import { Card, Typography, Divider, Space } from "antd";
import {
  BookOutlined,
  HeartOutlined,
  StarOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const BelKeNiyam = () => {
  const niyamRules = [
    {
      id: 1,
      title: "प्रस्तावना",
      lines: [
        "श्री आई माताजी के द्वारा बताये हुए बेल के ग्यारह नियम बाय सीरवी समाज सम्पूर्ण भारत",
        "बेल आईजी री बान्धो भाई, नेम धरम सब पालो भाई।",
      ],
      isIntro: true,
    },
    {
      id: 2,
      title: "पहला और दूसरा नियम",
      lines: ["परथम झूठ तजो सुख पाई, दूजो मद-मांस छुड़ाई।"],
      rules: ["सत्य का पालन करें", "मद्य और मांस का त्याग करें"],
    },
    {
      id: 3,
      title: "तीसरा और चौथा नियम",
      lines: ["तीजो धन पर ब्याज न लेवो, चैथे जुआ कभी न खेलो।"],
      rules: ["धन पर ब्याज न लें", "जुआ न खेलें"],
    },
    {
      id: 4,
      title: "पांचवां और छठा नियम",
      lines: ["पंचम मात-पिता री सेवा, छठे अभ्यागत हो देवा।"],
      rules: ["माता-पिता की सेवा करें", "अतिथि को देवता समान मानें"],
    },
    {
      id: 5,
      title: "सातवां और आठवां नियम",
      lines: ["सात गुरू की आज्ञा पालो, आठों पर हित मारग चालो।"],
      rules: ["गुरु की आज्ञा का पालन करें", "सबके हित में कार्य करें"],
    },
    {
      id: 6,
      title: "नौवां और दसवां नियम",
      lines: ["नव पर नारी माता जाणों, दस कन्या को धरम परणावो।"],
      rules: ["पराई नारी को माता समान मानें", "कन्या का धर्मानुसार विवाह करें"],
    },
    {
      id: 7,
      title: "ग्यारहवां नियम",
      lines: ["स्वारथ काज न अकरम करना, गांठ ग्यारह सन्मारग चलना।"],
      rules: ["स्वार्थ के लिए अधर्म न करें", "सन्मार्ग पर चलें"],
    },
    {
      id: 8,
      title: "बेल बांधने की विधि",
      lines: ["हाथ पुरुष अरू गले लुगाई, बान्धो बेल कहो जय आई।"],
      isMethod: true,
    },
    {
      id: 9,
      title: "समापन मंत्र",
      lines: [
        "जय आई श्री अम्बे माई, देव दनुज सब तेरो यश गाई।",
        "बेल आईजी री बान्धो भाई, नेम धरम सब पालो भाई।",
      ],
      isConclusion: true,
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
                <BookOutlined style={{ fontSize: "24px", color: "#ff6b6b" }} />
                <Title
                  level={2}
                  style={{
                    margin: 0,
                    color: "#1f2937",
                    fontSize: "24px",
                    fontWeight: "600",
                  }}
                >
                  माताजी के बेल के नियम
                </Title>
                <BookOutlined style={{ fontSize: "24px", color: "#ff6b6b" }} />
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
                11 पवित्र नियम
              </Text>
            </Space>
          </div>
          <Divider style={{ borderColor: "#e5e7eb", margin: "16px 0" }} />
          <div style={{ padding: "0 16px" }}>
            {niyamRules.map((rule) => (
              <div key={rule.id} style={{ marginBottom: "16px" }}>
                
                  <div
                    style={{
                      background: "#f8fafc",
                      color: "#1f2937",
                      padding: "8px 16px",
                      margin: "-8px -16px 16px -16px",
                      borderRadius: "8px 8px 0 0",
                      fontWeight: "600",
                      fontSize: "16px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <CheckCircleOutlined style={{ color: "#ff6b6b" }} />
                    {rule.title}
                  </div>
                  <Space
                    direction="vertical"
                    size="large"
                    style={{ width: "100%" }}
                  >
                    {rule.lines.map((line, lineIndex) => (
                      <div key={lineIndex} style={{ textAlign: "center" }}>
                        <Text
                          style={{
                            fontSize: "16px",
                            fontWeight:
                              rule.isIntro || rule.isConclusion ? "600" : "500",
                            color:
                              rule.isIntro || rule.isConclusion
                                ? "#ff6b6b"
                                : "#1f2937",
                            lineHeight: "1.8",
                            display: "block",
                            padding: "4px 0",
                          }}
                        >
                          {line}
                        </Text>
                      </div>
                    ))}
                    {rule.rules && (
                      <div style={{ marginTop: "12px" }}>
                        <Space
                          direction="vertical"
                          size="small"
                          style={{ width: "100%" }}
                        >
                          {rule.rules.map((ruleText, ruleIndex) => (
                            <div
                              key={ruleIndex}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                padding: "8px 12px",
                                background: "#f8fafc",
                                borderRadius: "6px",
                              }}
                            >
                              <CheckCircleOutlined
                                style={{ color: "#22c55e", fontSize: "14px" }}
                              />
                              <Text
                                style={{ fontSize: "14px", color: "#1f2937" }}
                              >
                                {ruleText}
                              </Text>
                            </div>
                          ))}
                        </Space>
                      </div>
                    )}
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
                  जय आई श्री अम्बे माई
                </Text>
                <HeartOutlined style={{ color: "#ff6b6b", fontSize: "16px" }} />
              </div>
              <Text style={{ color: "#6b7280", fontSize: "14px" }}>
                धर्म की विजय हो
              </Text>
            </Space>
          </div>
       
      </div>
    </div>
  );
};

export default BelKeNiyam;
