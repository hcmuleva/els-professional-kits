import { ImageUploader, Toast } from 'antd-mobile';
import React from 'react';
import { uploadImage } from '../../services/community';

const ImageUploaderSingle = ({ value = [], onChange, onUploadSuccess, onRemove }) => {
  const MAX_IMAGES = 1;

  const beforeUpload = (file) => {
    const isImage = file.type?.startsWith('image/');
    if (!isImage) {
      Toast.show('Only image files allowed!');
      return null;
    }

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      Toast.show('Image must be smaller than 2MB!');
      return null;
    }

    return Promise.resolve(file); // IMPORTANT: return File wrapped in Promise!
  };

  const handleUpload = async (file) => {
    try {
      // SAFETY CHECK
      if (!(file instanceof File)) {
        throw new Error('Invalid file type');
      }

      const formData = new FormData();
      formData.append('files', file);

      const response = await uploadImage(formData); // your Strapi API
      const uploadedFile = response?.[0];

      if (!uploadedFile?.url) {
        throw new Error('Upload returned empty');
      }

      const uploadedImage = {
        url: uploadedFile.url,
        name: uploadedFile.name,
        id: uploadedFile.id,
      };

      const updatedList = [uploadedImage];
      onChange?.(updatedList);
      onUploadSuccess?.(uploadedImage);
      return uploadedImage;
    } catch (err) {
      Toast.show('Upload failed');
      console.error('Upload error:', err);
      return null;
    }
  };

  const handleChange = (newList) => {
    onChange?.(newList);
    if (newList.length === 0) onRemove?.();
  };

  return (
    <ImageUploader
      value={value}
      onChange={handleChange}
      upload={handleUpload}
      beforeUpload={beforeUpload}
      maxCount={MAX_IMAGES}
      showUpload={value.length < MAX_IMAGES}
      style={{ '--cell-size': '80px', margin: '10px' }}
    />
  );
};

export default ImageUploaderSingle;
