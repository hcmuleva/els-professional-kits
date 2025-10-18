import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, message, Modal, Table, Tag } from "antd";
import React, { useState } from "react";
import { AssignUserToTempleCommunity } from "../../../../../services/community";
import { searchUserByMobile } from "../../../../../services/user";

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

export default function SearchAssignUserModel({
  visible,
  onClose,
  onAssignUser,
  templeId,
  subcategoryId,
  assignedUserIds = [],
}) {
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [assigning, setAssigning] = useState({});

  const handleSearch = async () => {
    if (!searchValue.trim()) {
      message.warning("कृपया मोबाइल नंबर दर्ज करें");
      return;
    }

    setLoading(true);
    try {
      const response = await searchUserByMobile(searchValue.trim());
      if (response?.ok && response?.data) {
        const users = Array.isArray(response.data)
          ? response.data
          : [response.data];
        setSearchResults(users);

        if (users.length === 0) {
          message.info("इस मोबाइल नंबर से कोई यूजर नहीं मिला");
        }
      } else {
        message.error("यूजर खोजने में विफल");
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      message.error("खोज के दौरान त्रुटि हुई");
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignUser = async (user) => {
    setAssigning((prev) => ({ ...prev, [user.id]: true }));

    try {
      const response = await AssignUserToTempleCommunity({
        templeId,
        subcategoryId,
        userId: user.id,
      });

      if (response?.ok) {
        message.success(
          `यूजर ${user.first_name} ${user.last_name} सफलतापूर्वक असाइन किया गया`
        );
        onAssignUser(user);
        setSearchResults((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, isAssigned: true } : u))
        );
      } else {
        throw new Error(response?.message || "Assignment failed");
      }
    } catch (error) {
      console.error("Assignment error:", error);
      message.error(error.message || "यूजर असाइन करने में विफल");
    } finally {
      setAssigning((prev) => ({ ...prev, [user.id]: false }));
    }
  };

  const handleClose = () => {
    setSearchValue("");
    setSearchResults([]);
    setAssigning({});
    onClose();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const isUserAssigned = (userId) => {
    return assignedUserIds.includes(userId);
  };

  const columns = [
    {
      title: "नाम",
      dataIndex: "first_name",
      key: "name",
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: "600", color: warmColors.textPrimary }}>
            {`${record.first_name || ""} ${record.last_name || ""}`.trim()}
          </div>
          {record.email && (
            <div style={{ fontSize: "12px", color: warmColors.textSecondary }}>
              {record.email}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "मोबाइल",
      dataIndex: "mobile",
      key: "mobile",
      render: (mobile) => (
        <span
          style={{ fontFamily: "monospace", color: warmColors.textPrimary }}
        >
          {mobile}
        </span>
      ),
    },
    {
      title: "स्थिति",
      key: "status",
      render: (_, record) => {
        if (record.isAssigned || isUserAssigned(record.id)) {
          return <Tag color={warmColors.success}>पहले से असाइन</Tag>;
        }
        return <Tag color={warmColors.primary}>उपलब्ध</Tag>;
      },
    },
    {
      title: "कार्रवाई",
      key: "action",
      render: (_, record) => {
        const isAssigned = record.isAssigned || isUserAssigned(record.id);
        const isLoading = assigning[record.id];

        return (
          <Button
            type={isAssigned ? "default" : "primary"}
            size="small"
            loading={isLoading}
            disabled={isAssigned}
            style={
              isAssigned
                ? {
                    borderRadius: "12px",
                    border: `2px solid ${warmColors.border}`,
                    color: warmColors.textSecondary,
                  }
                : {
                    background: `linear-gradient(135deg, ${warmColors.primary} 0%, ${warmColors.secondary} 100%)`,
                    border: "none",
                    color: warmColors.cardBg,
                    borderRadius: "12px",
                  }
            }
            onClick={() => handleAssignUser(record)}
          >
            {isAssigned ? "असाइन किया गया" : "असाइन करें"}
          </Button>
        );
      },
    },
  ];

  return (
    <Modal
      title="यूजर खोजें और असाइन करें"
      open={visible}
      onCancel={handleClose}
      footer={null}
      width="90%"
      style={{ borderRadius: "16px" }}
      bodyStyle={{
        backgroundColor: warmColors.cardBg,
        borderRadius: "16px",
        padding: "16px",
      }}
    >
      <div style={{ marginBottom: "16px", display: "flex", gap: "8px" }}>
        <Input
          placeholder="मोबाइल नंबर दर्ज करें (उदा., 9876543210)"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyPress={handleKeyPress}
          maxLength={10}
          style={{
            borderRadius: "12px",
            border: `2px solid ${warmColors.border}`,
            backgroundColor: warmColors.cardBg,
            fontSize: "16px",
            flex: 1,
          }}
        />
        <Button
          type="primary"
          icon={<SearchOutlined />}
          loading={loading}
          onClick={handleSearch}
          style={{
            background: `linear-gradient(135deg, ${warmColors.primary} 0%, ${warmColors.secondary} 100%)`,
            border: "none",
            color: warmColors.cardBg,
            borderRadius: "12px",
          }}
        >
          खोजें
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={searchResults}
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: false,
          showQuickJumper: true,
        }}
        locale={{
          emptyText: searchValue
            ? "इस मोबाइल नंबर से कोई यूजर नहीं मिला"
            : "मोबाइल नंबर दर्ज करें और खोजें पर क्लिक करें",
        }}
        style={{ overflowX: "auto" }}
      />
    </Modal>
  );
}
