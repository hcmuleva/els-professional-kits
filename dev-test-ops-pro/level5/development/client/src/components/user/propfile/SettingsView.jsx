import { Button, Modal, Form, Select, Input, Upload, message } from "antd";
import React, { useContext, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { Space } from "antd-mobile";
import { deleteSingleUser } from "../../../services/user";
import { AuthContext } from "../../../contexts/AuthContext";

export default function SettingsView() {
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

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [reportReason, setReportReason] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [form] = Form.useForm();
  const { user, forceRefreshUser, logout } = useContext(AuthContext);

  const reportOptions = [
    { label: "Inappropriate Content", value: "inappropriate" },
    { label: "Suspicious Emails", value: "suspicious" },
    { label: "Community Guidelines Violation", value: "guidelines" },
  ];

  const handleDeleteConfirm = async () => {
    // Implement delete logic here
    await deleteSingleUser(user.id);
    await logout();
    message.success("Content deleted successfully");
  };

  const handleReportSubmit = () => {
    // Implement report submission logic here
    setReportModalVisible(false);
    message.success("Your report has been submitted");
    setReportReason(null);
    setUploadedFiles([]);
    form.resetFields();
  };

  const uploadProps = {
    onChange: ({ fileList }) => {
      setUploadedFiles(fileList.slice(0, 3)); // Limit to 3 files
    },
    beforeUpload: () => false, // Prevent auto-upload
    fileList: uploadedFiles,
    multiple: true,
    maxCount: 3,
  };

  return (
    <div
      style={{
        padding: "32px 24px",
        textAlign: "center",
        background: warmColors.cardBg,
        borderRadius: "12px",
      }}
    >
      <Button
        danger
        style={{ marginRight: "16px" }}
        onClick={() => setDeleteModalVisible(true)}
      >
        Delete Account
      </Button>
      <Button
        type="primary"
        style={{
          background: warmColors.primary,
          borderColor: warmColors.primary,
        }}
        onClick={() => setReportModalVisible(true)}
      >
        Report
      </Button>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Confirm Deletion"
        open={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setDeleteModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="delete" danger onClick={handleDeleteConfirm}>
            Delete Account
          </Button>,
        ]}
        style={{ borderRadius: "8px" }}
        bodyStyle={{ background: warmColors.cardBg, padding: "24px" }}
      >
        <p style={{ color: warmColors.textSecondary, marginBottom: "16px" }}>
          Are you sure you want to delete this Account? This action cannot be
          undone.
        </p>
      </Modal>

      {/* Report Form Modal */}
      <Modal
        title="Report Content"
        open={reportModalVisible}
        onCancel={() => setReportModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setReportModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            style={{
              background: warmColors.primary,
              borderColor: warmColors.primary,
            }}
            onClick={handleReportSubmit}
          >
            Submit
          </Button>,
        ]}
        style={{ borderRadius: "8px" }}
        bodyStyle={{ background: warmColors.cardBg, padding: "24px" }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Reason for Report"
            name="reason"
            rules={[{ required: true, message: "Please select a reason" }]}
          >
            <Select
              options={reportOptions}
              value={reportReason}
              onChange={setReportReason}
              placeholder="Select a reason"
              style={{
                border: `1px solid ${warmColors.border}`,
                borderRadius: "4px",
              }}
            />
          </Form.Item>

          <Form.Item label="Description (optional)" name="description">
            <Input.TextArea
              placeholder="Provide additional details"
              rows={4}
              style={{
                border: `1px solid ${warmColors.border}`,
                borderRadius: "4px",
              }}
            />
          </Form.Item>

          <Form.Item label="Upload Evidence (optional)" name="upload">
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>Upload (Max: 3 files)</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
      <br />
      <Space />
      <div>
        <h1>Privacy Policy - </h1>
        <a
          href="https://emeelan.com/eksamaj/privacy-policy"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: warmColors.primary,
            textDecoration: "underline",
            fontSize: "15px",
          }}
        >
          Privacy Policy
        </a>
      </div>
    </div>
  );
}
