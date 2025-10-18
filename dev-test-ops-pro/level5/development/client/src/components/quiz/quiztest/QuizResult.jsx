import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  HomeOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Progress,
  Result,
  Row,
  Space,
  Tag,
  Typography,
} from "antd";

const { Title, Text } = Typography;

export const QuizResult = ({ quizSummary, language = "en", onReturnHome }) => {
  const getDifficultyColor = (level) => {
    const colors = {
      EASY: "green",
      MEDIUM: "orange",
      HARD: "red",
      HARDEST: "purple",
    };
    return colors[level] || "default";
  };

  const getCategoryColor = (category) => {
    const colors = {
      RELIGION: "purple",
      SCIENCE: "blue",
      TRICKS: "pink",
      MATHS: "indigo",
      HISTORY: "gold",
      GEOGRAPHY: "cyan",
      AI: "lime",
    };
    return colors[category] || "default";
  };

  const scorePercentage = Math.round(
    (quizSummary.correctAnswers / quizSummary.totalQuestions) * 100
  );

  const getScoreStatus = (percentage) => {
    if (percentage >= 80)
      return {
        status: "success",
        message: language === "en" ? "Excellent!" : "उत्कृष्ट!",
      };
    if (percentage >= 60)
      return {
        status: "info",
        message: language === "en" ? "Good Job!" : "अच्छा काम!",
      };
    if (percentage >= 40)
      return {
        status: "warning",
        message: language === "en" ? "Not Bad!" : "बुरा नहीं!",
      };
    return {
      status: "error",
      message: language === "en" ? "Keep Practicing!" : "अभ्यास करते रहें!",
    };
  };

  const { status, message: statusMessage } = getScoreStatus(scorePercentage);

  // Convert option value back to display text for results
  const getOptionDisplayText = (
    optionValue,
    questionOptions,
    currentLanguage
  ) => {
    const option = questionOptions.find((opt) => opt.option_en === optionValue);
    if (!option) return optionValue;
    return currentLanguage === "en" ? option.option_en : option.option_hi;
  };

  const formatAnswer = (
    answer,
    isMultiChoice,
    questionOptions,
    currentLanguage
  ) => {
    if (!answer || (Array.isArray(answer) && answer.length === 0)) {
      return currentLanguage === "en" ? "Not answered" : "उत्तर नहीं दिया";
    }

    if (isMultiChoice && Array.isArray(answer)) {
      return answer
        .map((ans) =>
          getOptionDisplayText(ans, questionOptions, currentLanguage)
        )
        .join(", ");
    }

    return getOptionDisplayText(answer, questionOptions, currentLanguage);
  };

  const formatCorrectAnswer = (
    correctAnswer,
    isMultiChoice,
    questionOptions,
    currentLanguage
  ) => {
    if (isMultiChoice && Array.isArray(correctAnswer)) {
      return correctAnswer
        .map((ans) =>
          getOptionDisplayText(ans, questionOptions, currentLanguage)
        )
        .join(", ");
    }
    return getOptionDisplayText(
      correctAnswer,
      questionOptions,
      currentLanguage
    );
  };

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "24px",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      {/* Results Header */}
      <Card
        style={{
          marginBottom: "24px",
          textAlign: "center",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          borderRadius: "12px",
        }}
      >
        <Result
          icon={
            <TrophyOutlined style={{ color: "#1890ff", fontSize: "64px" }} />
          }
          title={
            <Title level={2} style={{ margin: 0 }}>
              {language === "en" ? "Quiz Completed!" : "क्विज़ पूर्ण!"}
            </Title>
          }
          subTitle={statusMessage}
          extra={
            <div>
              <div style={{ marginBottom: "16px" }}>
                <Text
                  style={{
                    fontSize: "28px",
                    fontWeight: "bold",
                    color: "#262626",
                  }}
                >
                  {language === "en" ? "Score" : "स्कोर"}:{" "}
                  {quizSummary.correctAnswers}/{quizSummary.totalQuestions}
                </Text>
                <Text
                  style={{
                    fontSize: "20px",
                    marginLeft: "16px",
                    color: "#666",
                  }}
                >
                  ({scorePercentage}%)
                </Text>
              </div>
              <Progress
                percent={scorePercentage}
                status={status}
                strokeWidth={12}
                style={{ maxWidth: "400px", margin: "0 auto" }}
              />
            </div>
          }
        />

        <Button
          type="primary"
          size="large"
          icon={<HomeOutlined />}
          onClick={onReturnHome}
          style={{
            marginTop: "20px",
            fontSize: "16px",
            height: "48px",
            paddingLeft: "24px",
            paddingRight: "24px",
          }}
        >
          {language === "en" ? "Return Home" : "घर वापस जाएं"}
        </Button>
      </Card>

      {/* Detailed Results */}
      <Card
        title={
          <Title level={3} style={{ margin: 0 }}>
            {language === "en" ? "Detailed Results" : "विस्तृत परिणाम"}
          </Title>
        }
        style={{
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          borderRadius: "12px",
        }}
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          {quizSummary.results.map((result, index) => {
            const isMultiChoice = result.question.attributes.quetype === "MCQ";

            return (
              <Card
                key={result.questionId}
                size="small"
                style={{
                  border: `2px solid ${
                    result.isCorrect ? "#52c41a" : "#ff4d4f"
                  }`,
                  backgroundColor: result.isCorrect ? "#f6ffed" : "#fff2f0",
                  borderRadius: "8px",
                }}
              >
                <Row align="middle" gutter={16}>
                  <Col flex="auto">
                    <div style={{ marginBottom: "12px" }}>
                      <Space>
                        <Text strong style={{ fontSize: "16px" }}>
                          {language === "en" ? "Q" : "प्र"}
                          {index + 1}.
                        </Text>
                        <Tag
                          color={getDifficultyColor(
                            result.question.attributes.question_level
                          )}
                        >
                          {result.question.attributes.question_level}
                        </Tag>
                        <Tag
                          color={getCategoryColor(
                            result.question.attributes.question_category
                          )}
                        >
                          {result.question.attributes.question_category}
                        </Tag>
                        <Tag
                          color={isMultiChoice ? "purple" : "blue"}
                          style={{ fontWeight: "bold" }}
                        >
                          {isMultiChoice
                            ? language === "en"
                              ? "Multiple Choice"
                              : "बहुविकल्पी"
                            : language === "en"
                            ? "Single Choice"
                            : "एकल विकल्प"}
                        </Tag>
                      </Space>
                    </div>

                    <Title
                      level={5}
                      style={{ margin: "12px 0", lineHeight: "1.4" }}
                    >
                      {language === "en"
                        ? result.question.attributes.title_en ||
                          result.question.attributes.title_hi ||
                          ""
                        : result.question.attributes.title_hi ||
                          result.question.attributes.title_en ||
                          ""}
                    </Title>

                    <div style={{ marginBottom: "8px" }}>
                      <Text strong>
                        {language === "en" ? "Your Answer: " : "आपका उत्तर: "}
                      </Text>
                      <Text
                        style={{
                          color: result.isCorrect ? "#52c41a" : "#ff4d4f",
                          fontWeight: "bold",
                        }}
                      >
                        {formatAnswer(
                          result.selectedAnswer,
                          isMultiChoice,
                          result.question.attributes.json,
                          language
                        )}
                      </Text>
                    </div>

                    <div style={{ marginBottom: "12px" }}>
                      <Text strong>
                        {language === "en" ? "Correct Answer: " : "सही उत्तर: "}
                      </Text>
                      <Text style={{ color: "#52c41a", fontWeight: "bold" }}>
                        {formatCorrectAnswer(
                          result.correctAnswer,
                          isMultiChoice,
                          result.question.attributes.json,
                          language
                        )}
                      </Text>
                    </div>

                    {(result.question.attributes.explaination_description_en ||
                      result.question.attributes
                        .explaination_description_hi) && (
                      <div
                        style={{
                          padding: "12px",
                          backgroundColor: "#f8f9fa",
                          borderRadius: "6px",
                        }}
                      >
                        <Text type="secondary" style={{ fontStyle: "italic" }}>
                          <strong>
                            {language === "en" ? "Explanation: " : "व्याख्या: "}
                          </strong>
                          {language === "en"
                            ? result.question.attributes
                                .explaination_description_en ||
                              result.question.attributes
                                .explaination_description_hi ||
                              ""
                            : result.question.attributes
                                .explaination_description_hi ||
                              result.question.attributes
                                .explaination_description_en ||
                              ""}
                        </Text>
                      </div>
                    )}
                  </Col>

                  <Col>
                    {result.isCorrect ? (
                      <CheckCircleOutlined
                        style={{ fontSize: "32px", color: "#52c41a" }}
                      />
                    ) : (
                      <CloseCircleOutlined
                        style={{ fontSize: "32px", color: "#ff4d4f" }}
                      />
                    )}
                  </Col>
                </Row>
              </Card>
            );
          })}
        </Space>
      </Card>
    </div>
  );
};
