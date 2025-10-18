import { Tabs, Typography } from "antd";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import CommunityListWithAssign from "./community/CommunityListWithAssign";
import TempleUserList from "./users/TempleUserList";
import TempleCard from "./TempleCard";
import NewUserController from "./users/NewUserController";
import UserStatusUpdate from "./users/UserStatusUpdate";
import Templemap from "./TempleOnMap";

const { Text, Title } = Typography;
const { TabPane } = Tabs;

const TempleAdmin = () => {
  const { id } = useParams();

  console.log("temple Admin id", id);

  const [showAssignView, setShowAssignView] = useState(false);
  const [currentTab, setCurrentTab] = useState("community");

  const avatarUrl =
    "https://c7.alamy.com/comp/FG38JC/shree-shanta-durga-mandir-dedicated-goddess-parvati-calangute-goa-FG38JC.jpg";
  const name = `Mataji Mandir Id:${id}`;

  const handleTabChange = (tab) => {
    setCurrentTab(tab);
    if (tab !== "community") {
      setShowAssignView(false); // reset toggle when leaving community tab
    }
  };
  const tabContents = {
    members: (
      <div className="tab-content">
        <TempleUserList id={id} />
      </div>
    ),
    community: (
      <div className="tab-content">
        <button
          onClick={() => setShowAssignView((prev) => !prev)}
          style={{ marginBottom: "1rem" }}
        >
          {showAssignView ? "Back to Community List" : "Assign Communities"}
        </button>
      </div>
    ),
    family: <div className="tab-content">Family Content</div>,
    status: <div className="tab-content">Status Content</div>,
  };
  const onChange = (key) => {
    console.log(key);
  };
  const items = [
    {
      key: "1",
      label: "Community",
      children: <CommunityListWithAssign id={id} />,
    },
    {
      key: "2",
      label: "UserManagement",
      children: <NewUserController templeId={id} />,
    },
    {
      key: "3",
      label: "TempleOnMap",
      children: <Templemap templeId={id} />,
    },
    {
      key: "4",
      label: "Status",
      children: <UserStatusUpdate templeid={id} />,
    },
  ];
  return (
    <div className="profile-container">
      {/* Banner Section */}
      <TempleCard id={id} />

      {/* Tabs Section */}
      <div>
        <div className="tabs">
          {/* <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
           */}
        </div>
      </div>
    </div>
  );
};

export default TempleAdmin;
