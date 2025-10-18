import React,{useState} from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Badge, Space } from "antd-mobile";
import { CalendarOutline, TeamOutline, RightOutline, EnvironmentOutline } from "antd-mobile-icons";
import { UserToTemple } from "../../services/temple";
import { AuthContext, useAuth } from "../../contexts/AuthContext";
import TempleDirectionDialog from "./TempleDirectionDialog";

const TempleCard = ({ temple}) => {
  const navigate = useNavigate();
  const {user} = useAuth(AuthContext)
  const [open, setOpen] = useState(false);
  const templeLat = 13.1042;
  const templeLng = 77.571;
  const handleViewDetails = () => {
    navigate(`/temples/${temple?.id}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // const userCount = temple.attributes?.users_permissions_users?.data?.length || 0;
  // const communityCount = temple.attributes?.communities?.data?.length || 0;
  const { id, attributes } = temple;
          const { title, subtitle, address } = attributes;
          const addr = address?.data?.attributes || {};
  // Theme colors
  const theme = {
    primary: '#FF7A00',      // Orange
    secondary: '#FFB800',    // Yellow
    white: '#FFFFFF',
    lightGray: '#F8F8F8',
    textDark: '#333333',
    textMedium: '#666666',
    textLight: '#999999',
    borderRadius: '12px',
    shadowLight: '0 2px 8px rgba(0, 0, 0, 0.08)',
    shadowMedium: '0 4px 12px rgba(0, 0, 0, 0.12)',
  };

  const cardStyles = {
    container: {
      margin: '12px 0',
      borderRadius: theme.borderRadius,
      overflow: 'hidden',
      boxShadow: theme.shadowLight,
      border: '1px solid #f0f0f0',
      transition: 'all 0.3s ease',
    },
    imageContainer: {
      height: '140px',
      position: 'relative',
      backgroundColor: theme.lightGray,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    },
    imageOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.5) 100%)',
    },
    emoji: {
      fontSize: '56px',
      zIndex: 1,
    },
    statusBadge: {
      position: 'absolute',
      top: '12px',
      left: '12px',
      zIndex: 2,
    },
    communityBadge: {
      position: 'absolute',
      bottom: '12px',
      left: '12px',
      zIndex: 2,
      backgroundColor: 'rgba(255, 184, 0, 0.9)',
      color: 'white',
      padding: '4px 10px',
      borderRadius: '16px',
      fontSize: '12px',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
    locationBadge: {
      position: 'absolute',
      bottom: '12px',
      right: '12px',
      zIndex: 2,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      color: theme.textDark,
      padding: '4px 10px',
      borderRadius: '16px',
      fontSize: '12px',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    },
    contentContainer: {
      padding: '16px',
    },
    title: {
      fontSize: '18px',
      fontWeight: 'bold',
      margin: '0 0 8px 0',
      color: theme.textDark,
      display: '-webkit-box',
      WebkitLineClamp: 1,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    subtitle: {
      fontSize: '14px',
      color: theme.textMedium,
      margin: '0 0 14px 0',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      lineHeight: '1.4',
    },
    infoRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '13px',
      color: theme.textLight,
      marginBottom: '8px',
    },
    footer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '14px 16px',
      borderTop: '1px solid #f0f0f0',
      backgroundColor: theme.lightGray,
    },
    userCount: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      color: theme.primary,
      fontWeight: '600',
    },
    viewButton: {
      '--background-color': theme.primary,
      '--text-color': 'white',
      fontSize: '14px',
      fontWeight: '600',
      '--border-radius': '8px',
      boxShadow: '0 2px 8px rgba(255, 122, 0, 0.25)',
    },
  };

  // Prepare location text from available fields
  const location = [
    addr?.village,
    addr?.tehsil,
    addr?.district,
    addr?.state,
    addr?.country
  ].filter(Boolean)[0] || 'Location';
const hanndleJoinNow = async()=>{
  try{
    const resp = await UserToTemple({data:{requeststatus:"PENDING", user:user.id, temple:temple?.id}})
    console.log("respon", resp)

} catch (error) {
    console.error('Failed to fetch temples', error);
  }
}
  return (
    <div>
    {/* <Button type="link" onClick={() => setOpen(true)}>Show Directions</Button> */}
    <TempleDirectionDialog
      open={open}
      onClose={() => setOpen(false)}
      templeLat={templeLat}
      templeLng={templeLng}
    />
  
    <Card
      style={cardStyles.container}
      // onClick={handleViewDetails}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = cardStyles.shadowMedium;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = cardStyles.shadowLight;
      }}
    >
      <div style={cardStyles.imageContainer}>
        {temple.attributes?.images?.[0] ? (
          <img
            src={temple.attributes.images[0]}
            alt={temple.attributes?.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <>
            <div style={cardStyles.imageOverlay}></div>
            <div style={cardStyles.emoji}>{temple.emoji || '🏛️'}</div>
          </>
        )}

        <div style={cardStyles.statusBadge}>
          <Badge
            color={theme.primary}
            content="Active"
            style={{
              '--right': '-6px',
              '--top': '-6px',
              fontWeight: '600',
              padding: '0 6px'
            }}
          />
        </div>

        {/* {communityCount > 0 && (
          <div style={cardStyles.communityBadge}>
            <TeamOutline fontSize={14} />
            <span>{communityCount} Communities</span>
          </div>
        )} */}

        <div style={cardStyles.locationBadge}  onClick={() => setOpen(true)}> 
          <EnvironmentOutline fontSize={12} />
          <span>{location}</span>
        </div>
      </div>

      <div style={cardStyles.contentContainer}>
        <h3 style={cardStyles.title}>{temple?.attributes?.title}</h3>
        <p style={cardStyles.subtitle}>
          {temple.attributes?.subtitle ||
            temple.description ||
            "Experience the spiritual journey at this temple, connecting tradition with community."}
        </p>

        <div style={cardStyles.infoRow}>
          <CalendarOutline fontSize={16} color={theme.secondary} />
          <span>Created: {formatDate(temple.attributes?.createdAt)}</span>
        </div>

       
      </div>
        <Space>
      <div style={cardStyles.footer}>
        <div style={cardStyles.userCount} onClick={()=>{hanndleJoinNow()}}>
          <TeamOutline fontSize={18} />
          {/* <span>{userCount > 0 ? `${userCount} Users` : 'Join now'}</span> */}
          <span>JoinNow</span>
        </div>

        <Button
          color="primary"
          size="small"
          style={cardStyles.viewButton}
          onClick={(e) => {
            e.stopPropagation();
            handleViewDetails();
          }}
          fill="solid"
        >
          <Space>
            <span>View Details</span>
            <RightOutline fontSize={12} />
          </Space>
        </Button>
       
      </div> </Space>
    </Card>
    </div>
  );
};

export default TempleCard;