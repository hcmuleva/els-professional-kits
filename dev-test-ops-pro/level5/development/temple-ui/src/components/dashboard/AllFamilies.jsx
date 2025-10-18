import React, { useEffect, useState } from "react";
import {
  Table,
  Avatar,
  Button,
  Typography,
  Space,
  Spin,
  Alert,
  Card,
  Badge,
} from "antd";
import { EyeOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons";
import { useAuth, AuthContext } from "../../contexts/AuthContext";
import { getAllFamilies } from "../../services/families";
import { useNavigate, useParams } from "react-router-dom";

const { Title, Text } = Typography;

export default function AllFamilies() {
  const { templeIdfromAdmin } = useParams();
  const { user } = useAuth(AuthContext);
  const navigate = useNavigate();
  const templeId = templeIdfromAdmin
    ? templeIdfromAdmin
    : user?.temples?.[0]?.id;

  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const userrole = user?.userrole || "user"; // Default to 'user' if role is not defined

  const fetchFamilies = async () => {
    try {
      setLoading(true);
      setError(null); // Reset error state

      const response = await getAllFamilies({ templeId });
      console.log("Families response:", response);

      // Check if response exists and is an array
      if (Array.isArray(response)) {
        setFamilies(response);
      } else if (response?.data) {
        // Handle case where data might be nested under data property
        setFamilies(
          Array.isArray(response.data) ? response.data : [response.data]
        );
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error fetching families:", err);
      setError(err.message || "Failed to fetch families");

      // Optional: Show error notification to user
      //message.error(err.message || "Failed to fetch families");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (templeId) fetchFamilies();
  }, [templeId]);

  const columns = [
    {
      title: "Profile Picture",
      dataIndex: ["mukhiya", "profilePicture"],
      key: "profilePicture",
      render: (url, record) => (
        <Avatar
          size={64}
          src={url}
          icon={<UserOutlined />}
          style={{
            backgroundColor: record.mukhiya ? "#f0f0f0" : "#d9d9d9",
          }}
        />
      ),
    },
    {
      title: "Head Name",
      key: "headName",
      render: (_, record) => (
        <div>
          <Text strong>{record.name || "Unknown Family"}</Text>
          {record.mukhiya && (
            <div style={{ marginTop: 4 }}>
              <Text type="secondary">
                {record.mukhiya.name}
                {record.mukhiya.gotra && ` • ${record.mukhiya.gotra}`}
              </Text>
            </div>
          )}
        </div>
      ),
    },
    // {
    //   title: "Address",
    //   key: "address",
    //   render: (_, record) => (
    //     record.mukhiya?.address ? (
    //       <div>
    //         <Text>{record.mukhiya.address.state}</Text>
    //         {record.mukhiya.address.country && (
    //           <Text type="secondary" style={{ display: 'block' }}>
    //             {record.mukhiya.address.country}
    //           </Text>
    //         )}
    //       </div>
    //     ) : (
    //       <Text type="secondary">No address</Text>
    //     )
    //   ),
    // },
    {
      title: "Members",
      dataIndex: "memberCount",
      key: "memberCount",
      render: (count) => (
        <Badge
          count={count}
          style={{
            backgroundColor: "#8B4513",
            fontSize: "12px",
          }}
        />
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/familylist/${record.id}`)}
            style={{
              background: `linear-gradient(135deg, #8B4513 0%, #A0522D 100%)`,
              border: "none",
            }}
          >
            View
          </Button>

          {/* Admin-only Details button */}
          {userrole === "ADMIN" && (
            <Button
              type="default"
              icon={<SettingOutlined />}
              onClick={() =>
                navigate(`/templeadmin/${templeId}/familyadmin/${record.id}`)
              }
              style={{
                borderColor: "#8B4513",
                color: "#8B4513",
              }}
            >
              Details
            </Button>
          )}
        </Space>
      ),
    },
  ];
  console.log("Error", error);
  console.log("Families data:", families);
  return (
    <div style={{ padding: 20 }}>
      <Card>
        <Button onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>
          Back
        </Button>
        <Title level={3}>All Families</Title>
        {error ? (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            action={
              <Button size="small" onClick={fetchFamilies}>
                Retry
              </Button>
            }
          />
        ) : (
          <div style={{ overflowX: "auto" }}>
            <Table
              columns={columns}
              dataSource={families}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 10 }}
              scroll={{ x: "max-content" }}
            />
          </div>
        )}
      </Card>
    </div>
  );
}

