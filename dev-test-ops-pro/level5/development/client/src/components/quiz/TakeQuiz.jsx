import React, { useState, useEffect } from "react";
import { getExam } from "../../services/exam";
import { QuizPlayer } from "./QuizPlayer";

const Button = ({
  children,
  onClick,
  style,
  type = "default",
  disabled,
  loading,
  size = "medium",
  ...props
}) => (
  <button
    onClick={onClick}
    disabled={disabled || loading}
    style={{
      padding:
        size === "large"
          ? "16px 32px"
          : size === "small"
          ? "8px 16px"
          : "12px 24px",
      border: "none",
      borderRadius: "8px",
      fontSize: size === "large" ? "18px" : size === "small" ? "14px" : "16px",
      fontWeight: "500",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.6 : 1,
      background:
        type === "primary"
          ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          : type === "ghost"
          ? "transparent"
          : "#f5f5f5",
      color:
        type === "primary" ? "white" : type === "ghost" ? "#667eea" : "#333",
      border: type === "ghost" ? "1px solid #667eea" : "none",
      transition: "all 0.3s ease",
      ...style,
    }}
    {...props}
  >
    {loading ? "Loading..." : children}
  </button>
);

const Input = ({
  value,
  onChange,
  placeholder,
  style,
  prefix,
  suffix,
  ...props
}) => (
  <div style={{ position: "relative", width: "100%" }}>
    {prefix && (
      <div
        style={{
          position: "absolute",
          left: "12px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 1,
          color: "#666",
        }}
      >
        {prefix}
      </div>
    )}
    <input
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      style={{
        width: "100%",
        padding: prefix ? "12px 16px 12px 40px" : "12px 16px",
        border: "2px solid #e1e8ff",
        borderRadius: "8px",
        fontSize: "16px",
        outline: "none",
        transition: "border-color 0.3s ease",
        ...style,
      }}
      onFocus={(e) => (e.target.style.borderColor = "#667eea")}
      onBlur={(e) => (e.target.style.borderColor = "#e1e8ff")}
      {...props}
    />
    {suffix && (
      <div
        style={{
          position: "absolute",
          right: "12px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 1,
          color: "#666",
        }}
      >
        {suffix}
      </div>
    )}
  </div>
);

const Card = ({ children, style, onClick, ...props }) => (
  <div
    onClick={onClick}
    style={{
      background: "rgba(255, 255, 255, 0.95)",
      borderRadius: "16px",
      padding: "24px",
      marginBottom: "20px",
      boxShadow: "0 8px 32px rgba(102, 126, 234, 0.1)",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      cursor: onClick ? "pointer" : "default",
      transition: "all 0.3s ease",
      ...style,
    }}
    onMouseEnter={(e) => {
      if (onClick) {
        e.target.style.transform = "translateY(-2px)";
        e.target.style.boxShadow = "0 12px 48px rgba(102, 126, 234, 0.15)";
      }
    }}
    onMouseLeave={(e) => {
      if (onClick) {
        e.target.style.transform = "translateY(0)";
        e.target.style.boxShadow = "0 8px 32px rgba(102, 126, 234, 0.1)";
      }
    }}
    {...props}
  >
    {children}
  </div>
);

const Badge = ({ children, color = "primary", style }) => (
  <span
    style={{
      display: "inline-block",
      padding: "4px 12px",
      borderRadius: "12px",
      fontSize: "12px",
      fontWeight: "500",
      background:
        color === "primary"
          ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          : color === "success"
          ? "#10b981"
          : "#ef4444",
      color: "white",
      ...style,
    }}
  >
    {children}
  </span>
);

