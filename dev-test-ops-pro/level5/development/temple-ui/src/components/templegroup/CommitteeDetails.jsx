import React, { useState, useEffect, useContext } from "react";
import { Toast, Loading } from "antd-mobile";
import { useParams } from "react-router-dom";
import { getSingleCommittee, getCommitteeData } from "../../services/committee";
import AdminCommitteeView from "./committee/AdminCommitteeView";
import UserCommitteeView from "./committee/UserCommitteeView";
import { AuthContext } from "../../contexts/AuthContext";

const CommitteeDetails = () => {

  console.log("CommitteeDetails CommitteeDetails")
  const [activeTab, setActiveTab] = useState("about");
  const [committee, setCommittee] = useState(null);
  const [committeeUsers, setCommitteeUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [committeeData, setCommitteeData] = useState(null);
  const params = useParams();
  const { user } = useContext(AuthContext);

  const isAdmin = user?.userrole === "ADMIN";

  // Fetch committee data
  useEffect(() => {
    const fetchCommitteeData = async () => {
      try {
        setLoading(true);
        const response = await getSingleCommittee(params.committeeId);

        if (!response.data || !response.data.attributes) {
          throw new Error("Invalid committee data structure");
        }

        const committeeData = response.data.attributes;
        setCommittee({
          id: response.data.id || null,
          committeeName: committeeData.committee_name || "Unnamed Committee",
          type: committeeData.type || "Unknown",
          subtype: committeeData.subtype || "Unknown",
          createdAt: committeeData.createdAt || null,
          creator: committeeData.creator || null,
        });

        const processedUsers =
          committeeData.users?.data?.map((user) => ({
            id: user.id || null,
            name:
              `${user.attributes?.first_name || "Unknown"} ${
                user.attributes?.last_name || ""
              }`.trim() || "Unknown",
            email: user.attributes?.email || "N/A",
            phone: user.attributes?.mobile || "N/A",
            role: user.attributes?.committee_role || "member",
            avatar: `https://ui-avatars.com/api/?name=${
              user.attributes?.first_name || "User"
            }+${user.attributes?.last_name || ""}&background=ff6b35&color=fff`,
            joinedDate: user.attributes?.createdAt || null,
            status:
              user.attributes?.userstatus === "APPROVED"
                ? "active"
                : "inactive",
            age: user.attributes?.age || null,
            gender: user.attributes?.gender || "N/A",
            addresses: user.attributes?.addresses?.data || [],
          })) || [];

        setCommitteeUsers(processedUsers);
      } catch (error) {
        console.error("Error fetching committee:", error);
        Toast.show({
          content: "Failed to load committee details",
          position: "top",
        });
      } finally {
        setLoading(false);
      }
    };

    if (params.committeeId) {
      fetchCommitteeData();
    }
  }, [params.committeeId]);

  // Fetch committee types data
  useEffect(() => {
    const fetchCommitteeTypesData = async () => {
      try {
        const response = await getCommitteeData();
        setCommitteeData(response.data[0]?.attributes?.types_data || {});
      } catch (error) {
        console.error("Error fetching committee data:", error);
        Toast.show({
          content: "Failed to load committee types",
          position: "top",
        });
      }
    };

    fetchCommitteeTypesData();
  }, []);

  // Get available roles
  const getAvailableRoles = () => {
    if (!committeeData || !committee) return [];

    const typeData = committeeData.committees?.find(
      (c) => c.type === committee.type
    );
    if (!typeData) return [];

    const subtypeData = typeData.subtypes?.find(
      (s) => s.name === committee.subtype
    );
    if (!subtypeData) return [];

    return Array.isArray(subtypeData.roles) ? subtypeData.roles : [];
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #ffecd2 0%, #ff6b35 100%)",
        }}
      >
        <Loading />
      </div>
    );
  }

  if (!committee) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
        }}
      >
        <div style={{ textAlign: "center", color: "#666" }}>
          <h3>Committee not found</h3>
          <p>The requested committee could not be loaded.</p>
        </div>
      </div>
    );
  }

  return isAdmin ? (
    <AdminCommitteeView
      committee={committee}
      committeeUsers={committeeUsers}
      setCommitteeUsers={setCommitteeUsers}
      getAvailableRoles={getAvailableRoles}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      currentUser={user}
      committeeData={committeeData}
      params={params}
    />
  ) : (
    <UserCommitteeView
      committee={committee}
      committeeUsers={committeeUsers}
      getAvailableRoles={getAvailableRoles}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    />
  );
};

export default CommitteeDetails;
