"use client";

import {
  Form,
  ImageUploader,
  Toast,
  Dialog,
  Button,
  Space,
  Popup,
} from "antd-mobile";
import {
  UploadOutline,
  CameraOutline,
  CheckOutline,
  CloseOutline,
} from "antd-mobile-icons";
import { useState, useRef, useCallback } from "react";
import { AuthContext, useAuth } from "../../contexts/AuthContext";
import { uploadImage } from "../../services/user";

const MAX_IMAGES = 1;
const MAX_FILE_SIZE_MB = 10;

const ProfilePhotoUpload = ({ setFileId, setAvatar, onSuccess, disabled }) => {
  const { jwt } = useAuth(AuthContext);
  const [photoFileList, setPhotoFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const fileInputRef = useRef(null);

  // Cropping state
  const [cropData, setCropData] = useState({
    startX: 0,
    startY: 0,
    width: 0,
    height: 0,
    isDragging: false,
  });

  // Warm color palette
  const styles = {
    container: {
      background: "#f5e7db",
      borderRadius: "12px",
      padding: "20px",
      border: "1px solid #fed7aa",
      textAlign: "center",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      transition: "all 0.3s ease",
      width: "100%",
      maxWidth: "400px", // Fixed max width for consistency
      margin: "0 auto",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    uploaderWrapper: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "16px",
      width: "100%",
    },
    uploadIcon: {
      fontSize: "40px",
      color: "#9a3412",
      marginBottom: "8px",
    },
    uploadText: {
      fontSize: "16px",
      fontWeight: "600",
      color: "#7c2d12",
      marginBottom: "4px",
    },
    uploadSubtext: {
      fontSize: "13px",
      color: "#6b7280",
      lineHeight: "1.5",
    },
    uploadButton: {
      background: "#f97316",
      color: "#ffffff",
      border: "none",
      borderRadius: "8px",
      padding: "12px 20px",
      fontSize: "14px",
      fontWeight: "600",
      minHeight: "44px",
      width: "100%",
      maxWidth: "200px",
    },
    cameraButton: {
      background: "#059669",
      color: "#ffffff",
      border: "none",
      borderRadius: "8px",
      padding: "12px 20px",
      fontSize: "14px",
      fontWeight: "600",
      minHeight: "44px",
      width: "100%",
      maxWidth: "200px",
    },
    progressContainer: {
      background: "#fff7ed",
      borderRadius: "8px",
      padding: "16px",
      textAlign: "center",
      border: "1px solid #fed7aa",
      width: "100%",
      maxWidth: "300px",
    },
    progressText: {
      color: "#7c2d12",
      fontSize: "14px",
      fontWeight: "600",
      marginBottom: "12px",
    },
    successContainer: {
      background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
      borderRadius: "8px",
      padding: "16px",
      color: "#ffffff",
      textAlign: "center",
      width: "100%",
      maxWidth: "300px",
    },
    successIcon: {
      fontSize: "28px",
      marginBottom: "8px",
    },
    successText: {
      fontSize: "14px",
      fontWeight: "600",
    },
    previewImage: {
      width: "80px",
      height: "80px",
      borderRadius: "50%",
      objectFit: "cover",
      border: "3px solid #f97316",
    },
    removeButton: {
      background: "#b91c1c",
      color: "#ffffff",
      border: "none",
      borderRadius: "8px",
      padding: "8px 16px",
      fontSize: "12px",
      fontWeight: "600",
      marginTop: "8px",
      minHeight: "36px",
    },
    formItem: {
      marginBottom: "0",
      width: "100%",
    },
    formLabel: {
      color: "#7c2d12",
      fontSize: "16px",
      fontWeight: "600",
      marginBottom: "12px",
      display: "block",
      textAlign: "center",
    },
    cropperPopup: {
      "--z-index": "9999",
      width: "100%",
      maxWidth: "400px",
      margin: "0 auto",
    },
    cropperContainer: {
      padding: "20px",
      background: "#ffffff",
      minHeight: "80vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "100%",
      boxSizing: "border-box",
    },
    cropperHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px",
      paddingBottom: "12px",
      borderBottom: "1px solid #e5e7eb",
      width: "100%",
    },
    cropperTitle: {
      fontSize: "18px",
      fontWeight: "600",
      color: "#1f2937",
    },
    imageContainer: {
      flex: 1,
      position: "relative",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#f9fafb",
      borderRadius: "8px",
      width: "100%",
      maxWidth: "300px", // Fixed width for image container
      maxHeight: "300px", // Fixed height for image container
      aspectRatio: "1 / 1", // Ensure square container
      overflow: "hidden", // Prevent overflow
    },
    cropperImage: {
      maxWidth: "100%",
      maxHeight: "100%",
      width: "100%", // Force image to fit container
      height: "100%", // Force image to fit container
      objectFit: "contain", // Maintain aspect ratio
      userSelect: "none",
      touchAction: "none",
    },
    cropOverlay: {
      position: "absolute",
      border: "2px solid #f97316",
      background: "rgba(249, 115, 22, 0.1)",
      borderRadius: "50%",
      cursor: "move",
      touchAction: "none",
      width: "150px", // Fixed crop size
      height: "150px", // Fixed crop size
      maxWidth: "100%", // Prevent overflow
      maxHeight: "100%", // Prevent overflow
    },
    cropperActions: {
      display: "flex",
      gap: "12px",
      justifyContent: "center",
      width: "100%",
      maxWidth: "300px",
    },
    cropButton: {
      background: "#f97316",
      color: "#ffffff",
      border: "none",
      borderRadius: "8px",
      padding: "12px 24px",
      fontSize: "14px",
      fontWeight: "600",
      minHeight: "44px",
      flex: 1,
      maxWidth: "120px",
    },
    cancelButton: {
      background: "#6b7280",
      color: "#ffffff",
      border: "none",
      borderRadius: "8px",
      padding: "12px 24px",
      fontSize: "14px",
      fontWeight: "600",
      minHeight: "44px",
      flex: 1,
      maxWidth: "120px",
    },
    hiddenInput: {
      position: "absolute",
      left: "-9999px",
      opacity: 0,
      pointerEvents: "none",
    },
  };

  const beforeUpload = (file) => {
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    const isImage = validTypes.includes(file.type.toLowerCase());
    const isLt10M = file.size / 1024 / 1024 < MAX_FILE_SIZE_MB;

    if (!isImage) {
      Toast.show({
        icon: "fail",
        content: "Please upload JPG, PNG, or WEBP images only!",
        position: "center",
      });
      return null;
    }

    if (!isLt10M) {
      Toast.show({
        icon: "fail",
        content: `Image size must be less than ${MAX_FILE_SIZE_MB}MB!`,
        position: "center",
      });
      return null;
    }

    return file;
  };

  const handleFileSelect = (file) => {
    if (!beforeUpload(file)) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage({
        src: e.target.result,
        file: file,
        name: file.name,
      });
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  };

  const handleGalleryClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleCameraClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute("capture", "camera");
      fileInputRef.current.click();
    }
  };

  const dataURLtoBlob = (dataurl) => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  const cropImage = useCallback(() => {
    if (!selectedImage || !imageRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = imageRef.current;

    // Set canvas size to desired output size
    const outputSize = 400;
    canvas.width = outputSize;
    canvas.height = outputSize;

    // Calculate crop dimensions relative to actual image size
    const imgRect = img.getBoundingClientRect();
    const containerRect = img.parentElement.getBoundingClientRect();

    const scaleX = img.naturalWidth / imgRect.width;
    const scaleY = img.naturalHeight / imgRect.height;

    const cropSize = Math.min(cropData.width || 150, cropData.height || 150);
    const cropX = (cropData.startX || (imgRect.width - cropSize) / 2) * scaleX;
    const cropY = (cropData.startY || (imgRect.height - cropSize) / 2) * scaleY;
    const cropWidth = cropSize * scaleX;
    const cropHeight = cropSize * scaleY;

    // Draw cropped image
    ctx.drawImage(
      img,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      outputSize,
      outputSize
    );

    // Convert to blob
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const croppedFile = new File([blob], selectedImage.name, {
            type: "image/jpeg",
            lastModified: Date.now(),
          });

          setCroppedImage({
            file: croppedFile,
            url: canvas.toDataURL("image/jpeg", 0.9),
          });

          setShowCropper(false);
          handleUpload(croppedFile);
        }
      },
      "image/jpeg",
      0.9
    );
  }, [selectedImage, cropData]);

  const handleUpload = async (file) => {
    setUploading(true);
    const uploadData = new FormData();
    uploadData.append("files", file);

    try {
      const loadingToast = Toast.show({
        icon: "loading",
        content: "Uploading photo...",
        duration: 0,
        position: "center",
      });

      const response = await uploadImage(uploadData, jwt);
      const uploadedFile = response[0];
      loadingToast.close();

      setAvatar(uploadedFile.url);
      const uploadedImage = {
        url: uploadedFile.url,
        file,
        id: uploadedFile.id,
      };
      setPhotoFileList([uploadedImage]);
      setFileId(uploadedFile.id);

      if (onSuccess) {
        onSuccess(uploadedFile.id, uploadedFile.url);
      }

      Toast.show({
        icon: "success",
        content: "Profile photo uploaded successfully!",
        position: "center",
      });

      return uploadedImage;
    } catch (error) {
      console.error("Upload failed:", error);
      Toast.show({
        icon: "fail",
        content: error.message || "Upload failed. Please try again.",
        position: "center",
      });
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const onPreview = (file) => {
    Dialog.alert({
      title: "Profile Photo Preview",
      content: (
        <div style={{ textAlign: "center", padding: "16px 0" }}>
          <img
            src={file.url}
            style={{
              ...styles.previewImage,
              width: "120px",
              height: "120px",
            }}
            alt="Profile Preview"
          />
          <p style={{ marginTop: "16px", color: "#6b7280", fontSize: "14px" }}>
            This is how your profile photo will appear
          </p>
        </div>
      ),
      confirmText: "Got it",
    });
  };

  const handleRemovePhoto = () => {
    Dialog.confirm({
      title: "Remove Photo",
      content: "Are you sure you want to remove this photo?",
      confirmText: "Remove",
      cancelText: "Cancel",
      onConfirm: () => {
        setPhotoFileList([]);
        setAvatar(null);
        setFileId(null);
        setCroppedImage(null);
        setSelectedImage(null);
        Toast.show({
          icon: "success",
          content: "Photo removed",
          position: "center",
        });
      },
    });
  };

  const handleCropStart = (e) => {
    e.preventDefault();
    const rect = e.currentTarget.parentElement.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    setCropData((prev) => ({
      ...prev,
      isDragging: true,
      startX: Math.max(0, Math.min(clientX - rect.left, rect.width - 150)),
      startY: Math.max(0, Math.min(clientY - rect.top, rect.height - 150)),
    }));
  };

  const handleCropMove = (e) => {
    if (!cropData.isDragging) return;
    e.preventDefault();

    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const currentX = Math.max(
      0,
      Math.min(clientX - rect.left, rect.width - 150)
    );
    const currentY = Math.max(
      0,
      Math.min(clientY - rect.top, rect.height - 150)
    );

    setCropData((prev) => ({
      ...prev,
      width: 150, // Fixed crop size
      height: 150, // Fixed crop size
      startX: currentX,
      startY: currentY,
    }));
  };

  const handleCropEnd = () => {
    setCropData((prev) => ({
      ...prev,
      isDragging: false,
    }));
  };

  const renderUploadContent = () => {
    if (uploading) {
      return (
        <div style={styles.progressContainer}>
          <div style={styles.progressText}>📤 Uploading your photo...</div>
          <div
            style={{
              height: "6px",
              background: "#fed7aa",
              borderRadius: "3px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                background: "#f97316",
                animation: "loading 1.5s ease-in-out infinite",
                width: "60%",
                borderRadius: "3px",
              }}
            />
          </div>
        </div>
      );
    }

    if (photoFileList.length > 0) {
      return (
        <div style={styles.successContainer}>
          <CheckOutline style={styles.successIcon} />
          <div style={styles.successText}>Photo uploaded successfully!</div>
          <Space direction="vertical" style={{ marginTop: "16px" }}>
            <Button
              size="small"
              fill="outline"
              onClick={() => onPreview(photoFileList[0])}
              style={{
                color: "#ffffff",
                borderColor: "#ffffff",
                fontSize: "12px",
                borderRadius: "8px",
                minHeight: "36px",
              }}
            >
              👀 Preview
            </Button>
            <Button
              size="small"
              onClick={handleRemovePhoto}
              style={styles.removeButton}
            >
              🗑️ Remove
            </Button>
          </Space>
        </div>
      );
    }

    return (
      <div style={styles.uploaderWrapper}>
        <CameraOutline style={styles.uploadIcon} />
        <div>
          <div style={styles.uploadText}>Upload Profile Photo</div>
          <div style={styles.uploadSubtext}>
            Take a photo or choose from gallery
            <br />
            You can crop and adjust before uploading
            <br />
            Supported: JPG, PNG, WEBP • Max: {MAX_FILE_SIZE_MB}MB
          </div>
        </div>
        <Space
          direction="vertical"
          style={{ width: "100%", maxWidth: "200px" }}
        >
          <Button style={styles.cameraButton} onClick={handleCameraClick}>
            <CameraOutline style={{ marginRight: "8px" }} />
            Take Photo
          </Button>
          <Button style={styles.uploadButton} onClick={handleGalleryClick}>
            <UploadOutline style={{ marginRight: "8px" }} />
            Choose from Gallery
          </Button>
        </Space>
      </div>
    );
  };

  return (
    <>
      <Form.Item
        style={styles.formItem}
        label={<span style={styles.formLabel}>📸 Profile Photo</span>}
      >
        <div style={styles.container}>
          {renderUploadContent()}

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={styles.hiddenInput}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileSelect(e.target.files[0]);
              }
              e.target.value = ""; // Reset input
            }}
          />
        </div>
      </Form.Item>

      {/* Image Cropper Popup */}
      <Popup
        visible={showCropper}
        onClose={() => setShowCropper(false)}
        position="bottom"
        style={styles.cropperPopup}
        bodyStyle={{ height: "90vh" }}
      >
        <div style={styles.cropperContainer}>
          <div style={styles.cropperHeader}>
            <span style={styles.cropperTitle}>Crop Your Photo</span>
            <Button
              fill="none"
              onClick={() => setShowCropper(false)}
              style={{ padding: "8px", minWidth: "auto" }}
            >
              <CloseOutline />
            </Button>
          </div>

          <div
            style={styles.imageContainer}
            onMouseMove={handleCropMove}
            onMouseUp={handleCropEnd}
            onTouchMove={handleCropMove}
            onTouchEnd={handleCropEnd}
          >
            {selectedImage && (
              <>
                <img
                  ref={imageRef}
                  src={selectedImage.src}
                  alt="Crop preview"
                  style={styles.cropperImage}
                  onMouseDown={handleCropStart}
                  onTouchStart={handleCropStart}
                />
                {cropData.width > 0 && cropData.height > 0 && (
                  <div
                    style={{
                      ...styles.cropOverlay,
                      left: cropData.startX,
                      top: cropData.startY,
                    }}
                  />
                )}
              </>
            )}
          </div>

          <div style={styles.cropperActions}>
            <Button
              style={styles.cancelButton}
              onClick={() => setShowCropper(false)}
            >
              Cancel
            </Button>
            <Button style={styles.cropButton} onClick={cropImage}>
              Crop & Upload
            </Button>
          </div>
        </div>

        {/* Hidden canvas for cropping */}
        <canvas ref={canvasRef} style={{ display: "none" }} />
      </Popup>
    </>
  );
};

export default ProfilePhotoUpload;
