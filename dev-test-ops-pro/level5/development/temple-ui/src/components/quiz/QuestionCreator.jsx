import React, { useState } from "react";
import { createQuestions } from "../../services/questions";
import { Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { uploadFile } from "../../services/upload";

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

const Input = ({ value, onChange, placeholder, style, ...props }) => (
  <input
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

const QuestionCreator = ({ contentId, onCancel, onSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [questionData, setQuestionData] = useState({
    title: "",
    description: "",
    quetype: "",
    content: contentId,
  });

  const [options, setOptions] = useState([
    { id: 1, text: "", isCorrect: false, multimediaId: null },
    { id: 2, text: "", isCorrect: false, multimediaId: null },
    { id: 3, text: "", isCorrect: false, multimediaId: null },
    { id: 4, text: "", isCorrect: false, multimediaId: null },
  ]);

  const [multimediaFiles, setMultimediaFiles] = useState([]);

  const questionTypes = [
    { value: "SC", label: "Single Choice" },
    { value: "MCQ", label: "Multiple Choice" },
    { value: "TF", label: "True/False" },
    { value: "MATCH", label: "Matching" },
    { value: "SUBJECTIVE", label: "Subjective" },
  ];

  const handleOptionChange = (optionId, field, value) => {
    setOptions((prev) =>
      prev.map((option) =>
        option.id === optionId ? { ...option, [field]: value } : option
      )
    );
  };

  const handleFileUpload = async (file, optionId) => {
    setUploading(true);
    try {
      // Mock file upload - replace with actual upload logic
      // const mockFileId = Date.now() + Math.random();
      // const mockFileUrl = URL.createObjectURL(file);

      const formData = new FormData();
      formData.append("files", file);

      // Add to multimedia files
      const response = await uploadFile(formData);

      const fileUrl = response[0];

      const newMultimedia = {
        ...fileUrl,
        id: fileUrl?.id,
        url: fileUrl?.url,
        name: fileUrl.name,
      };

      setMultimediaFiles((prev) => [...prev, newMultimedia]);

      // Update option with multimedia ID
      handleOptionChange(optionId, "multimediaId", fileUrl?.id);

      console.log("File uploaded successfully:", newMultimedia);
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  const handleSaveQuestion = async () => {
    if (!questionData.title || !questionData.quetype) {
      alert("Please fill in all required fields");
      return;
    }

    if (
      (questionData.quetype === "MCQ" || questionData.quetype === "SC") &&
      !options.some((opt) => opt.isCorrect)
    ) {
      alert("Please select at least one correct answer");
      return;
    }

    setSaving(true);
    try {
      const formattedOptions = options.map((option) => ({
        [option.id]: option.text,
        isCorrect: option.isCorrect,
        multimediaId: option.multimediaId,
      }));

      const payload = {
        ...questionData,
        json: {
          options: formattedOptions,
        },
        option_multimedia: multimediaFiles,
      };

      console.log("Creating question with payload:", payload);
      const response = await createQuestions(payload);

      console.log("Question created successfully:", response);

      if (onSuccess) {
        onSuccess(response);
      }

      setQuestionData({
        title: "",
        description: "",
        quetype: "",
        content: contentId,
      });

      setOptions([
        { id: 1, text: "", isCorrect: false, multimediaId: null },
        { id: 2, text: "", isCorrect: false, multimediaId: null },
        { id: 3, text: "", isCorrect: false, multimediaId: null },
        { id: 4, text: "", isCorrect: false, multimediaId: null },
      ]);

      alert("Question created successfully!");
    } catch (error) {
      console.error("Error creating question:", error);
      alert("Error creating question. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const getMultimediaPreview = (multimediaId) => {
    const multimedia = multimediaFiles.find((m) => m.id === multimediaId);
    if (!multimedia) return null;

    if (multimedia) {
      return (
        <img
          src={multimedia.url}
          alt={multimedia.name}
          style={{
            width: "60px",
            height: "60px",
            objectFit: "cover",
            borderRadius: "8px",
            marginLeft: "8px",
          }}
        />
      );
    }

    return (
      <div
        style={{
          padding: "8px 12px",
          background: "#f0f0f0",
          borderRadius: "8px",
          marginLeft: "8px",
          fontSize: "12px",
        }}
      >
        📎 {multimedia.name}
      </div>
    );
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
      onClick={onCancel}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: "16px",
          padding: "20px",
          width: "100%",
          maxWidth: "800px",
          maxHeight: "90vh",
          overflowY: "auto",
          paddingTop: "150px",
          paddingBottom: "50px",
        }}
        onClick={(e) => e.stopPropagation()}
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
              Create Question
            </h1>
            <Button type="ghost" onClick={onCancel}>
              ✕ Close
            </Button>
          </div>
          <p style={{ color: "#666", margin: "8px 0 0 0" }}>
            Create a new question for the selected content
          </p>
        </Card>

        {/* Question Information */}
        <Card>
          <h2 style={{ margin: "0 0 20px 0", color: "#333", fontSize: "20px" }}>
            Question Details
          </h2>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
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
                Question Title *
              </label>
              <Input
                value={questionData.title}
                onChange={(value) =>
                  setQuestionData((prev) => ({ ...prev, title: value }))
                }
                placeholder="Enter question title"
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
                Description
              </label>
              <TextArea
                value={questionData.description}
                onChange={(value) =>
                  setQuestionData((prev) => ({ ...prev, description: value }))
                }
                placeholder="Enter question description"
                rows={3}
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
                Question Type *
              </label>
              <Select
                value={questionData.quetype}
                onChange={(value) =>
                  setQuestionData((prev) => ({ ...prev, quetype: value }))
                }
                options={questionTypes}
                placeholder="Select question type"
              />
            </div>
          </div>
        </Card>

        {/* Options Section */}
        {(questionData.quetype === "MCQ" || questionData.quetype === "SC") && (
          <Card>
            <h2
              style={{ margin: "0 0 20px 0", color: "#333", fontSize: "20px" }}
            >
              Answer Options
            </h2>

            {options.map((option, index) => (
              <div
                key={option.id}
                style={{
                  marginBottom: "16px",
                  padding: "16px",
                  border: "1px solid #e1e8ff",
                  borderRadius: "8px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "8px",
                  }}
                >
                  <input
                    type={questionData.quetype === "SC" ? "radio" : "checkbox"}
                    name={
                      questionData.quetype === "SC"
                        ? "correctAnswer"
                        : undefined
                    }
                    checked={option.isCorrect}
                    onChange={(e) => {
                      if (questionData.quetype === "SC") {
                        // For single choice, uncheck others
                        setOptions((prev) =>
                          prev.map((opt) => ({
                            ...opt,
                            isCorrect:
                              opt.id === option.id ? e.target.checked : false,
                          }))
                        );
                      } else {
                        handleOptionChange(
                          option.id,
                          "isCorrect",
                          e.target.checked
                        );
                      }
                    }}
                    style={{ marginRight: "8px" }}
                  />
                  <label style={{ fontWeight: "500", color: "#333" }}>
                    Option {index + 1} {option.isCorrect && "✓ Correct"}
                  </label>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <Input
                      value={option.text}
                      onChange={(value) =>
                        handleOptionChange(option.id, "text", value)
                      }
                      placeholder={`Enter option ${index + 1} text`}
                      style={{ minWidth: "150px" }}
                    />
                  </div>

                  <Upload
                    accept="image/*,video/*,audio/*"
                    customRequest={({ file, onSuccess }) => {
                      handleFileUpload(file, option.id).then(() =>
                        onSuccess("ok")
                      );
                    }}
                    showUploadList={false}
                    disabled={uploading}
                  >
                    <Button
                      type="ghost"
                      disabled={uploading}
                      style={{ minWidth: "120px", marginBottom: "10px" }}
                    >
                      {uploading ? "Uploading..." : "📎 Add Media"}
                    </Button>
                  </Upload>
                </div>

                {option.multimediaId &&
                  getMultimediaPreview(option.multimediaId)}
              </div>
            ))}
          </Card>
        )}

        {/* Actions */}
        <Card>
          <div
            style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}
          >
            <Button type="ghost" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={handleSaveQuestion}
              disabled={!questionData.title || !questionData.quetype || saving}
              loading={saving}
            >
              {saving ? "Creating..." : "Create Question"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default QuestionCreator;
