import React, { useState } from 'react';
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { AuthContext, useAuth } from '../../contexts/AuthContext';

const ProfilePhotoUpload = ({ onUploadSuccess, disabled }) => {
  const { jwt } = useAuth(AuthContext);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState([]);
  const [uploading, setUpUploading] = useState(false);

  const beforeUpload = (file) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const isImage = validTypes.includes(file.type);
    const isLt5M = file.size / 1024 / 1024 < 5;

    if (!isImage) {
      message.error('You can only upload JPG/PNG/WEBP images!');
      return Upload.LIST_IGNORE;
    }

    if (!isLt5M) {
      message.error('Image must be smaller than 5MB!');
      return Upload.LIST_IGNORE;
    }

    return true;
  };

  const handleUpload = async (options) => {
    const { file, onSuccess, onError } = options;
    setUpUploading(true);
    const formData = new FormData();
    formData.append('files', file);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        body: formData,
      });
      
      const uploadedFile = (await response.json())[0];
      
      setFileList([{
        uid: file.uid,
        name: file.name,
        status: 'done',
        url: uploadedFile.url,
      }]);

      // Notify parent component with both ID and URL
      if (onUploadSuccess) {
        onUploadSuccess(uploadedFile.id, uploadedFile.url);
      }

      onSuccess(uploadedFile);
      message.success('Upload successful');
    } catch (error) {
      console.error('Upload failed:', error);
      message.error('Upload failed');
      onError(error);
    } finally {
      setUpUploading(false);
    }
  };

  const handlePreview = (file) => {
    setPreviewImage(file.url || file.thumbUrl);
    setPreviewVisible(true);
  };

  const handleCancel = () => setPreviewVisible(false);

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <>
      <Upload
        accept="image/jpeg,image/png,image/webp"
        listType="picture-card"
        fileList={fileList}
        beforeUpload={beforeUpload}
        customRequest={handleUpload}
        onPreview={handlePreview}
        disabled={disabled || uploading}
        maxCount={1}
      >
        {fileList.length >= 1 ? null : uploadButton}
      </Upload>

      <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
        <img alt="preview" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
};

export default ProfilePhotoUpload;