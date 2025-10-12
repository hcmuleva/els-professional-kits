import { Grid, Toast } from 'antd-mobile';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchTempleCommunities } from '../../../services/temple';

export default function CommunityList({ templeId }) {
  
  const navigate = useNavigate()
  const [communities, setCommunities] = useState([]);
  const fetchTempleCommunitiesList = async (id) => {
    try {
      const response = await fetchTempleCommunities(id);
      setCommunities(response?.data?.attributes?.communities?.data||[]); // make sure response is an array of communities

    } catch (error) {
      Toast.show({ icon: 'fail', content: 'Failed to load communities' });
    }
  };
  useEffect(() => {
    if (templeId) {
      fetchTempleCommunitiesList(templeId);
    }
  }, [templeId]);
  return (
  <div className="menu-container">

  <Grid columns={3} gap={8}>
    {communities.map((community, index) => (
      <Grid.Item key={index}>
        <div
          className="menu-item"
          onClick={() => navigate(`/temple/${templeId}/community/${community.id}`)}
          role="button"
        >
          <div className="icon-container">
            <span className="emoji-icon">{community?.attributes?.icon}</span>
          </div>
          <div className="menu-name">{community?.attributes?.name}</div>
        </div>
      </Grid.Item>
    ))}
  </Grid>
</div>
  )

}
