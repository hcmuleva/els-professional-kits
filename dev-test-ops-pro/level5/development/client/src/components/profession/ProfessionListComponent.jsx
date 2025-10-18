import {
  UserOutlined,
  SearchOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { Avatar, Card, Button, Input, Tag } from "antd-mobile";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchPaginatedUsersList } from "../../services/user";
import { getProfessionTypes } from "../../services/profession";

export const ProfessionListComponent = () => {
  const [allProfessions, setAllProfessions] = useState([]);
  const [professionStats, setProfessionStats] = useState([]);
  const [selectedProfessionUsers, setSelectedProfessionUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProfession, setSelectedProfession] = useState(null);

  const navigate = useNavigate();
  const { professionType } = useParams();

  // Function to get profession stats with user counts
  const getProfessionStats = (professionList, allUsers) => {
    const stats = {};

    // Initialize all professions with count 0
    professionList.forEach((profession) => {
      const professionTypeName = profession.attributes.profession_type.type;

      if (!stats[professionTypeName]) {
        stats[professionTypeName] = {
          name: professionTypeName,
          count: 0,
          users: [],
        };
      }
    });

    // Count users for each profession
    allUsers.forEach((user) => {
      const userProfession = user.profession || user?.user_professions?.role;
      if (userProfession && stats[userProfession]) {
        stats[userProfession].count++;
        stats[userProfession].users.push(user);
      }
    });

    // Convert to array and sort: professions with users first (by count), then empty ones alphabetically
    return Object.values(stats).sort((a, b) => {
      if (a.count > 0 && b.count === 0) return -1;
      if (a.count === 0 && b.count > 0) return 1;
      if (a.count > 0 && b.count > 0) return b.count - a.count;
      return a.name.localeCompare(b.name);
    });
  };

  // Fetch users by profession filter
  const fetchUsersByProfession = async (professionTypeName) => {
    try {
      setLoadingUsers(true);
      setSelectedProfession(professionTypeName);

      const filters = {
        profession: professionTypeName,
      };

      const res = await fetchPaginatedUsersList(0, 100, filters);

      const mappedUsers = res.data.map((user) => ({
        id: user.id,
        name:
          `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
          user.username,
        profession: user.profession || user?.user_professions?.role || "N/A",
        avatar:
          user.profilePicture?.url ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            user.first_name || user.username
          )}&background=4F46E5&color=fff`,
        status: user.status || "ACTIVE",
        email: user.email || "",
        phone: user.phone || "",
        joinDate: user.created_at || "",
      }));

      setSelectedProfessionUsers(mappedUsers);
    } catch (error) {
      console.error("Error fetching users by profession:", error);
      setSelectedProfessionUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);

        const professionRes = await getProfessionTypes();
        setAllProfessions(professionRes.data);

        const usersRes = await fetchPaginatedUsersList(0, 1000);
        const stats = getProfessionStats(professionRes.data, usersRes.data);
        setProfessionStats(stats);

        // If professionType is provided in URL, fetch those users
        if (professionType) {
          await fetchUsersByProfession(decodeURIComponent(professionType));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setProfessionStats([]);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [professionType]);

  const handleProfessionClick = (profession) => {
    fetchUsersByProfession(profession.name);
  };

  const handleBackToProfessions = () => {
    setSelectedProfessionUsers([]);
    setSelectedProfession(null);
    navigate("/professions-list");
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  const filteredProfessions = professionStats.filter((profession) =>
    profession.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "APPROVED":
      case "ACTIVE":
        return "#10B981";
      case "PENDING":
        return "#F59E0B";
      case "REJECTED":
      case "INACTIVE":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "16px" }}>
        <Card
          style={{
            borderRadius: "12px",
            background: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(79, 70, 229, 0.1)",
          }}
        >
          <div
            style={{
              padding: "20px",
              textAlign: "center",
              color: "#6B7280",
              fontSize: "14px",
            }}
          >
            Loading...
          </div>
        </Card>
      </div>
    );
  }

  // Show users for selected profession
  if (selectedProfessionUsers.length > 0 || loadingUsers) {
    return (
      <div>
        <Card
          style={{
            borderRadius: "12px",
            background: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(79, 70, 229, 0.1)",
          }}
        >
          <div>
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "16px",
                paddingBottom: "12px",
                borderBottom: "1px solid rgba(79, 70, 229, 0.1)",
              }}
            >
              <Button
                onClick={handleBackToProfessions}
                style={{
                  "--background-color": "transparent",
                  "--border": "1px solid #4F46E5",
                  "--border-radius": "6px",
                  color: "#4F46E5",
                  marginRight: "12px",
                  fontWeight: "500",
                  padding: "4px 8px",
                  fontSize: "12px",
                }}
              >
                <ArrowLeftOutlined style={{ marginRight: "4px" }} />
                Back
              </Button>
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#1F2937",
                  }}
                >
                  {selectedProfession}
                </h2>
                <p
                  style={{
                    margin: 0,
                    fontSize: "12px",
                    color: "#6B7280",
                  }}
                >
                  {selectedProfessionUsers.length} Professional
                  {selectedProfessionUsers.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {loadingUsers ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "20px",
                  color: "#6B7280",
                  fontSize: "14px",
                }}
              >
                Loading professionals...
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gap: "12px",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                }}
              >
                {selectedProfessionUsers.map((user) => (
                  <div
                    key={user.id}
                    style={{
                      padding: "12px",
                      background: "rgba(255, 255, 255, 0.5)",
                      borderRadius: "8px",
                      border: "1px solid rgba(79, 70, 229, 0.1)",
                      transition: "all 0.2s ease",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "rgba(79, 70, 229, 0.05)";
                      e.currentTarget.style.borderColor =
                        "rgba(79, 70, 229, 0.2)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        "rgba(255, 255, 255, 0.5)";
                      e.currentTarget.style.borderColor =
                        "rgba(79, 70, 229, 0.1)";
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        marginBottom: "10px",
                      }}
                    >
                      <Avatar
                        src={user.avatar}
                        size={40}
                        style={{
                          marginRight: "10px",
                          border: "2px solid rgba(79, 70, 229, 0.2)",
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <h4
                          style={{
                            margin: "0 0 2px 0",
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#1F2937",
                          }}
                        >
                          {user.name}
                        </h4>
                        <p
                          style={{
                            margin: "0 0 4px 0",
                            fontSize: "12px",
                            color: "#6B7280",
                          }}
                        >
                          {user.profession}
                        </p>

                        <Tag
                          color={getStatusColor(user.status)}
                          style={{
                            borderRadius: "4px",
                            fontSize: "10px",
                            fontWeight: "500",
                            padding: "2px 6px",
                          }}
                        >
                          {user.status}
                        </Tag>
                      </div>
                    </div>

                    {(user.email || user.phone) && (
                      <div
                        style={{
                          fontSize: "11px",
                          color: "#6B7280",
                          backgroundColor: "rgba(79, 70, 229, 0.05)",
                          padding: "8px",
                          borderRadius: "6px",
                          marginTop: "8px",
                        }}
                      >
                        {user.email && <div>📧 {user.email}</div>}
                        {user.phone && (
                          <div style={{ marginTop: "2px" }}>
                            📱 {user.phone}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  }

  // Show all professions list (compact list view)
  return (
    <div>
      <Card
        style={{
          borderRadius: "12px",
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(79, 70, 229, 0.1)",
        }}
      >
        <div style={{ padding: "16px" }}>
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "16px",
              paddingBottom: "12px",
              borderBottom: "1px solid rgba(79, 70, 229, 0.1)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <Button
                onClick={handleBackToHome}
                style={{
                  "--background-color": "transparent",
                  "--border": "1px solid #4F46E5",
                  "--border-radius": "6px",
                  color: "#4F46E5",
                  marginRight: "12px",
                  fontWeight: "500",
                  padding: "4px 8px",
                  fontSize: "12px",
                }}
              >
                <ArrowLeftOutlined style={{ marginRight: "4px" }} />
                Home
              </Button>
              <div>
                <h1
                  style={{
                    margin: 0,
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#1F2937",
                  }}
                >
                  Professional Directory
                </h1>
                <p
                  style={{
                    margin: 0,
                    fontSize: "12px",
                    color: "#6B7280",
                  }}
                >
                  {professionStats.length} Categories
                </p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div style={{ marginBottom: "16px" }}>
            <Input
              placeholder="Search professions..."
              value={searchTerm}
              onChange={setSearchTerm}
              style={{
                "--background-color": "rgba(255, 255, 255, 0.8)",
                "--border": "1px solid rgba(79, 70, 229, 0.2)",
                "--border-radius": "8px",
                "--font-size": "14px",
                "--color": "#1F2937",
                padding: "8px 12px",
              }}
            />
          </div>

          {/* Professions List - Compact cards */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {filteredProfessions.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "20px",
                  color: "#9CA3AF",
                  fontSize: "14px",
                }}
              >
                {searchTerm
                  ? "No professions found matching your search"
                  : "No profession data available"}
              </div>
            ) : (
              filteredProfessions.map((profession, index) => (
                <div
                  key={profession.name}
                  onClick={() => handleProfessionClick(profession)}
                  style={{
                    padding: "12px 16px",
                    background: "rgba(255, 255, 255, 0.5)",
                    borderRadius: "8px",
                    border: "1px solid rgba(79, 70, 229, 0.1)",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      "rgba(79, 70, 229, 0.05)";
                    e.currentTarget.style.borderColor =
                      "rgba(79, 70, 229, 0.2)";
                    e.currentTarget.style.transform = "translateX(4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      "rgba(255, 255, 255, 0.5)";
                    e.currentTarget.style.borderColor =
                      "rgba(79, 70, 229, 0.1)";
                    e.currentTarget.style.transform = "translateX(0px)";
                  }}
                >
                  {/* Left side - Icon and profession info */}
                  <div
                    style={{ display: "flex", alignItems: "center", flex: 1 }}
                  >
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "6px",
                        background:
                          profession.count > 0 ? "#4F46E5" : "#E5E7EB",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: "12px",
                      }}
                    >
                      <UserOutlined
                        style={{
                          fontSize: "14px",
                          color: profession.count > 0 ? "white" : "#9CA3AF",
                        }}
                      />
                    </div>
                    <div>
                      <h3
                        style={{
                          margin: "0 0 2px 0",
                          fontSize: "14px",
                          fontWeight: "600",
                          color: profession.count > 0 ? "#1F2937" : "#6B7280",
                        }}
                      >
                        {profession.name}
                      </h3>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "11px",
                          color: "#9CA3AF",
                        }}
                      >
                        {profession.count > 0
                          ? `${profession.count} registered professional${
                              profession.count !== 1 ? "s" : ""
                            }`
                          : "No professionals yet"}
                      </p>
                    </div>
                  </div>

                  {/* Right side - User count badge */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        fontWeight: "500",
                        color: profession.count > 0 ? "#4F46E5" : "#9CA3AF",
                        background:
                          profession.count > 0
                            ? "rgba(79, 70, 229, 0.1)"
                            : "rgba(156, 163, 175, 0.1)",
                        padding: "4px 8px",
                        borderRadius: "6px",
                        border:
                          profession.count > 0
                            ? "1px solid rgba(79, 70, 229, 0.2)"
                            : "1px solid rgba(156, 163, 175, 0.2)",
                        minWidth: "60px",
                        textAlign: "center",
                      }}
                    >
                      {profession.count > 0
                        ? `${profession.count} users`
                        : "0 users"}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#9CA3AF",
                        marginLeft: "4px",
                      }}
                    >
                      →
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
