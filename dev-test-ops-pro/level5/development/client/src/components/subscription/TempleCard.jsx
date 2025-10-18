import React from 'react';
import { Button } from 'antd-mobile';
import { HeartOutline, TeamOutline, EnvironmentOutline, StarOutline } from 'antd-mobile-icons';
import { useNavigate } from 'react-router-dom';

const TempleCard = ({ temple, onJoin }) => {
  const navigate = useNavigate()

  const theme = {
    primary: '#FF7A00',    // Orange
    secondary: '#FFB800',  // Yellow
    white: '#FFFFFF',
    lightGray: '#F8F8F8',
    textDark: '#333333',
    textMedium: '#666666',
    textLight: '#999999',
    borderRadius: '12px',
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      borderRadius: theme.borderRadius,
      overflow: 'hidden',
      marginBottom: '20px',
      backgroundColor: theme.white,
      boxShadow: '0 4px 12px rgba(255, 122, 0, 0.1)',
      border: '1px solid rgba(255, 184, 0, 0.2)',
      height: '100%',
    }}>
      {/* Image Section */}
      <div style={{
        height: '180px',
        backgroundImage: `url(${temple.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
      }}>
        {/* Gradient Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0) 60%, rgba(0,0,0,0.7) 100%)',
        }} />

        {/* Favorite Button */}
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '50%',
          width: '36px',
          height: '36px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        }}>
          <HeartOutline style={{ fontSize: '20px', color: theme.primary }} />
        </div>

        {/* Temple Status Badge */}
        {temple.offer && (
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            backgroundColor: theme.secondary,
            borderRadius: '4px',
            padding: '4px 10px',
            display: 'flex',
            alignItems: 'center',
          }}>
            <StarOutline style={{ color: theme.white, fontSize: '14px', marginRight: '4px' }} />
            <span style={{ color: theme.white, fontSize: '12px', fontWeight: '600' }}>
              {temple.discount} OFF
            </span>
          </div>
        )}

        {/* Families Count */}
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          borderRadius: '4px',
          padding: '5px 10px',
          display: 'flex',
          alignItems: 'center',
        }}>
          <TeamOutline style={{ color: theme.white, fontSize: '14px', marginRight: '6px' }} />
          <span style={{ color: theme.white, fontSize: '13px', fontWeight: '600' }}>
            {temple.families} Families
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div style={{
        padding: '16px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'space-between',
      }}>
        <div>
          {/* Temple Name */}
          <h3 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            margin: '0 0 8px 0',
            color: theme.textDark,
          }}>
            {temple.name}
          </h3>

          {/* Location */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            color: theme.textMedium,
            marginBottom: '12px',
          }}>
            <EnvironmentOutline style={{ fontSize: '16px', marginRight: '6px', color: theme.primary }} />
            <span style={{ fontSize: '14px' }}>{temple.community}</span>
          </div>
        </div>

        {/* Divider */}
        <div style={{
          height: '1px',
          backgroundColor: 'rgba(255, 184, 0, 0.2)',
          margin: '12px 0',
        }} />

        {/* Footer Section */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          {/* Price */}
          <div>
            <div style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: theme.primary,
            }}>
              ₹{temple.price}
            </div>
            <div style={{
              fontSize: '13px',
              color: theme.textLight,
            }}>
              Per Member
            </div>
          </div>

          {/* Join Button */}
          <Button
            style={{
              '--background-color': theme.primary,
              '--text-color': theme.white,
              '--border-color': theme.primary,
              fontWeight: '600',
              borderRadius: '8px',
              padding: '0 20px',
              height: '38px',
              boxShadow: '0 2px 8px rgba(255, 122, 0, 0.3)',
            }}
            onClick={() => {
              onJoin && onJoin(temple.id)
              navigate("/temple-detail-page")
            }}
          >
            Join Temple
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TempleCard;