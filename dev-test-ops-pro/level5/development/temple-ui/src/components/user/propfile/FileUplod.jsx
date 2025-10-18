import React, { useState, useCallback } from 'react';
import { ImageUploader, Button, Toast, ProgressCircle } from 'antd-mobile';
import { UploadOutline } from 'antd-mobile-icons';
//import { auth } from '../../services/api'; // Your API service
import { uploadImage } from '../../../services/community';

const FileUpload = ({ userId, currentImage, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Handle file upload to Strapi with S3
  const uploadFile = useCallback(async (file) => {
    setUploading(true);
    setProgress(0);
    
    try {
      // 1. Upload the file to Strapi
      const formData = new FormData();
        formData.append('files', file);
        const response =uploadImage(formData)
        console.log("uploadImage =>response",response)
        
    //   const uploadResponse = await api.post('/upload', formData, {
    //     onUploadProgress: (progressEvent) => {
    //       const percentCompleted = Math.round(
    //         (progressEvent.loaded * 100) / progressEvent.total
    //       );
    //       setProgress(percentCompleted);
    //     }
    //   });

      const uploadedFileId = response.data[0].id;
      console.log("uplOadedFileId",uploadedFileId)
    //   // 2. Update user profile with the new file ID
    //   await api.put(`/users/${userId}`, {
    //     profilePicture: uploadedFileId
    //   });

      Toast.show({
        icon: 'success',
        content: 'Profile picture updated successfully'
      });

      // 3. Notify parent component
      if (onUploadSuccess) {
        onUploadSuccess(uploadedFileId);
      }

      return uploadedFileId;
    } catch (error) {
      console.error('Upload failed:', error);
      Toast.show({
        icon: 'fail',
        content: 'Failed to upload profile picture'
      });
      throw error;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }, [userId, onUploadSuccess]);

  // Handle file selection
  const beforeUpload = (file) => {
    // Validate file type
    const isImage = ['image/jpeg', 'image/png', 'image/gif'].includes(file.type);
    if (!isImage) {
      Toast.show('You can only upload JPG/PNG/GIF files!');
      return null;
    }

    // Validate file size (5MB max)
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      Toast.show('Image must be smaller than 5MB!');
      return null;
    }

    return file;
  };

  const onChange = async (files) => {
    if (files.length > 0) {
      const selectedFile = files[0];
      const validFile = beforeUpload(selectedFile.file);
      if (validFile) {
        setFile(selectedFile);
        await uploadFile(validFile);
      }
    }
  };

  // Get image URL (handles both local and S3 files)
  const getImageUrl = () => {
    if (file) {
      return file.url;
    }
    if (currentImage) {
      // If currentImage is an object (Strapi format)
      if (typeof currentImage === 'object') {
        return currentImage.url;
      }
      // If currentImage is just an ID
      return `${process.env.REACT_APP_API_URL}/uploads/${currentImage}`;
    }
    return null;
  };

  return (
    <div style={{ padding: 16 }}>
      <ImageUploader
        value={file ? [file] : []}
        onChange={onChange}
        maxCount={1}
        beforeUpload={beforeUpload}
        upload={uploadFile}
        disabled={uploading}
        style={{
          '--cell-size': '150px',
          '--border-color': '#eee',
          '--border-radius': '50%',
          '--background-color': '#f5f5f5'
        }}
        preview={getImageUrl() && (
          <div style={{
            position: 'relative',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            overflow: 'hidden'
          }}>
            <img
              src={getImageUrl()}
              alt="Profile preview"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
            {uploading && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <ProgressCircle
                  percent={progress}
                  style={{
                    '--size': '60px',
                    '--track-width': '4px'
                  }}
                >
                  {progress}%
                </ProgressCircle>
              </div>
            )}
          </div>
        )}
      >
        <div style={{
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          backgroundColor: '#f5f5f5',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#999',
          fontSize: 14
        }}>
          <UploadOutline style={{ fontSize: 24, marginBottom: 8 }} />
          <span>Upload Photo</span>
        </div>
      </ImageUploader>
      
      {getImageUrl() && !uploading && (
        <Button
          color="primary"
          size="small"
          style={{ marginTop: 12 }}
          onClick={() => setFile(null)}
        >
          Remove Photo
        </Button>
      )}
    </div>
  );
};

export default FileUpload;