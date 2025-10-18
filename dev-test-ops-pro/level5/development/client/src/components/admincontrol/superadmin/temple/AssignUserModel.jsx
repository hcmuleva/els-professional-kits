import React, { useEffect, useState } from "react";
import { Modal, Spin, message, Typography, Button, Card } from "antd";
import { UserOutlined, CloseOutlined } from "@ant-design/icons";
import {
  getAssignedUnAssginedUsersForTemples,
  assignUsersToTemples,
} from "../../../../services/temple";
import CustomTransfer from "../../admins/temple/community/CustomTransfer";

const { Title } = Typography;

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

const AssignUserModal = ({
  visible,
  onClose,
  selectedTemples,
  temples,
  onSuccess,
}) => {
  const [data, setData] = useState([]);
  const [targetKeys, setTargetKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [oldAssignment, setOldAssignment] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!visible || selectedTemples.length === 0) return;

      setLoading(true);
      try {
        const response = await getAssignedUnAssginedUsersForTemples(
          selectedTemples
        );
        const assigned = response?.assigned || [];
        const unassigned = response?.unassigned || [];

        setOldAssignment(assigned.map((item) => item.id.toString()));

        const combinedData = [...assigned, ...unassigned].map((item) => ({
          key: item.id.toString(),
          title: `${item.name || "N/A"} (${item.email || "No Email"})`,
          fullItem: item,
        }));

        setData(combinedData);
        setTargetKeys(assigned.map((item) => item.id.toString()));
      } catch (err) {
        console.error("Error fetching users", err);
        message.error("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [visible, selectedTemples]);

  const handleSave = async (nextTargetKeys) => {
    const assignedItems = data.filter((item) =>
      nextTargetKeys.includes(item.key)
    );
    const newElements = assignedItems.filter(
      (item) => !oldAssignment.includes(item.key)
    );
    const removedElement = oldAssignment.filter(
      (id) => !nextTargetKeys.includes(id)
    );
    const existingElements = assignedItems.filter((item) =>
      oldAssignment.includes(item.key)
    );

    const newUsers = newElements.map((item) => parseInt(item.key, 10));
    const removedUsers = removedElement.map((id) => parseInt(id, 10));
    const existingUsers = existingElements.map((item) =>
      parseInt(item.key, 10)
    );

    try {
      await assignUsersToTemples({
        templeIds: selectedTemples,
        newUsers,
        existingUsers,
        removedUsers,
      });

      message.success("यूजर सफलतापूर्वक असाइन किए गए!");
      onSuccess();
    } catch (err) {
      console.error("Error assigning users", err);
      message.error(
        err?.response?.data?.error?.message || "यूजर असाइन करने में त्रुटि हुई"
      );
    }
  };

  const handleCancel = () => {
    setData([]);
    setTargetKeys([]);
    setOldAssignment([]);
    onClose();
  };

  const getSelectedTempleNames = () => {
    return temples
      .filter((temple) => selectedTemples.includes(temple.id))
      .map((temple) => temple.attributes.title)
      .join(", ");
  };

  return (
    <Modal
      title={null}
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width="90%"
      style={{ maxWidth: "800px", top: 20 }}
      bodyStyle={{
        padding: 0,
        backgroundColor: warmColors.background,
        borderRadius: "16px",
        maxHeight: "80vh",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "24px",
          backgroundColor: warmColors.background,
          borderRadius: "16px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background pattern */}
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

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "24px",
            }}
          >
            <Title
              level={3}
              style={{
                margin: 0,
                color: warmColors.textPrimary,
                fontWeight: "700",
                background: `linear-gradient(135deg, ${warmColors.primary} 0%, ${warmColors.secondary} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              <UserOutlined style={{ marginRight: "8px" }} />
              यूजर असाइन करें
            </Title>
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={handleCancel}
              style={{
                color: warmColors.textSecondary,
                fontSize: "18px",
              }}
            />
          </div>

          {/* Selected Temples Info */}
          <Card
            style={{
              marginBottom: "24px",
              backgroundColor: `${warmColors.primary}10`,
              border: `1px solid ${warmColors.primary}30`,
              borderRadius: "12px",
            }}
          >
            <div style={{ padding: "8px" }}>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: warmColors.primary,
                  marginBottom: "8px",
                }}
              >
                चुने गए मंदिर ({selectedTemples.length}):
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: warmColors.textPrimary,
                  lineHeight: "1.4",
                  maxHeight: "60px",
                  overflowY: "auto",
                }}
              >
                {getSelectedTempleNames()}
              </div>
            </div>
          </Card>

          {/* Loading State */}
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "300px",
              }}
            >
              <Spin size="large" />
              <span
                style={{ marginLeft: "12px", color: warmColors.textSecondary }}
              >
                यूजर लोड हो रहे हैं...
              </span>
            </div>
          ) : (
            /* Transfer Component */
            <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
              <CustomTransfer
                dataSource={data}
                targetKeys={targetKeys}
                onFinish={handleSave}
                onCancel={handleCancel}
                titles={["अनअसाइन्ड यूजर", "असाइन्ड यूजर"]}
                render={(item) => (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <UserOutlined style={{ color: warmColors.primary }} />
                    <span>{item.title}</span>
                  </div>
                )}
              />
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default AssignUserModal;
