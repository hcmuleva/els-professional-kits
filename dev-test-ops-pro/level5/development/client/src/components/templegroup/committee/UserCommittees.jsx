import React, { useState, useEffect, useContext } from "react";
import { Button, Toast, Card } from "antd-mobile";
import { TeamOutline } from "antd-mobile-icons";
import { AuthContext } from "../../../contexts/AuthContext";
import { getCommittee } from "../../../services/committee";
import { useNavigate } from "react-router-dom";

const UserCommittees = ({ orgId }) => {
  const { user } = useContext(AuthContext);
  const [committees, setCommittees] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch committees on component mount
  useEffect(() => {
    const fetchCommittees = async () => {
      setLoading(true);
      try {
        const committeesRes = await getCommittee();
        setCommittees(committeesRes?.data || []);
      } catch (error) {
        Toast.show({
          content: "Failed to load committees",
          position: "top",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCommittees();
  }, []);

  const handleViewGroup = (committee) => {
    navigate(`/committee/${orgId}/${committee.id}`);
  };

  const formatCommitteeForDisplay = (committee) => {
    return {
      id: committee.id,
      committeeName: committee.attributes?.committee_name || "",
      type: committee.attributes?.type || "",
      subtype: committee.attributes?.subtype || "",
      createdAt: committee.attributes?.createdAt || new Date().toISOString(),
    };
  };

  return (
    <div style={{ padding: "12px", minHeight: "100vh", paddingBottom: "80px" }}>
      <div style={{ marginBottom: "16px", padding: "4px 0" }}>
        <h2
          style={{
            margin: 0,
            color: "#ff6b35",
            fontSize: "18px",
            fontWeight: "600",
          }}
        >
          Committee Groups
        </h2>
        <p style={{ margin: "4px 0 0 0", color: "#666", fontSize: "13px" }}>
          View available committee groups
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          Loading committees...
        </div>
      ) : committees.length > 0 ? (
        committees.map((committee) => {
          const displayCommittee = formatCommitteeForDisplay(committee);
          return (
            <Card
              key={committee.id}
              style={{
                marginBottom: "8px",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                border: "1px solid #f0f0f0",
              }}
            >
              <div style={{ padding: "12px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    marginBottom: "8px",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#fff2ed",
                      borderRadius: "8px",
                      padding: "6px",
                      marginRight: "10px",
                      minWidth: "32px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <TeamOutline
                      style={{ fontSize: "16px", color: "#ff6b35" }}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4
                      style={{
                        margin: "0 0 4px 0",
                        color: "#333",
                        fontSize: "15px",
                        fontWeight: "500",
                        lineHeight: "1.2",
                      }}
                    >
                      {displayCommittee.committeeName}
                    </h4>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#666",
                        marginBottom: "6px",
                      }}
                    >
                      <span style={{ color: "#ff6b35", fontWeight: "500" }}>
                        {displayCommittee.type.charAt(0).toUpperCase() +
                          displayCommittee.type.slice(1)}
                      </span>
                      {" • "}
                      <span>
                        {displayCommittee.subtype.charAt(0).toUpperCase() +
                          displayCommittee.subtype.slice(1)}
                      </span>
                    </div>
                    <div style={{ fontSize: "11px", color: "#999" }}>
                      Created:{" "}
                      {new Date(
                        displayCommittee.createdAt
                      ).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <Button
                  size="small"
                  color="primary"
                  fill="outline"
                  style={{
                    borderColor: "#ff6b35",
                    color: "#ff6b35",
                    width: "100%",
                    height: "36px",
                    fontSize: "13px",
                    fontWeight: "500",
                  }}
                  onClick={() => handleViewGroup(committee)}
                >
                  View Group
                </Button>
              </div>
            </Card>
          );
        })
      ) : (
        <div
          style={{ textAlign: "center", padding: "60px 20px", color: "#666" }}
        >
          <div
            style={{
              backgroundColor: "#f8f8f8",
              borderRadius: "50%",
              width: "80px",
              height: "80px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <TeamOutline style={{ fontSize: "32px", color: "#ddd" }} />
          </div>
          <p style={{ margin: "0 0 8px 0", fontSize: "16px", color: "#333" }}>
            No committee groups available
          </p>
          <p style={{ margin: 0, fontSize: "13px", color: "#999" }}>
            Committee groups will appear here once created by admins
          </p>
        </div>
      )}
    </div>
  );
};

export default UserCommittees;
