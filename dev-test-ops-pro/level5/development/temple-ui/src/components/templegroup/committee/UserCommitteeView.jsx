import React from "react";
import { Tabs, NavBar } from "antd-mobile";
import { FileOutline, TeamOutline, LeftOutline } from "antd-mobile-icons";
import AboutTab from "./AboutTab";
import CommitteeUsersTab from "./CommitteeUsersTab";
import { useNavigate } from "react-router-dom";

const UserCommitteeView = ({
  committee,
  committeeUsers,
  getAvailableRoles,
  activeTab,
  setActiveTab,
}) => {
  const navigate = useNavigate();

  const tabs = [
    {
      key: "about",
      title: "About",
      icon: <FileOutline />,
      content: (
        <AboutTab
          committee={committee}
          committeeUsers={committeeUsers}
          getAvailableRoles={getAvailableRoles}
        />
      ),
    },
    {
      key: "users",
      title: "Members",
      icon: <TeamOutline />,
      content: (
        <CommitteeUsersTab
          committeeUsers={committeeUsers}
          getAvailableRoles={getAvailableRoles}
        />
      ),
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
        paddingBottom: "60px",
      }}
    >
      <NavBar
        onBack={() => navigate(-1)}
        style={{
          background: "#fff",
          fontWeight: 600,
          fontSize: "16px",
          borderBottom: "1px solid #eee",
        }}
      >
        {committee.committeeName}
      </NavBar>

      <div style={{ minHeight: "calc(100vh - 120px)", paddingTop: "8px" }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          style={{
            "--active-line-color": "#ff6b35",
            "--active-title-color": "#ff6b35",
            "--title-font-size": "14px",
            background: "rgba(255, 255, 255, 0.9)",
            borderRadius: "12px 12px 0 0",
            margin: "0 8px",
            boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
          }}
        >
          {tabs.map((item) => (
            <Tabs.Tab
              key={item.key}
              title={
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "2px",
                  }}
                >
                  {item.icon}
                  <span style={{ fontSize: "12px" }}>{item.title}</span>
                </div>
              }
            >
              <div
                style={{
                  padding: "0 16px 16px",
                  background: "rgba(255, 255, 255, 0.9)",
                  margin: "0 8px",
                  borderRadius: "0 0 12px 12px",
                  minHeight: "400px",
                }}
              >
                {item.content}
              </div>
            </Tabs.Tab>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default UserCommitteeView;
