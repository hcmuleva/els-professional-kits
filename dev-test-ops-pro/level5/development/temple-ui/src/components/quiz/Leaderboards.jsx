import React, { useEffect, useState } from "react";
import { getCourseList } from "../../services/course";
import { getUsersResultData } from "../../services/result";

// Component definitions
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
          ? "12px 24px"
          : size === "small"
          ? "6px 12px"
          : "8px 16px",
      border: "none",
      borderRadius: "8px",
      fontSize: size === "large" ? "16px" : size === "small" ? "12px" : "14px",
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
      minWidth: "0",
      ...style,
    }}
    {...props}
  >
    {loading ? "Loading..." : children}
  </button>
);

const Card = ({ children, style, onClick, ...props }) => (
  <div
    onClick={onClick}
    style={{
      background: "rgba(255, 255, 255, 0.95)",
      borderRadius: "12px",
      padding: "16px",
      marginBottom: "16px",
      boxShadow: "0 4px 16px rgba(102, 126, 234, 0.1)",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      cursor: onClick ? "pointer" : "default",
      transition: "all 0.3s ease",
      ...style,
    }}
    {...props}
  >
    {children}
  </div>
);

const Leaderboards = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("weekly");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [userResults, setUserResults] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processedLeaderboard, setProcessedLeaderboard] = useState([]);

  const periods = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "alltime", label: "All Time" },
  ];

  const filterByPeriod = (results, period) => {
    const now = Date.now();
    return results.filter(({ attributes: { createdAt } }) => {
      const ts = new Date(createdAt).getTime();
      switch (period) {
        case "daily":
          return new Date(ts).toDateString() === new Date(now).toDateString();
        case "weekly":
          return ts >= now - 7 * 24 * 60 * 60 * 1000;
        case "monthly":
          return ts >= now - 30 * 24 * 60 * 60 * 1000;
        default: // alltime
          return true;
      }
    });
  };

  // Generate student avatars based on user ID
  const generateStudentAvatar = (userId) => {
    const avatars = [
      "👨‍💻",
      "👩‍🔬",
      "👨‍🎓",
      "👩‍💼",
      "👨‍🏫",
      "👩‍💻",
      "👨‍💼",
      "👩‍🎓",
      "👨‍🚀",
      "👩‍⚕️",
      "👨‍🎨",
      "👩‍🏫",
      "👨‍🔬",
      "👩‍🚀",
      "👨‍⚕️",
      "👩‍🎨",
      "👨‍💻",
      "👩‍💼",
    ];
    return avatars[userId % avatars.length];
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch courses
        const courseRes = await getCourseList();
        const courseData = courseRes?.data?.data || [];
        setCourses(courseData);

        // Fetch user results
        const resultRes = await getUsersResultData();
        const resultData = resultRes?.data || [];
        setUserResults(resultData);

        // Process the data to create leaderboard
        processLeaderboardData(resultData, courseData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateAccuracy = (resultDetails) => {
    if (!resultDetails || Object.keys(resultDetails).length === 0) return 0;

    const questions = Object.values(resultDetails);
    const correctAnswers = questions.filter((q) => q.isCorrect).length;
    return Math.round((correctAnswers / questions.length) * 100);
  };

  const calculateTotalTimeSpent = (resultDetails) => {
    if (!resultDetails || Object.keys(resultDetails).length === 0) return 0;

    return Object.values(resultDetails).reduce(
      (total, q) => total + (q.timeSpent || 0),
      0
    );
  };

  const processLeaderboardData = (results, courseData) => {
    // Filter results by selected period
    const filteredResults = filterByPeriod(results, selectedPeriod);
    // Group results by user (using result ID as user identifier for now)
    const userScores = {};

    filteredResults.forEach((result) => {
      const userId = result.id; // Using result ID as user identifier
      const courseId =
        result.attributes.exam?.data?.attributes?.course?.data?.id;
      const marks = result.attributes.marks || 0;
      const resultDetails = result.attributes.result_details || {};
      const accuracy = calculateAccuracy(resultDetails);
      const totalTimeSpent = calculateTotalTimeSpent(resultDetails);
      const examName =
        result.attributes.exam?.data?.attributes?.name || "Unknown Exam";

      if (!userScores[userId]) {
        userScores[userId] = {
          userId: userId,
          name: `${result?.attributes?.user?.data?.attributes?.first_name} ${result?.attributes?.user?.data?.attributes?.last_name}`,
          avatar: generateStudentAvatar(userId),
          totalScore: 0,
          quizCount: 0,
          totalAccuracy: 0,
          totalTimeSpent: 0,
          results: [],
          courseScores: {},
        };
      }

      userScores[userId].totalScore += marks;
      userScores[userId].quizCount += 1;
      userScores[userId].totalAccuracy += accuracy;
      userScores[userId].totalTimeSpent += totalTimeSpent;
      userScores[userId].results.push({
        examName,
        marks,
        accuracy,
        courseId,
        courseName:
          courseData.find((c) => c.id === courseId)?.attributes?.name ||
          "Unknown",
        courseIcon:
          courseData.find((c) => c.id === courseId)?.attributes?.icon || "📚",
        createdAt: result.attributes.createdAt,
      });

      // Track scores by course
      if (courseId) {
        if (!userScores[userId].courseScores[courseId]) {
          userScores[userId].courseScores[courseId] = {
            courseId,
            courseName:
              courseData.find((c) => c.id === courseId)?.attributes?.name ||
              "Unknown",
            courseIcon:
              courseData.find((c) => c.id === courseId)?.attributes?.icon ||
              "📚",
            totalScore: 0,
            quizCount: 0,
            totalAccuracy: 0,
          };
        }

        userScores[userId].courseScores[courseId].totalScore += marks;
        userScores[userId].courseScores[courseId].quizCount += 1;
        userScores[userId].courseScores[courseId].totalAccuracy += accuracy;
      }
    });

    // Calculate average accuracy for each user
    Object.values(userScores).forEach((user) => {
      user.averageAccuracy =
        user.quizCount > 0
          ? Math.round(user.totalAccuracy / user.quizCount)
          : 0;

      // Calculate average accuracy for each course
      Object.values(user.courseScores).forEach((courseScore) => {
        courseScore.averageAccuracy =
          courseScore.quizCount > 0
            ? Math.round(courseScore.totalAccuracy / courseScore.quizCount)
            : 0;
      });
    });

    // Convert to array for leaderboard display
    const leaderboardData = Object.values(userScores)
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((user, index) => ({
        ...user,
        rank: index + 1,
        accuracy: user.averageAccuracy,
      }));

    setProcessedLeaderboard(leaderboardData);
  };

  // Re-process data when period changes
  useEffect(() => {
    if (userResults.length > 0 && courses.length > 0) {
      processLeaderboardData(userResults, courses);
    }
  }, [selectedPeriod, userResults, courses]);

  const getFilteredLeaderboard = () => {
    if (selectedCourse === "all") {
      return processedLeaderboard;
    } else {
      // Filter users who have taken quizzes in the selected course
      return processedLeaderboard
        .filter((user) => user.courseScores[parseInt(selectedCourse)])
        .map((user) => {
          const courseScore = user.courseScores[parseInt(selectedCourse)];
          return {
            ...user,
            totalScore: courseScore.totalScore,
            quizCount: courseScore.quizCount,
            accuracy: courseScore.averageAccuracy,
            courseName: courseScore.courseName,
            courseIcon: courseScore.courseIcon,
          };
        })
        .sort((a, b) => b.totalScore - a.totalScore)
        .map((user, index) => ({
          ...user,
          rank: index + 1,
        }));
    }
  };

  const filteredLeaderboard = getFilteredLeaderboard();
  const topThree = filteredLeaderboard.slice(0, 3);

  if (loading) {
    return (
      <div
        style={{
          padding: "20px",
          textAlign: "center",
          minHeight: "50vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div>Loading leaderboards...</div>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "12px",
        maxWidth: "100%",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)`,
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <Card>
          <h1
            style={{
              margin: "0 0 8px 0",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: "clamp(24px, 5vw, 32px)",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            🏆 Leaderboards
          </h1>
          <p
            style={{
              textAlign: "center",
              color: "#666",
              margin: 0,
              fontSize: "clamp(14px, 3vw, 16px)",
            }}
          >
            See who's leading the quiz challenges
          </p>
        </Card>

        {/* Filters */}
        <Card>
          <div style={{ marginBottom: "16px" }}>
            <h3
              style={{
                margin: "0 0 12px 0",
                fontSize: "16px",
                color: "#333",
                fontWeight: "600",
              }}
            >
              📚 Course Filter
            </h3>
            <div
              style={{
                display: "flex",
                gap: "6px",
                flexWrap: "wrap",
                marginBottom: "16px",
              }}
            >
              <Button
                key="all"
                type={selectedCourse === "all" ? "primary" : "ghost"}
                onClick={() => setSelectedCourse("all")}
                size="small"
                style={{ fontSize: "12px" }}
              >
                🏆 All Courses
              </Button>
              {courses.map((course) => (
                <Button
                  key={course.id}
                  type={
                    selectedCourse === course.id.toString()
                      ? "primary"
                      : "ghost"
                  }
                  onClick={() => setSelectedCourse(course.id.toString())}
                  size="small"
                  style={{ fontSize: "12px" }}
                >
                  {course.attributes.icon} {course.attributes.name}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h3
              style={{
                margin: "0 0 12px 0",
                fontSize: "16px",
                color: "#333",
                fontWeight: "600",
              }}
            >
              📅 Time Period
            </h3>
            <div
              style={{
                display: "flex",
                gap: "6px",
                flexWrap: "wrap",
              }}
            >
              {periods.map((period) => (
                <Button
                  key={period.value}
                  type={selectedPeriod === period.value ? "primary" : "ghost"}
                  onClick={() => setSelectedPeriod(period.value)}
                  size="small"
                  style={{ fontSize: "12px" }}
                >
                  {period.label}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {/* Top 3 Podium - Mobile Optimized */}
        {topThree.length >= 3 && (
          <Card>
            <h3
              style={{
                margin: "0 0 16px 0",
                color: "#333",
                fontSize: "18px",
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              🥇 Top Performers
            </h3>

            {/* Mobile-first podium layout */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                alignItems: "center",
              }}
            >
              {/* 1st Place - Prominent */}
              <div
                style={{
                  textAlign: "center",
                  background:
                    "linear-gradient(135deg, rgba(255, 215, 0, 0.3) 0%, rgba(255, 193, 7, 0.3) 100%)",
                  borderRadius: "16px",
                  padding: "20px",
                  width: "100%",
                  maxWidth: "280px",
                  border: "2px solid #ffd700",
                }}
              >
                <div style={{ fontSize: "48px", marginBottom: "8px" }}>
                  {topThree[0].avatar}
                </div>
                <div style={{ fontSize: "32px", marginBottom: "8px" }}>🏆</div>
                <h4
                  style={{
                    margin: "0 0 4px 0",
                    color: "#333",
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                >
                  {topThree[0].name}
                </h4>
                <p
                  style={{
                    margin: "0 0 8px 0",
                    color: "#666",
                    fontSize: "16px",
                    fontWeight: "bold",
                  }}
                >
                  {topThree[0].totalScore} pts
                </p>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#888",
                    background: "rgba(255,255,255,0.7)",
                    padding: "4px 8px",
                    borderRadius: "8px",
                    display: "inline-block",
                  }}
                >
                  {topThree[0].courseIcon} {topThree[0].courseName}
                </div>
              </div>

              {/* 2nd and 3rd Place - Side by side on larger screens */}
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  width: "100%",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                {/* 2nd Place */}
                <div
                  style={{
                    textAlign: "center",
                    background:
                      "linear-gradient(135deg, rgba(192, 192, 192, 0.3) 0%, rgba(169, 169, 169, 0.3) 100%)",
                    borderRadius: "12px",
                    padding: "16px",
                    flex: "1",
                    minWidth: "120px",
                    maxWidth: "140px",
                    border: "2px solid #c0c0c0",
                  }}
                >
                  <div style={{ fontSize: "36px", marginBottom: "6px" }}>
                    {topThree[1].avatar}
                  </div>
                  <div style={{ fontSize: "24px", marginBottom: "6px" }}>
                    🥈
                  </div>
                  <h4
                    style={{
                      margin: "0 0 4px 0",
                      color: "#333",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    {topThree[1].name}
                  </h4>
                  <p
                    style={{
                      margin: "0 0 6px 0",
                      color: "#666",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    {topThree[1].totalScore} pts
                  </p>
                  <div
                    style={{
                      fontSize: "10px",
                      color: "#888",
                      background: "rgba(255,255,255,0.7)",
                      padding: "2px 6px",
                      borderRadius: "6px",
                    }}
                  >
                    {topThree[1].courseIcon}{" "}
                    {topThree[1].courseName.length > 8
                      ? topThree[1].courseName.substring(0, 8) + "..."
                      : topThree[1].courseName}
                  </div>
                </div>

                {/* 3rd Place */}
                <div
                  style={{
                    textAlign: "center",
                    background:
                      "linear-gradient(135deg, rgba(205, 127, 50, 0.3) 0%, rgba(184, 115, 51, 0.3) 100%)",
                    borderRadius: "12px",
                    padding: "16px",
                    flex: "1",
                    minWidth: "120px",
                    maxWidth: "140px",
                    border: "2px solid #cd7f32",
                  }}
                >
                  <div style={{ fontSize: "36px", marginBottom: "6px" }}>
                    {topThree[2].avatar}
                  </div>
                  <div style={{ fontSize: "24px", marginBottom: "6px" }}>
                    🥉
                  </div>
                  <h4
                    style={{
                      margin: "0 0 4px 0",
                      color: "#333",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    {topThree[2].name}
                  </h4>
                  <p
                    style={{
                      margin: "0 0 6px 0",
                      color: "#666",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    {topThree[2].totalScore} pts
                  </p>
                  <div
                    style={{
                      fontSize: "10px",
                      color: "#888",
                      background: "rgba(255,255,255,0.7)",
                      padding: "2px 6px",
                      borderRadius: "6px",
                    }}
                  >
                    {topThree[2].courseIcon}{" "}
                    {topThree[2].courseName.length > 8
                      ? topThree[2].courseName.substring(0, 8) + "..."
                      : topThree[2].courseName}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Full Leaderboard - Mobile Optimized */}
        <Card>
          <h3
            style={{
              margin: "0 0 16px 0",
              color: "#333",
              fontSize: "18px",
              fontWeight: "600",
            }}
          >
            📊 Full Rankings ({filteredLeaderboard.length})
          </h3>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              maxHeight: "60vh",
              overflowY: "auto",
            }}
          >
            {filteredLeaderboard.map((user, index) => (
              <div
                key={`${user.userId}-${user.courseId}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px",
                  background:
                    index < 3
                      ? "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)"
                      : "rgba(255, 255, 255, 0.8)",
                  borderRadius: "12px",
                  border: "1px solid rgba(102, 126, 234, 0.1)",
                  transition: "all 0.3s ease",
                  minHeight: "60px",
                }}
              >
                {/* Rank */}
                <div
                  style={{
                    minWidth: "32px",
                    textAlign: "center",
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: index < 3 ? "#667eea" : "#666",
                  }}
                >
                  #{user.rank}
                </div>

                {/* Avatar and Badge */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <div style={{ fontSize: "24px" }}>{user.avatar}</div>
                  <div style={{ fontSize: "16px" }}>
                    {index === 0
                      ? "🏆"
                      : index === 1
                      ? "🥈"
                      : index === 2
                      ? "🥉"
                      : "🏅"}
                  </div>
                </div>

                {/* User Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4
                    style={{
                      margin: "0 0 4px 0",
                      color: "#333",
                      fontSize: "14px",
                      fontWeight: "600",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {user.name}
                  </h4>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                      color: "#666",
                      fontSize: "11px",
                    }}
                  >
                    <div
                      style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}
                    >
                      <span>📝 {user.quizCount}</span>
                      <span>🎯 {user.accuracy}%</span>
                    </div>
                    <div
                      style={{
                        color: "#888",
                        fontSize: "10px",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      {user.courseIcon} {user.courseName}
                    </div>
                  </div>
                </div>

                {/* Score */}
                <div
                  style={{
                    textAlign: "right",
                    color: "#667eea",
                    fontSize: "16px",
                    fontWeight: "bold",
                    minWidth: "60px",
                  }}
                >
                  {user.totalScore}
                  <div
                    style={{
                      fontSize: "10px",
                      color: "#888",
                      fontWeight: "normal",
                    }}
                  >
                    points
                  </div>
                </div>
              </div>
            ))}

            {filteredLeaderboard.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px 20px",
                  color: "#666",
                }}
              >
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>📊</div>
                <h3 style={{ margin: "0 0 8px 0", fontSize: "18px" }}>
                  No results found
                </h3>
                <p style={{ margin: 0, fontSize: "14px" }}>
                  Try selecting a different course or time period
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Course Statistics */}
        <Card>
          <h3
            style={{
              margin: "0 0 16px 0",
              color: "#333",
              fontSize: "18px",
              fontWeight: "600",
            }}
          >
            📈 Course Statistics
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "12px",
            }}
          >
            {courses.map((course) => {
              const courseLeaders = processedLeaderboard
                .filter((student) => student.courseId === course.id)
                .slice(0, 1);

              const topStudent = courseLeaders[0];

              return (
                <div
                  key={course.id}
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)",
                    borderRadius: "12px",
                    padding: "16px",
                    border: "1px solid rgba(102, 126, 234, 0.1)",
                    textAlign: "center",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                  }}
                  onClick={() => setSelectedCourse(course.id.toString())}
                >
                  <div style={{ fontSize: "24px", marginBottom: "8px" }}>
                    {course.attributes.icon}
                  </div>
                  <h4
                    style={{
                      margin: "0 0 8px 0",
                      color: "#333",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    {course.attributes.name}
                  </h4>
                  {topStudent && (
                    <>
                      <p
                        style={{
                          margin: "0 0 4px 0",
                          color: "#667eea",
                          fontSize: "12px",
                          fontWeight: "600",
                        }}
                      >
                        {topStudent.avatar} {topStudent.name}
                      </p>
                      <p
                        style={{
                          margin: 0,
                          color: "#666",
                          fontSize: "12px",
                        }}
                      >
                        {topStudent.totalScore} points
                      </p>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Leaderboards;
