import React, { useState, useEffect, useContext } from "react";
import {
  Card,
  SearchBar,
  List,
  Avatar,
  Tag,
  Empty,
  PullToRefresh,
  Button,
  Toast,
  Dialog,
} from "antd-mobile";
import {
  TeamOutline,
  UserOutline,
  RightOutline,
  SearchOutline,
  StarOutline,
  EnvironmentOutline,
  AddOutline,
  CheckOutline,
} from "antd-mobile-icons";
import { AuthContext } from "../../contexts/AuthContext";
import { getOrgsList, getOrgUser } from "../../services/org";
import { getUserCounts } from "../../services/userInfoApi";
import { useNavigate } from "react-router-dom";

const TempleGroupsList = ({ onGroupSelect }) => {
  const { user } = useContext(AuthContext);
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [joiningGroups, setJoiningGroups] = useState(new Set());
  const [countsData, setCountsData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const countsRes = await getUserCounts();
        const countsJson = await countsRes.json();
        setCountsData(countsJson);

        const response = await getOrgsList();
        console.log("API Response:", response);
        const transformedGroups = transformOrgData(response, countsJson);
        console.log("Transformed Groups:", transformedGroups);
        setGroups(transformedGroups);
        setFilteredGroups(transformedGroups);
      } catch (error) {
        console.error("Error fetching data:", error);
        Toast.show({
          icon: "fail",
          content: "Failed to load temple data.",
          position: "center",
        });
        setGroups([]);
        setFilteredGroups([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    handleSearch(searchValue);
  }, [groups, searchValue]);

  const formatAddress = (addressData) => {
    if (!addressData?.data?.attributes) {
      return "Location not specified";
    }

    const addr = addressData.data.attributes;
    const parts = [];

    if (addr.tehsil) parts.push(addr.tehsil);
    if (addr.district) parts.push(addr.district);
    if (addr.state) parts.push(addr.state);
    if (addr.pincode) parts.push(addr.pincode);

    return parts.length > 0 ? parts.join(", ") : "Location not specified";
  };

  const getTempleCount = (orgId, counts = null) => {
    const dataSource = counts || countsData;
    if (!dataSource?.templeUserCounts) return { userCount: 0, adminCount: 1 };

    const templeData = dataSource.templeUserCounts.find(
      (temple) => temple.orgId.toString() === orgId.toString()
    );

    return {
      userCount: templeData ? parseInt(templeData.userCount) || 0 : 0,
      adminCount: templeData ? parseInt(templeData.adminCount) || 1 : 1,
    };
  };

  const transformOrgData = (apiResponse, counts = null) => {
    if (!apiResponse || !apiResponse.data || !Array.isArray(apiResponse.data)) {
      console.log("No data found in API response");
      return [];
    }

    return apiResponse.data.map((orgItem) => {
      const org = orgItem.attributes;

      const { userCount, adminCount } = getTempleCount(orgItem.id, counts);
      const totalMembers = userCount;
      const approvedMembers = userCount;
      const adminMembers = adminCount;

      const isUserMember = Math.random() > 0.7;

      const imageUrl =
        org.orgimages?.data && org.orgimages.data.length > 0
          ? org.orgimages.data[0].attributes?.url
          : `https://images.unsplash.com/photo-${
              1570619616900 + orgItem.id * 1000
            }?w=400&h=300&fit=crop&auto=format`;

      const location = formatAddress(org.address);

      return {
        id: orgItem.id,
        name: org.name || "Temple Community",
        image: imageUrl,
        memberCount: totalMembers,
        approvedMemberCount: approvedMembers,
        adminCount: adminMembers,
        location: location,
        description:
          org.description || "A spiritual community bringing people together",
        isJoined: isUserMember,
        category: "Temple",
        createdAt: org.createdAt,
        updatedAt: org.updatedAt,
        publishedAt: org.publishedAt,
        academic: org.academic,
        rawData: org,
      };
    });
  };

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const response = await getOrgsList();
      console.log("API Response:", response);
      const transformedGroups = transformOrgData(response, countsData);
      console.log("Transformed Groups:", transformedGroups);
      setGroups(transformedGroups);
      setFilteredGroups(transformedGroups);
    } catch (error) {
      console.error("Error fetching groups:", error);
      setGroups([]);
      setFilteredGroups([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchValue(value);
    if (!value.trim()) {
      setFilteredGroups(groups);
    } else {
      const filtered = groups.filter(
        (group) =>
          group.name.toLowerCase().includes(value.toLowerCase()) ||
          group.location.toLowerCase().includes(value.toLowerCase()) ||
          group.description.toLowerCase().includes(value.toLowerCase()) ||
          group.category.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredGroups(filtered);
    }
  };

  const handleGroupClick = (group) => {
    if (onGroupSelect) {
      onGroupSelect(group);
    }
    navigate(`/temple-group/${group.id}`, {
      state: { groupInfo: group },
    });
    console.log("Navigate to group:", group.name, "ID:", group.id);
  };

  const handleJoinGroup = async (group, event) => {
    event.stopPropagation();

    if (group.isJoined) return;

    setJoiningGroups((prev) => new Set([...prev, group.id]));

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setGroups((prevGroups) =>
        prevGroups.map((g) =>
          g.id === group.id
            ? { ...g, isJoined: true, memberCount: g.memberCount + 1 }
            : g
        )
      );

      Toast.show({
        icon: "success",
        content: `Successfully joined ${group.name}!`,
        position: "center",
      });
    } catch (error) {
      console.error("Error joining group:", error);
      Toast.show({
        icon: "fail",
        content: "Failed to join group. Please try again.",
        position: "center",
      });
    } finally {
      setJoiningGroups((prev) => {
        const next = new Set(prev);
        next.delete(group.id);
        return next;
      });
    }
  };

  const renderGroupCard = (group) => (
    <Card
      key={group.id}
      onClick={() => handleGroupClick(group)}
      style={{
        margin: "12px 16px",
        borderRadius: "20px",
        border: "none",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
        cursor: "pointer",
        overflow: "hidden",
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        transition: "all 0.3s ease",
      }}
    >
      <div style={{ padding: "20px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
          <div style={{ position: "relative" }}>
            <Avatar
              src={group.image}
              style={{
                width: "70px",
                height: "70px",
                borderRadius: "16px",
                flexShrink: 0,
                border: "3px solid rgba(252, 182, 159, 0.3)",
              }}
            />
            {group.isJoined && (
              <div
                style={{
                  position: "absolute",
                  bottom: "-2px",
                  right: "-2px",
                  background: "#52c41a",
                  borderRadius: "50%",
                  width: "20px",
                  height: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px solid white",
                }}
              >
                <CheckOutline style={{ fontSize: "10px", color: "white" }} />
              </div>
            )}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3
                  style={{
                    margin: "0 0 4px 0",
                    fontSize: "18px",
                    fontWeight: "700",
                    color: "#1a1a1a",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    lineHeight: "1.3",
                  }}
                >
                  {group.name}
                </h3>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    marginBottom: "8px",
                    color: "#666",
                    fontSize: "13px",
                  }}
                >
                  <EnvironmentOutline
                    style={{ fontSize: "14px", color: "#fcb69f" }}
                  />
                  <span
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      fontWeight: "500",
                    }}
                  >
                    {group.location}
                  </span>
                </div>
              </div>

              <Button
                size="small"
                color={group.isJoined ? "success" : "primary"}
                fill={group.isJoined ? "outline" : "solid"}
                loading={joiningGroups.has(group.id)}
                disabled={group.isJoined}
                onClick={(e) => handleJoinGroup(group, e)}
                style={{
                  marginLeft: "12px",
                  borderRadius: "12px",
                  minWidth: "80px",
                  height: "32px",
                  fontSize: "12px",
                  fontWeight: "600",
                  background: group.isJoined
                    ? "transparent"
                    : group.memberCount === 0
                    ? "linear-gradient(135deg, #52c41a 0%, #73d13d 100%)"
                    : "linear-gradient(135deg, #fcb69f 0%, #ffecd2 100%)",
                  border: group.isJoined ? "1.5px solid #52c41a" : "none",
                  color: group.isJoined ? "#52c41a" : "#fff",
                  boxShadow: group.isJoined
                    ? "none"
                    : "0 2px 8px rgba(0, 0, 0, 0.15)",
                }}
              >
                {group.isJoined ? (
                  <>
                    <CheckOutline
                      style={{ fontSize: "12px", marginRight: "4px" }}
                    />
                    Joined
                  </>
                ) : group.memberCount === 0 ? (
                  <>
                    <AddOutline
                      style={{ fontSize: "12px", marginRight: "4px" }}
                    />
                    Be First
                  </>
                ) : (
                  <>
                    <AddOutline
                      style={{ fontSize: "12px", marginRight: "4px" }}
                    />
                    Join
                  </>
                )}
              </Button>
            </div>

            <p
              style={{
                margin: "0 0 12px 0",
                fontSize: "14px",
                color: "#666",
                lineHeight: "1.4",
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {group.description}
            </p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
                fontSize: "13px",
                color: "#666",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "rgba(252, 182, 159, 0.1)",
                  padding: "4px 8px",
                  borderRadius: "8px",
                }}
              >
                <TeamOutline style={{ fontSize: "14px", color: "#fcb69f" }} />
                <span style={{ fontWeight: "600" }}>
                  {group.memberCount > 0
                    ? group.memberCount.toLocaleString()
                    : "No"}
                </span>
                <span>member{group.memberCount !== 1 ? "s" : ""}</span>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "rgba(252, 182, 159, 0.1)",
                  padding: "4px 8px",
                  borderRadius: "8px",
                }}
              >
                <UserOutline style={{ fontSize: "14px", color: "#fcb69f" }} />
                <span style={{ fontWeight: "600" }}>{group.adminCount}</span>
                <span>admin{group.adminCount !== 1 ? "s" : ""}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
        paddingTop: "8px",
      }}
    >
      <div
        style={{
          padding: "20px 16px",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(252, 182, 159, 0.2)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        }}
      >
        <h1
          style={{
            margin: "0 0 20px 0",
            fontSize: "28px",
            fontWeight: "800",
            color: "#1a1a1a",
            textAlign: "center",
            background: "linear-gradient(135deg, #fcb69f 0%, #ff8a65 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          🕉️ Temple Communities
        </h1>

        <SearchBar
          placeholder="Search temples by name, location, or description..."
          value={searchValue}
          onChange={handleSearch}
          style={{
            background: "rgba(255, 255, 255, 0.9)",
            borderRadius: "24px",
            border: "2px solid rgba(252, 182, 159, 0.3)",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
          }}
        />
      </div>

      <PullToRefresh
        onRefresh={async () => {
          setLoading(true);
          try {
            const [countsRes, orgsRes] = await Promise.all([
              getUserCounts(),
              getOrgsList(),
            ]);
            const countsJson = await countsRes.json();
            setCountsData(countsJson);
            const transformedGroups = transformOrgData(orgsRes, countsJson);
            setGroups(transformedGroups);
            setFilteredGroups(transformedGroups);
          } catch (error) {
            console.error("Error refreshing data:", error);
            Toast.show({
              icon: "fail",
              content: "Failed to refresh temple data.",
              position: "center",
            });
            setGroups([]);
            setFilteredGroups([]);
          } finally {
            setLoading(false);
          }
        }}
      >
        <div style={{ paddingBottom: "32px" }}>
          {loading ? (
            <div style={{ padding: "60px", textAlign: "center" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  border: "4px solid rgba(252, 182, 159, 0.3)",
                  borderTop: "4px solid #fcb69f",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                  margin: "0 auto",
                }}
              />
              <p
                style={{
                  marginTop: "20px",
                  color: "#666",
                  fontSize: "16px",
                  fontWeight: "500",
                }}
              >
                Loading temple communities...
              </p>
            </div>
          ) : filteredGroups.length === 0 ? (
            <div style={{ padding: "60px 20px" }}>
              <Empty
                description={
                  searchValue
                    ? "No temples found matching your search"
                    : groups.length === 0
                    ? "No temple communities found"
                    : "No temples match your search"
                }
                style={{ color: "#666" }}
              />
              {groups.length === 0 && !searchValue && (
                <p
                  style={{
                    textAlign: "center",
                    color: "#888",
                    marginTop: "20px",
                    fontSize: "15px",
                  }}
                >
                  Temple communities will appear here when available
                </p>
              )}
            </div>
          ) : (
            <>
              <div
                style={{
                  padding: "16px 20px 8px",
                  fontSize: "15px",
                  color: "#666",
                  textAlign: "center",
                  fontWeight: "600",
                }}
              >
                {filteredGroups.length} temple community
                {filteredGroups.length !== 1 ? "ies" : "y"} found
              </div>

              {filteredGroups.map(renderGroupCard)}
            </>
          )}
        </div>
      </PullToRefresh>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default TempleGroupsList;