// import React, { useEffect, useState } from "react";
// import {
//   Table,
//   Avatar,
//   Button,
//   Typography,
//   Space,
//   Spin,
//   Alert,
//   Card,
//   Badge,
//   Tooltip,
// } from "antd";
// import { EyeOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons";

// const { Title, Text } = Typography;

// // Mock data for demonstration
// const mockFamilies = [
//   {
//     id: 1,
//     name: "Sharma Family",
//     mukhiya: {
//       name: "Rajesh Sharma",
//       profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
//       gotra: "Bharadwaj"
//     },
//     members: [
//       { id: 1, name: "Rajesh Sharma", profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" },
//       { id: 2, name: "Sunita Sharma", profilePicture: "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=150&h=150&fit=crop&crop=face" },
//       { id: 3, name: "Arjun Sharma", profilePicture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" },
//       { id: 4, name: "Priya Sharma", profilePicture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face" }
//     ],
//     memberCount: 4
//   },
//   {
//     id: 2,
//     name: "Gupta Family",
//     mukhiya: {
//       name: "Vikram Gupta",
//       profilePicture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
//       gotra: "Kashyap"
//     },
//     members: [
//       { id: 1, name: "Vikram Gupta", profilePicture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face" },
//       { id: 2, name: "Meera Gupta", profilePicture: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face" },
//       { id: 3, name: "Rohit Gupta", profilePicture: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop&crop=face" },
//       { id: 4, name: "Kavya Gupta", profilePicture: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face" },
//       { id: 5, name: "Ankit Gupta", profilePicture: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face" },
//       { id: 6, name: "Ravi Gupta", profilePicture: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face" }
//     ],
//     memberCount: 6
//   },
//   {
//     id: 3,
//     name: "Patel Family",
//     mukhiya: {
//       name: "Ramesh Patel",
//       profilePicture: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
//       gotra: "Angiras"
//     },
//     members: [
//       { id: 1, name: "Ramesh Patel", profilePicture: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face" },
//       { id: 2, name: "Kiran Patel", profilePicture: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face" },
//       { id: 3, name: "Dev Patel", profilePicture: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face" }
//     ],
//     memberCount: 3
//   }
// ];

// export default function AllFamilies() {
//   const [families, setFamilies] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const userrole = "ADMIN"; // Mock user role

//   const navigate = (path) => {
//     console.log(`Navigating to: ${path}`);
//   };

//   useEffect(() => {
//     // Simulate API call
//     setLoading(true);
//     setTimeout(() => {
//       setFamilies(mockFamilies);
//       setLoading(false);
//     }, 1000);
//   }, []);

//   const renderMemberAvatars = (members = []) => {
//     const maxVisible = 4;
//     const visibleMembers = members.slice(0, maxVisible);
//     const remainingCount = Math.max(0, members.length - maxVisible);

//     return (
//       <Avatar.Group 
//         maxCount={4}
//         maxStyle={{
//           color: '#f56a00',
//           backgroundColor: '#fde3cf',
//           cursor: 'pointer',
//           fontSize: '12px'
//         }}
//       >
//         {visibleMembers.map((member, index) => (
//           <Tooltip key={member.id || index} title={member.name}>
//             <Avatar
//               size={32}
//               src={member.profilePicture}
//               icon={<UserOutlined />}
//               style={{
//                 backgroundColor: member.profilePicture ? 'transparent' : '#87ceeb',
//                 cursor: 'pointer'
//               }}
//             />
//           </Tooltip>
//         ))}
//         {remainingCount > 0 && (
//           <Tooltip title={`+${remainingCount} more members`}>
//             <Avatar
//               size={32}
//               style={{
//                 backgroundColor: '#1890ff',
//                 color: 'white',
//                 fontSize: '12px',
//                 cursor: 'pointer'
//               }}
//             >
//               +{remainingCount}
//             </Avatar>
//           </Tooltip>
//         )}
//       </Avatar.Group>
//     );
//   };

