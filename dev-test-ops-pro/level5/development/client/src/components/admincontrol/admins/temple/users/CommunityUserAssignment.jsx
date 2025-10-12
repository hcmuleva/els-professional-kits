import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Modal,
  message,
  Select,
  Card,
  DatePicker,
  Badge,
  Input,
  Spin,
} from "antd";
import { UserAddOutlined, TeamOutlined } from "@ant-design/icons";
import {
  getCustomCommunityUsers,
  updateCustomCommunityUsers,
  updateUserRole,
} from "../../../../../services/community";
import { useNavigate, useParams } from "react-router-dom";
import SearchAssignUserModel from "./SearchAssignUserModel";
import dayjs from "dayjs";
import { AuthContext } from "../../../../../contexts/AuthContext";
import { deleteUserRole } from "../../../../../services/userrole";
import CustomTransfer from "../community/CustomTransfer";

const warmColors = {
  primary: "#8B4513",
  secondary: "#A0522D",
  accent: "#CD853F",
  background: "#FAFAFA",
  cardBg: "#FFFFFF",
  textPrimary: "#2C2C2C",
  textSecondary: "#666666",
  border: "#E8E8E8",
  error: "#D32F2F",
  success: "#2E7D32",
};

const statusOptions = [
  "PENDING",
  "APPROVED",
  "REJECTED",
  "EXPIRED",
  "RESIGNED",
  "EXPELLED",
  "LEFT",
  "BLOCKED",
  "NA",
];

