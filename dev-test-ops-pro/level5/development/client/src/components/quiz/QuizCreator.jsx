import { useContext, useEffect, useState } from "react";
import { getQuestions } from "../../services/questions";
import { createExam } from "../../services/exam";

// Mock AuthContext for demo
const AuthContext = { user: { id: 1, name: "Demo User" } };

const Button = ({
  children,
  onClick,
  style,
  type = "default",
  disabled,
  loading,
  ...props
}) => (
  <button
    onClick={onClick}
    disabled={disabled || loading}
    style={{
      padding: "12px 24px",
      border: "none",
      borderRadius: "8px",
      fontSize: "16px",
      fontWeight: "500",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.6 : 1,
      background:
        type === "primary"
          ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          : type === "ghost"
          ? "transparent"
          : type === "danger"
          ? "#ff4757"
          : "#f5f5f5",
      color:
        type === "primary"
          ? "white"
          : type === "ghost"
          ? "#667eea"
          : type === "danger"
          ? "white"
          : "#333",
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
  type = "text",
  ...props
}) => (
  <input
    type={type}
    value={value}
    onChange={(e) => onChange?.(e.target.value)}
    placeholder={placeholder}
    style={{
      width: "100%",
      padding: "12px 16px",
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
);

const TextArea = ({
  value,
  onChange,
  placeholder,
  rows = 4,
  style,
  ...props
}) => (
  <textarea
    value={value}
    onChange={(e) => onChange?.(e.target.value)}
    placeholder={placeholder}
    rows={rows}
    style={{
      width: "100%",
      padding: "12px 16px",
      border: "2px solid #e1e8ff",
      borderRadius: "8px",
      fontSize: "16px",
      outline: "none",
      resize: "vertical",
      fontFamily: "inherit",
      transition: "border-color 0.3s ease",
      ...style,
    }}
    onFocus={(e) => (e.target.style.borderColor = "#667eea")}
    onBlur={(e) => (e.target.style.borderColor = "#e1e8ff")}
    {...props}
  />
);

const Select = ({ value, onChange, options, placeholder, style, ...props }) => (
  <select
    value={value}
    onChange={(e) => onChange?.(e.target.value)}
    style={{
      width: "100%",
      padding: "12px 16px",
      border: "2px solid #e1e8ff",
      borderRadius: "8px",
      fontSize: "16px",
      outline: "none",
      background: "white",
      cursor: "pointer",
      transition: "border-color 0.3s ease",
      ...style,
    }}
    onFocus={(e) => (e.target.style.borderColor = "#667eea")}
    onBlur={(e) => (e.target.style.borderColor = "#e1e8ff")}
    {...props}
  >
    {placeholder && (
      <option value="" disabled>
        {placeholder}
      </option>
    )}
    {options?.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

const Card = ({ children, style, ...props }) => (
  <div
    style={{
      background: "rgba(255, 255, 255, 0.95)",
      borderRadius: "16px",
      padding: "24px",
      marginBottom: "20px",
      boxShadow: "0 8px 32px rgba(102, 126, 234, 0.1)",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      ...style,
    }}
    {...props}
  >
    {children}
  </div>
);

// Transform API response to component format
const transformApiQuestionsToComponentFormat = (apiResponse) => {
  if (!apiResponse?.data?.attributes?.questions?.data) {
    return [];
  }

  return apiResponse.data.attributes.questions.data.map((questionData) => {
    const attrs = questionData.attributes;
    return {
      id: questionData.id,
      title: attrs.title,
      description: attrs.description,
      quetype: attrs.quetype,
      json: attrs.json,
      explanation_description: attrs.explaination_description,
      created_at: attrs.createdAt,
      updated_at: attrs.updatedAt,
      published_at: attrs.publishedAt,
    };
  });
};

const fetchQuestions = async (contentId) => {
  const res = await getQuestions(contentId);
  const transformedQuestions = transformApiQuestionsToComponentFormat(res);
  return { questions: transformedQuestions };
};

const QuizCreator = ({ contentId = 4, courseId = 1, onCancel, onSuccess }) => {
  const user = { id: 1, name: "Demo User" }; // Mock user
  const [loading, setLoading] = useState(false);
  const [availableQuestions, setAvailableQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  const [examData, setExamData] = useState({
    name: "",
    description: "",
    course: courseId || null,
    content: contentId || null,
    time_limit: 60,
    attempts: 1,
    difficulty_option: "EASY",
    difficulty: "",
    questions: [],
  });

  const difficultyOptions = [
    { value: "EASY", label: "Easy" },
    { value: "MEDIUM", label: "Medium" },
    { value: "HARD", label: "Hard" },
  ];

  useEffect(() => {
    if (contentId) {
      loadAvailableQuestions();
    }
  }, [contentId]);

  const loadAvailableQuestions = async () => {
    try {
      setLoading(true);
      const res = await fetchQuestions(contentId);
      setAvailableQuestions(res?.questions || []);
    } catch (error) {
      console.error("Error loading questions:", error);
      alert("Error loading questions for this content");
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionToggle = (questionId) => {
    setSelectedQuestions((prev) => {
      const isSelected = prev.includes(questionId);
      if (isSelected) {
        return prev.filter((id) => id !== questionId);
      } else {
        return [...prev, questionId];
      }
    });
  };

  const handleSelectAllQuestions = () => {
    if (selectedQuestions.length === availableQuestions.length) {
      setSelectedQuestions([]);
    } else {
      setSelectedQuestions(availableQuestions.map((q) => q.id));
    }
  };

  const handleSaveExam = async () => {
    if (!examData.name.trim()) {
      alert("Please enter exam name");
      return;
    }

    if (selectedQuestions.length === 0) {
      alert("Please select at least one question for the exam");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...examData,
        questions: selectedQuestions,
        course: courseId,
        content: contentId,
      };

      console.log("Creating exam with payload:", payload);

      const response = await createExam(payload);
      console.log("Exam created successfully:", response);

      if (onSuccess) {
        onSuccess(response);
      }

      alert("Exam created successfully!");
    } catch (error) {
      console.error("Error creating exam:", error);
      alert("Error creating exam. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getQuestionTypeLabel = (type) => {
    const types = {
      SC: "Single Choice",
      MCQ: "Multiple Choice",
      TF: "True/False",
      MATCH: "Matching",
      SUBJECTIVE: "Subjective",
    };
    return types[type] || type;
  };

  const getQuestionPreview = (question) => {
    if (!question.json?.options) return "No options available";

    const options = question.json.options;
    const correctOptions = options.filter((opt) => opt.isCorrect);

    return `${options.length} options | ${correctOptions.length} correct answer(s)`;
  };

  return (
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
    >
      <div
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: "16px",
          padding: "20px",
          width: "100%",
          maxWidth: "900px",
          maxHeight: "90vh",
          overflowY: "auto",
          paddingTop: "150px",
          paddingBottom: "50px",
        }}
      >
        {/* Header */}
        <Card>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h1
              style={{
                margin: 0,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: "28px",
                fontWeight: "bold",
              }}
            >
              Create Exam/Quiz
            </h1>
            <Button type="ghost" onClick={onCancel}>
              ✕ Close
            </Button>
          </div>
          <p style={{ color: "#666", margin: "8px 0 0 0" }}>
            Create an exam by selecting questions from the available content
          </p>
        </Card>

        {/* Exam Information */}
        <Card>
          <h2 style={{ margin: "0 0 20px 0", color: "#333", fontSize: "20px" }}>
            Exam Details
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                  color: "#333",
                }}
              >
                Exam Name *
              </label>
              <Input
                value={examData.name}
                onChange={(value) =>
                  setExamData((prev) => ({ ...prev, name: value }))
                }
                placeholder="Enter exam name"
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                  color: "#333",
                }}
              >
                Time Limit (minutes)
              </label>
              <Input
                type="number"
                value={examData.time_limit}
                onChange={(value) =>
                  setExamData((prev) => ({
                    ...prev,
                    time_limit: parseInt(value) || 60,
                  }))
                }
                placeholder="60"
                min="1"
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                  color: "#333",
                }}
              >
                Max Attempts
              </label>
              <Input
                type="number"
                value={examData.attempts}
                onChange={(value) =>
                  setExamData((prev) => ({
                    ...prev,
                    attempts: value === "" ? "" : value,
                  }))
                }
                // once focus leaves, enforce a minimum of 1
                onBlur={() =>
                  setExamData((prev) => ({
                    ...prev,
                    attempts:
                      parseInt(prev.attempts) >= 1
                        ? parseInt(prev.attempts)
                        : 1,
                  }))
                }
                placeholder="1"
                min="1"
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                  color: "#333",
                }}
              >
                Difficulty Level
              </label>
              <Select
                value={examData.difficulty_option}
                onChange={(value) =>
                  setExamData((prev) => ({ ...prev, difficulty_option: value }))
                }
                options={difficultyOptions}
                placeholder="Select difficulty"
              />
            </div>
          </div>

          <div style={{ marginTop: "16px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "500",
                color: "#333",
              }}
            >
              Description
            </label>
            <TextArea
              value={examData.description}
              onChange={(value) =>
                setExamData((prev) => ({ ...prev, description: value }))
              }
              placeholder="Enter exam description"
              rows={3}
            />
          </div>

          <div style={{ marginTop: "16px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "500",
                color: "#333",
              }}
            >
              Additional Difficulty Notes
            </label>
            <Input
              value={examData.difficulty}
              onChange={(value) =>
                setExamData((prev) => ({ ...prev, difficulty: value }))
              }
              placeholder="Enter any additional difficulty notes"
            />
          </div>
        </Card>

        {/* Questions Selection */}
        <Card>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h2 style={{ margin: 0, color: "#333", fontSize: "20px" }}>
              Select Questions ({selectedQuestions.length}/
              {availableQuestions.length})
            </h2>
            <div style={{ display: "flex", gap: "12px" }}>
              <Button
                type="ghost"
                onClick={loadAvailableQuestions}
                disabled={loading}
              >
                🔄 Refresh
              </Button>
              <Button
                type="ghost"
                onClick={handleSelectAllQuestions}
                disabled={availableQuestions.length === 0}
              >
                {selectedQuestions.length === availableQuestions.length
                  ? "Deselect All"
                  : "Select All"}
              </Button>
            </div>
          </div>

          {loading ? (
            <div
              style={{ textAlign: "center", padding: "40px", color: "#666" }}
            >
              Loading questions...
            </div>
          ) : availableQuestions.length === 0 ? (
            <div
              style={{ textAlign: "center", padding: "40px", color: "#666" }}
            >
              <p>No questions available for this content.</p>
              <p>
                Please create some questions first using the "Create Question"
                option.
              </p>
            </div>
          ) : (
            <div style={{ maxHeight: "300px", overflowY: "auto" }}>
              {availableQuestions.map((question, index) => (
                <div
                  key={question.id}
                  style={{
                    padding: "16px",
                    border: "1px solid #e1e8ff",
                    borderRadius: "8px",
                    marginBottom: "12px",
                    background: selectedQuestions.includes(question.id)
                      ? "rgba(102, 126, 234, 0.1)"
                      : "white",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onClick={() => handleQuestionToggle(question.id)}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "12px",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedQuestions.includes(question.id)}
                      onChange={() => handleQuestionToggle(question.id)}
                      style={{ marginTop: "4px" }}
                    />
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: "8px",
                        }}
                      >
                        <h4
                          style={{ margin: 0, color: "#333", fontSize: "16px" }}
                        >
                          Q{index + 1}: {question.title}
                        </h4>
                        <span
                          style={{
                            background: "#667eea",
                            color: "white",
                            padding: "2px 8px",
                            borderRadius: "12px",
                            fontSize: "12px",
                            fontWeight: "500",
                          }}
                        >
                          {getQuestionTypeLabel(question.quetype)}
                        </span>
                      </div>
                      {question.description && (
                        <p
                          style={{
                            margin: "0 0 8px 0",
                            color: "#666",
                            fontSize: "14px",
                          }}
                        >
                          {question.description}
                        </p>
                      )}
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#999",
                          marginBottom: "4px",
                        }}
                      >
                        {getQuestionPreview(question)}
                      </div>
                      <div style={{ fontSize: "12px", color: "#999" }}>
                        Created:{" "}
                        {new Date(question.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Actions */}
        <Card>
          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "flex-end",
            }}
          >
            <Button type="ghost" onClick={() => alert("Cancelled")}>
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={handleSaveExam}
              disabled={
                !examData.name.trim() ||
                selectedQuestions.length === 0 ||
                loading
              }
              loading={loading}
            >
              {loading
                ? "Creating Exam..."
                : `Create Exam (${selectedQuestions.length} questions)`}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default QuizCreator;
