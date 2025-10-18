import { TrophyOutlined } from "@ant-design/icons";
import { Avatar, Card, Button } from "antd-mobile";
import { RightOutline } from "antd-mobile-icons";
import { useEffect, useState } from "react";
import { fetchPaginatedUsersList } from "../../../services/user";
import { useNavigate } from "react-router-dom";
import { getProfessionTypes } from "../../../services/profession";

export const TopProfessionSection = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [professionStats, setProfessionStats] = useState([]);
  const [allProfessions, setAllProfessions] = useState([]);
  const navigate = useNavigate();

  // Function to get profession stats with user counts
  const getProfessionStats = (professionList, allUsers) => {
    const stats = {};

    // Initialize profession counts
    professionList.forEach((profession) => {
      const professionType = profession.attributes.profession_type.type;

      if (!stats[professionType]) {
        stats[professionType] = {
          name: professionType,
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

    // Convert to array and sort by count
    return Object.values(stats)
      .filter((stat) => stat.count > 0)
      .sort((a, b) => b.count - a.count);
  };

  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);

        // Fetch profession types
        const professionRes = await getProfessionTypes();
        setAllProfessions(professionRes.data);

        // Fetch all users to calculate profession stats
        const usersRes = await fetchPaginatedUsersList(0, 1000);

        const mappedUsers = usersRes.data.map((user) => ({
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
        }));

        setUsers(mappedUsers);

        // Calculate profession statistics
        const stats = getProfessionStats(professionRes.data, usersRes.data);
        setProfessionStats(stats);
      } catch (error) {
        console.error("Error fetching data:", error);
        setUsers([]);
        setProfessionStats([]);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  const handleViewAllProfessions = () => {
    navigate("/professions-list");
  };

  const handleProfessionClick = (professionType) => {
    navigate(`/professions-list/${encodeURIComponent(professionType)}`);
  };

  if (loading) {
    return (
      <Card
        style={{
          margin: "16px",
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
    );
  }

  return (
    <Card
      style={{
        margin: "16px",
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
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                background: "#4F46E5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "10px",
              }}
            >
              <TrophyOutlined
                style={{
                  fontSize: "18px",
                  color: "white",
                }}
              />
            </div>
            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#1F2937",
                }}
              >
                Top Professions
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: "12px",
                  color: "#6B7280",
                }}
              >
                Most popular categories
              </p>
            </div>
          </div>
          <Button
            onClick={handleViewAllProfessions}
            style={{
              "--background-color": "transparent",
              "--border": "1px solid #4F46E5",
              "--border-radius": "6px",
              color: "#4F46E5",
              fontWeight: "500",
              padding: "4px 10px",
              fontSize: "12px",
            }}
          >
            View All
          </Button>
        </div>

        {/* Profession List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {professionStats.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                color: "#9CA3AF",
                padding: "20px",
                fontSize: "14px",
              }}
            >
              No data available
            </div>
          ) : (
            <>
              {professionStats.slice(0, 5).map((profession, index) => (
                <div
                  key={profession.name}
                  onClick={() => handleProfessionClick(profession.name)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px",
                    background: "rgba(255, 255, 255, 0.5)",
                    borderRadius: "6px",
                    border: "1px solid rgba(79, 70, 229, 0.08)",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
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
                      "rgba(79, 70, 229, 0.08)";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "4px",
                        background: index === 0 ? "#4F46E5" : "#F3F4F6",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: index === 0 ? "white" : "#6B7280",
                        fontSize: "12px",
                        fontWeight: "600",
                        marginRight: "10px",
                      }}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: "500",
                          color: "#1F2937",
                          marginBottom: "1px",
                        }}
                      >
                        {profession.name}
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: "#9CA3AF",
                        }}
                      >
                        {profession.count}{" "}
                        {profession.count === 1
                          ? "professional"
                          : "professionals"}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      background: "#F9FAFB",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#374151",
                      border: "1px solid #E5E7EB",
                    }}
                  >
                    {profession.count}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* View All Button */}
        {professionStats.length > 5 && (
          <div style={{ marginTop: "12px" }}>
            <Button
              onClick={handleViewAllProfessions}
              style={{
                "--background-color": "#4F46E5",
                "--border": "none",
                "--border-radius": "6px",
                color: "white",
                fontWeight: "500",
                padding: "10px 20px",
                fontSize: "13px",
                width: "100%",
              }}
            >
              View All {professionStats.length} Professions
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};
