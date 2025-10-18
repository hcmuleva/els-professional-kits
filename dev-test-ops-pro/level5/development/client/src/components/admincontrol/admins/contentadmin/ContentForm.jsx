import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Select, Button, Upload, message, InputNumber, Card, Image } from 'antd';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import { createContent } from '../../../../services/content';
import ProfilePhotoUpload from '../../../common/ProfilePhotoUpload';

export default function ContentForm({ currentUser, courseId, onContentCreated }) {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [fileId, setFileId] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const uploadButtonRef = useRef(null);
  const contentTypes = ['YOUTUBE', 'VIDEO', 'AUDIO', 'IMAGE', 'DOCUMENT', 'PDF'];
  const contentCategories = ['QUESTION', 'EXAM', 'LECTURE', 'PRACTICE'];
  const contentlevel = [1, 2, 3, 4, 5, 6, 7];
  const [previewImage, setPreviewImage] = useState(null);
  const [mediaUploading, setMediaUploading] = useState(false);
  
  const handleUploadSuccess = (newFileId, url) => {
    setFileId(newFileId);
    setAvatarUrl(url);
    message.success('Media uploaded successfully');
  };

  const triggerFileSelect = () => {
    console.log("Fileupload clicked ")
    uploadButtonRef.current?.click();
  };

  const onFinish = async (values) => {
    try {
      const payload = {
        ...values,
        multimedia: fileId,
        course: courseId,
        creator: currentUser?.id,
      };

      setUploading(true);
      const newContent = await createContent(payload);
      message.success('Content created successfully');
      form.resetFields();
      setAvatarUrl(null);
      setFileId(null);
      if (onContentCreated) {
        onContentCreated(newContent);
      }
    } catch (error) {
      console.error(error);
      message.error('Failed to create content');
    } finally {
      setUploading(false);
    }
  };

  const selectedType = Form.useWatch('type', form);

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <Card title="Create New Content" bordered={false}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ type: 'YOUTUBE', content_category: 'LECTURE', level: 1 }}
        >
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input placeholder="Enter content title" />
          </Form.Item>

          <Form.Item name="content_category" label="Category" rules={[{ required: true }]}>
            <Select options={contentCategories.map(cat => ({ label: cat, value: cat }))} />
          </Form.Item>

          <Form.Item name="level" label="Level">
            <Select options={contentlevel.map(level => ({ label: level, value: level }))} />
          </Form.Item>

          <Form.Item name="type" label="Content Type" rules={[{ required: true }]}>
            <Select options={contentTypes.map(type => ({ label: type, value: type }))} />
          </Form.Item>

          {selectedType === 'YOUTUBE' && (
            <Form.Item
              name="youtubeurl"
              label="YouTube URL"
              rules={[{ required: true, message: 'YouTube URL is required for YOUTUBE type' }]}
            >
              <Input placeholder="https://youtube.com/..." />
            </Form.Item>
          )}

{selectedType !== 'YOUTUBE' && (
            <Form.Item label="Media">
              {previewImage ? (
                <div style={{ position: 'relative', marginBottom: 16 }}>
                  <Image
                    src={previewImage}
                    alt="Uploaded media"
                    style={{ width: '100%', maxHeight: 300, borderRadius: 8 }}
                    preview={{ mask: 'Click to Preview' }}
                  />
                  <Button
                    type="link"
                    danger
                    style={{ position: 'absolute', top: 8, right: 8 }}
                    onClick={() => {
                      setPreviewImage(null);
                      setFileId(null);
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <ProfilePhotoUpload 
                  onUploadSuccess={handleUploadSuccess}
                  disabled={mediaUploading}
                />
              )}
            </Form.Item>
          )}


          <Form.Item name="about" label="Description">
            <Input.TextArea rows={4} placeholder="Describe the content" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={uploading} style={{ marginRight: 8 }}>
              Create Content
            </Button>
            <Button onClick={() => navigate(-1)}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}