export default function CommunityUserAssignment() {
  const { profileUpdated, setProfileUpdated } = useContext(AuthContext);
  const { templeId, subcategoryId } = useParams();
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [unassignedUsers, setUnassignedUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [transferData, setTransferData] = useState([]);
  const [targetKeys, setTargetKeys] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingUserId, setDeletingUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, [templeId, subcategoryId]);

  const toggleEditMode = (userId, mode) => {
    setAssignedUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, editMode: mode } : u))
    );
  };

  const fetchUsers = async () => {
    try {
      const {
        assigned = [],
        unassigned = [],
        roles = [],
      } = await getCustomCommunityUsers(templeId, subcategoryId);

      const enrichedAssigned = assigned.map((user) => {
        const matchedRole = roles.find((r) => r.name === user.categoryRoleName);
        return {
          ...user,
          userroleId: user?.userroles?.[0]?.id || user.userroleId || null, // ensure always set
          categoryRoleId: matchedRole?.id || null,
          editMode: false,
          start: user.start ? dayjs(user.start) : null,
          enddate: user.enddate ? dayjs(user.enddate) : null,
        };
      });

      enrichedAssigned.sort((a, b) =>
        `${a.first_name || ""} ${a.last_name || ""}`.localeCompare(
          `${b.first_name || ""} ${b.last_name || ""}`,
          "en",
          { sensitivity: "base" }
        )
      );
      unassigned.sort((a, b) =>
        `${a.first_name || ""} ${a.last_name || ""}`.localeCompare(
          `${b.first_name || ""} ${b.last_name || ""}`,
          "en",
          { sensitivity: "base" }
        )
      );

      setAssignedUsers(enrichedAssigned);
      setUnassignedUsers(unassigned);
      setRoles(roles || []);
      const newTransferData = [...enrichedAssigned, ...unassigned].map(
        (user) => ({
          key: user.id.toString(),
          title: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
        })
      );
      setTransferData(newTransferData);
      setTargetKeys(enrichedAssigned.map((user) => user.id.toString()));
    } catch (err) {
      console.error("Error fetching users", err);
      message.error("Failed to fetch users");
    }
  };

  const handleSaveTransfer = async (keys) => {
    try {
      await updateCustomCommunityUsers({
        templeId,
        subcategoryId,
        assignedUserIds: keys.map((key) => parseInt(key, 10)),
      });
      message.success("Assignments updated");
      setModalVisible(false);
      await fetchUsers();
    } catch (err) {
      console.error("Error updating assignments", err);
      message.error(
        err?.response?.data?.error?.message || "Failed to update assignments"
      );
    } finally {
      setProfileUpdated(true);
    }
  };

  const handleDeleteUserfromRole = async (user) => {
    const idToDelete = user?.userroles?.[0]?.id || user?.userroleId;
    if (!idToDelete) {
      message.error("No user role ID found to delete");
      return;
    }

    setDeletingUserId(user.id);
    try {
      await deleteUserRole(idToDelete);
      message.success("Removed from role");
      await fetchUsers();
    } catch (err) {
      console.error("Error removing user", err);
      const errorMessage =
        err?.response?.data?.error?.message ||
        (err?.code === 80017
          ? "Failed to delete user role due to Ably connection issue"
          : "Failed to remove user");
      message.error(errorMessage);
    } finally {
      setDeletingUserId(null);
    }
  };

  const handleInlineSave = async (user) => {
    const userObject = {
      userroleId: user.userroleId,
      status: user.status,
      categoryRoleId: user.categoryRoleId,
      start: user.start ? user.start.format("YYYY-MM-DD") : null,
      enddate: user.enddate ? user.enddate.format("YYYY-MM-DD") : null,
    };

    try {
      await updateUserRole(userObject);
      message.success("Updated successfully");
      await fetchUsers();
    } catch (err) {
      console.error("Error updating user role", err);
      message.error(err?.response?.data?.error?.message || "Update failed");
    }
  };

  const isPurv = (user) => {
    return user.enddate && dayjs().isAfter(user.enddate);
  };

  const handleChange = (value, field, userId) => {
    setAssignedUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, [field]: value } : u))
    );
  };

  const handleUserAssigned = () => {
    fetchUsers();
  };

  const normalized = (u) =>
    `${u.first_name || ""} ${u.last_name || ""}`.trim().toLowerCase();
  const filteredAssigned = assignedUsers.filter((u) =>
    normalized(u).includes(searchTerm.trim().toLowerCase())
  );

  const styles = {
    topBar: {
      display: "flex",
      gap: "8px",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: "16px",
      flexWrap: "wrap",
      padding: "0 8px",
    },
    searchInput: {
      borderRadius: "12px",
      border: `2px solid ${warmColors.border}`,
      backgroundColor: warmColors.cardBg,
      color: warmColors.textPrimary,
      fontSize: "16px",
      width: "100%",
      maxWidth: "300px",
      padding: "10px 12px",
    },
    cardGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      gap: "16px",
      marginTop: "24px",
      padding: "0 8px",
    },
    cardWrapper: {
      position: "relative",
    },
    cardInner: {
      padding: "24px",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      backgroundColor: warmColors.cardBg,
      borderRadius: "16px",
      boxShadow: `0 4px 16px ${warmColors.primary}12`,
      border: `1px solid ${warmColors.border}`,
    },
    badgeStyle: {
      position: "absolute",
      top: "8px",
      left: "8px",
      zIndex: 10,
    },
    cardContentBlock: {
      marginBottom: "16px",
    },
    inlineControls: {
      display: "flex",
      gap: "8px",
      justifyContent: "space-between",
    },
  };

  return (
    <div
      style={{
        padding: "16px",
        backgroundColor: warmColors.background,
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `radial-gradient(circle at 25% 25%, ${warmColors.primary}08 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, ${warmColors.accent}08 0%, transparent 50%)`,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        <h2
          style={{
            color: warmColors.textPrimary,
            fontWeight: "700",
            marginBottom: "24px",
            textAlign: "center",
            background: `linear-gradient(135deg, ${warmColors.primary} 0%, ${warmColors.secondary} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          कम्युनिटी यूजर असाइनमेंट
        </h2>

        <div style={styles.topBar}>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <Button
              onClick={() => navigate(-1)}
              style={{
                borderRadius: "12px",
                border: `2px solid ${warmColors.border}`,
                color: warmColors.textPrimary,
              }}
            >
              ← वापस जाये
            </Button>
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              style={{
                background: `linear-gradient(135deg, ${warmColors.primary} 0%, ${warmColors.secondary} 100%)`,
                border: "none",
                color: warmColors.cardBg,
                borderRadius: "12px",
              }}
              onClick={() => setSearchModalVisible(true)}
            >
              मोबाइल सर्च
            </Button>
            <Button
              icon={<TeamOutlined />}
              style={{
                borderRadius: "12px",
                border: `2px solid ${warmColors.border}`,
                color: warmColors.textPrimary,
              }}
              onClick={() => setModalVisible(true)}
            >
              सारे यूजर
            </Button>
          </div>
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="नाम से यूजर खोजें..."
            style={styles.searchInput}
            aria-label="Search users"
          />
        </div>

        <Modal
          title="यूजर असाइन करें"
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          width="90%"
          style={{ borderRadius: "16px" }}
          bodyStyle={{
            backgroundColor: warmColors.cardBg,
            borderRadius: "16px",
            padding: "16px",
          }}
        >
          <CustomTransfer
            dataSource={transferData}
            targetKeys={targetKeys}
            titles={["अनअसाइन्ड", "असाइन्ड"]}
            render={(item) => item.title}
            onFinish={handleSaveTransfer}
            onCancel={() => setModalVisible(false)}
          />
        </Modal>

        <SearchAssignUserModel
          visible={searchModalVisible}
          onClose={() => setSearchModalVisible(false)}
          onAssignUser={handleUserAssigned}
          templeId={templeId}
          subcategoryId={subcategoryId}
          assignedUserIds={targetKeys}
        />

        <div style={styles.cardGrid}>
          {filteredAssigned.map((user, index) => (
            <div key={user.id} style={styles.cardWrapper}>
              <Badge
                count={index + 1}
                style={styles.badgeStyle}
                color={warmColors.accent}
              />
              <Card style={styles.cardInner}>
                <div>
                  <h3
                    style={{
                      margin: 0,
                      color: warmColors.textPrimary,
                      fontWeight: "600",
                    }}
                  >
                    {user.first_name} {user.last_name || ""}
                  </h3>
                  <div style={styles.cardContentBlock}>
                    {user.editMode ? (
                      <>
                        <div
                          style={{
                            marginBottom: "8px",
                            color: warmColors.textSecondary,
                          }}
                        >
                          स्थिति:
                        </div>
                        <Select
                          value={user.status}
                          style={{
                            width: "100%",
                            borderRadius: "12px",
                            border: `2px solid ${warmColors.border}`,
                          }}
                          onChange={(value) =>
                            handleChange(value, "status", user.id)
                          }
                        >
                          {statusOptions.map((s) => (
                            <Select.Option key={s} value={s}>
                              {s}
                            </Select.Option>
                          ))}
                        </Select>
                        {/* <div
                          style={{
                            marginBottom: "8px",
                            marginTop: "12px",
                            color: warmColors.textSecondary,
                          }}
                        >
                          भूमिका:
                        </div>
                        <Select
                          value={user.categoryRoleId}
                          style={{
                            width: "100%",
                            borderRadius: "12px",
                            border: `2px solid ${warmColors.border}`,
                          }}
                          onChange={(value) =>
                            handleChange(value, "categoryRoleId", user.id)
                          }
                        >
                          {roles.map((role) => (
                            <Select.Option key={role.id} value={role.id}>
                              {role.name} ({role.name_hi})
                            </Select.Option>
                          ))}
                        </Select> */}
                        <div
                          style={{
                            marginBottom: "8px",
                            marginTop: "12px",
                            color: warmColors.textSecondary,
                          }}
                        >
                          प्रारंभ तिथि:
                        </div>
                        <DatePicker
                          value={user.start}
                          style={{ width: "100%", borderRadius: "12px" }}
                          onChange={(date) =>
                            handleChange(date, "start", user.id)
                          }
                          format="DD/MM/YYYY"
                          placeholder="प्रारंभ तिथि चुनें"
                        />
                        <div
                          style={{
                            marginBottom: "8px",
                            marginTop: "12px",
                            color: warmColors.textSecondary,
                          }}
                        >
                          समाप्ति तिथि:
                        </div>
                        <DatePicker
                          value={user.enddate}
                          style={{ width: "100%", borderRadius: "12px" }}
                          onChange={(date) =>
                            handleChange(date, "enddate", user.id)
                          }
                          format="DD/MM/YYYY"
                          placeholder="समाप्ति तिथि चुनें (वैकल्पिक)"
                        />
                      </>
                    ) : (
                      <>
                        <p
                          style={{
                            margin: "8px 0",
                            color: warmColors.textSecondary,
                          }}
                        >
                          <strong>स्थिति:</strong> {user.status || "N/A"}
                        </p>
                        <p
                          style={{
                            margin: "8px 0",
                            color: warmColors.textSecondary,
                          }}
                        >
                          <strong>भूमिका:</strong>{" "}
                          {(() => {
                            const role = roles.find(
                              (r) => r.id === user.categoryRoleId
                            );
                            const roleText = role
                              ? `${role?.name_hi} (${role?.name})`
                              : "N/A";
                            const purvPrefix = isPurv(user) ? "पूर्व " : "";
                            return `${purvPrefix}${roleText}`;
                          })()}
                        </p>
                      </>
                    )}
                  </div>
                </div>
                <div style={styles.inlineControls}>
                  {user.editMode ? (
                    <>
                      <Button
                        type="primary"
                        style={{
                          background: `linear-gradient(135deg, ${warmColors.primary} 0%, ${warmColors.secondary} 100%)`,
                          border: "none",
                          color: warmColors.cardBg,
                          borderRadius: "12px",
                        }}
                        onClick={() => {
                          handleInlineSave(user);
                          toggleEditMode(user.id, false);
                        }}
                      >
                        सहेजें
                      </Button>
                      <Button
                        style={{
                          borderRadius: "12px",
                          border: `2px solid ${warmColors.border}`,
                          color: warmColors.textPrimary,
                        }}
                        onClick={() => toggleEditMode(user.id, false)}
                      >
                        रद्द करें
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        style={{
                          borderRadius: "12px",
                          border: `2px solid ${warmColors.error}`,
                          color: warmColors.error,
                        }}
                        size="small"
                        onClick={() => handleDeleteUserfromRole(user)}
                        disabled={deletingUserId === user.id}
                        icon={
                          deletingUserId === user.id ? (
                            <Spin size="small" />
                          ) : null
                        }
                      >
                        {deletingUserId === user.id
                          ? "हटाया जा रहा..."
                          : "हटाएँ"}
                      </Button>
                      <Button
                        type="primary"
                        style={{
                          background: `linear-gradient(135deg, ${warmColors.primary} 0%, ${warmColors.secondary} 100%)`,
                          border: "none",
                          color: warmColors.cardBg,
                          borderRadius: "12px",
                        }}
                        size="small"
                        onClick={() => toggleEditMode(user.id, true)}
                        disabled={deletingUserId === user.id}
                      >
                        संपादित करें
                      </Button>
                    </>
                  )}
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
