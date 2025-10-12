import {
  BookOutlined,
  HeatMapOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Card, Divider, NavBar, Space } from "antd-mobile";
import {
  CalendarOutline,
  EditSOutline,
  EnvironmentOutline,
  MailOutline,
} from "antd-mobile-icons";
import { Header } from "antd/es/layout/layout";
import { useEffect, useState } from "react";
import { fetchUserById } from "../../services/user";
import { useNavigate, useParams } from "react-router-dom";

const UserProfilePanel = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const [isEditing, setIsEditing] = useState(false);
  const [bannerImage, setBannerImage] = useState(
    "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=300&fit=crop"
  );

  useEffect(() => {
    const getUserById = async () => {
      try {
        setLoading(true);
        const res = await fetchUserById(id);
        // Map user data to component structure
        const transformedUser = {
          id: res.id,
          name: `${res.first_name || ""} ${res.last_name || ""}`.trim(),
          role: res.occupation?.toLowerCase() || "user",
          profilePicture:
            res.profile_picture ||
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
          email: res.email,
          phone: res.mobile,
          address: res.addresses?.[0]?.full_address || "Address not provided",
          about:
            res.bio ||
            `${res.occupation || "User"} at ${res.org?.name || "Institute"}`,
          institute: res.org?.name || "Institute",
          joinDate: res.createdAt,

          // Academic information for students
          semester: res.user_org?.semester,
          course: res.user_org?.degree,
          branch: res.user_org?.branch,

          // Alumni information
          profession:
            res.user_professions?.[0]?.role ||
            res.user_professions?.[0]?.category,
          graduationYear: res.user_org?.end_date
            ? new Date(res.user_org.end_date).getFullYear()
            : null,

          // Faculty information
          position: res.user_professions?.[0]?.role,
          department:
            res.user_org?.branch || res.user_professions?.[0]?.category,
          specialization: res.user_professions?.[0]?.subcategory,
        };
        setUser(transformedUser);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };
    getUserById();
  }, [id]);

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

  return (
    <div
      style={{
        background: "#f1f5f9",
        minHeight: "100vh",
        paddingBottom: "80px",
      }}
    >
      <Space />
      <NavBar onBack={() => navigate(-1)}>Profile</NavBar>

      <div
        style={{
          position: "relative",
          height: "200px",
          backgroundImage: `url(${bannerImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          margin: "16px",
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            display: "flex",
            gap: "8px",
          }}
        >
          <div
            style={{
              background: "rgba(255, 255, 255, 0.9)",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <HeatMapOutlined fontSize={20} style={{ color: "#3b82f6" }} />
          </div>
          <div
            style={{
              background: "rgba(255, 255, 255, 0.9)",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <EditSOutline fontSize={18} style={{ color: "#6b7280" }} />
          </div>
        </div>

        {/* Profile Picture Overlay */}
        <div
          style={{
            position: "absolute",
            bottom: "-30px",
            left: "20px",
          }}
        >
          <Avatar
            src={user.profilePicture}
            size={80}
            style={{
              border: "4px solid white",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            }}
          />
        </div>
      </div>

      {/* Profile Info Section */}
      <Card
        style={{
          margin: "16px",
          marginTop: "50px",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(59, 130, 246, 0.1)",
        }}
      >
        <div style={{ padding: "20px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "16px",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#1f2937",
                  margin: "0 0 8px 0",
                }}
              >
                {user.name || "Unknown User"}
              </h1>
              <div
                style={{
                  display: "inline-block",
                  background: roleColors.bg,
                  color: roleColors.text,
                  padding: "6px 16px",
                  borderRadius: "20px",
                  fontSize: "14px",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              >
                {user.role}
              </div>
            </div>
            <Button
              size="small"
              fill="outline"
              color="primary"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Save" : "Edit"}
            </Button>
          </div>

          {/* Contact Info */}
          <div style={{ marginBottom: "20px" }}>
            {user.email && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "12px",
                }}
              >
                <MailOutline
                  fontSize={18}
                  style={{ color: "#6b7280", marginRight: "12px" }}
                />
                <span style={{ fontSize: "16px", color: "#374151" }}>
                  {user.email}
                </span>
              </div>
            )}
            {user.phone && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "12px",
                }}
              >
                <PhoneOutlined
                  fontSize={18}
                  style={{ color: "#6b7280", marginRight: "12px" }}
                />
                <span style={{ fontSize: "16px", color: "#374151" }}>
                  {user.phone}
                </span>
              </div>
            )}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "12px",
              }}
            >
              <EnvironmentOutline
                fontSize={18}
                style={{ color: "#6b7280", marginRight: "12px" }}
              />
              <span style={{ fontSize: "16px", color: "#374151" }}>
                {user.address}
              </span>
              <HeatMapOutlined
                fontSize={16}
                style={{
                  color: "#3b82f6",
                  marginLeft: "8px",
                  cursor: "pointer",
                }}
              />
            </div>
          </div>

          <Divider />

          {/* Role-specific Information */}
          <div style={{ margin: "20px 0" }}>
            {user.role === "student" && (
              <div>
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "#1f2937",
                    marginBottom: "12px",
                  }}
                >
                  Academic Information
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                  }}
                >
                  {user.semester && (
                    <div>
                      <span
                        style={{
                          fontSize: "14px",
                          color: "#6b7280",
                          display: "block",
                        }}
                      >
                        Current Semester
                      </span>
                      <span
                        style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          color: "#1f2937",
                        }}
                      >
                        {user.semester}
                      </span>
                    </div>
                  )}
                  {user.course && (
                    <div>
                      <span
                        style={{
                          fontSize: "14px",
                          color: "#6b7280",
                          display: "block",
                        }}
                      >
                        Course
                      </span>
                      <span
                        style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          color: "#1f2937",
                        }}
                      >
                        {user.course}
                      </span>
                    </div>
                  )}
                  {user.branch && (
                    <div style={{ gridColumn: "span 2" }}>
                      <span
                        style={{
                          fontSize: "14px",
                          color: "#6b7280",
                          display: "block",
                        }}
                      >
                        Branch
                      </span>
                      <span
                        style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          color: "#1f2937",
                        }}
                      >
                        {user.branch}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {user.role === "alumni" && (
              <div>
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "#1f2937",
                    marginBottom: "12px",
                  }}
                >
                  Professional Information
                </h3>
                {user.profession && (
                  <div style={{ marginBottom: "12px" }}>
                    <span
                      style={{
                        fontSize: "14px",
                        color: "#6b7280",
                        display: "block",
                      }}
                    >
                      Current Position
                    </span>
                    <span
                      style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "#1f2937",
                      }}
                    >
                      {user.profession}
                    </span>
                  </div>
                )}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                  }}
                >
                  {user.course && (
                    <div>
                      <span
                        style={{
                          fontSize: "14px",
                          color: "#6b7280",
                          display: "block",
                        }}
                      >
                        Course Completed
                      </span>
                      <span
                        style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          color: "#1f2937",
                        }}
                      >
                        {user.course}
                      </span>
                    </div>
                  )}
                  {user.graduationYear && (
                    <div>
                      <span
                        style={{
                          fontSize: "14px",
                          color: "#6b7280",
                          display: "block",
                        }}
                      >
                        Graduation Year
                      </span>
                      <span
                        style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          color: "#1f2937",
                        }}
                      >
                        {user.graduationYear}
                      </span>
                    </div>
                  )}
                  {user.branch && (
                    <div style={{ gridColumn: "span 2" }}>
                      <span
                        style={{
                          fontSize: "14px",
                          color: "#6b7280",
                          display: "block",
                        }}
                      >
                        Specialization
                      </span>
                      <span
                        style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          color: "#1f2937",
                        }}
                      >
                        {user.branch}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {user.role === "faculty" && (
              <div>
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "#1f2937",
                    marginBottom: "12px",
                  }}
                >
                  Faculty Information
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                  }}
                >
                  {user.position && (
                    <div>
                      <span
                        style={{
                          fontSize: "14px",
                          color: "#6b7280",
                          display: "block",
                        }}
                      >
                        Position
                      </span>
                      <span
                        style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          color: "#1f2937",
                        }}
                      >
                        {user.position}
                      </span>
                    </div>
                  )}
                  {user.department && (
                    <div>
                      <span
                        style={{
                          fontSize: "14px",
                          color: "#6b7280",
                          display: "block",
                        }}
                      >
                        Department
                      </span>
                      <span
                        style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          color: "#1f2937",
                        }}
                      >
                        {user.department}
                      </span>
                    </div>
                  )}
                  {user.specialization && (
                    <div style={{ gridColumn: "span 2" }}>
                      <span
                        style={{
                          fontSize: "14px",
                          color: "#6b7280",
                          display: "block",
                        }}
                      >
                        Specialization
                      </span>
                      <span
                        style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          color: "#1f2937",
                        }}
                      >
                        {user.specialization}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <Divider />

          {/* About Section */}
          <div style={{ margin: "20px 0" }}>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                color: "#1f2937",
                marginBottom: "12px",
              }}
            >
              About Me
            </h3>
            <p style={{ fontSize: "16px", color: "#6b7280", lineHeight: 1.6 }}>
              {user.about}
            </p>
          </div>

          {/* Additional Info */}
          <div
            style={{
              background: "#f8fafc",
              padding: "16px",
              borderRadius: "12px",
              marginTop: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <CalendarOutline
                fontSize={16}
                style={{ color: "#6b7280", marginRight: "8px" }}
              />
              <span style={{ fontSize: "14px", color: "#6b7280" }}>
                Joined: {new Date(user.joinDate).toLocaleDateString()}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <BookOutlined
                fontSize={16}
                style={{ color: "#6b7280", marginRight: "8px" }}
              />
              <span style={{ fontSize: "14px", color: "#6b7280" }}>
                Institute: {user.institute}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UserProfilePanel;
