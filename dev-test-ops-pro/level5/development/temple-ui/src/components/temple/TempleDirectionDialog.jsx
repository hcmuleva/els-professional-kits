import React, { useState } from 'react';
import { Modal, Button, Typography, Spin } from 'antd';
const { Text } = Typography;

const TempleDirectionDialog = ({ open, onClose, templeLat, templeLng }) => {
  const [userCoords, setUserCoords] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getUserLocation = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setError('');
        setLoading(false);
      },
      (err) => {
        setError('Failed to get your location. Please allow location access.');
        setLoading(false);
      }
    );
  };

  const openInGoogleMaps = () => {
    if (!userCoords) return;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${userCoords.lat},${userCoords.lng}&destination=${templeLat},${templeLng}&travelmode=driving`;
    window.open(url, '_blank');
  };

  return (
    <Modal
      title="Temple Directions"
      open={open}
      onCancel={onClose}
      footer={null}
    >
      <div style={{ textAlign: 'center' }}>
        {!userCoords && !loading && (
          <Button type="primary" onClick={getUserLocation}>
            Get My Location & Show Path
          </Button>
        )}

        {loading && <Spin tip="Getting your location..." />}

        {userCoords && (
          <div>
            <Text>Your location: {userCoords.lat.toFixed(4)}, {userCoords.lng.toFixed(4)}</Text>
            <br />
            <Button
              type="primary"
              onClick={openInGoogleMaps}
              style={{ marginTop: 16 }}
            >
              Open Path in Google Maps
            </Button>
          </div>
        )}

        {error && <Text type="danger">{error}</Text>}
      </div>
    </Modal>
  );
};

export default TempleDirectionDialog;