const TakeQuiz = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showQuizPlayer, setShowQuizPlayer] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [categories, setCategories] = useState([
    { id: "all", name: "All Categories", icon: "📚" },
  ]);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoading(true);
        const response = await getExam();
        setExams(response.data);

        const uniqueCategories = [
          ...new Set(
            response.data.map(
              (exam) => exam.attributes.course?.data?.attributes?.name
            )
          ),
        ].filter(Boolean);

        const categoryOptions = uniqueCategories.map((categoryName) => {
          const courseData = response.data.find(
            (exam) =>
              exam.attributes.course?.data?.attributes?.name === categoryName
          )?.attributes.course?.data?.attributes;

          return {
            id: categoryName.toLowerCase().replace(/\s+/g, "_"),
            name: categoryName,
            icon: courseData?.icon || "📁",
          };
        });

        setCategories([
          { id: "all", name: "All Categories", icon: "📚" },
          ...categoryOptions,
        ]);
      } catch (err) {
        setError(err);
        console.error("Error fetching exams:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  const transformExamData = (exam) => {
    const attributes = exam.attributes;
    const courseData = attributes.course?.data?.attributes;
    const contentData = attributes.content?.data?.attributes;

    return {
      id: exam.id,
      title: attributes.name,
      description: attributes.description,
      category:
        courseData?.name?.toLowerCase().replace(/\s+/g, "_") || "uncategorized",
      categoryName: courseData?.name || "Uncategorized",
      categoryIcon: courseData?.icon || "📁",
      difficulty: attributes.difficulty_option || "MEDIUM",
      questions: attributes.questions?.data?.length || 0,
      duration: `${attributes.time_limit || 30} min`,
      attempts: attributes.attempts || 1,
      contentTitle: contentData?.title,
      coverImage: contentData?.coverurl,
      isLatest: isRecentlyCreated(attributes.createdAt),
      createdAt: attributes.createdAt,
    };
  };
  const transformExamForQuizPlayer = (exam) => {
    const attributes = exam.attributes;

    return {
      id: exam.id,
      title: attributes.name || "Untitled Quiz",
      description: attributes.description || "",
      timeLimit: attributes.time_limit || 30, // in minutes
      difficulty: attributes.difficulty_option || "MEDIUM",
      category: attributes.course?.data?.attributes?.name || "General",
      questions: attributes.questions || { data: [] }, // This will be fetched separately by QuizPlayer
      createdAt: attributes.createdAt,
      updatedAt: attributes.updatedAt,
    };
  };

  const isRecentlyCreated = (createdAt) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffInDays = (now - created) / (1000 * 60 * 60 * 24);
    return diffInDays <= 1;
  };

  const filteredExams = exams.map(transformExamData).filter((exam) => {
    const matchesSearch =
      exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || exam.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const latestExams = filteredExams.filter((exam) => exam.isLatest);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toUpperCase()) {
      case "EASY":
        return "#10b981";
      case "MEDIUM":
        return "#f59e0b";
      case "HARD":
        return "#ef4444";
      default:
        return "#667eea";
    }
  };

  const handleQuizComplete = (score, resultData) => {
    console.log("Quiz completed with score:", score);
    console.log("Result data:", resultData);

    alert(`Quiz completed! Your score: ${score}%`);

    setShowQuizPlayer(false);
    setSelectedQuiz(null);
  };

  const handleBackToQuizList = () => {
    setShowQuizPlayer(false);
    setSelectedQuiz(null);
  };

  const handleStartQuiz = (examId) => {
    console.log("Starting quiz:", examId);

    // Find the original exam data from the exams array
    const originalExam = exams.find((exam) => exam.id === examId);

    if (originalExam) {
      const transformedQuizData = transformExamForQuizPlayer(originalExam);
      console.log("Transformed quiz data:", transformedQuizData);

      setSelectedQuiz(transformedQuizData);
      setShowQuizPlayer(true);
    } else {
      console.error("Quiz not found:", examId);
      alert("Quiz not found. Please try again.");
    }
  };

  if (showQuizPlayer && selectedQuiz) {
    return (
      <QuizPlayer
        quiz={selectedQuiz}
        onBack={handleBackToQuizList}
        onComplete={handleQuizComplete}
      />
    );
  }

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <Card>
          <div style={{ padding: "40px" }}>
            <div style={{ fontSize: "24px", marginBottom: "16px" }}>🔄</div>
            <p>Loading quizzes...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px" }}>
        <Card>
          <div style={{ textAlign: "center", padding: "40px" }}>
            <div style={{ fontSize: "24px", marginBottom: "16px" }}>❌</div>
            <h3 style={{ color: "#ef4444", margin: "0 0 8px 0" }}>
              Error Loading Quizzes
            </h3>
            <p style={{ color: "#666" }}>{error}</p>
            <Button
              type="primary"
              onClick={() => window.location.reload()}
              style={{ marginTop: "16px" }}
            >
              Try Again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      {/* Header */}
      <Card>
        <h1
          style={{
            margin: "0 0 8px 0",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontSize: "32px",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Take Quiz
        </h1>
        <p style={{ textAlign: "center", color: "#666", margin: 0 }}>
          Challenge yourself with our curated quizzes
        </p>
      </Card>

      {/* Search Bar */}
      <Card>
        <Input
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search quizzes..."
          prefix="🔍"
          style={{ marginBottom: "16px" }}
        />

        {/* Categories */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {categories.map((category) => (
            <Button
              key={category.id}
              type={selectedCategory === category.id ? "primary" : "ghost"}
              size="small"
              onClick={() => setSelectedCategory(category.id)}
              style={{
                background:
                  selectedCategory === category.id
                    ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    : "rgba(102, 126, 234, 0.1)",
                border:
                  selectedCategory === category.id
                    ? "none"
                    : "1px solid #667eea",
              }}
            >
              {category.icon} {category.name}
            </Button>
          ))}
        </div>
      </Card>

      {/* Latest Quizzes Bar */}
      {latestExams.length > 0 && (
        <Card>
          <h3
            style={{
              margin: "0 0 16px 0",
              color: "#333",
              fontSize: "20px",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            🔥 Latest Quizzes
          </h3>
          <div
            style={{
              display: "flex",
              gap: "16px",
              overflowX: "auto",
              paddingBottom: "8px",
            }}
          >
            {latestExams.map((exam) => (
              <div
                key={exam.id}
                style={{
                  minWidth: "280px",
                  background:
                    "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
                  borderRadius: "12px",
                  padding: "16px",
                  border: "1px solid rgba(102, 126, 234, 0.2)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onClick={() => handleStartQuiz(exam.id)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.02)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 24px rgba(102, 126, 234, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <h4
                  style={{
                    margin: "0 0 8px 0",
                    color: "#333",
                    fontSize: "16px",
                  }}
                >
                  {exam.title}
                </h4>
                <p
                  style={{
                    margin: "0 0 12px 0",
                    color: "#666",
                    fontSize: "14px",
                  }}
                >
                  {exam.description}
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Badge color="success">NEW</Badge>
                  <span style={{ color: "#666", fontSize: "14px" }}>
                    {exam.categoryIcon} {exam.categoryName}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* All Quizzes */}
      <Card>
        <h3
          style={{
            margin: "0 0 20px 0",
            color: "#333",
            fontSize: "20px",
            fontWeight: "600",
          }}
        >
          All Quizzes ({filteredExams.length})
        </h3>

        {filteredExams.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
            <h4>No quizzes found</h4>
            <p>Try adjusting your search or category filter</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "16px" }}>
            {filteredExams.map((exam) => (
              <div
                key={exam.id}
                style={{
                  background: "rgba(255, 255, 255, 0.8)",
                  borderRadius: "12px",
                  padding: "20px",
                  border: "1px solid rgba(102, 126, 234, 0.1)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 1)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 24px rgba(102, 126, 234, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.8)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "12px",
                  }}
                >
                  <div>
                    <h4
                      style={{
                        margin: "0 0 4px 0",
                        color: "#333",
                        fontSize: "18px",
                        fontWeight: "600",
                      }}
                    >
                      {exam.title}
                    </h4>
                    <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
                      {exam.description}
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                    }}
                  >
                    {exam.isLatest && <Badge color="success">NEW</Badge>}
                    <Badge
                      style={{
                        background: getDifficultyColor(exam.difficulty),
                      }}
                    >
                      {exam.difficulty}
                    </Badge>
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                    gap: "12px",
                    marginBottom: "16px",
                    color: "#666",
                    fontSize: "14px",
                  }}
                >
                  <div>
                    {exam.categoryIcon} {exam.categoryName}
                  </div>
                  <div>📝 {exam.questions} questions</div>
                  <div>⏱️ {exam.duration}</div>
                  <div>🔄 {exam.attempts} attempts</div>
                </div>

                {exam.contentTitle && (
                  <div
                    style={{
                      background: "rgba(102, 126, 234, 0.05)",
                      borderRadius: "8px",
                      padding: "12px",
                      marginBottom: "16px",
                      border: "1px solid rgba(102, 126, 234, 0.1)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#667eea",
                        fontWeight: "500",
                      }}
                    >
                      RELATED CONTENT
                    </div>
                    <div
                      style={{
                        fontSize: "14px",
                        color: "#333",
                        marginTop: "4px",
                      }}
                    >
                      📺 {exam.contentTitle}
                    </div>
                  </div>
                )}

                <Button
                  type="primary"
                  style={{ width: "100%" }}
                  onClick={() => handleStartQuiz(exam.id)}
                >
                  Start Quiz
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default TakeQuiz;
