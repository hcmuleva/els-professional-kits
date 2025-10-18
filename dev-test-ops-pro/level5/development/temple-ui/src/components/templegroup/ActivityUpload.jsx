import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import {
  Button,
  Card,
  Input,
  Selector,
  SpinLoading,
  TextArea,
  Toast,
  Form,
} from "antd-mobile";
import { Upload } from "antd";
import { uploadFile } from "../../services/upload";
import { addActivity } from "../../services/activity";
import { getAllSubCategories } from "../../services/subcategory";
import { useParams } from "react-router-dom";
import { getSingleTemple } from "../../services/community";

export const ActivityUpload = ({ onSave, onCancel }) => {
  const { templeId } = useParams();
  const { user } = useContext(AuthContext);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [subcategoryLoading, setSubcategoryLoading] = useState(false);
  const [templeName, setTempleName] = useState("");
  const [templeLoading, setTempleLoading] = useState(false);

  const warmColors = {
    primary: "#d2691e",
    secondary: "#daa520",
    accent: "#cd853f",
    background: "#fef7e7",
    cardBg: "#ffffff",
    textPrimary: "#5d4037",
    textSecondary: "#8d6e63",
    border: "#f4e4bc",
    success: "#52c41a",
    warning: "#faad14",
    error: "#ff4d4f",
  };

  const [activityData, setActivityData] = useState({
    title: "",
    subtitle: "",
    type: "YOUTUBE",
    category: "ANNOUNCEMENT",
    singlemedia: null,
    multimedia: null,
    youtubeurl: "",
    user: user?.id,
    temple: templeId ? parseInt(templeId, 10) : null,
    subcategory: null,
    likes: 0,
  });

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadMode, setUploadMode] = useState("single");
  const [filePreview, setFilePreview] = useState({
    single: null,
    multi: null,
  });

  const contentTypes = [
    { value: "YOUTUBE", label: "🎥 YouTube Video" },
    // { value: "VIDEO", label: "📹 Video" },
    // { value: "AUDIO", label: "🎵 Audio" },
    // { value: "IMAGE", label: "🖼️ Image" },
    // { value: "DOCUMENT", label: "📄 Document" },
    // { value: "PDF", label: "📋 PDF" },
  ];

  const activityCategories = [
    { value: "ANNOUNCEMENT", label: "📢 Announcement" },
    { value: "EVENT", label: "🎉 Event" },
    { value: "PRAYER", label: "🙏 Prayer" },
    { value: "DONATION", label: "💝 Donation" },
    { value: "JOIN", label: "👥 Member Join" },
    { value: "CELEBRATION", label: "🎊 Celebration" },
    { value: "SERVICE", label: "🤝 Community Service" },
    { value: "EDUCATION", label: "📚 Educational" },
  ];

  const uploadModes = [
    { label: "Single File", value: "single" },
    { label: "Multiple Files", value: "multi" },
  ];

  // Fetch temple details to get temple name
  useEffect(() => {
    const fetchTemple = async () => {
      if (!templeId) {
        setTempleName("");
        return;
      }
      try {
        setTempleLoading(true);
        const res = await getSingleTemple(parseInt(templeId));
        const templeTitle =
          res?.data?.attributes?.title || `Temple ${templeId}`;
        setTempleName(templeTitle);
      } catch (err) {
        console.error("Failed to load temple details:", err);
        Toast.show({
          content: "Failed to load temple details",
          position: "center",
        });
        setTempleName(`Temple ${templeId}`);
      } finally {
        setTempleLoading(false);
      }
    };

    fetchTemple();
  }, [templeId]);

  // Fetch subcategories using templeId
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (!templeId) {
        setSubcategories([]);
        setSelectedSubcategory(null);
        setActivityData((prev) => ({ ...prev, subcategory: null }));
        return;
      }
      try {
        setSubcategoryLoading(true);
        const filters = { templeId: templeId };
        const res = await getAllSubCategories(filters);
        const subcats = res.data.map((subcat) => ({
          id: subcat.id,
          name: subcat.attributes.name,
          name_hi: subcat.attributes.name_hi,
          icon: subcat.attributes.icon || "🏷️",
        }));
        setSubcategories(subcats);
        setSelectedSubcategory(null);
      } catch (err) {
        console.error("Failed to load subcategories:", err);
        Toast.show({
          content: "Failed to load subcategories",
          position: "center",
        });
        setSubcategories([]);
      } finally {
        setSubcategoryLoading(false);
      }
    };

    fetchSubcategories();
  }, [templeId]);

  // Handle subcategory selection
  const handleSubcategorySelect = async (value) => {
    try {
      const newSubcategoryId =
        value && value.length > 0 ? parseInt(value[0], 10) : null;
      setSelectedSubcategory(newSubcategoryId);
      setActivityData((prev) => ({
        ...prev,
        subcategory: newSubcategoryId,
      }));
    } catch (error) {
      console.error("Error selecting subcategory:", error);
      Toast.show({
        content: "Failed to load activities for selected subcategory",
        position: "center",
      });
    }
  };

  const generatePreview = (file) => {
    if (file.type.startsWith("image/")) {
      return URL.createObjectURL(file);
    } else if (file.type.startsWith("video/")) {
      return { type: "video", url: URL.createObjectURL(file), name: file.name };
    } else if (file.type.startsWith("audio/")) {
      return { type: "audio", name: file.name, size: file.size };
    } else {
      return { type: "document", name: file.name, size: file.size };
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFileUpload = async (file, field) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("files", file);

      const response = await uploadFile(formData);
      const fileUrl = response[0];

      const preview = generatePreview(file);
      setFilePreview((prev) => ({
        ...prev,
        [field === "singlemedia" ? "single" : "multi"]: { preview, file },
      }));

      setActivityData((prev) => ({
        ...prev,
        [field]: fileUrl,
      }));

      Toast.show({
        content: "File uploaded successfully!",
        position: "center",
      });
    } catch (err) {
      console.error("Upload failed", err);
      Toast.show({
        content: "Upload failed. Please try again.",
        position: "center",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!activityData.title.trim()) {
      Toast.show({
        content: "Title is required!",
        position: "center",
      });
      return;
    }
    if (!activityData.temple) {
      Toast.show({
        content: "Temple ID is missing!",
        position: "center",
      });
      return;
    }
    if (!activityData.subcategory) {
      Toast.show({
        content: "Please select a subcategory!",
        position: "center",
      });
      return;
    }
    if (activityData.type === "YOUTUBE" && !activityData.youtubeurl.trim()) {
      Toast.show({
        content: "YouTube URL is required!",
        position: "center",
      });
      return;
    }

    const payload = { ...activityData };
    if (payload.type === "YOUTUBE") {
      delete payload.singlemedia;
      delete payload.multimedia;
    }

    setSaving(true);
    try {
      const response = await addActivity(payload);
      if (response && response.data) {
        Toast.show({
          content: "Activity posted successfully!",
          position: "center",
        });
        onSave({
          ...response.data.attributes,
          user: {
            id: user?.id || "",
            first_name: user?.first_name || "",
            last_name: user?.last_name || "",
            avatar: user?.avatar || { url: "/default-avatar.png" },
            userrole: user?.userrole || "MEMBER",
            userstatus: user?.userstatus || "APPROVED",
          },
        });
        onCancel();
      } else {
        throw new Error("Empty or invalid response from server");
      }
    } catch (error) {
      console.error("Failed to save activity:", error);
      Toast.show({
        content: error.message || "Failed to post activity. Please try again.",
        position: "center",
      });
    } finally {
      setSaving(false);
    }
  };

  const getCategoryIcon = (category) => {
    const categoryMap = {
      ANNOUNCEMENT: "📢",
      EVENT: "🎉",
      PRAYER: "🙏",
      DONATION: "💝",
      JOIN: "👥",
      CELEBRATION: "🎊",
      SERVICE: "🤝",
      EDUCATION: "📚",
    };
    return categoryMap[category] || "📝";
  };

  const clearUpload = (type) => {
    if (type === "single") {
      setActivityData((prev) => ({ ...prev, singlemedia: null }));
      setFilePreview((prev) => ({ ...prev, single: null }));
    } else {
      setActivityData((prev) => ({ ...prev, multimedia: null }));
      setFilePreview((prev) => ({ ...prev, multi: null }));
    }
  };

  const renderFilePreview = (previewData, type) => {
    if (!previewData) return null;

    const { preview, file } = previewData;

    return (
      <div
        style={{
          marginTop: "8px",
          padding: "8px",
          border: `1px solid ${warmColors.border}`,
          borderRadius: "8px",
          background: warmColors.cardBg,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {typeof preview === "string" ? (
          <img
            src={preview}
            alt="Preview"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "4px",
              objectFit: "cover",
            }}
          />
        ) : preview.type === "video" ? (
          <div style={{ fontSize: "20px" }}>📹</div>
        ) : preview.type === "audio" ? (
          <div style={{ fontSize: "20px" }}>🎵</div>
        ) : (
          <div style={{ fontSize: "20px" }}>📄</div>
        )}
        <div style={{ flex: 1, marginLeft: "8px" }}>
          <p
            style={{
              margin: 0,
              fontSize: "12px",
              color: warmColors.textPrimary,
            }}
          >
            {preview.name || "Uploaded file"}
          </p>
          <p
            style={{
              margin: 0,
              fontSize: "10px",
              color: warmColors.textSecondary,
            }}
          >
            {formatFileSize(preview.size || file.size)}
          </p>
        </div>
        <Button
          size="mini"
          fill="none"
          onClick={() => clearUpload(type)}
          style={{ color: warmColors.error }}
        >
          Remove
        </Button>
      </div>
    );
  };

  useEffect(() => {
    if (uploadMode === "single") {
      clearUpload("multi");
    } else {
      clearUpload("single");
    }
  }, [uploadMode]);

  useEffect(() => {
    if (activityData.type === "YOUTUBE") {
      clearUpload("single");
      clearUpload("multi");
    }
  }, [activityData.type]);

  const subcategoryOptions = [
    { label: "Select a subcategory", value: "null", disabled: true },
    ...subcategories.map((subcat) => ({
      label: `${subcat.icon}${subcat.name_hi}(${subcat.name})`,
      value: subcat.id.toString(),
    })),
  ];

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
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "16px",
      }}
    >
      <Card
        style={{
          maxWidth: "400px",
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          borderRadius: "12px",
          border: `1px solid ${warmColors.border}`,
          boxShadow: "0 4px 16px rgba(210, 105, 30, 0.1)",
          background: warmColors.cardBg,
        }}
      >
        <div style={{ padding: "16px" }}>
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
                margin: 0,
                fontSize: "20px",
                fontWeight: "600",
                color: warmColors.textPrimary,
              }}
            >
              {getCategoryIcon(activityData.category)} Create Activity
            </h2>
            <Button
              fill="none"
              onClick={onCancel}
              style={{
                border: "none",
                background: "transparent",
                fontSize: "18px",
                color: warmColors.textSecondary,
              }}
            >
              ✕
            </Button>
          </div>

          <Form layout="vertical">
            <Form.Item label="Temple" required>
              <div
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  border: `1px solid ${warmColors.border}`,
                  background: warmColors.cardBg,
                  color: warmColors.textPrimary,
                  fontSize: "14px",
                }}
              >
                {templeLoading ? (
                  <SpinLoading color={warmColors.accent} />
                ) : (
                  templeName || "No Temple Selected"
                )}
              </div>
            </Form.Item>

            {templeId && (
              <Form.Item label="Subcategory" required>
                {subcategoryLoading ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "12px",
                      color: warmColors.textSecondary,
                    }}
                  >
                    <SpinLoading color={warmColors.accent} />
                  </div>
                ) : (
                  <Selector
                    options={subcategoryOptions}
                    value={
                      selectedSubcategory
                        ? [selectedSubcategory.toString()]
                        : ["null"]
                    }
                    onChange={handleSubcategorySelect}
                    showSearch
                    searchPlaceholder="Search subcategories"
                    style={{
                      "--border-radius": "8px",
                      "--border": `1px solid ${warmColors.border}`,
                      "--checked-border": `2px solid ${warmColors.accent}`,
                      "--adm-color-primary": warmColors.accent,
                    }}
                  />
                )}
              </Form.Item>
            )}

            <Form.Item label="Content Type" required>
              <Selector
                options={contentTypes}
                value={[activityData.type]}
                onChange={(value) =>
                  setActivityData((prev) => ({ ...prev, type: value[0] }))
                }
                style={{
                  "--border-radius": "8px",
                  "--border": `1px solid ${warmColors.border}`,
                  "--checked-border": `2px solid ${warmColors.primary}`,
                  "--adm-color-primary": warmColors.primary,
                }}
              />
            </Form.Item>

            <Form.Item label="Activity Category" required>
              <Selector
                options={activityCategories}
                value={[activityData.category]}
                onChange={(value) =>
                  setActivityData((prev) => ({ ...prev, category: value[0] }))
                }
                style={{
                  "--border-radius": "8px",
                  "--border": `1px solid ${warmColors.border}`,
                  "--checked-border": `2px solid ${warmColors.primary}`,
                  "--adm-color-primary": warmColors.primary,
                }}
              />
            </Form.Item>

            {activityData.type === "YOUTUBE" && (
              <Form.Item label="YouTube URL" required>
                <Input
                  value={activityData.youtubeurl || ""}
                  onChange={(value) =>
                    setActivityData((prev) => ({ ...prev, youtubeurl: value }))
                  }
                  placeholder="https://www.youtube.com/watch?v=..."
                  style={{
                    "--border-radius": "8px",
                    "--border": `1px solid ${warmColors.border}`,
                    "--font-size": "14px",
                    "--color": warmColors.textPrimary,
                  }}
                />
              </Form.Item>
            )}

            <Form.Item label="Title" required>
              <Input
                value={activityData.title}
                onChange={(value) =>
                  setActivityData((prev) => ({ ...prev, title: value }))
                }
                placeholder="Enter activity title"
                style={{
                  "--border-radius": "8px",
                  "--border": `1px solid ${warmColors.border}`,
                  "--font-size": "14px",
                  "--color": warmColors.textPrimary,
                }}
              />
            </Form.Item>

            <Form.Item label="Description">
              <TextArea
                value={activityData.subtitle}
                onChange={(value) =>
                  setActivityData((prev) => ({ ...prev, subtitle: value }))
                }
                placeholder="Describe your activity..."
                rows={4}
                style={{
                  "--border-radius": "8px",
                  "--border": `1px solid ${warmColors.border}`,
                  "--font-size": "14px",
                  "--color": warmColors.textPrimary,
                }}
              />
            </Form.Item>

            {activityData.type !== "YOUTUBE" && (
              <>
                <Form.Item label="Upload Mode">
                  <Selector
                    options={uploadModes}
                    value={[uploadMode]}
                    onChange={(value) => setUploadMode(value[0])}
                    style={{
                      "--border-radius": "8px",
                      "--border": `1px solid ${warmColors.border}`,
                      "--checked-border": `2px solid ${warmColors.accent}`,
                      "--adm-color-primary": warmColors.accent,
                    }}
                  />
                </Form.Item>

                {uploadMode === "single" && (
                  <Form.Item label="Single Media Upload">
                    <Upload
                      accept={
                        activityData.type === "IMAGE"
                          ? "image/*"
                          : activityData.type === "VIDEO"
                          ? "video/*"
                          : activityData.type === "AUDIO"
                          ? "audio/*"
                          : activityData.type === "PDF"
                          ? ".pdf"
                          : "*/*"
                      }
                      customRequest={({ file, onSuccess }) => {
                        handleFileUpload(file, "singlemedia").then(() =>
                          onSuccess("ok")
                        );
                      }}
                      showUploadList={false}
                      disabled={uploading}
                    >
                      <div
                        style={{
                          border: `2px dashed ${warmColors.accent}`,
                          borderRadius: "8px",
                          padding: "16px",
                          textAlign: "center",
                          background: `${warmColors.accent}10`,
                          cursor: uploading ? "not-allowed" : "pointer",
                        }}
                      >
                        <div style={{ fontSize: "24px", marginBottom: "8px" }}>
                          📤
                        </div>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "14px",
                            color: warmColors.textSecondary,
                          }}
                        >
                          {uploading
                            ? "Uploading..."
                            : "Upload single media file"}
                        </p>
                      </div>
                    </Upload>
                    {renderFilePreview(filePreview.single, "single")}
                  </Form.Item>
                )}

                {uploadMode === "multi" && (
                  <Form.Item label="Multi Media Upload">
                    <Upload
                      accept={
                        activityData.type === "IMAGE"
                          ? "image/*"
                          : activityData.type === "VIDEO"
                          ? "video/*"
                          : activityData.type === "AUDIO"
                          ? "audio/*"
                          : activityData.type === "PDF"
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
                          border: `2px dashed ${warmColors.accent}`,
                          borderRadius: "8px",
                          padding: "16px",
                          textAlign: "center",
                          background: `${warmColors.accent}10`,
                          cursor: uploading ? "not-allowed" : "pointer",
                        }}
                      >
                        <div style={{ fontSize: "24px", marginBottom: "8px" }}>
                          📤
                        </div>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "14px",
                            color: warmColors.textSecondary,
                          }}
                        >
                          {uploading
                            ? "Uploading..."
                            : "Upload multiple media files"}
                        </p>
                      </div>
                    </Upload>
                    {renderFilePreview(filePreview.multi, "multi")}
                  </Form.Item>
                )}
              </>
            )}

            <Form.Item>
              <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
                <Button
                  color="primary"
                  onClick={handleSave}
                  disabled={!activityData.title.trim() || saving || uploading}
                  loading={saving}
                  style={{
                    flex: 1,
                    borderRadius: "8px",
                    background: warmColors.primary,
                    color: "#fff",
                    fontWeight: "600",
                  }}
                >
                  {saving ? "Posting..." : "Post Activity"}
                </Button>
                <Button
                  fill="outline"
                  onClick={onCancel}
                  style={{
                    flex: 1,
                    borderRadius: "8px",
                    border: `1px solid ${warmColors.border}`,
                    color: warmColors.textPrimary,
                    fontWeight: "600",
                  }}
                >
                  Cancel
                </Button>
              </div>
            </Form.Item>

            <Form.Item>
              <div
                style={{
                  textAlign: "center",
                  fontSize: "12px",
                  color: warmColors.textSecondary,
                }}
              >
                Posting as: {user?.first_name} {user?.last_name}
              </div>
            </Form.Item>
          </Form>
        </div>
      </Card>
    </div>
  );
};
