import { Button, Avatar } from 'antd-mobile'
import { AddOutline } from 'antd-mobile-icons'
import { useNavigate } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../contexts/AuthContext'

const SelectAccountPage = ({ isRegister, setIsRegister }) => {
  const navigate = useNavigate()
  const { profiles, user } = useContext(AuthContext)
  const [currentProfileId, setCurrentProfileId] = useState(null)
  const authcontext = useContext(AuthContext)

  console.log(user)

  // console.log(profiles, "PROFIES")

  // Function to select an account
  const handleSelectAccount = (userId, userData) => {
    setCurrentProfileId(userId)

    authcontext.selectProfile(userId, userData, currentProfileId)
    // navigate('/') 
  }

  // Function to handle adding a new account
  const handleAddAccount = () => {
    setIsRegister(!isRegister)
  }

  // UseEffect to update the current profile when profiles change
  useEffect(() => {
    if (profiles && Object.keys(profiles).length > 0) {
      // Set first profile as default
      const firstProfileId = Object.keys(profiles)[0]
      setCurrentProfileId(firstProfileId)
    }
  }, [profiles])

  // Function to get initials from username or name
  const getInitials = (profile) => {
    if (profile.user.first_name && profile.user.last_name) {
      return (profile.user.first_name[0] + profile.user.last_name[0]).toUpperCase();
    }

    if (profile.user.username) {
      return profile.user.username.substring(0, 2).toUpperCase();
    }

    return '?';
  }

  // Function to get display name
  const getDisplayName = (profile) => {
    if (profile.user.first_name && profile.user.last_name) {
      return `${profile.user.first_name} ${profile.user.last_name}`;
    }

    return profile.user.username || profile.user.email.split('@')[0];
  }

  return (
    <div style={{
      background: '#fff',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <h2 style={{
        color: '#fa541c',
        fontSize: '24px',
        marginBottom: '10px',
        textAlign: 'center'
      }}>
        Select Profile
      </h2>

      {/* Horizontal scrollable profile bar */}
      <div style={{
        width: '100%',
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        padding: '10px 0',
      }}>
        <div style={{
          display: 'inline-flex',
          paddingLeft: '10px',
          paddingRight: '20px'
        }}>
          {/* Add Account Button - First Item */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginRight: '20px'
          }}>
            <Button
              style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                backgroundColor: '#f5f5f5',
                border: '2px dashed #fa541c',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '0',
                marginBottom: '8px'
              }}
              onClick={handleAddAccount}
            >
              <AddOutline style={{ fontSize: '30px', color: '#fa541c' }} />
            </Button>
            <span style={{ fontSize: '14px', color: '#666' }}>Add New</span>
          </div>

          {/* Profile Circles */}
          {profiles && Object.keys(profiles).length > 0 ? (
            Object.entries(profiles).map(([profileId, profileData]) => (
              <div
                key={profileId}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginRight: '20px',
                  cursor: 'pointer',
                }}
                onClick={() => handleSelectAccount(profileId, profileData)}
              >
                <Avatar
                  style={{
                    width: '70px',
                    height: '70px',
                    fontSize: '24px',
                    backgroundColor: currentProfileId === profileId ? '#fa541c' : '#ffb996',
                    border: currentProfileId === profileId ? '3px solid #fa541c' : 'none',
                    color: '#fff',
                    marginBottom: '8px',
                  }}
                >
                  {getInitials(profileData)}
                </Avatar>
                <span
                  style={{
                    fontSize: '14px',
                    color: currentProfileId === profileId ? '#fa541c' : '#666',
                    fontWeight: currentProfileId === profileId ? 'bold' : 'normal',
                    maxWidth: '80px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {getDisplayName(profileData)}
                </span>
              </div>
            ))
          ) : (
            <div style={{ padding: '20px', color: '#666' }}>
              No profiles available. Please add an account.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SelectAccountPage