import { Avatar, SpinLoading } from "antd-mobile";

export default function ChatMessage({
  message,
  sender,
  timestamp,
  isCurrentUser,
  isGroup = false,
  sending = false,
}) {
  const formatTime = (timestamp) => {
    if (!timestamp) return "";

    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return "";

    const now = new Date();
    const diffTime = now - date;
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) {
      return "now";
    } else if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffDays < 7) {
      return `${date.toLocaleDateString([], {
        weekday: "short",
      })} ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else {
      return `${date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
      })} ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }
  };

  const getInitials = (firstName, lastName, username) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    } else if (firstName) {
      return firstName[0].toUpperCase();
    } else if (lastName) {
      return lastName[0].toUpperCase();
    } else if (username) {
      return username[0].toUpperCase();
    }
    return "U";
  };

  const getProfileImageUrl = (profilePicture) => {
    if (!profilePicture) return null;

    if (typeof profilePicture === "string") {
      return profilePicture.startsWith("http")
        ? profilePicture
        : `${
            process.env.REACT_APP_API_URL || "http://localhost:1337"
          }${profilePicture}`;
    }

    if (profilePicture?.data) {
      const url =
        profilePicture.data.attributes?.url || profilePicture.data.url;
      return url
        ? url.startsWith("http")
          ? url
          : `${process.env.REACT_APP_API_URL || "http://localhost:1337"}${url}`
        : null;
    }

    if (profilePicture?.url) {
      return profilePicture.url.startsWith("http")
        ? profilePicture.url
        : `${process.env.REACT_APP_API_URL || "http://localhost:1337"}${
            profilePicture.url
          }`;
    }

    return null;
  };

  const getSenderDisplayName = () => {
    if (!sender) return "Unknown User";

    const firstName = sender.first_name || "";
    const lastName = sender.last_name || "";
    const username = sender.username || "";

    const fullName = `${firstName} ${lastName}`.trim();

    if (fullName) {
      return fullName;
    } else if (username) {
      return `@${username}`;
    } else {
      return "Unknown User";
    }
  };

  const senderDisplayName = getSenderDisplayName();
  const profileImageUrl = sender
    ? getProfileImageUrl(sender.profile_picture || sender.avatar)
    : null;

  const getUserColor = (userId) => {
    if (!userId) return "#10b981";

    const colors = [
      "#10b981",
      "#3b82f6",
      "#8b5cf6",
      "#f59e0b",
      "#ef4444",
      "#06b6d4",
      "#84cc16",
      "#f97316",
      "#ec4899",
      "#6366f1",
    ];

    const hash = userId
      .toString()
      .split("")
      .reduce((a, b) => {
        a = (a << 5) - a + b.charCodeAt(0);
        return a & a;
      }, 0);

    return colors[Math.abs(hash) % colors.length];
  };

  const userColor = getUserColor(sender?.id);

  return (
    <div
      style={{
        width: "100%", // Ensure full width to prevent horizontal alignment
        display: "block", // Use block to ensure vertical stacking in parent
        marginBottom: "8px", // Space between messages
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: isCurrentUser ? "row-reverse" : "row",
          alignItems: "flex-start",
          padding: "8px 16px",
          gap: "12px",
        }}
      >
        {!isCurrentUser && (
          <Avatar
            src={profileImageUrl}
            style={{
              "--size": "36px",
              background: profileImageUrl
                ? "transparent"
                : `linear-gradient(45deg, ${userColor}, ${userColor}dd)`,
              color: "white",
              fontWeight: "bold",
              fontSize: "14px",
              flexShrink: 0,
              border: profileImageUrl
                ? "2px solid rgba(59, 130, 246, 0.2)"
                : `2px solid ${userColor}33`,
              cursor: "pointer",
            }}
            onClick={() => {
              console.log("View profile for:", senderDisplayName);
            }}
          >
            {!profileImageUrl &&
              getInitials(
                sender?.first_name,
                sender?.last_name,
                sender?.username
              )}
          </Avatar>
        )}

        <div
          style={{
            maxWidth: "75%",
            display: "flex",
            flexDirection: "column",
            alignItems: isCurrentUser ? "flex-end" : "flex-start",
          }}
        >
          {!isCurrentUser && (isGroup || true) && (
            <div
              style={{
                fontSize: "12px",
                color: userColor,
                marginBottom: "4px",
                paddingLeft: "2px",
                fontWeight: "600",
                cursor: "pointer",
              }}
              onClick={() => {
                console.log("View profile for:", senderDisplayName);
              }}
            >
              {senderDisplayName}
            </div>
          )}

          <div
            style={{
              background: isCurrentUser
                ? "linear-gradient(45deg, #8b5cf6, #3b82f6)"
                : "rgba(255, 255, 255, 0.95)",
              color: isCurrentUser ? "white" : "#1f2937",
              padding: "12px 16px",
              borderRadius: isCurrentUser
                ? "20px 20px 6px 20px"
                : "20px 20px 20px 6px",
              boxShadow: isCurrentUser
                ? "0 4px 12px rgba(139, 92, 246, 0.3)"
                : "0 2px 8px rgba(0, 0, 0, 0.1)",
              backdropFilter: "blur(10px)",
              border: isCurrentUser
                ? "none"
                : "1px solid rgba(139, 92, 246, 0.15)",
              position: "relative",
              opacity: sending ? 0.7 : 1,
              transform: sending ? "scale(0.98)" : "scale(1)",
              transition: "all 0.2s ease",
              maxWidth: "100%",
              wordBreak: "break-word",
            }}
          >
            <div
              style={{
                wordWrap: "break-word",
                lineHeight: "1.5",
                fontSize: "14px",
                whiteSpace: "pre-wrap",
              }}
            >
              {message}
            </div>

            {sending && (
              <div
                style={{
                  position: "absolute",
                  right: "-24px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "rgba(255, 255, 255, 0.9)",
                  borderRadius: "50%",
                  padding: "4px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                <SpinLoading
                  style={{
                    "--size": "14px",
                    "--color": "#8b5cf6",
                  }}
                />
              </div>
            )}
          </div>

          <div
            style={{
              fontSize: "11px",
              color: "#9ca3af",
              marginTop: "4px",
              paddingLeft: isCurrentUser ? "0" : "4px",
              paddingRight: isCurrentUser ? "4px" : "0",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              justifyContent: isCurrentUser ? "flex-end" : "flex-start",
            }}
          >
            <span>{formatTime(timestamp)}</span>
            {sending && (
              <span style={{ color: "#8b5cf6", fontSize: "10px" }}>
                • Sending...
              </span>
            )}
            {isCurrentUser && !sending && (
              <span
                style={{
                  color: "#10b981",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
                title="Delivered"
              >
                ✓
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
