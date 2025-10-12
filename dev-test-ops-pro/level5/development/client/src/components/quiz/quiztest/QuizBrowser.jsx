import {
  FilterOutlined,
  PlayCircleOutlined,
  ReloadOutlined,
  TranslationOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  Col,
  Input,
  Row,
  Select,
  Space,
  Spin,
  Tag,
  Typography,
  Pagination,
} from "antd";
import { useState, useEffect } from "react";

const { Option } = Select;
const { Search } = Input;
const { Title, Text } = Typography;

const QUESTION_LEVELS = {
  en: ["EASY", "MEDIUM", "HARD", "HARDEST"],
  hi: ["आसान", "मध्यम", "कठिन", "सबसे कठिन"],
};

const QUESTION_CATEGORIES = {
  en: ["RELIGION", "SCIENCE", "TRICKS", "MATHS", "HISTORY", "GEOGRAPHY", "AI"],
  hi: ["धर्म", "विज्ञान", "ट्रिक्स", "गणित", "इतिहास", "भूगोल", "AI"],
};

const QUESTION_TYPES = {
  en: ["SC", "MCQ"],
  hi: ["SC", "MCQ"],
};

// Mapping functions for display values
const getLevelDisplayValue = (level, language) => {
  const levelMap = {
    EASY: language === "en" ? "EASY" : "आसान",
    MEDIUM: language === "en" ? "MEDIUM" : "मध्यम",
    HARD: language === "en" ? "HARD" : "कठिन",
    HARDEST: language === "en" ? "HARDEST" : "सबसे कठिन",
  };
  return levelMap[level] || level;
};

const getCategoryDisplayValue = (category, language) => {
  const categoryMap = {
    RELIGION: language === "en" ? "RELIGION" : "धर्म",
    SCIENCE: language === "en" ? "SCIENCE" : "विज्ञान",
    TRICKS: language === "en" ? "TRICKS" : "ट्रिक्स",
    MATHS: language === "en" ? "MATHS" : "गणित",
    HISTORY: language === "en" ? "HISTORY" : "इतिहास",
    GEOGRAPHY: language === "en" ? "GEOGRAPHY" : "भूगोल",
    AI: "AI",
  };
  return categoryMap[category] || category;
};

const getTypeDisplayValue = (type, language) => {
  return type; // SC and MCQ are the same in both languages
};

