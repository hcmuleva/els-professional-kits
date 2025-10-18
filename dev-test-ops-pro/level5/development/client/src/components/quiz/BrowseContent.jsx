import { PlayCircleOutlined, PlusOutlined } from "@ant-design/icons";
import React, { useState, useRef, useEffect } from "react";
import { getCourseList } from "../../services/course";
import { QuizPlayer } from "./QuizPlayer";
import { QuizList } from "./QuizList";
import QuestionCreator from "./QuestionCreator";
import QuizCreator from "./QuizCreator";

const BrowseContent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [allContent, setAllContent] = useState([]);
  const [categories, setCategories] = useState([
    { key: "All Categories", label: "🌟 All Categories", icon: "🌟" },
  ]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showQuizList, setShowQuizList] = useState(false);
  const [showQuizPlayer, setShowQuizPlayer] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [showQuestionCreator, setShowQuestionCreator] = useState(false); // State for QuestionCreator
  const scrollContainerRef = useRef(null);
  const [showQuizCreator, setShowQuizCreator] = useState(false);
  const [activeTab, setActiveTab] = useState("browse");
  // Hard-coded user role - change this to "USER" or "CREATOR"
  const [userRole, setUserRole] = useState("CREATOR"); // Set to CREATOR for testing

  // Fetch course data and set categories and content
  useEffect(() => {
    const fetchData = async () => {
      // Mock data since getCourseList is not available
      //   const mockCourses = [
      //     {
      //       id: 1,
      //       attributes: {
      //         name: "Mathematics",
      //         icon: "🔢",
      //         contents: {
      //           data: [
      //             {
      //               id: 1,
      //               attributes: {
      //                 title: "Basic Algebra",
      //                 subtitle: "Learn fundamental algebraic concepts",
      //                 type: "YOUTUBE",
      //                 youtubeurl: "https://www.youtube.com/embed/example1",
      //                 coverurl:
      //                   "https://via.placeholder.com/300x200?text=Algebra",
      //               },
      //             },
      //             {
      //               id: 2,
      //               attributes: {
      //                 title: "Calculus Introduction",
      //                 subtitle: "Introduction to differential calculus",
      //                 type: "IMAGE",
      //                 coverurl:
      //                   "https://via.placeholder.com/300x200?text=Calculus",
      //               },
      //             },
      //           ],
      //         },
      //       },
      //     },
      //     {
      //       id: 2,
      //       attributes: {
      //         name: "Science",
      //         icon: "🔬",
      //         contents: {
      //           data: [
      //             {
      //               id: 3,
      //               attributes: {
      //                 title: "Physics Basics",
      //                 subtitle: "Fundamental physics concepts",
      //                 type: "YOUTUBE",
      //                 youtubeurl: "https://www.youtube.com/embed/example2",
      //                 coverurl:
      //                   "https://via.placeholder.com/300x200?text=Physics",
      //               },
      //             },
      //           ],
      //         },
      //       },
      //     },
      //   ];

      const res = await getCourseList();
      const courses = res?.data?.data;
      //   const courses = mockCourses; // Use mock data
      // Map categories
      const apiCats = courses.map((cat) => ({
        key: cat.attributes.name,
        label: `${cat.attributes.icon} ${cat.attributes.name}`,
        icon: cat.attributes.icon,
      }));
      setCategories([
        { key: "All Categories", label: "🌟 All Categories", icon: "🌟" },
        ...apiCats,
      ]);

      // Map all content items
      const contentItems = courses.flatMap((course) =>
        course.attributes.contents.data.map((content) => ({
          id: content.id,
          title: content.attributes.title,
          category: course.attributes.name,
          type:
            content.attributes.type === "YOUTUBE"
              ? "video"
              : content.attributes.type.toLowerCase(),
          thumbnail: content.attributes.coverurl,
          videoUrl:
            content.attributes.type === "YOUTUBE"
              ? content.attributes.youtubeurl
              : undefined,
          description: content.attributes.subtitle,
        }))
      );
      setAllContent(contentItems);
    };
    fetchData();
  }, []);

  // Filter content by category
  const getContentByCategory = (category) => {
    if (category === "All Categories") return allContent;
    return allContent.filter((item) => item.category === category);
  };

  const filteredContent = getContentByCategory(selectedCategory).filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const carouselContent = filteredContent.slice(0, 5);
  const scrollableContent = filteredContent;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselContent.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + carouselContent.length) % carouselContent.length
    );
  };

  // Handle icon click based on user role
  const handleIconClick = (item) => {
    setSelectedItem(item);
    if (userRole === "CREATOR") {
      setShowPopup(true);
    } else if (userRole === "USER") {
      setShowQuizList(true);
    }
  };

  const handlePlayQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setShowQuizList(false);
    setShowQuizPlayer(true);
  };

  const handleQuizComplete = (score) => {
    alert(`Quiz completed! Your score: ${score}%`);
    setShowQuizPlayer(false);
    setSelectedQuiz(null);
  };

  const handleBackToQuizList = () => {
    setShowQuizPlayer(false);
    setShowQuizList(true);
  };

  // Handle question creation
  const handleCreateQuestion = (item) => {
    setSelectedItem(item);
    setShowQuestionCreator(true);
    setShowPopup(false); // Close the popup
  };

  const handleQuestionCreatorSuccess = (response) => {
    console.log("Question created:", response);
    setShowQuestionCreator(false);
    setSelectedItem(null);
  };

  const handleQuestionCreatorCancel = () => {
    setShowQuestionCreator(false);
    setSelectedItem(null);
  };

  const handleCreateQuiz = (item) => {
    setSelectedItem(item);
    setShowQuizCreator(true);
    setShowPopup(false);
  };

  const handleQuizCreatorSuccess = (response) => {
    console.log("Quiz created:", response);
    setShowQuizCreator(false);
    setSelectedItem(null);
  };

  const handleQuizCreatorCancel = () => {
    setShowQuizCreator(false);
    setSelectedItem(null);
  };

  // Creator Popup component
  const CreatorPopup = ({ onClose }) => (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          borderRadius: "16px",
          padding: "24px",
          width: "300px",
          boxShadow: "0 8px 32px rgba(102, 126, 234, 0.2)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          style={{
            margin: "0 0 16px 0",
            color: "#333",
            fontSize: "20px",
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          Create Content for "{selectedItem?.title}"
        </h3>
        <button
          onClick={() => handleCreateQuiz(selectedItem)}
          style={{
            padding: "12px",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "500",
            cursor: "pointer",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            transition: "all 0.3s ease",
          }}
        >
          📝 Create Quiz
        </button>
        <button
          onClick={() => handleCreateQuestion(selectedItem)}
          style={{
            padding: "12px",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "500",
            cursor: "pointer",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            transition: "all 0.3s ease",
          }}
        >
          ❓ Create Question
        </button>
        <button
          onClick={onClose}
          style={{
            padding: "12px",
            border: "1px solid #667eea",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "500",
            cursor: "pointer",
            background: "transparent",
            color: "#667eea",
            transition: "all 0.3s ease",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );

  // Button component
  const Button = ({
    children,
    onClick,
    style,
    type = "default",
    size = "medium",
    ...props
  }) => (
    <button
      onClick={onClick}
      style={{
        padding:
          size === "large"
            ? "16px 32px"
            : size === "small"
            ? "8px 16px"
            : "12px 24px",
        border: "none",
        borderRadius: "8px",
        fontSize:
          size === "large" ? "18px" : size === "small" ? "14px" : "16px",
        fontWeight: "500",
        cursor: "pointer",
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
      {children}
    </button>
  );

  // Card component
  const Card = ({ children, style, onClick, ...props }) => (
    <div
      onClick={onClick}
      style={{
        background: "rgba(255, 255, 255, 0.95)",
        borderRadius: "16px",
        padding: "20px",
        marginBottom: "20px",
        boxShadow: "0 8px 32px rgba(102, 126, 234, 0.1)",
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

  // MediaPreview component
  const MediaPreview = ({ item, isCarousel = false }) => {
    const containerStyle = {
      position: "relative",
      width: "100%",
      height: isCarousel ? "300px" : "200px",
      borderRadius: "12px",
      overflow: "hidden",
      marginBottom: "12px",
    };

    if (item.type === "video") {
      return (
        <div style={containerStyle}>
          <iframe
            src={item.videoUrl}
            style={{ width: "100%", height: "100%", border: "none" }}
            allowFullScreen
            title={item.title}
          />
        </div>
      );
    }

    if (item.type === "image") {
      return (
        <div style={containerStyle}>
          <img
            src={item.thumbnail}
            alt={item.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div
            style={{
              position: "absolute",
              top: "8px",
              left: "8px",
              background: "rgba(102, 126, 234, 0.9)",
              color: "white",
              padding: "4px 8px",
              borderRadius: "12px",
              fontSize: "12px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            📷 Image
          </div>
        </div>
      );
    }

    return null;
  };

  // Show Quiz Player if active
  if (showQuizPlayer && selectedQuiz) {
    return (
      <QuizPlayer
        quiz={selectedQuiz}
        onBack={handleBackToQuizList}
        onComplete={handleQuizComplete}
      />
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        position: "relative",
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
      <div style={{ position: "relative", zIndex: 1, padding: "20px" }}>
        {/* Role Switcher */}
        <Card>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <span
              style={{ color: "#666", fontSize: "16px", fontWeight: "500" }}
            >
              Current Role:
            </span>
            <div style={{ display: "flex", gap: "8px" }}>
              <Button
                type={userRole === "CREATOR" ? "primary" : "ghost"}
                size="small"
                onClick={() => setUserRole("CREATOR")}
              >
                👨‍💻 Creator
              </Button>
              <Button
                type={userRole === "USER" ? "primary" : "ghost"}
                size="small"
                onClick={() => setUserRole("USER")}
              >
                👤 User
              </Button>
            </div>
          </div>
        </Card>

        <Card>
          <h1
            style={{
              margin: "0 0 16px 0",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: "36px",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            📚 Browse Content
          </h1>
          <p
            style={{
              textAlign: "center",
              color: "#666",
              margin: 0,
              fontSize: "18px",
              lineHeight: "1.6",
            }}
          >
            Discover educational content across various subjects
          </p>
        </Card>

        <Card>
          <div style={{ position: "relative", marginBottom: "20px" }}>
            <div
              style={{
                position: "absolute",
                left: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#667eea",
                fontSize: "20px",
              }}
            >
              🔍
            </div>
            <input
              type="text"
              placeholder="Search content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "16px 16px 16px 48px",
                border: "2px solid rgba(102, 126, 234, 0.2)",
                borderRadius: "12px",
                fontSize: "16px",
                background: "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(10px)",
                outline: "none",
                transition: "all 0.3s ease",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#667eea";
                e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(102, 126, 234, 0.2)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {categories.map((category) => (
              <Button
                key={category.key}
                type={selectedCategory === category.key ? "primary" : "ghost"}
                onClick={() => {
                  setSelectedCategory(category.key);
                  setCurrentSlide(0);
                }}
                size="small"
              >
                {category.label}
              </Button>
            ))}
          </div>
        </Card>

        {carouselContent.length > 0 && (
          <Card>
            <h3
              style={{
                margin: "0 0 20px 0",
                color: "#333",
                fontSize: "24px",
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              🌟 Featured Content
            </h3>
            <div style={{ position: "relative" }}>
              <div
                style={{
                  overflow: "hidden",
                  borderRadius: "16px",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    transform: `translateX(-${currentSlide * 100}%)`,
                    transition: "transform 0.5s ease",
                  }}
                >
                  {carouselContent.map((item) => (
                    <div
                      key={item.id}
                      style={{ minWidth: "100%", position: "relative" }}
                    >
                      <MediaPreview item={item} isCarousel={true} />
                      <div
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          background:
                            "linear-gradient(transparent, rgba(0, 0, 0, 0.8))",
                          padding: "40px 24px 24px",
                          color: "white",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-end",
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <h4
                              style={{
                                margin: "0 0 8px 0",
                                fontSize: "24px",
                                fontWeight: "bold",
                              }}
                            >
                              {item.title}
                            </h4>
                            <div
                              style={{
                                background: "rgba(102, 126, 234, 0.8)",
                                display: "inline-block",
                                padding: "4px 12px",
                                borderRadius: "12px",
                                fontSize: "14px",
                                fontWeight: "500",
                              }}
                            >
                              {item.category}
                            </div>
                          </div>
                          <button
                            onClick={() => handleIconClick(item)}
                            style={{
                              background: "rgba(255, 255, 255, 0.2)",
                              border: "2px solid white",
                              borderRadius: "50%",
                              width: "48px",
                              height: "48px",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              transition: "all 0.3s ease",
                              fontSize: "18px",
                            }}
                          >
                            {userRole === "CREATOR" ? "➕" : "▶️"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {carouselContent.length > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    style={{
                      position: "absolute",
                      left: "16px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "rgba(255, 255, 255, 0.9)",
                      border: "none",
                      borderRadius: "50%",
                      width: "48px",
                      height: "48px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                      transition: "all 0.3s ease",
                    }}
                  >
                    ←
                  </button>
                  <button
                    onClick={nextSlide}
                    style={{
                      position: "absolute",
                      right: "16px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "rgba(255, 255, 255, 0.9)",
                      border: "none",
                      borderRadius: "50%",
                      width: "48px",
                      height: "48px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                      transition: "all 0.3s ease",
                    }}
                  >
                    →
                  </button>
                </>
              )}
              {carouselContent.length > 1 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "8px",
                    marginTop: "16px",
                  }}
                >
                  {carouselContent.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        border: "none",
                        background:
                          currentSlide === index
                            ? "#667eea"
                            : "rgba(102, 126, 234, 0.3)",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </Card>
        )}

        <Card>
          <h3
            style={{
              margin: "0 0 20px 0",
              color: "#333",
              fontSize: "24px",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            📖 All Content ({scrollableContent.length})
          </h3>
          <div
            className="container"
            ref={scrollContainerRef}
            style={{ maxHeight: "600px", overflowY: "auto", padding: "0 8px" }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "20px",
              }}
            >
              {scrollableContent.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: "rgba(255, 255, 255, 0.8)",
                    borderRadius: "16px",
                    border: "1px solid rgba(102, 126, 234, 0.1)",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    position: "relative",
                    width: "90%",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow =
                      "0 12px 32px rgba(102, 126, 234, 0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <MediaPreview item={item} />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "12px",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <h4
                        style={{
                          margin: "0 0 8px 0",
                          fontSize: "18px",
                          fontWeight: "600",
                          color: "#333",
                          lineHeight: "1.4",
                        }}
                      >
                        {item.title}
                      </h4>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          marginBottom: "12px",
                        }}
                      >
                        <span
                          style={{
                            background:
                              "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            color: "white",
                            padding: "4px 12px",
                            borderRadius: "12px",
                            fontSize: "12px",
                            fontWeight: "500",
                          }}
                        >
                          {item.category}
                        </span>
                      </div>
                      {item.description && (
                        <p
                          style={{
                            margin: "0",
                            fontSize: "14px",
                            color: "#666",
                            lineHeight: "1.5",
                          }}
                        >
                          {item.description}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleIconClick(item)}
                      style={{
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        border: "none",
                        borderRadius: "50%",
                        width: "40px",
                        height: "40px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.3s ease",
                        flexShrink: "0",
                        fontSize: "16px",
                      }}
                    >
                      {userRole === "CREATOR" ? (
                        <PlusOutlined style={{ color: "white" }} />
                      ) : (
                        <PlayCircleOutlined style={{ color: "white" }} />
                      )}
                    </button>
                  </div>
                </div>
              ))}
              {scrollableContent.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px",
                    color: "#666",
                  }}
                >
                  <div style={{ fontSize: "48px", marginBottom: "16px" }}>
                    🔍
                  </div>
                  <h3 style={{ margin: "0 0 8px" }}>No content found</h3>
                  <p style={{ margin: 0 }}>
                    Try adjusting your search or category filter
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Conditional Popups */}
      {showPopup && userRole === "CREATOR" && (
        <CreatorPopup onClose={() => setShowPopup(false)} />
      )}

      {showQuizList && userRole === "USER" && (
        <QuizList
          contentItem={selectedItem}
          onClose={() => setShowQuizList(false)}
          onPlayQuiz={handlePlayQuiz}
        />
      )}

      {showQuestionCreator && selectedItem && (
        <QuestionCreator
          contentId={selectedItem.id}
          onCancel={handleQuestionCreatorCancel}
          onSuccess={handleQuestionCreatorSuccess}
        />
      )}
      {showQuizCreator && selectedItem && (
        <QuizCreator
          contentId={selectedItem.id}
          onCancel={handleQuizCreatorCancel}
          onSuccess={handleQuizCreatorSuccess}
        />
      )}

      <style>
        {`
          .container {
            scrollbar-width: none;
            -ms-overflow-style: none; /* IE 10+ */
          }
          .container::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
    </div>
  );
};

export default BrowseContent;
