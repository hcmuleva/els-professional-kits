import React from 'react';
import { Button } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';
const REACT_APP_GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
const LocationTile = ({ lat, lng, address }) => {
  const handleGetDirections = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude: userLat, longitude: userLng } = position.coords;
        window.open(
          `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${lat},${lng}&travelmode=driving`
        );
      });
    } else {
      window.open(`https://www.google.com/maps?q=${lat},${lng}`);
    }
  };

  return (
    <div style={{ 
      marginTop: 16,
      border: '1px solid #e8e8e8',
      borderRadius: 8,
      overflow: 'hidden'
    }}>
      {/* Map Preview (using Google Maps static image) */}
      <div style={{ height: 150, position: 'relative' }}>
        <img
          src={`https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&size=600x300&maptype=roadmap&markers=color:red%7C${lat},${lng}&key=${REACT_APP_GOOGLE_API_KEY}`}
          alt="Location map"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Address and Directions Button */}
      <div style={{ padding: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontWeight: 500 }}>{address}</div>
          <div style={{ color: '#666', fontSize: 12 }}>Lat: {lat}, Lng: {lng}</div>
        </div>
        <Button 
          type="primary" 
          icon={<EnvironmentOutlined />}
          onClick={handleGetDirections}
        >
          Get Directions
        </Button>
      </div>
    </div>
  );
};

// Usage in your component:
// <LocationTile lat={yourLatitude} lng={yourLongitude} address={yourAddress} />
export default LocationTile;