// Question Browser Component
export const QuestionBrowser = ({
  questions,
  filteredQuestions,
  loading,
  selectedLevel,
  setSelectedLevel,
  selectedCategory,
  setSelectedCategory,
  selectedQuestionType,
  setSelectedQuestionType,
  searchTerm,
  setSearchTerm,
  language,
  setLanguage,
  onStartQuiz,
  onPlaySingle,
  resetFilters,
  currentPage,
  pageSize,
  onPageChange,
  totalQuestions,
}) => {
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  // Clear selected questions when filters or page changes
  useEffect(() => {
    setSelectedQuestions([]);
  }, [filteredQuestions, currentPage]);

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

  // Handle going back
  const handleGoBack = () => {
    window.history.back();
  };

  // Handle checkbox change for selecting/deselecting questions
  const handleQuestionSelect = (questionId) => {
    setSelectedQuestions((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId]
    );
  };

  // Handle card click to select/deselect question
  const handleCardClick = (questionId, event) => {
    // Prevent selection when clicking on action buttons or checkbox
    if (
      event.target.closest(".ant-card-actions") ||
      event.target.closest(".ant-checkbox-wrapper") ||
      event.target.closest("button")
    ) {
      return;
    }
    handleQuestionSelect(questionId);
  };

  // Handle playing selected questions
  const handlePlaySelected = () => {
    if (selectedQuestions.length === 0) {
      return;
    }
    const questionsToPlay = filteredQuestions.filter((q) =>
      selectedQuestions.includes(q.id)
    );
    onStartQuiz(questionsToPlay);
  };

  // Calculate questions to display for the current page
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedQuestions = filteredQuestions.slice(
    startIndex,
    startIndex + pageSize
  );

  return (
    <div
      style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "12px",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "20px" }}>
        {/* Back Button */}
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={handleGoBack}
          style={{
            marginBottom: "12px",
            display: "flex",
            alignItems: "center",
          }}
          size="middle"
        >
          {language === "en" ? "Back" : "वापस"}
        </Button>

        <div style={{ textAlign: "center" }}>
          <Title
            level={1}
            style={{
              marginBottom: "4px",
              color: "#262626",
              fontSize: "clamp(24px, 5vw, 32px)",
            }}
          >
            {language === "en" ? "Question Player" : "प्रश्न प्लेयर"}
          </Title>
          <Text
            style={{
              color: "#666",
              fontSize: "clamp(14px, 3vw, 16px)",
              display: "block",
              padding: "0 8px",
            }}
          >
            {language === "en"
              ? "Filter and practice questions by category and difficulty level"
              : "श्रेणी और कठिनाई स्तर के अनुसार प्रश्नों को फ़िल्टर करें और अभ्यास करें"}
          </Text>
        </div>
      </div>

      {/* Filters and Search */}
      <Card
        style={{
          marginBottom: "16px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
        styles={{ body: { padding: "12px" } }}
      >
        <Row gutter={[8, 12]} align="middle">
          {/* Search Bar */}
          <Col xs={24} sm={24} md={6} lg={6}>
            <Search
              placeholder={
                language === "en"
                  ? "🔍 Search questions by title, category..."
                  : "🔍 शीर्षक, श्रेणी के द्वारा प्रश्न खोजें..."
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              allowClear
              style={{ width: "100%" }}
              size="middle"
            />
          </Col>

          {/* Level Filter */}
          <Col xs={12} sm={6} md={3} lg={3}>
            <Select
              placeholder={
                language === "en" ? "📊 Select Difficulty" : "📊 कठिनाई चुनें"
              }
              value={selectedLevel}
              onChange={setSelectedLevel}
              allowClear
              style={{ width: "100%" }}
              size="middle"
            >
              {QUESTION_LEVELS[language].map((level, index) => (
                <Option key={level} value={QUESTION_LEVELS.en[index]}>
                  <Tag
                    color={getDifficultyColor(QUESTION_LEVELS.en[index])}
                    style={{ margin: 0, fontSize: "12px" }}
                  >
                    {level}
                  </Tag>
                </Option>
              ))}
            </Select>
          </Col>

          {/* Category Filter */}
          <Col xs={12} sm={6} md={3} lg={3}>
            <Select
              placeholder={
                language === "en" ? "📚 Select Category" : "📚 श्रेणी चुनें"
              }
              value={selectedCategory}
              onChange={setSelectedCategory}
              allowClear
              style={{ width: "100%" }}
              size="middle"
            >
              {QUESTION_CATEGORIES[language].map((category, index) => (
                <Option key={category} value={QUESTION_CATEGORIES.en[index]}>
                  <Tag
                    color={getCategoryColor(QUESTION_CATEGORIES.en[index])}
                    style={{ margin: 0, fontSize: "12px" }}
                  >
                    {category}
                  </Tag>
                </Option>
              ))}
            </Select>
          </Col>

          {/* Question Type Filter */}
          <Col xs={8} sm={6} md={3} lg={3}>
            <Select
              placeholder={
                language === "en" ? "📝 Select Type" : "📝 प्रकार चुनें"
              }
              value={selectedQuestionType}
              onChange={setSelectedQuestionType}
              allowClear
              style={{ width: "100%" }}
              size="middle"
            >
              {QUESTION_TYPES[language].map((type, index) => (
                <Option key={type} value={QUESTION_TYPES.en[index]}>
                  <Tag
                    color={type === "SC" ? "geekblue" : "volcano"}
                    style={{ margin: 0, fontSize: "12px" }}
                  >
                    {type}
                  </Tag>
                </Option>
              ))}
            </Select>
          </Col>

          {/* Language Toggle */}
          <Col xs={8} sm={6} md={2} lg={2}>
            <Button
              icon={<TranslationOutlined />}
              onClick={() => setLanguage(language === "en" ? "hi" : "en")}
              style={{ width: "100%" }}
              size="middle"
              title={
                language === "en"
                  ? "Switch to Hindi"
                  : "अंग्रेजी में स्विच करें"
              }
            >
              {language === "en" ? "हिंदी" : "English"}
            </Button>
          </Col>

          {/* Reset Button */}
          <Col xs={8} sm={6} md={2} lg={2}>
            <Button
              icon={<ReloadOutlined />}
              onClick={resetFilters}
              style={{ width: "100%" }}
              size="middle"
              title={
                language === "en"
                  ? "Reset all filters"
                  : "सभी फ़िल्टर रीसेट करें"
              }
            >
              {language === "en" ? "Reset" : "रीसेट"}
            </Button>
          </Col>

          {/* Action Buttons */}
          <Col xs={24} sm={12} md={3} lg={3}>
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              onClick={() => onStartQuiz(filteredQuestions)}
              disabled={filteredQuestions.length === 0}
              style={{ width: "100%" }}
              size="middle"
              title={
                language === "en"
                  ? `Play all filtered questions (${filteredQuestions.length})`
                  : `सभी फ़िल्टर किए गए प्रश्न चलाएं (${filteredQuestions.length})`
              }
            >
              {language === "en"
                ? `All (${filteredQuestions.length})`
                : `सभी (${filteredQuestions.length})`}
            </Button>
          </Col>
        </Row>

        {/* Selected Questions Play Button - Mobile Friendly */}
        {selectedQuestions.length > 0 && (
          <Row style={{ marginTop: "12px" }}>
            <Col span={24}>
              <Button
                type="primary"
                icon={<PlayCircleOutlined />}
                onClick={handlePlaySelected}
                style={{
                  width: "100%",
                  background: "#52c41a",
                  borderColor: "#52c41a",
                }}
                size="middle"
                title={
                  language === "en"
                    ? `Play selected questions (${selectedQuestions.length})`
                    : `चुने गए प्रश्न चलाएं (${selectedQuestions.length})`
                }
              >
                {language === "en"
                  ? `Play Selected Questions (${selectedQuestions.length})`
                  : `चुने गए प्रश्न चलाएं (${selectedQuestions.length})`}
              </Button>
            </Col>
          </Row>
        )}
      </Card>

      {/* Questions Grid */}
      <Spin spinning={loading}>
        <Row gutter={[8, 12]}>
          {paginatedQuestions.map((question) => {
            const isSelected = selectedQuestions.includes(question.id);

            return (
              <Col key={question.id} xs={24} sm={12} lg={8} xl={6}>
                <Card
                  hoverable
                  onClick={(e) => handleCardClick(question.id, e)}
                  style={{
                    height: "100%",
                    boxShadow: isSelected
                      ? "0 4px 12px rgba(24, 144, 255, 0.3)"
                      : "0 2px 8px rgba(0,0,0,0.1)",
                    transition: "all 0.3s ease",
                    border: isSelected
                      ? "2px solid #1890ff"
                      : "1px solid #d9d9d9",
                    backgroundColor: isSelected ? "#f0f8ff" : "#fff",
                    cursor: "pointer",
                    transform: isSelected ? "translateY(-2px)" : "none",
                  }}
                  styles={{
                    body: {
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      padding: "12px",
                    },
                  }}
                  actions={[
                    <Button
                      key="play"
                      type="link"
                      icon={<PlayCircleOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        onPlaySingle(question);
                      }}
                      size="small"
                      title={
                        language === "en"
                          ? "Play this question only"
                          : "केवल इस प्रश्न को चलाएं"
                      }
                    >
                      {language === "en" ? "Play Single" : "एकल चलाएं"}
                    </Button>,
                  ]}
                >
                  <div style={{ marginBottom: "8px" }}>
                    <Checkbox
                      checked={isSelected}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleQuestionSelect(question.id);
                      }}
                      style={{
                        marginRight: "8px",
                        transform: "scale(1.1)",
                      }}
                      title={
                        language === "en"
                          ? "Select this question"
                          : "इस प्रश्न का चयन करें"
                      }
                    />
                    <Tag
                      color={getDifficultyColor(
                        question.attributes.question_level
                      )}
                      style={{
                        marginBottom: "4px",
                        fontSize: "11px",
                        fontWeight: "500",
                      }}
                    >
                      {getLevelDisplayValue(
                        question.attributes.question_level,
                        language
                      )}
                    </Tag>
                    <br />
                    <Tag
                      color={getCategoryColor(
                        question.attributes.question_category
                      )}
                      style={{ fontSize: "11px", fontWeight: "500" }}
                    >
                      {getCategoryDisplayValue(
                        question.attributes.question_category,
                        language
                      )}
                    </Tag>
                  </div>

                  <Title
                    level={5}
                    style={{
                      marginBottom: "8px",
                      flex: 1,
                      color: "#262626",
                      fontSize: "clamp(14px, 3vw, 16px)",
                      lineHeight: "1.4",
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 3,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {language === "en"
                      ? question.attributes.title_en
                      : question.attributes.title_hi}
                  </Title>

                  <div style={{ marginTop: "auto" }}>
                    <Text
                      style={{
                        color: "#666",
                        fontSize: "11px",
                        display: "block",
                      }}
                    >
                      {question.attributes.json.length}{" "}
                      {language === "en" ? "options" : "विकल्प"}
                      {question.attributes.quetype &&
                        ` • ${getTypeDisplayValue(
                          question.attributes.quetype,
                          language
                        )}`}
                    </Text>
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>

        {filteredQuestions.length === 0 && !loading && (
          <Card
            style={{
              textAlign: "center",
              padding: "24px",
              margin: "20px 0",
            }}
            styles={{ body: { padding: "24px" } }}
          >
            <div style={{ color: "#999" }}>
              <FilterOutlined
                style={{
                  fontSize: "clamp(36px, 8vw, 48px)",
                  marginBottom: "12px",
                }}
              />
              <Title
                level={4}
                style={{
                  color: "#999",
                  fontSize: "clamp(16px, 4vw, 20px)",
                }}
              >
                {language === "en"
                  ? "No questions found"
                  : "कोई प्रश्न नहीं मिला"}
              </Title>
              <Text style={{ fontSize: "clamp(12px, 3vw, 14px)" }}>
                {language === "en"
                  ? "Try adjusting your filters or search terms"
                  : "अपने फ़िल्टर या खोज शब्दों को समायोजित करने का प्रयास करें"}
              </Text>
            </div>
          </Card>
        )}

        {/* Pagination */}
        {totalQuestions > 0 && (
          <Row justify="center" style={{ marginTop: "54px" }}>
            <Col>
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={totalQuestions}
                onChange={onPageChange}
                showSizeChanger={false}
                showQuickJumper
                showTotal={(total) =>
                  language === "en"
                    ? `Total ${total} questions`
                    : `कुल ${total} प्रश्न`
                }
              />
            </Col>
          </Row>
        )}
      </Spin>
    </div>
  );
};
