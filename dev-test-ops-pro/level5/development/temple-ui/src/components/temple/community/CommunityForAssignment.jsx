import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Toast, Card, Space, Tag, Grid } from 'antd-mobile';
import { fetchUnlinkedCommunities, linkCommunitiesToTemple } from '../../../services/temple';
import { CheckCircleFill, CloseCircleFill } from 'antd-mobile-icons';
import { getSingleTemple } from '../../../services/community';

export default function CommunityForAssignment({ templeId, onAssignmentSuccess }) {
  const [communities, setCommunities] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetchUnlinkedCommunities(templeId);
        setCommunities(response);
      } catch (error) {
        Toast.show({ icon: 'fail', content: 'Failed to load communities' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [templeId]);

  const handleAssignCommunity = async () => {
    try {
      setLoading(true);
      // Step 1: Assign the selected communities
      await linkCommunitiesToTemple(templeId, selectedIds);
      Toast.show({ icon: 'success', content: 'Communities assigned successfully' });
      
      // Step 2: Fetch the updated list of communities for this temple
      const updatedCommunities = await getSingleTemple(templeId);
      console.log("updatedCommunities", updatedCommunities?.data?.attributes?.communities?.data);
      // Step 3: Pass the updated list to the parent component
      onAssignmentSuccess(updatedCommunities);
      
      // Step 4: Clear selection and refresh unlinked communities
      setSelectedIds([]);
      const refreshedUnlinkedCommunities = await fetchUnlinkedCommunities(templeId);
      setCommunities(refreshedUnlinkedCommunities);
      
    } catch (error) {
      Toast.show({ icon: 'fail', content: 'Failed to assign communities' });
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  return(
    <div className="menu-container">
    <Grid columns={3} gap={8}>
      {communities.map((community, index) => (
        <Grid.Item key={index}>
          <div
            className="menu-item"

          >
             <Checkbox
                  checked={selectedIds.includes(community.id)}
                  onChange={(checked) => toggleSelection(community.id)}
                  onClick={(e) => e.stopPropagation()}
                />
            <div className="icon-container">
              <span className="emoji-icon">{community.icon}</span>
            </div>
            <div className="menu-name">{community.name}</div>
          </div>
        </Grid.Item>
      ))}
    </Grid>
    <Button
        block
        color="primary"
        size='large'
        style={{ marginTop: 24 }}
        disabled={selectedIds.length === 0}
        loading={loading}
        onClick={handleAssignCommunity}
      >
        Assign {selectedIds.length > 0 ? `(${selectedIds.length})` : ''} Communities
      </Button>
  </div>
  )
}