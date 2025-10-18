import { useState, useEffect } from "react";
import {
  Card,
  Button,
  Progress,
  Badge,
  Space,
  Typography,
  Row,
  Col,
  Alert,
  Divider,
  Select,
  message,
  Spin,
} from "antd";
import {
  LeftOutlined,
  RightOutlined,
  RedoOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FilterOutlined,
  LoadingOutlined,
} from "@ant-design/icons";

// Import different question sets
import kidsQuestions from "./data/kids.json";
import studentsQuestions from "./data/students.json";
import adultsQuestions from "./data/adults.json";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

export default function SocialQuizApp({ 
  ageGroup, 
  currentQuestionIndex = 0,
  previousAnswers = [],
  onQuestionComplete,
  onBackToAgeSelection,
  onAgeGroupRoundComplete 
}) {
  const [currentQuestion, setCurrentQuestion] = useState(currentQuestionIndex);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionData, setCurrentQuestionData] = useState(null);
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [filteredQuestions, setFilteredQuestions] = useState([]);

  // Initialize from previous answers
  useEffect(() => {
    if (previousAnswers && previousAnswers.length > 0) {
      const answeredIndices = new Array(questions.length).fill(false);
      let calculatedScore = 0;
      
      previousAnswers.forEach((answer, index) => {
        if (index < answeredIndices.length) {
          answeredIndices[index] = true;
          if (answer.correct) {
            calculatedScore += 1;
          }
        }
      });
      
      setAnsweredQuestions(answeredIndices);
      setScore(calculatedScore);
    }
  }, [previousAnswers, questions.length]);

  // Update current question when prop changes
  useEffect(() => {
    setCurrentQuestion(currentQuestionIndex);
    setSelectedAnswer(null);
    setShowAnswer(false);
  }, [currentQuestionIndex]);

  // Load questions based on age group
  useEffect(() => {
    if (!ageGroup) return;

    setLoading(true);
    try {
      let questionsData = [];
      
      // Handle both string and object ageGroup formats
      const ageGroupKey = typeof ageGroup === 'string' ? ageGroup : ageGroup.id || ageGroup;
      
      switch (ageGroupKey) {
        case "kids":
          questionsData = kidsQuestions;
          break;
        case "students":
          questionsData = studentsQuestions;
          break;
        case "adults":
        case "elderly":
          questionsData = adultsQuestions;
          break;
        default:
          questionsData = studentsQuestions; // fallback
      }
      
      console.log("questionsData", questionsData);
      setQuestions(questionsData);
      setLoading(false);
    } catch (error) {
      console.error("Error loading questions:", error);
      const ageGroupName = typeof ageGroup === 'string' ? ageGroup : ageGroup?.name?.en || 'Unknown';
      message.error(`प्रश्न लोड करने में त्रुटि / Error loading questions for ${ageGroupName}`);
      setLoading(false);
    }
  }, [ageGroup]);

  // Get unique categories and difficulties
  const categories = [...new Set(questions.map(q => q.category.en))];
  const difficulties = [...new Set(questions.map(q => q.difficulty.en))];

  // Filter questions based on selected category and difficulty
  useEffect(() => {
    if (questions.length === 0) return;

    let filtered = questions;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(q => q.category.en === selectedCategory);
    }
    
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(q => q.difficulty.en === selectedDifficulty);
    }
    
    setFilteredQuestions(filtered);
    
    // Reset states when filters change, but preserve progress if using same questions
    if (filtered.length !== filteredQuestions.length) {
      setCurrentQuestion(0);
      setSelectedAnswer(null);
      setShowAnswer(false);
      setAnsweredQuestions(new Array(filtered.length).fill(false));
      
      // Recalculate score based on previous answers if available
      if (previousAnswers && previousAnswers.length > 0) {
        const answeredIndices = new Array(filtered.length).fill(false);
        let calculatedScore = 0;
        
        previousAnswers.forEach((answer, index) => {
          if (index < answeredIndices.length) {
            answeredIndices[index] = true;
            if (answer.correct) {
              calculatedScore += 1;
            }
          }
        });
        
        setAnsweredQuestions(answeredIndices);
        setScore(calculatedScore);
      }
    }
    
    if (filtered.length === 0) {
      message.warning('कोई प्रश्न नहीं मिला / No questions found for selected filters');
    }
  }, [selectedCategory, selectedDifficulty, questions]);

  const handleAnswerSelect = (answerIndex) => {
    if (showAnswer) return;
    setSelectedAnswer(answerIndex);
  };

  const handleShowAnswer = () => {
    if (selectedAnswer === null) return;

    setShowAnswer(true);

    if (!answeredQuestions[currentQuestion]) {
      const newAnsweredQuestions = [...answeredQuestions];
      newAnsweredQuestions[currentQuestion] = true;
      setAnsweredQuestions(newAnsweredQuestions);

      const isCorrect = selectedAnswer === filteredQuestions[currentQuestion].correctAnswer;
      if (isCorrect) {
        setScore(score + 1);
      }

      // Store question data but don't notify parent yet - only when moving to next question
      const questionData = {
        questionIndex: currentQuestion,
        selectedAnswer: selectedAnswer,
        correctAnswer: filteredQuestions[currentQuestion].correctAnswer,
        correct: isCorrect,
        question: filteredQuestions[currentQuestion],
        timestamp: new Date().toISOString()
      };
      
      // Store this data temporarily - we'll send it when actually moving to next question
      setCurrentQuestionData(questionData);
    }
  };

  const handleNextQuestion = () => {
    // Send question data to parent when actually moving to next question
    if (currentQuestionData && onQuestionComplete) {
      onQuestionComplete(currentQuestionData);
      setCurrentQuestionData(null);
    }

    if (currentQuestion < filteredQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowAnswer(false);
    setScore(0);
    setAnsweredQuestions(new Array(filteredQuestions.length).fill(false));
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedDifficulty('all');
  };

  const handleCompleteRound = () => {
    // Send any pending question data before completing round
    if (currentQuestionData && onQuestionComplete) {
      onQuestionComplete(currentQuestionData);
      setCurrentQuestionData(null);
    }

    if (onAgeGroupRoundComplete) {
      onAgeGroupRoundComplete();
    }
  };

  // Get age group display info
  const getAgeGroupInfo = () => {
    if (typeof ageGroup === 'string') {
      switch (ageGroup) {
        case 'kids':
          return { name: { hi: 'बच्चे', en: 'Kids' }, color: '#52c41a' };
        case 'students':
          return { name: { hi: 'छात्र', en: 'Students' }, color: '#1890ff' };
        case 'elderly':
          return { name: { hi: 'बुजुर्ग', en: 'Elderly' }, color: '#722ed1' };
        default:
          return { name: { hi: 'अज्ञात', en: 'Unknown' }, color: '#8c8c8c' };
      }
    }
    return ageGroup;
  };

  const ageGroupInfo = getAgeGroupInfo();

  // Loading state
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f0f5ff 0%, #f9f0ff 100%)",
          padding: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Card
          style={{
            textAlign: "center",
            borderRadius: "16px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            padding: "48px",
          }}
        >
          <Spin
            indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
            size="large"
          />
          <Title level={3} style={{ marginTop: "24px", marginBottom: "8px" }}>
            प्रश्न लोड हो रहे हैं...
          </Title>
          <Paragraph style={{ color: "#8c8c8c", marginBottom: "0" }}>
            Loading questions for {ageGroupInfo?.name.en}...
          </Paragraph>
        </Card>
      </div>
    );
  }

  // No questions available
  if (filteredQuestions.length === 0) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f0f5ff 0%, #f9f0ff 100%)",
          padding: "24px",
        }}
      >
        <div style={{ maxWidth: "1000px", margin: "0 auto", paddingTop: "80px" }}>
          <Card
            style={{
              textAlign: "center",
              borderRadius: "16px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            }}
          >
            <Title level={2}>कोई प्रश्न उपलब्ध नहीं / No Questions Available</Title>
            <Paragraph>कृपया अपने फ़िल्टर बदलें / Please change your filters</Paragraph>
            <Space>
              <Button type="primary" onClick={handleResetFilters}>
                फ़िल्टर रीसेट करें / Reset Filters
              </Button>
              <Button onClick={onBackToAgeSelection}>
                आयु समूह बदलें / Change Age Group
              </Button>
            </Space>
          </Card>
        </div>
      </div>
    );
  }

  const question = filteredQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / filteredQuestions.length) * 100;
  const totalAnswered = answeredQuestions.filter(Boolean).length;

  const getCategoryColor = (category) => {
    const categoryEn = category.en || category;
    switch (categoryEn) {
      case "Math":
        return "blue";
      case "Science":
        return "green";
      case "GK":
        return "orange";
      case "Hindu Religion":
        return "purple";
      case "Indian History":
        return "red";
      case "Basic Math":
        return "cyan";
      case "Animals":
        return "lime";
      case "Colors":
        return "pink";
      case "Shapes":
        return "gold";
      case "Advanced Math":
        return "volcano";
      case "Physics":
        return "geekblue";
      case "Chemistry":
        return "purple";
      case "Current Affairs":
        return "magenta";
      case "Literature":
        return "red";
      case "Philosophy":
        return "purple";
      case "Politics":
        return "orange";
      case "Economics":
        return "green";
      default:
        return "default";
    }
  };

  const getDifficultyColor = (difficulty) => {
    const difficultyEn = difficulty.en || difficulty;
    switch (difficultyEn) {
      case "Easy":
        return "success";
      case "Medium":
        return "warning";
      case "Hard":
        return "error";
      default:
        return "default";
    }
  };

  const getButtonType = (index) => {
    if (!showAnswer) {
      return selectedAnswer === index ? "primary" : "default";
    }

    if (index === question.correctAnswer) {
      return "primary";
    }

    if (selectedAnswer === index && index !== question.correctAnswer) {
      return "danger";
    }

    return "default";
  };

  const getButtonIcon = (index) => {
    if (!showAnswer) return null;

    if (index === question.correctAnswer) {
      return <CheckCircleOutlined />;
    }

    if (selectedAnswer === index && index !== question.correctAnswer) {
      return <CloseCircleOutlined />;
    }

    return null;
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0f5ff 0%, #f9f0ff 100%)",
        padding: "24px",
        paddingTop: "80px", // Account for back button
      }}
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <Badge
            count={`${ageGroupInfo.name.hi} / ${ageGroupInfo.name.en}`}
            style={{
              backgroundColor: ageGroupInfo.color,
              fontSize: "16px",
              fontWeight: "500",
              padding: "8px 16px",
              height: "auto",
              lineHeight: "1.4",
              marginBottom: "16px",
            }}
          />
          <Title level={1} style={{ color: "#1d1d1d", marginBottom: "8px" }}>
            द्विभाषी प्रश्नोत्तरी
          </Title>
          <Title
            level={2}
            style={{ color: "#595959", fontWeight: "normal", marginTop: "0" }}
          >
            Bilingual Quiz Challenge
          </Title>

          <Space size="large">
            <Badge
              count={`प्रश्न / Question ${currentQuestion + 1}/${
                filteredQuestions.length
              }`}
              style={{
                backgroundColor: "#1890ff",
                fontSize: "14px",
                fontWeight: "500",
                padding: "0 16px",
                height: "32px",
                lineHeight: "32px",
              }}
            />
            <Badge
              count={`स्कोर / Score: ${score}/${totalAnswered}`}
              style={{
                backgroundColor: "#52c41a",
                fontSize: "14px",
                fontWeight: "500",
                padding: "0 16px",
                height: "32px",
                lineHeight: "32px",
              }}
            />
          </Space>
        </div>

        {/* Filters */}
        <Card
          style={{
            marginBottom: "32px",
            borderRadius: "16px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "16px" }}>
            <Text strong style={{ fontSize: "16px", marginRight: "8px" }}>
              <FilterOutlined /> फ़िल्टर / Filters
            </Text>
          </div>
          <Row gutter={[16, 16]} justify="center">
            <Col xs={24} sm={12} md={8}>
              <div style={{ textAlign: "center" }}>
                <Text strong style={{ display: "block", marginBottom: "8px" }}>
                  श्रेणी / Category
                </Text>
                <Select
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                  style={{ width: "100%" }}
                  size="large"
                >
                  <Option value="all">सभी / All</Option>
                  {categories.map(category => {
                    const questionWithCategory = questions.find(q => q.category.en === category);
                    return (
                      <Option key={category} value={category}>
                        {questionWithCategory?.category.hi} / {category}
                      </Option>
                    );
                  })}
                </Select>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div style={{ textAlign: "center" }}>
                <Text strong style={{ display: "block", marginBottom: "8px" }}>
                  कठिनाई / Difficulty
                </Text>
                <Select
                  value={selectedDifficulty}
                  onChange={setSelectedDifficulty}
                  style={{ width: "100%" }}
                  size="large"
                >
                  <Option value="all">सभी / All</Option>
                  {difficulties.map(difficulty => {
                    const questionWithDifficulty = questions.find(q => q.difficulty.en === difficulty);
                    return (
                      <Option key={difficulty} value={difficulty}>
                        {questionWithDifficulty?.difficulty.hi} / {difficulty}
                      </Option>
                    );
                  })}
                </Select>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div style={{ textAlign: "center" }}>
                <Text strong style={{ display: "block", marginBottom: "8px" }}>
                  क्रियाएं / Actions
                </Text>
                <Button
                  onClick={handleResetFilters}
                  size="large"
                  style={{ width: "100%" }}
                >
                  रीसेट / Reset
                </Button>
              </div>
            </Col>
          </Row>
          <div style={{ textAlign: "center", marginTop: "16px" }}>
            <Text type="secondary">
              {filteredQuestions.length} प्रश्न मिले / {filteredQuestions.length} questions found
            </Text>
          </div>
        </Card>

        {/* Progress Bar */}
        <Progress
          percent={progress}
          strokeColor={{ "0%": "#1890ff", "100%": "#722ed1" }}
          showInfo={false}
          style={{ marginBottom: "32px" }}
          strokeWidth={8}
        />

        {/* Question Card */}
        <Card
          style={{
            marginBottom: "32px",
            borderRadius: "16px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          }}
        >
          {/* Category and Difficulty Badges */}
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <Space size="large">
              <Badge
                color={getCategoryColor(question.category)}
                text={
                  <Text style={{ fontSize: "14px", fontWeight: "500" }}>
                    {question.category.hi} / {question.category.en}
                  </Text>
                }
              />
              <Badge
                status={getDifficultyColor(question.difficulty)}
                text={
                  <Text style={{ fontSize: "14px", fontWeight: "500" }}>
                    {question.difficulty.hi} / {question.difficulty.en}
                  </Text>
                }
              />
            </Space>
          </div>

          {/* Question */}
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <Title level={3} style={{ color: "#1d1d1d", marginBottom: "12px" }}>
              {question.question.hi}
            </Title>
            <Title
              level={4}
              style={{ color: "#595959", fontWeight: "normal", marginTop: "0" }}
            >
              {question.question.en}
            </Title>
          </div>

          {/* Options */}
          <Row gutter={[16, 16]} style={{ marginBottom: "32px" }}>
            {question.options.en.map((option, index) => (
              <Col xs={24} md={12} key={index}>
                <Button
                  type={getButtonType(index)}
                  icon={getButtonIcon(index)}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showAnswer}
                  style={{
                    width: "100%",
                    height: "auto",
                    minHeight: "80px",
                    padding: "16px",
                    textAlign: "left",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    borderRadius: "12px",
                    fontSize: "16px",
                  }}
                >
                  <div style={{ width: "100%" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "8px",
                      }}
                    >
                      <Text
                        strong
                        style={{ fontSize: "18px", marginRight: "12px" }}
                      >
                        {String.fromCharCode(65 + index)}.
                      </Text>
                      <Text strong style={{ fontSize: "16px" }}>
                        {question.options.hi[index]}
                      </Text>
                    </div>
                    <Text
                      style={{
                        fontSize: "14px",
                        color: "#8c8c8c",
                        marginLeft: "30px",
                      }}
                    >
                      {question.options.en[index]}
                    </Text>
                  </div>
                </Button>
              </Col>
            ))}
          </Row>

          {/* Show Answer Button */}
          {!showAnswer && (
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <Button
                type="primary"
                size="large"
                onClick={handleShowAnswer}
                disabled={selectedAnswer === null}
                style={{
                  background:
                    selectedAnswer === null
                      ? undefined
                      : "linear-gradient(135deg, #1890ff 0%, #722ed1 100%)",
                  border: "none",
                  height: "48px",
                  padding: "0 32px",
                  fontSize: "16px",
                  fontWeight: "500",
                  borderRadius: "8px",
                }}
              >
                उत्तर दिखाएं / Show Answer
              </Button>
            </div>
          )}

          {/* Explanation */}
          {showAnswer && (
            <Alert
              message={
                <Text strong style={{ fontSize: "16px" }}>
                  व्याख्या / Explanation
                </Text>
              }
              description={
                <div style={{ marginTop: "12px" }}>
                  <Paragraph style={{ marginBottom: "8px" }}>
                    <Text strong>हिंदी:</Text> {question.explanation.hi}
                  </Paragraph>
                  <Paragraph style={{ marginBottom: "0" }}>
                    <Text strong>English:</Text> {question.explanation.en}
                  </Paragraph>
                </div>
              }
              type="info"
              showIcon
              style={{
                marginBottom: "32px",
                borderRadius: "8px",
                fontSize: "14px",
              }}
            />
          )}

          <Divider />

          {/* Navigation */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button
              icon={<LeftOutlined />}
              onClick={handlePrevQuestion}
              disabled={currentQuestion === 0}
              size="large"
              style={{ padding: "0 20px" }}
            >
              पिछला / Previous
            </Button>

            <Space>
              <Button
                icon={<RedoOutlined />}
                onClick={handleRestart}
                size="large"
                style={{ padding: "0 20px" }}
              >
                फिर से / Restart
              </Button>
              
              {/* Complete Round Button - shown when at the end or after significant progress */}
              {(currentQuestion >= filteredQuestions.length - 1 || totalAnswered >= Math.min(5, filteredQuestions.length)) && (
                <Button
                  type="primary"
                  onClick={handleCompleteRound}
                  size="large"
                  style={{ 
                    padding: "0 20px",
                    background: "linear-gradient(135deg, #52c41a 0%, #1890ff 100%)",
                    border: "none"
                  }}
                >
                  राउंड पूरा / Complete Round
                </Button>
              )}
            </Space>

            <Button
              icon={<RightOutlined />}
              type="primary"
              onClick={handleNextQuestion}
              disabled={currentQuestion === filteredQuestions.length - 1}
              size="large"
              style={{ padding: "0 20px" }}
            >
              अगला / Next
            </Button>
          </div>
        </Card>

        {/* Final Score */}
        {currentQuestion === filteredQuestions.length - 1 && showAnswer && (
          <Card
            style={{
              textAlign: "center",
              borderRadius: "16px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              background: "linear-gradient(135deg, #f6ffed 0%, #e6f7ff 100%)",
            }}
          >
            <Title level={2} style={{ marginBottom: "16px" }}>
              प्रश्नोत्तरी पूर्ण! / Quiz Complete! 🎉
            </Title>
            <Title level={3} style={{ color: "#1890ff", marginBottom: "16px" }}>
              अंतिम स्कोर / Final Score: {score}/{filteredQuestions.length}
            </Title>
            <Paragraph style={{ fontSize: "16px", marginBottom: "24px" }}>
              {score / filteredQuestions.length >= 0.8
                ? "बेहतरीन! / Excellent work! 🌟"
                : score / filteredQuestions.length >= 0.6
                ? "अच्छा काम! / Good job! 👍"
                : "अभ्यास जारी रखें! / Keep practicing! 💪"}
            </Paragraph>
            <Space size="large">
              <Button
                type="primary"
                size="large"
                onClick={handleCompleteRound}
                style={{
                  background: "linear-gradient(135deg, #52c41a 0%, #1890ff 100%)",
                  border: "none",
                  height: "48px",
                  padding: "0 32px",
                  fontSize: "16px",
                  fontWeight: "500",
                  borderRadius: "8px",
                }}
              >
                अगले समूह के लिए / Next Age Group
              </Button>
              <Button
                size="large"
                onClick={handleRestart}
                style={{
                  height: "48px",
                  padding: "0 32px",
                  fontSize: "16px",
                  fontWeight: "500",
                  borderRadius: "8px",
                }}
              >
                फिर से खेलें / Play Again
              </Button>
              <Button
                size="large"
                onClick={handleResetFilters}
                style={{
                  height: "48px",
                  padding: "0 32px",
                  fontSize: "16px",
                  fontWeight: "500",
                  borderRadius: "8px",
                }}
              >
                नए फ़िल्टर / New Filters
              </Button>
              <Button
                size="large"
                onClick={onBackToAgeSelection}
                style={{
                  height: "48px",
                  padding: "0 32px",
                  fontSize: "16px",
                  fontWeight: "500",
                  borderRadius: "8px",
                }}
              >
                आयु समूह बदलें / Change Age Group
              </Button>
            </Space>
          </Card>
        )}
      </div>
    </div>
  );
}