//   const columns = [
//     {
//       title: "Profile Picture",
//       dataIndex: ["mukhiya", "profilePicture"],
//       key: "profilePicture",
//       width: 100,
//       render: (url, record) => (
//         <Avatar
//           size={48}
//           src={url}
//           icon={<UserOutlined />}
//           style={{
//             backgroundColor: url ? 'transparent' : '#87ceeb',
//           }}
//         />
//       ),
//     },
//     {
//       title: "Head Name",
//       key: "headName",
//       width: 200,
//       render: (_, record) => (
//         <div>
//           <Text strong style={{ fontSize: '14px' }}>
//             {record.name || "Unknown Family"}
//           </Text>
//           {record.mukhiya && (
//             <div style={{ marginTop: 2 }}>
//               <Text type="secondary" style={{ fontSize: '12px' }}>
//                 {record.mukhiya.name}
//                 {record.mukhiya.gotra && ` • ${record.mukhiya.gotra}`}
//               </Text>
//             </div>
//           )}
//         </div>
//       ),
//     },
//     {
//       title: "Members",
//       key: "members",
//       width: 200,
//       render: (_, record) => renderMemberAvatars(record.members),
//     },
//     {
//       title: "Action",
//       key: "action",
//       width: 160,
//       render: (_, record) => (
//         <Space size="small">
//           <Button
//             type="primary"
//             size="small"
//             icon={<EyeOutlined />}
//             onClick={() => navigate(`/familylist/${record.id}`)}
//             style={{
//               background: '#52c41a',
//               borderColor: '#52c41a',
//               fontSize: '12px',
//               height: '28px'
//             }}
//           >
//             View
//           </Button>

//           {userrole === "ADMIN" && (
//             <Button
//               type="default"
//               size="small"
//               icon={<SettingOutlined />}
//               onClick={() => navigate(`/templeadmin/1/familyadmin/${record.id}`)}
//               style={{
//                 borderColor: '#8B4513',
//                 color: '#8B4513',
//                 fontSize: '12px',
//                 height: '28px'
//               }}
//             >
//               Details
//             </Button>
//           )}
//         </Space>
//       ),
//     },
//   ];

//   return (
//     <div style={{ padding: 24, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
//       <Card 
//         style={{ 
//           borderRadius: '8px',
//           boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
//         }}
//       >
//         <div style={{ marginBottom: 16 }}>
//           <Button 
//             onClick={() => navigate(-1)} 
//             style={{ marginBottom: 16 }}
//           >
//             ← Back
//           </Button>
//           <Title level={3} style={{ margin: 0, color: '#333' }}>
//             Top products
//           </Title>
//           <Text type="secondary" style={{ fontSize: '14px' }}>
//             Detailed information about the products
//           </Text>
//         </div>

//         {error ? (
//           <Alert
//             message="Error"
//             description={error}
//             type="error"
//             showIcon
//             action={
//               <Button size="small" onClick={() => window.location.reload()}>
//                 Retry
//               </Button>
//             }
//           />
//         ) : (
//           <Table
//             columns={columns}
//             dataSource={families}
//             rowKey="id"
//             loading={loading}
//             pagination={{ 
//               pageSize: 10,
//               showSizeChanger: false,
//               showQuickJumper: false
//             }}
//             size="middle"
//             style={{
//               backgroundColor: 'white'
//             }}
//             rowClassName={() => 'table-row-light'}
//           />
//         )}
//       </Card>
      
//       <style jsx>{`
//         .table-row-light:hover {
//           background-color: #fafafa !important;
//         }
//       `}</style>
//     </div>
//   );
// }