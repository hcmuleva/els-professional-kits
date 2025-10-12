import { UserOutlined } from "@ant-design/icons";
import {
  Avatar,
  Card,
  Col,
  Row,
  Select,
  Spin,
  Tabs,
  Typography,
  message,
} from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTempleUserWithStatus } from "../../../../../services/community";
import { customUpdateUserStatusRoleData } from "../../../../../services/user";

const { TabPane } = Tabs;
const { Title, Text } = Typography;
const { Option } = Select;

export default function UserStatusUpdate() {
  const { id } = useParams();
  const [userGroups, setUserGroups] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await getTempleUserWithStatus(id);
      setUserGroups(response || {});
    } catch (err) {
      console.error("Error fetching temple users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchUsers();
  }, [id]);

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await customUpdateUserStatusRoleData(userId, { userstatus: newStatus });
      message.success("User status updated!");
      fetchUsers(); // Refresh data
    } catch (err) {
      message.error("Failed to update status");
    }
  };

  const renderUserCard = (user) => (
    <Card
      key={user.id}
      hoverable
      style={{
        margin: "8px",
        borderRadius: "10px",
        boxShadow: "0 1px 6px rgba(0,0,0,0.1)",
      }}
    >
      <Card.Meta
        avatar={
          <Avatar
            src={user.profilePicture?.url}
            icon={!user.profilePicture && <UserOutlined />}
            style={{ backgroundColor: "#d9d9d9" }}
          />
        }
        title={
          <Text strong>
            {user.first_name} {user.last_name}
          </Text>
        }
        description={
          <div>
            <div>
              <Text type="secondary">Gotra: </Text>
              {user.gotra || "N/A"}
            </div>
            <div>
              <Text type="secondary">Father: </Text>
              {user.father || "N/A"}
            </div>
            <div>
              <Text type="secondary">Status: </Text>
              <Select
                size="small"
                value={user.userstatus}
                style={{ width: 120 }}
                onChange={(val) => handleStatusChange(user.id, val)}
              >
                <Option value="APPROVED">APPROVED</Option>
                <Option value="PENDING">PENDING</Option>
                <Option value="BLOCKED">BLOCKED</Option>
                <Option value="REJECTED">REJECTED</Option>
              </Select>
            </div>
          </div>
        }
      />
    </Card>
  );

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Temple Users by Status</Title>
      {loading ? (
        <Spin />
      ) : (
        <Tabs defaultActiveKey="APPROVED">
          {Object.keys(userGroups).map((statusKey) => (
            <TabPane
              tab={`${statusKey} (${userGroups[statusKey].length})`}
              key={statusKey}
            >
              <Row gutter={[16, 16]}>
                {userGroups[statusKey].map((user) => (
                  <Col xs={24} sm={12} md={8} lg={6} key={user.id}>
                    {renderUserCard(user)}
                  </Col>
                ))}
              </Row>
            </TabPane>
          ))}
        </Tabs>
      )}
    </div>
  );
}
