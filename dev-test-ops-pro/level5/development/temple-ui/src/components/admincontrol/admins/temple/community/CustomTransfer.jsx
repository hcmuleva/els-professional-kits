import React, { useState, useEffect } from "react";
import { List, Input, Button, Spin } from "antd";
import {
  RightOutlined,
  LeftOutlined,
  FileExcelFilled,
} from "@ant-design/icons";

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

const CustomTransfer = ({
  dataSource,
  targetKeys,
  onFinish,
  titles,
  render,
  onCancel,
}) => {
  const [localTargetKeys, setLocalTargetKeys] = useState(targetKeys || []);
  const [unassignedSearch, setUnassignedSearch] = useState("");
  const [assignedSearch, setAssignedSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLocalTargetKeys(targetKeys || []);
  }, [targetKeys]);

  const unassignedItems = dataSource
    .filter((item) => !localTargetKeys.includes(item.key))
    .filter((item) =>
      item.title.toLowerCase().includes(unassignedSearch.toLowerCase())
    );

  const assignedItems = dataSource
    .filter((item) => localTargetKeys.includes(item.key))
    .filter((item) =>
      item.title.toLowerCase().includes(assignedSearch.toLowerCase())
    );

  const handleMoveToAssigned = (keys) => {
    if (!loading) {
      setLocalTargetKeys([...localTargetKeys, ...keys]);
    }
  };

  const handleMoveToUnassigned = (keys) => {
    if (!loading) {
      setLocalTargetKeys(localTargetKeys.filter((key) => !keys.includes(key)));
    }
  };

  const handleOk = async () => {
    setLoading(true);
    try {
      await onFinish(localTargetKeys); // Trigger API call in parent
    } finally {
      setLoading(false); // Reset loading state regardless of success/failure
    }
  };

  const handleCancel = () => {
    setLocalTargetKeys(targetKeys || []);
    if (typeof onCancel === "function") {
      onCancel();
    }
  };

  const styles = {
    container: {
      width: "100%",
      maxWidth: "600px",
      margin: "0 auto",
      paddingBottom: "80px",
    },
    listContainer: {
      marginBottom: "16px",
      position: "relative",
    },
    listHeader: {
      padding: "8px 12px",
      background: `linear-gradient(135deg, ${warmColors.primary} 0%, ${warmColors.secondary} 100%)`,
      color: warmColors.cardBg,
      fontWeight: "600",
      fontSize: "14px",
      borderRadius: "8px 8px 0 0",
      textAlign: "center",
    },
    list: {
      backgroundColor: warmColors.cardBg,
      borderRadius: "0 0 8px 8px",
      border: `1px solid ${warmColors.border}`,
      borderTop: "none",
      maxHeight: "250px",
      overflowY: "auto",
      width: "100%",
    },
    listItem: {
      padding: "6px 12px",
      fontSize: "14px",
      color: warmColors.textPrimary,
      cursor: loading ? "not-allowed" : "pointer",
      transition: "background-color 0.2s",
    },
    listItemHover: {
      backgroundColor: warmColors.background,
    },
    searchInput: {
      width: "100%",
      margin: "8px 0",
      borderRadius: "8px",
      border: `1px solid ${warmColors.border}`,
      backgroundColor: warmColors.cardBg,
      fontSize: "14px",
      padding: "6px 12px",
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "center",
      gap: "12px",
      margin: "12px 0",
    },
    actionButton: {
      background: `linear-gradient(135deg, ${warmColors.primary} 0%, ${warmColors.secondary} 100%)`,
      border: "none",
      borderRadius: "8px",
      fontSize: "14px",
      padding: "4px 12px",
      color: warmColors.cardBg,
    },
    disabledButton: {
      background: warmColors.border,
      border: "none",
      borderRadius: "8px",
      fontSize: "14px",
      padding: "4px 12px",
      color: warmColors.textSecondary,
    },
    okButtonContainer: {
      position: "sticky",
      bottom: 0,
      background: warmColors.cardBg,
      padding: "8px 0",
      zIndex: 10,
      borderTop: `1px solid ${warmColors.border}`,
      textAlign: "center",
      display: "flex",
    },
    okButton: {
      background: `linear-gradient(135deg, ${warmColors.primary} 0%, ${warmColors.secondary} 100%)`,
      border: "none",
      borderRadius: "8px",
      fontSize: "14px",
      padding: "4px 12px",
      color: warmColors.cardBg,
      width: "150px",
      textAlign: "center",
    },
    disabledOkButton: {
      background: warmColors.border,
      border: "none",
      borderRadius: "8px",
      fontSize: "14px",
      padding: "4px 12px",
      color: warmColors.textSecondary,
      width: "150px",
      textAlign: "center",
    },
  };

  return (
    <>
      <div style={styles.container}>
        <div style={styles.listContainer}>
          <div style={styles.listHeader}>{titles[0]}</div>
          <Input
            placeholder="नाम से खोजें..."
            value={unassignedSearch}
            onChange={(e) => setUnassignedSearch(e.target.value)}
            style={styles.searchInput}
            allowClear
            disabled={loading}
          />
          <List
            style={styles.list}
            dataSource={unassignedItems}
            renderItem={(item) => (
              <List.Item
                style={styles.listItem}
                onClick={() => handleMoveToAssigned([item.key])}
                onMouseEnter={(e) =>
                  !loading &&
                  (e.currentTarget.style.backgroundColor =
                    styles.listItemHover.backgroundColor)
                }
                onMouseLeave={(e) =>
                  !loading &&
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
                actions={[
                  <Button
                    type="primary"
                    size="small"
                    icon={<RightOutlined />}
                    style={
                      loading ? styles.disabledButton : styles.actionButton
                    }
                    onClick={() => handleMoveToAssigned([item.key])}
                    disabled={loading}
                  />,
                ]}
              >
                {render(item)}
              </List.Item>
            )}
          />
        </div>

        <div style={styles.buttonContainer}>
          <Button
            type="primary"
            disabled={!unassignedItems.length || loading}
            onClick={() =>
              handleMoveToAssigned(unassignedItems.map((item) => item.key))
            }
            style={
              unassignedItems.length && !loading
                ? styles.actionButton
                : styles.disabledButton
            }
          >
            सभी असाइन करें
          </Button>
          <Button
            type="primary"
            disabled={!assignedItems.length || loading}
            onClick={() =>
              handleMoveToUnassigned(assignedItems.map((item) => item.key))
            }
            style={
              assignedItems.length && !loading
                ? styles.actionButton
                : styles.disabledButton
            }
          >
            सभी अनअसाइन करें
          </Button>
        </div>

        <div style={styles.listContainer}>
          <div style={styles.listHeader}>{titles[1]}</div>
          <Input
            placeholder="नाम से खोजें..."
            value={assignedSearch}
            onChange={(e) => setAssignedSearch(e.target.value)}
            style={styles.searchInput}
            allowClear
            disabled={loading}
          />
          <List
            style={styles.list}
            dataSource={assignedItems}
            renderItem={(item) => (
              <List.Item
                style={styles.listItem}
                onClick={() => handleMoveToUnassigned([item.key])}
                onMouseEnter={(e) =>
                  !loading &&
                  (e.currentTarget.style.backgroundColor =
                    styles.listItemHover.backgroundColor)
                }
                onMouseLeave={(e) =>
                  !loading &&
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
                actions={[
                  <Button
                    type="primary"
                    size="small"
                    icon={<LeftOutlined />}
                    style={
                      loading ? styles.disabledButton : styles.actionButton
                    }
                    onClick={() => handleMoveToUnassigned([item.key])}
                    disabled={loading}
                  />,
                ]}
              >
                {render(item)}
              </List.Item>
            )}
          />
          <div style={styles.okButtonContainer}>
            {loading ? (
              <Spin size="small" />
            ) : (
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  gap: "12px",
                  padding: "8px 0",
                }}
              >
                <Button
                  type="primary"
                  style={loading ? styles.disabledOkButton : styles.okButton}
                  onClick={handleOk}
                  disabled={loading}
                >
                  OK
                </Button>
                <Button
                  type="primary"
                  style={loading ? styles.disabledOkButton : styles.okButton}
                  onClick={handleCancel}
                  disabled={loading}
                >
                  CANCEL
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 600px) {
          .container {
            padding: 8px !important;
          }
          .listContainer {
            marginbottom: 8px !important;
          }
          .listHeader {
            font-size: 12px !important;
            padding: 6px 8px !important;
          }
          .list {
            max-height: 200px !important;
          }
          .listItem {
            font-size: 12px !important;
            padding: 4px 8px !important;
          }
          .searchInput {
            font-size: 12px !important;
            padding: 4px 8px !important;
          }
          .actionButton,
          .disabledButton,
          .okButton,
          .disabledOkButton {
            font-size: 12px !important;
            padding: 4px 8px !important;
            width: 120px !important;
          }
          .okButtonContainer {
            padding: 6px 0 !important;
          }
        }
      `}</style>
    </>
  );
};

export default CustomTransfer;
