import React, { useEffect, useState } from 'react';
import {
  Card,
  SearchBar,
  Tag,
  Space,
  Loading,
  Empty,
  NavBar,
  Toast,
} from 'antd-mobile';
import { UserOutline } from 'antd-mobile-icons';
import { IdcardOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAgricultureById } from '../../../services/agriculture';

export default function AgricultureList() {
  const location = useLocation();
  const selectedAgriculture = location.state?.selectedAgriculture;
  const templeId = location.state?.templeId || null;
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const warmColors = {
    primary: '#d2691e',
    secondary: '#daa520',
    accent: '#cd853f',
    background: '#fef7e7',
    cardBg: '#ffffff',
    textPrimary: '#5d4037',
    textSecondary: '#8d6e63',
    border: '#f4e4bc',
    success: '#52c41a',
    warning: '#faad14',
    error: '#ff4d4f',
  };

  useEffect(() => {
    if (!selectedAgriculture?.land_unit) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const data = await getAgricultureById(
          selectedAgriculture.land_unit,
          templeId
        );
        setUsers(data?.data || []);
        setFilteredUsers(data?.data || []);
      } catch (err) {
        Toast.show({
          icon: 'fail',
          content: 'Failed to load agriculture users',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedAgriculture?.land_unit, templeId]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter((item) => {
      const user = item.attributes.user?.data?.attributes;
      const agriculture = item.attributes;
      const searchFields = [
        user?.first_name?.toLowerCase(),
        user?.last_name?.toLowerCase(),
        user?.gotra?.toLowerCase(),
        agriculture?.land_unit?.toLowerCase(),
        agriculture?.land_type?.toLowerCase(),
        agriculture?.ownership_type?.toLowerCase(),
      ].filter(Boolean);

      return searchFields.some((field) =>
        field.includes(searchTerm.toLowerCase())
      );
    });

    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const formatUserDetails = (item) => {
    if (!item?.attributes?.user?.data?.attributes) return null;
    const userData = item.attributes.user.data.attributes;
    const agricultureData = item.attributes;
    return {
      name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim(),
      father: userData.father,
      gotra: userData.gotra,
      gender: userData.gender,
      mobile: userData.mobile,
      marital_status: userData.marital_status || userData.marital,
      age: userData.age || (userData.dob ? calculateAge(userData.dob) : null),
      land_unit: agricultureData.land_unit,
      land_area: agricultureData.land_area,
      land_type: agricultureData.land_type,
      ownership_type: agricultureData.ownership_type,
    };
  };

  const calculateAge = (dob) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: warmColors.background,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <Loading size="large" color={warmColors.primary} />
          <div
            style={{
              marginTop: '16px',
              color: warmColors.textPrimary,
              fontSize: '16px',
              fontWeight: '500',
            }}
          >
            Loading Users...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: warmColors.background,
        padding: '16px',
      }}
    >
      <NavBar
        style={{
          backgroundColor: warmColors.primary,
          color: 'white',
          '--adm-color-text': 'white',
        }}
        onBack={() => navigate(-1)}
      >
        Agriculture Directory
      </NavBar>

      <Card
        style={{
          marginBottom: '16px',
          borderRadius: '8px',
          border: `1px solid ${warmColors.border}`,
          boxShadow: '0 2px 8px rgba(210, 105, 30, 0.08)',
          background: warmColors.cardBg,
        }}
      >
        <div style={{ padding: '12px' }}>
          <h3
            style={{
              margin: 0,
              fontSize: '18px',
              fontWeight: '600',
              color: warmColors.textPrimary,
            }}
          >
            {selectedAgriculture?.land_unit?.toUpperCase() || 'AGRICULTURE'}
          </h3>
          <p
            style={{
              margin: '4px 0 12px 0',
              fontSize: '12px',
              color: warmColors.textSecondary,
            }}
          >
            {filteredUsers.length} users found
          </p>
          <SearchBar
            placeholder="Search by name, gotra, land type, or ownership"
            value={searchTerm}
            onChange={setSearchTerm}
            style={{
              '--adm-color-primary': warmColors.primary,
              '--border-radius': '8px',
            }}
          />
        </div>
      </Card>

      {filteredUsers.length === 0 ? (
        <Card
          style={{
            borderRadius: '12px',
            border: `1px solid ${warmColors.border}`,
            boxShadow: '0 4px 16px rgba(210, 105, 30, 0.1)',
            background: warmColors.cardBg,
          }}
        >
          <Empty
            description={
              searchTerm
                ? `No users found for "${searchTerm}"`
                : `No users found for ${selectedAgriculture?.land_unit}`
            }
            style={{ padding: '40px 0' }}
            image={<IdcardOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />}
          />
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredUsers.map((item) => {
            const userDetails = formatUserDetails(item);

            return (
              <Card
                key={item.id}
                style={{
                  borderRadius: '12px',
                  border: `1px solid ${warmColors.border}`,
                  boxShadow: '0 4px 16px rgba(210, 105, 30, 0.1)',
                  background: warmColors.cardBg,
                  padding: '16px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    marginBottom: '12px',
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '8px',
                      backgroundColor: `${warmColors.secondary}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '12px',
                      flexShrink: 0,
                    }}
                  >
                    <UserOutline
                      style={{
                        fontSize: '24px',
                        color: warmColors.secondary,
                      }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4
                      style={{
                        margin: 0,
                        fontSize: '16px',
                        fontWeight: '600',
                        color: warmColors.textPrimary,
                        marginBottom: '4px',
                      }}
                    >
                      {userDetails?.name || 'Unknown User'} (ID: {item.id})
                    </h4>
                    <Space size={4} wrap>
                      <Tag
                        color={warmColors.primary}
                        style={{
                          fontSize: '10px',
                          padding: '2px 6px',
                          border: 'none',
                        }}
                      >
                        {userDetails?.land_unit || 'Unspecified'}
                      </Tag>
                      {userDetails?.land_type && (
                        <Tag
                          color={warmColors.accent}
                          style={{
                            fontSize: '10px',
                            padding: '2px 6px',
                            border: 'none',
                          }}
                        >
                          {userDetails.land_type}
                        </Tag>
                      )}
                      {userDetails?.ownership_type && (
                        <Tag
                          color={warmColors.success}
                          style={{
                            fontSize: '10px',
                            padding: '2px 6px',
                            border: 'none',
                          }}
                        >
                          {userDetails.ownership_type}
                        </Tag>
                      )}
                      {userDetails?.land_area && (
                        <Tag
                          color={warmColors.warning}
                          style={{
                            fontSize: '10px',
                            padding: '2px 6px',
                            border: 'none',
                          }}
                        >
                          {userDetails.land_area} {userDetails.land_unit}
                        </Tag>
                      )}
                    </Space>
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: `${warmColors.primary}05`,
                    borderRadius: '8px',
                    padding: '12px',
                  }}
                >
                  {userDetails && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        marginBottom: '8px',
                      }}
                    >
                      <UserOutline
                        style={{
                          fontSize: '14px',
                          color: warmColors.primary,
                          marginRight: '8px',
                          marginTop: '2px',
                        }}
                      />
                      <div
                        style={{
                          fontSize: '12px',
                          color: warmColors.textSecondary,
                        }}
                      >
                        <span style={{ fontWeight: 500 }}>
                          {userDetails.name || 'Unknown User'}
                        </span>
                        {userDetails.father && (
                          <span style={{ marginLeft: '4px' }}>
                            (S/o {userDetails.father})
                          </span>
                        )}
                        {(userDetails.gotra ||
                          userDetails.gender ||
                          userDetails.age ||
                          userDetails.marital_status) && (
                          <div
                            style={{
                              fontSize: '11px',
                              color: warmColors.textSecondary,
                            }}
                          >
                            {userDetails.gotra && `Gotra: ${userDetails.gotra}`}
                            {userDetails.gotra &&
                              (userDetails.gender ||
                                userDetails.age ||
                                userDetails.marital_status) &&
                              ' • '}
                            {userDetails.gender && userDetails.gender}
                            {(userDetails.gender &&
                              (userDetails.age || userDetails.marital_status)) &&
                              ' • '}
                            {userDetails.age && `${userDetails.age} years`}
                            {(userDetails.age && userDetails.marital_status) &&
                              ' • '}
                            {userDetails.marital_status &&
                              userDetails.marital_status}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}