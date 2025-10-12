import { Select } from "antd";
import { Button, Card, Input, TextArea, Toast } from "antd-mobile";
import { CheckCircleOutline } from "antd-mobile-icons";
import { useEffect, useState, useRef, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createAnnouncement } from "../../../services/announcement";
import { getTempleSubcategories } from "../../../services/temple";
import ably from "../../../utils/ablyClient";
import { AuthContext } from "../../../contexts/AuthContext";
import { ArrowLeftOutlined } from "@ant-design/icons";

export const CreateAnnouncements = () => {
  const navigate = useNavigate();
  const { id: templeId } = useParams();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [subcategories, setSubcategories] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    announcement_type: "",
    temple: templeId,
    subcategory: null,
  });
  const publishedAnnouncements = useRef(new Set());

  const fetchSubcategories = async (templeId) => {
    try {
      const filters = { temple: { id: templeId } };
      const subcateresponse = await getTempleSubcategories(templeId);
      console.log("subcategories response", subcateresponse);
      const subcats =
        subcateresponse.data?.attributes?.subcategories?.data.map((subcat) => ({
          label: `${subcat.attributes.icon || "🏷️"} ${
            subcat.attributes.name_hi
          }(${subcat.attributes.name})`,
          value: subcat.id,
        })) || [];
      console.log("Subcategories:", subcats);
      setSubcategories(subcats);
    } catch (error) {
      Toast.show({
        content: "Failed to load categories",
        icon: "fail",
        duration: 2000,
      });
    }
  };

  useEffect(() => {
    fetchSubcategories(templeId);
  }, []);

  const playNotificationSound = () => {
    try {
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(
        0.1,
        audioContext.currentTime + 0.1
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.5
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log("Audio notification not supported:", error);
    }
  };

  const publishToAbly = (announcementData, announcementId) => {
    const channelName = `announcements:temple:${announcementData.temple}:subcategory:${announcementData.subcategory}`;
    const eventName = "new-announcement";
    const messageId = `announcement-${announcementId}`;

    if (publishedAnnouncements.current.has(messageId)) {
      console.log(
        "📢 Skipping duplicate publish for announcement:",
        announcementId
      );
      return;
    }
    publishedAnnouncements.current.add(messageId);

    console.log("📢 Publishing to Ably:", {
      channelName,
      announcementData,
      announcementId,
    });

    const channel = ably.channels.get(channelName);
    channel.publish(eventName, {
      ...announcementData,
      id: announcementId,
      subcategory: announcementData.subcategory,
      createdAt: new Date().toISOString(),
    });
  };

  const handleSubmit = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const announcementData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        announcement_type: formData.announcement_type,
        temple: parseInt(templeId),
        subcategory: formData.subcategory,
        user: user?.id,
      };

      console.log("📢 Creating announcement:", announcementData);
      const response = await createAnnouncement(announcementData);
      const announcementId = response.data?.id || response.id;
      console.log("📢 Announcement created, ID:", announcementId);
      publishToAbly(announcementData, announcementId);
      playNotificationSound();
      Toast.show({
        content: "Announcement created successfully",
        icon: <CheckCircleOutline fontSize={20} color="#10b981" />,
        duration: 2000,
      });

      setFormData({
        title: "",
        description: "",
        announcement_type: "",
        temple: templeId,
        subcategory: null,
      });
    } catch (error) {
      console.error("📢 Error creating announcement:", error);
      Toast.show({
        content: error.message || "Failed to create announcement",
        icon: "fail",
        duration: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      style={{
        margin: "12px",
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      }}
    >
      <div style={{ padding: "12px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "12px",
          }}
        >
          <ArrowLeftOutlined
            onClick={() => navigate(-1)}
            style={{
              marginRight: "8px",
              fontSize: 18,
              color: "#10b981",
              cursor: "pointer",
            }}
          />
          <h2
            style={{
              margin: 0,
              fontSize: "14px",
              fontWeight: "600",
              color: "#059669",
            }}
          >
            Back
          </h2>
        </div>

        <div>
          <div
            style={{
              fontSize: "12px",
              fontWeight: "600",
              color: "#374151",
              marginBottom: "6px",
            }}
          >
            Category *
          </div>
          <Select
            style={{ width: "100%", fontSize: "12px" }}
            value={formData.subcategory}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, subcategory: value }))
            }
            placeholder="Select category"
            options={subcategories}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div>
            <div
              style={{
                fontSize: "12px",
                fontWeight: "600",
                color: "#374151",
                marginBottom: "6px",
              }}
            >
              Title *
            </div>
            <Input
              value={formData.title}
              onChange={(val) =>
                setFormData((prev) => ({ ...prev, title: val }))
              }
              placeholder="Enter title"
              style={{ borderRadius: "6px", fontSize: "12px" }}
              maxLength={100}
            />
          </div>

          <div>
            <div
              style={{
                fontSize: "12px",
                fontWeight: "600",
                color: "#374151",
                marginBottom: "6px",
              }}
            >
              Description *
            </div>
            <TextArea
              value={formData.description}
              onChange={(val) =>
                setFormData((prev) => ({ ...prev, description: val }))
              }
              placeholder="Enter description"
              rows={3}
              style={{ borderRadius: "6px", fontSize: "12px" }}
              maxLength={500}
              showCount
            />
          </div>

          <Button
            onClick={handleSubmit}
            color="primary"
            size="large"
            loading={loading}
            disabled={loading}
            style={{
              width: "100%",
              borderRadius: "6px",
              background: "#10b981",
              fontSize: "12px",
              fontWeight: "600",
            }}
          >
            {loading ? "Creating..." : "Create"}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default CreateAnnouncements;
