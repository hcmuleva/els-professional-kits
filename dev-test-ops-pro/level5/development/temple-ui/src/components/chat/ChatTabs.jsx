import { NavBar, Space, Tabs } from "antd-mobile";
import { MessageOutline, TeamOutline } from "antd-mobile-icons";
import { useState } from "react";
import GroupSection from "./GroupSection";
import ChatSection from "./ChatSection";
import UserChatArea from "./UserChatArea";
import GroupChatArea from "./GroupChatArea";
import { useNavigate } from "react-router-dom";

const warmColors = {
  primary: "#d2691e",
  secondary: "#daa520",
  accent: "#cd853f",
  background: "#fef7e7",
  cardBg: "#ffffff",
  textPrimary: "#5d4037",
  textSecondary: "#8d6e63",
  border: "#f4e4bc",
  success: "#52c41a",
  warning: "#faad14",
  error: "#ff4d4f",
};

export default function ChatTabs() {
  const [view, setView] = useState("list"); // "list" or "chat"
  const [active, setActive] = useState(null);
  const navigate = useNavigate();
  const openChat = (info) => {
    setActive(info);
    setView("chat");
  };

  const back = () => {
    setView("list");
    setActive(null);
  };

  if (view === "chat" && active) {
    return active.isGroup ? (
      <GroupChatArea groupId={active.id} chatName={active.name} onBack={back} />
    ) : (
      <UserChatArea
        chatId={active.id}
        chatName={active.name}
        receiverId={active.id}
        onBack={back}
      />
    );
  }

  return (
    <div style={{ minHeight: "100vh" }}>
      <NavBar
        style={{
          backgroundColor: warmColors.primary,
          color: "white",
          "--adm-color-text": "white",
        }}
        onBack={() => navigate(-1)}
      >
        Chats
      </NavBar>
      <Tabs
        style={{
          "--content-padding": "0px",
          "--active-line-color": "#8b5cf6",
          "--active-title-color": "#8b5cf6",
          "--title-font-size": "16px",
          "--title-font-weight": "600",
          "--background-color": "transparent",
        }}
      >
        <Tabs.Tab
          title={
            <Space>
              <TeamOutline />
              Groups
            </Space>
          }
          key="groups"
        >
          <GroupSection
            onOpenChat={(group) => openChat({ ...group, isGroup: true })}
          />
        </Tabs.Tab>
        {/* <Tabs.Tab
          title={
            <Space>
              <MessageOutline />
              Chats
            </Space>
          }
          key="chats"
        >
          <ChatSection
            onOpenChat={(chat) => openChat({ ...chat, isGroup: false })}
          />
        </Tabs.Tab> */}
      </Tabs>
    </div>
  );
}
