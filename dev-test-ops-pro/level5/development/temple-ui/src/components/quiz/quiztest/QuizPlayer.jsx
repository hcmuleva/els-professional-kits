import {
  LeftOutlined,
  RightOutlined,
  TranslationOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Progress,
  Radio,
  Checkbox,
  Row,
  Space,
  Tag,
  Typography,
  Alert,
} from "antd";
import { useState } from "react";

const { Title, Text } = Typography;

export const QuizPlayer = ({
  questions,
  language,
  setLanguage,
  onExit,
  onComplete,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizResults, setQuizResults] = useState([]);
  const [userId] = useState("user_123");

  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswer = selectedAnswers[currentQuestion.id];
  const progressPercent = Math.round(
    ((currentQuestionIndex + 1) / questions.length) * 100
  );

  // Check if current question is multi-choice
  const isMultiChoice = currentQuestion.attributes.quetype === "MCQ";

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

  // Get option text based on language
  const getOptionText = (option) => {
    return language === "en" ? option.option_en : option.option_hi;
  };

  // Get option value (we'll use option_en as the value for consistency)
  const getOptionValue = (option) => {
    return option.option_en;
  };

  const handleSingleAnswerSelect = (questionId, selectedOption) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: selectedOption,
    }));
  };

  const handleMultiAnswerSelect = (questionId, selectedOptions) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: selectedOptions,
    }));
  };

  const handleNextQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const selectedAnswer = selectedAnswers[currentQuestion.id];

    // Get correct answers based on question type
    let correctAnswer;
    if (isMultiChoice) {
      // For MCQ, get all correct options
      correctAnswer = currentQuestion.attributes.json
        .filter((opt) => opt.iscorrect)
        .map((opt) => getOptionValue(opt));
    } else {
      // For SC, get single correct option
      correctAnswer = currentQuestion.attributes.json.find(
        (opt) => opt.iscorrect
      );
      correctAnswer = correctAnswer ? getOptionValue(correctAnswer) : null;
    }

    // Check if answer is correct
    let isCorrect = false;
    if (isMultiChoice) {
      // For MCQ, check if arrays match (same elements, regardless of order)
      isCorrect =
        Array.isArray(selectedAnswer) &&
        Array.isArray(correctAnswer) &&
        selectedAnswer.length === correctAnswer.length &&
        selectedAnswer.every((ans) => correctAnswer.includes(ans));
    } else {
      // For SC, direct comparison
      isCorrect = selectedAnswer === correctAnswer;
    }

    const result = {
      questionId: currentQuestion.id,
      userId: userId,
      selectedAnswer: selectedAnswer,
      correctAnswer: correctAnswer,
      isCorrect: isCorrect,
      timestamp: new Date().toISOString(),
      question: currentQuestion,
    };

    const newResults = [...quizResults, result];
    setQuizResults(newResults);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      finishQuiz(newResults);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const finishQuiz = (finalResults) => {
    const quizSummary = {
      userId: userId,
      totalQuestions: questions.length,
      correctAnswers: finalResults.filter((r) => r.isCorrect).length,
      results: finalResults,
      completedAt: new Date().toISOString(),
    };

    onComplete(quizSummary);
  };

  // Check if user can proceed (has made a selection)
  const canProceed = () => {
    if (isMultiChoice) {
      return Array.isArray(selectedAnswer) && selectedAnswer.length > 0;
    } else {
      return selectedAnswer !== undefined && selectedAnswer !== null;
    }
  };

  const renderOptions = () => {
    if (isMultiChoice) {
      // Render checkboxes for multi-choice questions
      return (
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          {currentQuestion.attributes.json.map((option, index) => {
            const optionValue = getOptionValue(option);
            const optionText = getOptionText(option);
            const isSelected =
              Array.isArray(selectedAnswer) &&
              selectedAnswer.includes(optionValue);

            return (
              <div
                key={index}
                style={{
                  padding: "16px",
                  border: "2px solid",
                  borderRadius: "8px",
                  backgroundColor: isSelected ? "#e6f7ff" : "#fff",
                  borderColor: isSelected ? "#1890ff" : "#d9d9d9",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onClick={() => {
                  const currentSelections = selectedAnswer || [];
                  const newSelections = currentSelections.includes(optionValue)
                    ? currentSelections.filter((item) => item !== optionValue)
                    : [...currentSelections, optionValue];
                  handleMultiAnswerSelect(currentQuestion.id, newSelections);
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Checkbox
                    checked={isSelected}
                    onChange={() => {
                      const currentSelections = selectedAnswer || [];
                      const newSelections = currentSelections.includes(
                        optionValue
                      )
                        ? currentSelections.filter(
                            (item) => item !== optionValue
                          )
                        : [...currentSelections, optionValue];
                      handleMultiAnswerSelect(
                        currentQuestion.id,
                        newSelections
                      );
                    }}
                    style={{ marginRight: "12px" }}
                  />
                  <span
                    style={{
                      fontWeight: "500",
                      marginRight: "8px",
                      color: "#666",
                    }}
                  >
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <span style={{ fontSize: "16px" }}>{optionText}</span>
                </div>
              </div>
            );
          })}
        </Space>
      );
    } else {
      // Render radio buttons for single-choice questions
      return (
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          {currentQuestion.attributes.json.map((option, index) => {
            const optionValue = getOptionValue(option);
            const optionText = getOptionText(option);
            const isSelected = selectedAnswer === optionValue;

            return (
              <div
                key={index}
                style={{
                  padding: "16px",
                  border: "2px solid",
                  borderRadius: "8px",
                  backgroundColor: isSelected ? "#e6f7ff" : "#fff",
                  borderColor: isSelected ? "#1890ff" : "#d9d9d9",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onClick={() =>
                  handleSingleAnswerSelect(currentQuestion.id, optionValue)
                }
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Radio
                    checked={isSelected}
                    onChange={() =>
                      handleSingleAnswerSelect(currentQuestion.id, optionValue)
                    }
                    style={{ marginRight: "12px" }}
                  />
                  <span
                    style={{
                      fontWeight: "500",
                      marginRight: "8px",
                      color: "#666",
                    }}
                  >
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <span style={{ fontSize: "16px" }}>{optionText}</span>
                </div>
              </div>
            );
          })}
        </Space>
      );
    }
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
      {/* Quiz Header */}
      <Row
        justify="space-between"
        align="middle"
        style={{ marginBottom: "24px" }}
      >
        <Col>
          <Button
            icon={<LeftOutlined />}
            onClick={onExit}
            style={{ display: "flex", alignItems: "center" }}
          >
            Exit Quiz
          </Button>
        </Col>
        <Col>
          <Text style={{ color: "#666" }}>
            Question {currentQuestionIndex + 1} of {questions.length}
          </Text>
        </Col>
        <Col>
          <Button
            icon={<TranslationOutlined />}
            onClick={() => setLanguage(language === "en" ? "hi" : "en")}
            type="primary"
            ghost
          >
            {language === "en" ? "हिंदी" : "English"}
          </Button>
        </Col>
      </Row>

      {/* Progress Bar */}
      <Progress
        percent={progressPercent}
        showInfo={false}
        style={{ marginBottom: "24px" }}
        strokeColor="#1890ff"
      />

      {/* Question Card */}
      <Card
        style={{
          marginBottom: "24px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ marginBottom: "16px" }}>
          <Tag
            color={getDifficultyColor(
              currentQuestion.attributes.question_level
            )}
          >
            {currentQuestion.attributes.question_level}
          </Tag>
          <Tag
            color={getCategoryColor(
              currentQuestion.attributes.question_category
            )}
          >
            {currentQuestion.attributes.question_category}
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
        </div>

        {/* Question Type Alert */}
        {isMultiChoice && (
          <Alert
            message={
              language === "en"
                ? "Select all correct answers"
                : "सभी सही उत्तर चुनें"
            }
            type="info"
            showIcon
            style={{ marginBottom: "16px" }}
          />
        )}

        <Title level={3} style={{ marginBottom: "24px", color: "#262626" }}>
          {language === "en"
            ? currentQuestion.attributes.title_en
            : currentQuestion.attributes.title_hi}
        </Title>

        {renderOptions()}
      </Card>

      {/* Navigation */}
      <Row justify="space-between">
        <Col>
          <Button
            icon={<LeftOutlined />}
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            size="large"
          >
            Previous
          </Button>
        </Col>

        <Col>
          <Button
            type="primary"
            icon={<RightOutlined />}
            onClick={handleNextQuestion}
            disabled={!canProceed()}
            size="large"
            style={{ display: "flex", alignItems: "center" }}
          >
            {currentQuestionIndex === questions.length - 1
              ? "Finish Quiz"
              : "Next"}
          </Button>
        </Col>
      </Row>

      {/* Debug Info (remove in production) */}
      {process.env.NODE_ENV === "development" && (
        <Card style={{ marginTop: "16px", fontSize: "12px", color: "#666" }}>
          <Text>Debug Info:</Text>
          <br />
          <Text>Question Type: {currentQuestion.attributes.quetype}</Text>
          <br />
          <Text>Selected Answer: {JSON.stringify(selectedAnswer)}</Text>
          <br />
          <Text>Is Multi Choice: {isMultiChoice ? "Yes" : "No"}</Text>
        </Card>
      )}
    </div>
  );
};
