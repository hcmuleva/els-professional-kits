import React, { useEffect, useState } from "react";
import { Tabs, Spin, Empty } from "antd";
import { AllUserWithStatus } from "../../../../services/temple";
import UserCard from "./UserCard"; // Adjust path as needed
import { useParams } from "react-router-dom";
import UserStatusUpdate from "../temple/users/UserStatusUpdate";
import RegisterPage from "../../../../pages/authpage/RegisterPage";
import create from "@ant-design/icons/lib/components/IconFont";
import { AuthContext, useAuth } from "../../../../contexts/AuthContext";

const { TabPane } = Tabs;

export default function AdminUserController() {
  const {user} = useAuth(AuthContext);
  const { id } = useParams();
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState("APPROVED");
  
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await AllUserWithStatus({ templeId: id }); // Replace with dynamic templeId if needed
      console.log("Fetched users:", res.data);
      setUserData(res.data || {});
    } catch (e) {
      console.error("Error fetching users:", e);
    } finally {
      setLoading(false);
    }
  };
  const handleStatusChanged = () => {
    fetchUsers(); // Re-fetch users on status update
  };
  const statusOptions = Object.keys(userData || {});
  const extraData = {
    role: "ADMIN",
    userstatus:"APPROVED",
    source: "AdminController",
    templeId: id,
    createdBy: user?.id || null,
  };
  return (
    <div style={{ padding: 24 }}>
      <h2>User Management</h2>
      <Tabs defaultActiveKey="newuser">
        <TabPane tab="🆕 New User" key="newuser">
          <RegisterPage extraData={extraData}/>
        </TabPane>

        <TabPane tab="👥 userstatus" key="stats">
          <UserStatusUpdate templeId={id} />
        </TabPane>
      </Tabs>
    </div>
  );
}
