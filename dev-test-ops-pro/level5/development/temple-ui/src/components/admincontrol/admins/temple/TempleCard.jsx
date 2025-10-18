import {
  CloseOutlined,
  EditOutlined,
  EnvironmentOutlined,
  FullscreenExitOutlined,
  SaveOutlined
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Col,
  Input, Modal,
  Row,
  Space,
  Spin,
  Typography,
  message
} from 'antd';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';

import { Divider } from 'antd-mobile';
import { updateAddress } from '../../../../services/address';
import { getSingleTemple } from '../../../../services/community';
import { updateTempleImage } from '../../../../services/temple';
import ImageUploaderSingle from '../../../fileupload/ImageUploaderSingle';

const { Title, Text } = Typography;
const DEFAULT_IMAGE = 'https://via.placeholder.com/120?text=Temple';

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

function ResizeMapOnShow({ show }) {
  const map = useMap();

  useEffect(() => {
    if (show && map) {
      setTimeout(() => {
        map.invalidateSize();
      }, 500);
    }
  }, [show]);

  return null;
}

export default function TempleCard({ id }) {
  const [temple, setTemple] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageList, setImageList] = useState([]);
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({});
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  const fetchTemple = async () => {
    try {
      setLoading(true);
      const response = await getSingleTemple(id);
      setTemple(response.data);
      const imageData = response?.data?.attributes?.images?.data;
      if (imageData) {
        setImageList([{
          uid: imageData.id,
          name: imageData.attributes.name,
          url: imageData.attributes.url,
        }]);
      } else {
        setImageList([]);
      }
    } catch (err) {
      console.error('Failed to load temple', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemple();
  }, [id]);

  const handleImageUploadSuccess = async (newImage) => {
    if (!newImage?.id) return;
    try {
      await updateTempleImage(id, newImage.id);
      await fetchTemple();
      setIsEditingImage(false);
    } catch (err) {
      console.error('Image update failed', err);
    }
  };

  const handleImageRemove = () => setImageList([]);

  const handleAddressChange = (field, value) => {
    setAddressForm(prev => ({ ...prev, [field]: value }));
  };

  const autofillCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        setAddressForm(prev => ({ ...prev, latitude, longitude }));
      },
      err => {
        message.error("Failed to get location.");
        console.error("Geolocation error:", err);
      }
    );
  };

  const handleSaveAddress = async () => {
    try {
      const cleanedForm = {
        ...addressForm,
        pincode: Number(addressForm.pincode) || null,
        latitude: addressForm.latitude ? Number(addressForm.latitude) : null,
        longitude: addressForm.longitude ? Number(addressForm.longitude) : null,
      };
      await updateAddress(addressForm.id, cleanedForm);
      message.success('Address updated');
      setIsEditingAddress(false);
      fetchTemple();
    } catch (err) {
      console.error('Failed to update address', err);
      message.error('Failed to update address');
    }
  };

  if (loading || !temple) return <Spin tip="Loading Temple..." />;

  const { title, subtitle, images, address } = temple.attributes;
  const avatarUrl = images?.data?.[0]?.attributes?.url || DEFAULT_IMAGE;
  const addr = address?.data?.attributes || {};

  const formatAddress = () => {
    return [
      addr.housename, addr.landmark, addr.village, addr.tehsil,
      addr.district, addr.state, addr.country
    ].filter(Boolean).join(', ') || 'No address available';
  };

  return (
    <>
      <Card title={title} extra={<Button onClick={() => setIsEditingAddress(true)} icon={<EditOutlined />} />}>        
        <Row gutter={12}>
          <Col span={8}>
            {!isEditingImage ? (
              <div style={{ textAlign: 'center' }}>
                <Avatar size={100} src={avatarUrl} />
                <div>
                  <Button size="small" onClick={() => setIsEditingImage(true)}>Edit Photo</Button>
                </div>
              </div>
            ) : (
              <ImageUploaderSingle
                value={imageList}
                onChange={setImageList}
                onUploadSuccess={handleImageUploadSuccess}
                onRemove={handleImageRemove}
              />
            )}
          </Col>

          <Col span={16}>
            <div onClick={() => setIsMapModalOpen(true)} style={{ height: 120, cursor: 'pointer' }}>
              {addr.latitude && addr.longitude ? (
                <MapContainer
                  center={[addr.latitude, addr.longitude]}
                  zoom={15}
                  style={{ height: '100%', width: '100%' }}
                  zoomControl={false}
                  scrollWheelZoom={false}
                  dragging={false}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={[addr.latitude, addr.longitude]} />
                </MapContainer>
              ) : (
                <Text>No coordinates available</Text>
              )}
            </div>
          </Col>
        </Row>

        <Divider />
        {!isEditingAddress ? (
          <Space direction="vertical">
            <Text><EnvironmentOutlined /> {formatAddress()}</Text>
            {addr.pincode && <Text>PIN: {addr.pincode}</Text>}
          </Space>
        ) : (
          <Row gutter={8}>
            {["housename", "landmark", "village", "tehsil", "district", "state", "country", "pincode", "latitude", "longitude"].map(field => (
              <Col span={12} key={field}>
                <Input
                  placeholder={field}
                  value={addressForm[field] || ''}
                  onChange={e => handleAddressChange(field, e.target.value)}
                />
              </Col>
            ))}
            <Col span={24}>
              <Space>
                <Button onClick={autofillCoordinates}>Use My Location</Button>
                <Button type="primary" onClick={handleSaveAddress} icon={<SaveOutlined />}>Save</Button>
                <Button onClick={() => setIsEditingAddress(false)} icon={<CloseOutlined />}>Cancel</Button>
              </Space>
            </Col>
          </Row>
        )}
      </Card>

      <Modal
        title={<><EnvironmentOutlined /> {title} - Location</>}
        open={isMapModalOpen}
        onCancel={() => setIsMapModalOpen(false)}
        footer={null}
        width="90vw"
        style={{ top: 20 }}
        bodyStyle={{ padding: 0, height: '80vh' }}
        closeIcon={<FullscreenExitOutlined />}
      >
        {addr.latitude && addr.longitude && (
          <MapContainer
            center={[addr.latitude, addr.longitude]}
            zoom={16}
            style={{ height: '80vh', width: '100%' }}
          >
            <ResizeMapOnShow show={isMapModalOpen} />
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[addr.latitude, addr.longitude]}>
              <Popup>
                <strong>{title}</strong><br />
                <Text>{formatAddress()}</Text><br />
                {addr.pincode && <Text type="secondary">PIN: {addr.pincode}</Text>}
              </Popup>
            </Marker>
          </MapContainer>
        )}
      </Modal>
    </>
  );
}
