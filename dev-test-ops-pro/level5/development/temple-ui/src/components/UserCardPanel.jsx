import { Avatar, Card } from "antd-mobile";
import { EnvironmentOutline, RightOutline } from "antd-mobile-icons";
import { useEffect, useState } from "react";
import { fetchUserById } from "../services/user";

export const UserCardPanel = ({ userId, onClick }) => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUserById = async () => {
      try {
        setLoading(true);
        const res = await fetchUserById(userId);
        console.log(res, "USERRES");

        const transformedUser = {
          id: res.id,
          name: `${res.first_name || ""} ${res.last_name || ""}`.trim(),
          role: res.occupation?.toLowerCase() || "user",
          profilePicture:
            res.profile_picture ||
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
          address: res.addresses?.[0]?.full_address || "Address not provided",
          semester: res.user_org?.semester,
          course: res.user_org?.degree,
          branch: res.user_org?.branch,
          profession:
            res.user_professions?.[0]?.role ||
            res.user_professions?.[0]?.category,
          position: res.user_professions?.[0]?.role,
          department:
            res.user_org?.branch || res.user_professions?.[0]?.category,
          institute: res.org?.name || "Institute",
          graduationYear: res.user_org?.end_date
            ? new Date(res.user_org.end_date).getFullYear()
            : null,
        };

        setUser(transformedUser);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };
    getUserById();
  }, [userId]);

  const getRoleColor = (role) => {
    switch (role) {
      case "student":
        return { bg: "#dbeafe", text: "#1e40af" };
      case "alumni":
        return { bg: "#dcfce7", text: "#166534" };
      case "faculty":
        return { bg: "#fef3c7", text: "#92400e" };
      default:
        return { bg: "#f3f4f6", text: "#374151" };
    }
  };

  const roleColors = getRoleColor(user.role);

  if (loading) {
    return (
      <Card
        style={{
          margin: "8px 16px",
          borderRadius: "16px",
          background: "white",
          border: "1px solid rgba(59, 130, 246, 0.1)",
          boxShadow: "0 4px 20px rgba(59, 130, 246, 0.08)",
        }}
      >
        <div style={{ padding: "16px", textAlign: "center" }}>Loading...</div>
      </Card>
    );
  }

  if (!user.id) {
    return null;
  }

  return (
    <Card
      onClick={() => onClick(user)}
      style={{
        margin: "8px 16px",
        borderRadius: "16px",
        background: "white",
        border: "1px solid rgba(59, 130, 246, 0.1)",
        boxShadow: "0 4px 20px rgba(59, 130, 246, 0.08)",
        cursor: "pointer",
      }}
    >
      <div style={{ padding: "16px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "12px",
          }}
        >
          <Avatar
            src={user.profilePicture}
            size={60}
            style={{ marginRight: "16px" }}
          />
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                color: "#1f2937",
                marginBottom: "4px",
              }}
            >
              {user.name || "Unknown User"}
            </div>
            {user.role && (
              <div
                style={{
                  display: "inline-block",
                  background: roleColors.bg,
                  color: roleColors.text,
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  marginBottom: "4px",
                }}
              >
                {user.role}
              </div>
            )}
          </div>
          <RightOutline fontSize={16} style={{ color: "#9ca3af" }} />
        </div>

        {user.address && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <EnvironmentOutline
              fontSize={16}
              style={{ color: "#6b7280", marginRight: "8px" }}
            />
            <span style={{ fontSize: "14px", color: "#6b7280" }}>
              {user.address}
            </span>
          </div>
        )}

        {user.role === "student" && (
          <div
            style={{
              display: "flex",
              gap: "16px",
              fontSize: "14px",
              color: "#6b7280",
              flexWrap: "wrap",
            }}
          >
            {user.semester && (
              <div>
                <strong>Semester:</strong> {user.semester}
              </div>
            )}
            {user.course && (
              <div>
                <strong>Course:</strong> {user.course}
              </div>
            )}
          </div>
        )}

        {user.role === "alumni" && (
          <div style={{ fontSize: "14px", color: "#6b7280" }}>
            {user.profession && (
              <div style={{ marginBottom: "4px" }}>
                <strong>Profession:</strong> {user.profession}
              </div>
            )}
            <div>
              {user.course && (
                <span>
                  <strong>Course:</strong> {user.course}
                </span>
              )}
              {user.course && user.branch && <span> - </span>}
              {user.branch && <span>{user.branch}</span>}
              {user.graduationYear && <span> ({user.graduationYear})</span>}
            </div>
          </div>
        )}

        {user.role === "faculty" && (
          <div style={{ fontSize: "14px", color: "#6b7280" }}>
            {user.position && (
              <div style={{ marginBottom: "4px" }}>
                <strong>Position:</strong> {user.position}
              </div>
            )}
            {user.department && (
              <div>
                <strong>Department:</strong> {user.department}
              </div>
            )}
          </div>
        )}

        {user.institute && (
          <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "8px" }}>
            {user.institute}
          </div>
        )}
      </div>
    </Card>
  );
};
