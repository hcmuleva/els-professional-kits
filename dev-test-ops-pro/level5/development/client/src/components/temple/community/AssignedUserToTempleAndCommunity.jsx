import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, List, Avatar, Space } from "antd-mobile";
import { SmileOutline } from 'antd-mobile-icons';
import { getCommunityUserRoles } from "../../../services/community";

const AssignedUserToTempleAndCommunity = ({ communityId, templeId }) => {
    console.log("communityId,templeId", communityId, templeId);
  const [roles, setRoles] = useState([]);
  const [community, setCommunity] = useState(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await getCommunityUserRoles(communityId, templeId);
        console.log("CommunityUserRolesMobile res", res);
        const data = res.data || [];
        console.log("CommunityUserRolesMobile data", res.data);
        if (data.length > 0) {
          setCommunity(data[0].attributes.community.data.attributes);
          setRoles(data);
        }
      } catch (error) {
        console.error("Failed to fetch roles:", error);
      }
    };

    fetchRoles();
  }, [communityId, templeId]);
  
  roles.map((role) => {
    const user = role.attributes.users_permissions_user?.data?.attributes;
    console.log("Assign user role", role.attributes?.communityrole?.data?.attributes);
    console.log("Assign user user", user);
  })
  return (
    <div style={{ padding: 12 }}>
      {/* Community Banner */}
      {community && (
        <Card style={{ marginBottom: 16 }}>
          <Space align="center">
            <span style={{ fontSize: 24 }}>{community.icon}</span>
            <span style={{ fontSize: 18, fontWeight: 'bold' }}>{community.name}</span>
          </Space>
        </Card>
      )}

      {/* User Role List */}
      <List header="Community Members">
        {roles.map((role) => {
          const user = role.attributes.users_permissions_user?.data?.attributes;
          if (!user) return null;

          return (
            <List.Item
              key={role.id}
              prefix={
                <Avatar style={{ '--size': '40px' }}>
                  {user.first_name?.[0] || <SmileOutline />}
                </Avatar>
              }
              description={`Role: ${role.attributes?.communityrole?.data?.attributes?.name || 'Member'}`}
            >
              {user.first_name} {user.last_name}
            </List.Item>
          );
        })}
      </List>
    </div>
  );
};

export default AssignedUserToTempleAndCommunity;
