import { PlayCircleOutlined } from "@ant-design/icons";
import { Space } from "antd-mobile";
import { useEffect, useState } from "react";
import { getExam } from "../../services/exam";

export const QuizList = ({ contentItem, onClose, onPlayQuiz }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [allQuizzes, setAllQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch quizzes from API
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        const response = await getExam();

        // Transform API data to match component structure
        const transformedQuizzes = response.data
          .filter((exam) => {
            // Filter by content ID if contentItem is provided
            if (contentItem && contentItem.id) {
              return exam.attributes.content?.data?.id === contentItem.id;
            }
            return true;
          })
          .map((exam) => transformExamData(exam));

        setAllQuizzes(transformedQuizzes);
        setError(null);
      } catch (err) {
        setError("Failed to load quizzes");
        console.error("Error fetching quizzes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [contentItem]);

  // Transform API data to component format
  const transformExamData = (exam) => {
    const attributes = exam.attributes;
    const courseData = attributes.course?.data?.attributes;
    const contentData = attributes.content?.data?.attributes;

    return {
      id: exam.id,
      title: attributes.name,
      description: attributes.description,
      difficulty: attributes.difficulty_option || "Medium",
      questions: attributes.questions?.data?.length || 0,
      timeLimit: attributes.time_limit || 30,
      createdAt: attributes.createdAt,
      attempts: calculateAttempts(attributes.results?.data || []),
      avgScore: calculateAverageScore(attributes.results?.data || []),
      course: {
        name: courseData?.name || "General",
        icon: courseData?.icon || "📚",
      },
      content: {
        title: contentData?.title,
        coverUrl: contentData?.coverurl,
      },
    };
  };

  // Calculate total attempts from results
  const calculateAttempts = (results) => {
    return results.length || 0;
  };

  // Calculate average score from results
  const calculateAverageScore = (results) => {
    if (results.length === 0) return 0;
    const totalScore = results.reduce((sum, result) => {
      return sum + (result.attributes?.score || 0);
    }, 0);
    return Math.round(totalScore / results.length);
  };

  // Filter and sort quizzes
  useEffect(() => {
    let filtered = allQuizzes.filter(
      (quiz) =>
        quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quiz.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort quizzes
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "difficulty":
          const difficultyOrder = {
            Easy: 1,
            EASY: 1,
            Medium: 2,
            MEDIUM: 2,
            Hard: 3,
            HARD: 3,
          };
          return (
            (difficultyOrder[a.difficulty] || 2) -
            (difficultyOrder[b.difficulty] || 2)
          );
        case "popular":
          return b.attempts - a.attempts;
        case "score":
          return b.avgScore - a.avgScore;
        default:
          return 0;
      }
    });

    setFilteredQuizzes(filtered);
  }, [searchQuery, sortBy, allQuizzes]);

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

  const handlePlayQuiz = (quiz) => {
    if (onPlayQuiz) {
      onPlayQuiz(quiz);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          position: "fixed",
          top: 100,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
          padding: "20px",
        }}
        onClick={onClose}
      >
        <div
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            borderRadius: "16px",
            width: "100%",
            maxWidth: "900px",
            maxHeight: "90vh",
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(102, 126, 234, 0.2)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            display: "flex",
            flexDirection: "column",
            padding: "40px",
            textAlign: "center",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ fontSize: "24px", marginBottom: "16px" }}>🔄</div>
          <p>Loading quizzes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          position: "fixed",
          top: 100,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
          padding: "20px",
        }}
        onClick={onClose}
      >
        <div
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            borderRadius: "16px",
            width: "100%",
            maxWidth: "900px",
            maxHeight: "90vh",
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(102, 126, 234, 0.2)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            display: "flex",
            flexDirection: "column",
            padding: "40px",
            textAlign: "center",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ fontSize: "24px", marginBottom: "16px" }}>❌</div>
          <h3 style={{ color: "#ef4444", margin: "0 0 8px 0" }}>
            Error Loading Quizzes
          </h3>
          <p style={{ color: "#666" }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              border: "none",
              borderRadius: "8px",
              padding: "12px 24px",
              color: "white",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
              marginTop: "16px",
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 100,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "900px",
          maxHeight: "90vh",
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(102, 126, 234, 0.2)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          display: "flex",
          flexDirection: "column",
          paddingTop: "80px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "24px",
            borderBottom: "1px solid rgba(102, 126, 234, 0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <h2
              style={{
                margin: "0",
                color: "#333",
                fontSize: "24px",
                fontWeight: "600",
              }}
            >
              🎯 Quizzes{" "}
              {contentItem?.title ? `for "${contentItem.title}"` : ""}
            </h2>
            <button
              onClick={onClose}
              style={{
                background: "transparent",
                border: "none",
                fontSize: "24px",
                cursor: "pointer",
                color: "#666",
                padding: "4px",
              }}
            >
              ✕
            </button>
          </div>

          {/* Search and Sort */}
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <div style={{ flex: "1", minWidth: "200px", position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#667eea",
                  fontSize: "16px",
                }}
              >
                🔍
              </div>
              <input
                type="text"
                placeholder="Search quizzes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 12px 12px 40px",
                  border: "2px solid rgba(102, 126, 234, 0.2)",
                  borderRadius: "8px",
                  fontSize: "14px",
                  background: "rgba(255, 255, 255, 0.8)",
                  outline: "none",
                  transition: "all 0.3s ease",
                }}
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: "12px 16px",
                border: "2px solid rgba(102, 126, 234, 0.2)",
                borderRadius: "8px",
                fontSize: "14px",
                background: "rgba(255, 255, 255, 0.8)",
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="difficulty">By Difficulty</option>
              <option value="popular">Most Popular</option>
              <option value="score">Highest Score</option>
            </select>
          </div>
        </div>

        {/* Quiz List */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px",
          }}
        >
          {filteredQuizzes.length === 0 ? (
            <div
              style={{ textAlign: "center", padding: "40px", color: "#666" }}
            >
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎯</div>
              <h3 style={{ margin: "0 0 8px 0" }}>No quizzes found</h3>
              <p style={{ margin: 0 }}>
                {searchQuery
                  ? "Try adjusting your search"
                  : contentItem
                  ? "No quizzes available for this content"
                  : "No quizzes available"}
              </p>
            </div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              {filteredQuizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  style={{
                    background: "rgba(255, 255, 255, 0.8)",
                    border: "1px solid rgba(102, 126, 234, 0.1)",
                    borderRadius: "12px",
                    padding: "20px",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 24px rgba(102, 126, 234, 0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "16px",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          marginBottom: "8px",
                        }}
                      >
                        <h3
                          style={{
                            margin: "0",
                            color: "#333",
                            fontSize: "18px",
                            fontWeight: "600",
                          }}
                        >
                          {quiz.title}
                        </h3>
                        <span
                          style={{
                            background: getDifficultyColor(quiz.difficulty),
                            color: "white",
                            padding: "2px 8px",
                            borderRadius: "12px",
                            fontSize: "12px",
                            fontWeight: "500",
                          }}
                        >
                          {quiz.difficulty}
                        </span>
                      </div>

                      <p
                        style={{
                          margin: "0 0 12px 0",
                          color: "#666",
                          fontSize: "14px",
                          lineHeight: "1.4",
                        }}
                      >
                        {quiz.description}
                      </p>

                      {/* Course Information */}
                      {quiz.course.name && (
                        <div
                          style={{
                            background: "rgba(102, 126, 234, 0.05)",
                            borderRadius: "8px",
                            padding: "8px 12px",
                            marginBottom: "12px",
                            display: "inline-block",
                          }}
                        >
                          <span style={{ fontSize: "12px", color: "#667eea" }}>
                            {quiz.course.icon} {quiz.course.name}
                          </span>
                        </div>
                      )}

                      <div
                        style={{
                          display: "flex",
                          gap: "20px",
                          fontSize: "12px",
                          color: "#888",
                        }}
                      >
                        <span>📝 {quiz.questions} questions</span>
                        <span>⏱️ {quiz.timeLimit} min</span>
                        <span>👥 {quiz.attempts} attempts</span>
                        {quiz.avgScore > 0 && (
                          <span>📊 {quiz.avgScore}% avg score</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handlePlayQuiz(quiz)}
                      style={{
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        border: "none",
                        borderRadius: "8px",
                        padding: "12px 20px",
                        color: "white",
                        fontSize: "14px",
                        fontWeight: "500",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <PlayCircleOutlined />
                      Play Quiz
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <Space />
          {filteredQuizzes.length > 0 && (
            <p style={{ textAlign: "center", color: "#666", fontSize: "14px" }}>
              {filteredQuizzes.length} quiz
              {filteredQuizzes.length !== 1 ? "es" : ""} found
            </p>
          )}
          <Space style={{ paddingBottom: "120px" }} />
        </div>
      </div>
    </div>
  );
};
