import React, { useEffect, useState } from "react";
import {
  Card,
  Avatar,
  SearchBar,
  Button,
  Badge,
  Selector,
  PullToRefresh,
  Collapse,
} from "antd-mobile";
import {
  SearchOutline,
  TeamOutline,
  StarOutline,
  UserOutline,
  MailOutline,
  MoreOutline,
  FilterOutline,
  DownOutline,
} from "antd-mobile-icons";
import {
  fetchOrgUsersList,
  fetchPaginatedUsersList,
} from "../../services/user";
import { PhoneOutlined } from "@ant-design/icons";

// Demo images
const demoMaleImage = "https://example.com/demo-male.jpg";
const demoFemaleImage = "https://example.com/demo-female.jpg";

const UsersTab = ({ groupInfo, orgId }) => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedFilters, setSelectedFilters] = useState(["all"]);
  const [refreshing, setRefreshing] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const filterOptions = [
    { label: "सभी सदस्य (All Members)", value: "all" },
    { label: "कृषि (Agriculture)", value: "AGRICULTURE" },
    { label: "व्यापार (Business)", value: "BUSINESS" },
    { label: "कंपनी (Company)", value: "COMPANY" },
    { label: "शिक्षा (Education)", value: "EDUCATION" },
    { label: "स्वास्थ्य सेवा (Healthcare)", value: "HEALTHCARE" },
    { label: "टेक्नोलॉजी (Technology)", value: "TECHNOLOGY" },
    { label: "विवाहित (Married)", value: "MARRIED" },
    { label: "अविवाहित (Single)", value: "SINGLE" },
    { label: "पुरुष (Male)", value: "Male" },
    { label: "महिला (Female)", value: "Female" },
    { label: "अप्रूव (Approved)", value: "APPROVED" },
    { label: "पेंडिंग (Pending)", value: "PENDING" }
  ];

  const getRoleColor = (role) => {
    if (!role) return "#b8bcc0";
    switch (role.toLowerCase()) {
      case "admin":
        return "#ff6b6b";
      case "volunteer":
        return "#4ecdc4";
      case "member":
      case "authenticated":
        return "#95e1d3";
      default:
        return "#b8bcc0";
    }
  };

  const getProfessionFromUser = (user) => {
    if (user.profession) return user.profession;
    if (user.user_professions && user.user_professions.length > 0) {
      const profession = user.user_professions[0];
      return (
        profession.profession_type || profession.category || "Not specified"
      );
    }
    return "Not specified";
  };

  const getAddressFromUser = (user) => {
    if (user.addresses && user.addresses.length > 0) {
      const currentAddress =
        user.addresses.find((addr) => addr.addresstype === "CURRENT") ||
        user.addresses.find((addr) => addr.addresstype === "PERMANENT") ||
        user.addresses[0];

      const parts = [
        currentAddress.housename,
        currentAddress.landmark,
        currentAddress.tehsil,
        currentAddress.village,
        currentAddress.district,
        currentAddress.state,
        currentAddress.country,
      ].filter(Boolean);
      return parts.join(", ") || "Address not specified";
    }
    return "Address not specified";
  };

  const getUserDisplayName = (user) => {
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    if (user.first_name) return user.first_name;
    if (user.last_name) return user.last_name;
    return user.username || "Unknown User";
  };

  const getAvatarSource = (user) => {
    if (user.gender === "Female") return null;
    if (user.profilePicture?.url) return user.profilePicture.url;
    return user.gender === "Male" ? demoMaleImage : demoFemaleImage;
  };

  const filteredUsers = allUsers.filter((user) => {
    const userName = getUserDisplayName(user).toLowerCase();
    const userEmail = (user.email || "").toLowerCase();
    const userAddress = getAddressFromUser(user).toLowerCase();
    const userProfession = getProfessionFromUser(user).toLowerCase();
    const userAge = user.age ? user.age.toString() : "";
    const searchLower = searchValue.toLowerCase();

    const matchesSearch =
      userName.includes(searchLower) ||
      userEmail.includes(searchLower) ||
      userAddress.includes(searchLower) ||
      userProfession.includes(searchLower) ||
      userAge.includes(searchLower);

    if (!matchesSearch) return false;

    if (selectedFilters.includes("all")) return true;

    if (
      selectedFilters.some(
        (filter) =>
          [
            "AGRICULTURE",
            "BUSINESS",
            "COMPANY",
            "EDUCATION",
            "HEALTHCARE",
            "TECHNOLOGY",
          ].includes(filter) &&
          getProfessionFromUser(user).toUpperCase() === filter
      )
    )
      return true;

    if (
      selectedFilters.includes("MARRIED") &&
      user.marital_status === "MARRIED"
    )
      return true;
    if (selectedFilters.includes("SINGLE") && user.marital_status === "SINGLE")
      return true;

    if (selectedFilters.includes("Male") && user.gender === "Male") return true;
    if (selectedFilters.includes("Female") && user.gender === "Female")
      return true;

    if (selectedFilters.includes("APPROVED") && user.userstatus === "APPROVED")
      return true;
    if (selectedFilters.includes("PENDING") && user.userstatus === "PENDING")
      return true;

    return false;
  });

  useEffect(() => {
    const getUserList = async () => {
      setLoading(true);
      try {
        const filters = {
          orgId: orgId,
        };
        const res = await fetchPaginatedUsersList(0, 50, filters);
        setAllUsers(res.data || res);
      } catch (error) {
        console.error("Error fetching users:", error);
        setAllUsers([]);
      } finally {
        setLoading(false);
      }
    };
    getUserList();
  }, [orgId]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const filters = {
        orgId: orgId,
      };
      const res = await fetchPaginatedUsersList(0, 50, filters);
      setAllUsers(res.data || res);
    } catch (error) {
      console.error("Error refreshing users:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const getUserStats = () => {
    const totalUsers = allUsers.length;
    const approvedUsers = allUsers.filter(
      (user) => user.userstatus === "APPROVED"
    ).length;
    const pendingUsers = allUsers.filter(
      (user) => user.userstatus === "PENDING"
    ).length;
    const maleUsers = allUsers.filter((user) => user.gender === "Male").length;

    return { totalUsers, approvedUsers, pendingUsers, maleUsers };
  };

  const stats = getUserStats();

  return (
    <PullToRefresh onRefresh={onRefresh} refreshing={refreshing}>
      <div
        style={{
          padding: "4px",
          paddingBottom: "20px",
          minHeight: "100vh",
          background: "#f5f5f5",
        }}
      >
        <Card
          style={{
            margin: "4px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            border: "none",
            color: "#fff",
          }}
        >
          <div style={{ padding: "16px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "12px",
                justifyContent: "center",
              }}
            >
              <TeamOutline style={{ fontSize: "20px", marginRight: "6px" }} />
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "bold" }}>
              कमिटी सदस्य
              </h3>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "8px",
              }}
            >
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  borderRadius: "8px",
                  padding: "12px",
                  textAlign: "center",
                  backdropFilter: "blur(10px)",
                }}
              >
                <div style={{ fontSize: "18px", fontWeight: "bold" }}>
                  {stats.totalUsers}
                </div>
                <div style={{ fontSize: "11px", opacity: 0.9 }}>
                कुल सदस्य 
                </div>
              </div>
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  borderRadius: "8px",
                  padding: "12px",
                  textAlign: "center",
                  backdropFilter: "blur(10px)",
                }}
              >
                <div style={{ fontSize: "18px", fontWeight: "bold" }}>
                  {stats.approvedUsers}
                </div>
                <div style={{ fontSize: "11px", opacity: 0.9 }}>Approved</div>
              </div>
            </div>
          </div>
        </Card>
        <Card
          style={{
            margin: "4px",
            borderRadius: "12px",
            background: "#fff",
            border: "none",
            boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
          }}
        >
          <div style={{ padding: "12px" }}>
            <SearchBar
              placeholder="Search by name, address, profession, age..."
              value={searchValue}
              onChange={setSearchValue}
              style={{
                "--border-radius": "8px",
                "--background": "#f8f9fa",
                "--border-color": "transparent",
                "--font-size": "14px",
              }}
            />
          </div>
        </Card>
        <Card
          style={{
            margin: "4px",
            borderRadius: "12px",
            background: "#fff",
            border: "none",
            boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
          }}
        >
          <div style={{ padding: "12px" }}>
            <div
              onClick={() => setShowFilters(!showFilters)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
                padding: "8px 0",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <FilterOutline
                  style={{
                    fontSize: "16px",
                    color: "#6c757d",
                    marginRight: "8px",
                  }}
                />
                <span
                  style={{
                    fontSize: "14px",
                    color: "#6c757d",
                    fontWeight: "600",
                  }}
                >
                  Filters ({selectedFilters.length})
                </span>
              </div>
              <DownOutline
                style={{
                  fontSize: "16px",
                  color: "#6c757d",
                  transform: showFilters ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.3s ease",
                }}
              />
            </div>
            {showFilters && (
              <div style={{ marginTop: "12px" }}>
                <Selector
                  options={filterOptions}
                  value={selectedFilters}
                  onChange={setSelectedFilters}
                  multiple
                  style={{
                    "--border": "1px solid #e9ecef",
                    "--border-radius": "6px",
                    "--padding": "6px 10px",
                    "--font-size": "13px",
                  }}
                />
              </div>
            )}
          </div>
        </Card>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {loading ? (
            <Card
              style={{
                margin: "4px",
                borderRadius: "12px",
                background: "#fff",
                border: "none",
                boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
              }}
            >
              <div
                style={{
                  padding: "30px",
                  textAlign: "center",
                  color: "#6c757d",
                }}
              >
                <div style={{ fontSize: "14px" }}>Loading members...</div>
              </div>
            </Card>
          ) : (
            filteredUsers.map((user) => (
              <Card
                key={user.id}
                style={{
                  margin: "4px",
                  borderRadius: "12px",
                  background: "#fff",
                  border: "none",
                  boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
                  overflow: "hidden",
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
                    <div style={{ position: "relative" }}>
                      <Avatar
                        src={getAvatarSource(user)}
                        style={{
                          "--size": "48px",
                          border: "2px solid #f8f9fa",
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        {getUserDisplayName(user).charAt(0).toUpperCase()}
                      </Avatar>
                    </div>
                    <div style={{ marginLeft: "12px", flex: 1 }}>
                      <div
                        style={{
                          fontSize: "14px",
                          color: "#212529",
                          fontWeight: "600",
                          marginBottom: "2px",
                        }}
                      >
                        {getUserDisplayName(user)}
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: "#7f8c8d",
                        }}
                      >
                        📍{" "}
                        {getAddressFromUser(user).length > 30
                          ? getAddressFromUser(user).substring(0, 30) + "..."
                          : getAddressFromUser(user)}
                      </div>
                    </div>
                    <Button
                      fill="none"
                      size="mini"
                      style={{
                        border: "none",
                        background: "transparent",
                        padding: "4px",
                      }}
                    >
                      <MoreOutline
                        style={{ fontSize: "16px", color: "#bdc3c7" }}
                      />
                    </Button>
                  </div>
                  <div
                    style={{
                      background: "#f8f9fa",
                      borderRadius: "8px",
                      padding: "12px",
                      marginBottom: "12px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          fontSize: "12px",
                          color: "#495057",
                        }}
                      >
                        <MailOutline
                          style={{
                            fontSize: "12px",
                            marginRight: "6px",
                            color: "#6c757d",
                          }}
                        />
                        <span style={{ wordBreak: "break-all" }}>
                          {user.email || "No email"}
                        </span>
                      </div>
                      {user.mobile && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            fontSize: "12px",
                            color: "#495057",
                          }}
                        >
                          <PhoneOutlined
                            style={{
                              fontSize: "12px",
                              marginRight: "6px",
                              color: "#6c757d",
                            }}
                          />
                          {user.mobile}
                        </div>
                      )}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          fontSize: "12px",
                          color: "#495057",
                        }}
                      >
                        <StarOutline
                          style={{
                            fontSize: "12px",
                            marginRight: "6px",
                            color: "#ffd700",
                          }}
                        />
                        <span style={{ fontSize: "11px" }}>
                          {getProfessionFromUser(user)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "6px",
                    }}
                  >
                    <Button
                      color="primary"
                      fill="outline"
                      size="small"
                      style={{
                        flex: 1,
                        borderRadius: "6px",
                        fontSize: "11px",
                        height: "32px",
                      }}
                    >
                      मेसेज
                    </Button>
                    <Button
                      color="primary"
                      fill="solid"
                      size="small"
                      style={{
                        flex: 1,
                        borderRadius: "6px",
                        fontSize: "11px",
                        height: "32px",
                      }}
                    >
                      प्रोफाइल(View Profile)
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
        {!loading && filteredUsers.length === 0 && (
          <Card
            style={{
              margin: "4px",
              borderRadius: "12px",
              background: "#fff",
              border: "none",
              boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
            }}
          >
            <div
              style={{
                padding: "30px",
                textAlign: "center",
                color: "#6c757d",
              }}
            >
              <UserOutline style={{ fontSize: "40px", marginBottom: "12px" }} />
              <h4 style={{ margin: "0 0 6px 0", fontSize: "14px" }}>
                No members found
              </h4>
              <p style={{ margin: 0, fontSize: "12px" }}>
                Try adjusting your search or filter criteria
              </p>
            </div>
          </Card>
        )}
      </div>
    </PullToRefresh>
  );
};

export default UsersTab;
