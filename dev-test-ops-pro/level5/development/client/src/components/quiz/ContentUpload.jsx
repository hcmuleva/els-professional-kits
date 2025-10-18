import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { Button, Card, Input } from "antd-mobile";
import { Select, Upload } from "antd";
import { uploadFile } from "../../services/upload";

// Content Upload Component
export const ContentUpload = ({ onSave, onCancel }) => {
  const { user } = useContext(AuthContext);

  const [contentData, setContentData] = useState({
    title: "",
    type: "DOCUMENT",
    youtubeUrl: "",
    multimedia: null,
    imageUrl: "",
    level: 1,
    creator: user?.id,
    subtitle: "",
    coverUrl: "",
  });

  const [uploading, setUploading] = useState(false);

  const contentTypes = [
    { value: "YOUTUBE", label: "🎥 YouTube Video" },
    { value: "VIDEO", label: "📹 Video" },
    { value: "AUDIO", label: "🎵 Audio" },
    { value: "IMAGE", label: "🖼️ Image" },
    { value: "DOCUMENT", label: "📄 Document" },
    { value: "PDF", label: "📋 PDF" },
  ];

  const handleFileUpload = async (file, field) => {
    setUploading(true);
    try {
      console.log(file);

      const formData = new FormData();
      formData.append("files", file);

      console.log(formData);
      // uploadFile now expects the full FormData
      const response = await uploadFile(formData);

      const fileUrl = response[0];

      setContentData((prev) => ({
        ...prev,
        [field === "multimedia"
          ? "multimedia"
          : field === "image"
          ? "imageUrl"
          : "coverUrl"]: fileUrl,
      }));
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = () => {
    onSave(contentData);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 80,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
      }}
    >
      <Card
        style={{
          maxWidth: "500px",
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          margin: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2
            style={{
              margin: 0,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: "24px",
              fontWeight: "bold",
            }}
          >
            Add Content
          </h2>
          <Button type="ghost" onClick={onCancel}>
            ✕
          </Button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "500",
                color: "#333",
              }}
            >
              Title *
            </label>
            <Input
              value={contentData.title}
              onChange={(value) =>
                setContentData((prev) => ({ ...prev, title: value }))
              }
              placeholder="Enter content title"
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
              Content Type *
            </label>
            <Select
              value={contentData.type}
              onChange={(value) =>
                setContentData((prev) => ({ ...prev, type: value }))
              }
              options={contentTypes}
            />
          </div>

          {contentData.type === "YOUTUBE" && (
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                  color: "#333",
                }}
              >
                YouTube URL
              </label>
              <Input
                value={contentData.youtubeUrl}
                onChange={(value) =>
                  setContentData((prev) => ({ ...prev, youtubeUrl: value }))
                }
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>
          )}

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "500",
                color: "#333",
              }}
            >
              Multimedia File
            </label>
            <Upload
              accept={
                contentData.type === "IMAGE"
                  ? "image/*"
                  : contentData.type === "VIDEO"
                  ? "video/*"
                  : contentData.type === "AUDIO"
                  ? "audio/*"
                  : contentData.type === "PDF"
                  ? ".pdf"
                  : "*/*"
              }
              customRequest={({ file, onSuccess }) => {
                handleFileUpload(file, "multimedia").then(() =>
                  onSuccess("ok")
                );
              }}
              showUploadList={false}
              disabled={uploading}
            >
              <div
                style={{
                  border: "2px dashed #667eea",
                  borderRadius: "8px",
                  padding: "20px",
                  textAlign: "center",
                  background: "rgba(102, 126, 234, 0.05)",
                  cursor: uploading ? "not-allowed" : "pointer",
                }}
              >
                <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
                  {uploading
                    ? "Uploading..."
                    : "Click to upload or drag and drop"}
                </p>
                {contentData.multimedia && (
                  <p
                    style={{
                      margin: "8px 0 0 0",
                      color: "#667eea",
                      fontSize: "14px",
                    }}
                  >
                    ✓ File uploaded successfully
                  </p>
                )}
              </div>
            </Upload>
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
              Level
            </label>
            <Select
              value={contentData.level}
              onChange={(value) =>
                setContentData((prev) => ({ ...prev, level: parseInt(value) }))
              }
              options={[
                { value: 1, label: "Level 1 - Beginner" },
                { value: 2, label: "Level 2 - Intermediate" },
                { value: 3, label: "Level 3 - Advanced" },
                { value: 4, label: "Level 4 - Expert" },
              ]}
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
              Subtitle
            </label>
            <Input
              value={contentData.subtitle}
              onChange={(value) =>
                setContentData((prev) => ({ ...prev, subtitle: value }))
              }
              placeholder="Enter subtitle"
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
              Cover Image
            </label>
            <Upload
              accept="image/*"
              customRequest={({ file, onSuccess }) => {
                handleFileUpload(file, "cover").then(() => onSuccess("ok"));
              }}
              showUploadList={false}
              disabled={uploading}
            >
              <div
                style={{
                  border: "2px dashed #764ba2",
                  borderRadius: "8px",
                  padding: "20px",
                  textAlign: "center",
                  background: "rgba(118, 75, 162, 0.05)",
                  cursor: uploading ? "not-allowed" : "pointer",
                }}
              >
                <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
                  Upload cover image
                </p>
                {contentData.coverUrl && (
                  <p
                    style={{
                      margin: "8px 0 0 0",
                      color: "#764ba2",
                      fontSize: "14px",
                    }}
                  >
                    ✓ Cover image uploaded
                  </p>
                )}
              </div>
            </Upload>
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
            <Button
              type="primary"
              onClick={handleSave}
              disabled={!contentData.title || !contentData.type}
              style={{ flex: 1 }}
            >
              Save Content
            </Button>
            <Button type="ghost" onClick={onCancel} style={{ flex: 1 }}>
              Cancel
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
