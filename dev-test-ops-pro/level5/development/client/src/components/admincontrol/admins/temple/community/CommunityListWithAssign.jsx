import React, { useState, useEffect } from 'react';
import { getAssginedCommunityToTemple, getAssignedUnAssginedSubcategories, updateTempleSubcategories } from '../../../../../services/community';
import { Grid, Popup, Toast } from 'antd-mobile';
import { Transfer, Spin, Button } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { Row, Col, Card, Typography } from 'antd';
const { Title } = Typography;

const gridStyle = {
    padding: '12px',
  };
  
  const cardStyle = {
    textAlign: 'center',
    borderRadius: 12,
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  };
  
  const cardContentStyle = {
    padding: 16,
  };
  
  const iconContainerStyle = {
    width: 50,
    height: 50,
    margin: '0 auto 12px',
    fontSize: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    backgroundColor: '#f5f5f5',
  };
  
  const cardTitleStyle = {
    fontSize: 16,
    marginBottom: 4,
  };
  
  const cardSubtitleStyle = {
    fontSize: 12,
    color: '#888',
  };
export default function CommunityListWithAssign() {
  const {id} = useParams();
  const [loading, setLoading] = useState(true);
  const [communityData, setCommunityData] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [transferData, setTransferData] = useState([]);
  const [targetKeys, setTargetKeys] = useState([]);
  const [transferLoading, setTransferLoading] = useState(false);

  const navigate = useNavigate();

  const fetchAssignedCommunities = async () => {
    setLoading(true);
    try {
      const response = await getAssginedCommunityToTemple({ id });
      setCommunityData(response?.assigned || []);
    } catch (err) {
      console.error('Error fetching assigned communities', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAssignedCommunities();
  }, [id]);

  const handleAssignClick = async () => {
    setOpenPopup(true);
    setTransferLoading(true);
    try {
      const response = await getAssignedUnAssginedSubcategories({ id });
      const assigned = response?.assigned || [];
      const unassigned = response?.unassigned || [];

      const combined = [...assigned, ...unassigned].map((item) => ({
        key: item.id.toString(),
        title: item.name,
      }));

      setTransferData(combined);
      setTargetKeys(assigned.map((item) => item.id.toString()));
    } catch (err) {
      console.error('Error loading transfer data', err);
    }
    setTransferLoading(false);
  };

  const handleAssignSave = async () => {
    try {
      await updateTempleSubcategories({
        id,
        subcategoryIds: targetKeys,
      });
      setOpenPopup(false);
      Toast.show({ content: 'Communities updated', duration: 1000 });
      fetchAssignedCommunities(); // refresh
    } catch (err) {
      console.error('Error saving assignments', err);
    }
  };

  return (
    <>
      <h1>Community List</h1>
      <Button onClick={handleAssignClick} style={{ marginBottom: 16 }}>
        Assign Communities
      </Button>
    <Row gutter={[16, 16]} style={gridStyle}>
      {communityData.map((item, index) => (
        <Col xs={8} sm={8} md={6} lg={4} key={index}>
          <Card
            style={cardStyle}
            hoverable
            bordered={false}
            bodyStyle={{ padding: 0 }}
            onClick={() => navigate(`/temple/${id}/subcategory/${item.id}`)}
          >
            <div style={cardContentStyle}>
              <div style={iconContainerStyle}>
                <span role="img" aria-label="icon" style={{ fontSize: 28 }}>
                  {item.icon}
                </span>
              </div>
              <Title level={5} style={cardTitleStyle}>
                {item.name}
              </Title>
              <p style={cardSubtitleStyle}>Click to explore</p>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
      <Popup
        visible={openPopup}
        onMaskClick={() => setOpenPopup(false)}
        position="bottom"
        bodyStyle={{ height: '95vh', padding: 16, overflowY: 'scroll' }}
      >
        <h2>Assign Communities</h2>
        {transferLoading ? (
          <Spin />
        ) : (
          <>
            <div style={{ width: '100%', overflowX: 'auto' }}>
              <Transfer
                dataSource={transferData}
                targetKeys={targetKeys}
                onChange={setTargetKeys}
                showSearch
                filterOption={(inputValue, item) =>
                  item.title.toLowerCase().includes(inputValue.toLowerCase())
                }
                render={(item) => item.title}
                listStyle={{
                  width: 160,
                  height: 400,
                }}
                titles={['Unassigned', 'Assigned']}
              />
            </div>

            <div style={{ marginTop: 16, textAlign: 'right' }}>
              <Button onClick={() => setOpenPopup(false)} style={{ marginRight: 8 }}>
                Cancel
              </Button>
              <Button color="primary" onClick={handleAssignSave}>
                Save
              </Button>
            </div>
          </>
        )}
      </Popup>
    </>
  );
}
