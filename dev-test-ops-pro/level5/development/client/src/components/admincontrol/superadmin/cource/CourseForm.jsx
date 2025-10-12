import { Form, Input, Button, Card, Avatar, Row, Col,Select,message, InputNumber } from 'antd';
import ProfilePhotoUpload from '../../../common/ProfilePhotoUpload';
import { useState, useRef, useEffect } from 'react';
import { CameraOutline } from 'antd-mobile-icons';
import { getAllCategory } from '../../../../services/category';
import { getAllSubCategories } from '../../../../services/subcategory';
import { getRolesByCategory } from '../../../../services/categoryRoles';

import { createCourse, getSingleUser } from '../../../../services/course';
import CourseCoverList from './CourseCoverList';
import { updateUser } from '../../../../services/auth';
import { useNavigate } from 'react-router-dom';
const { Option } = Select;

export default function CourseForm({ initialValues = {}, currentUserId, onSuccess }) {
  const [form] = Form.useForm();
  const [fileId, setFileId] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const uploaderRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [roles, setRoles] = useState([]);
  const [type,setType] = useState('ACADEMIC');
  const courseTypeList=[{name:'ACADEMIC', name_hi:""},{name:'NONACADEMIC', name_hi:""}]
  const stdList=[{name:'Primary', name_hi:""},{name:'Middle', name_hi:""},{name:'Higher', name_hi:""},{name:'Graduation', name_hi:""},{name:'All', name_hi:""}]

   const navigate = useNavigate()
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await getAllCategory();
        console.log("res",res)
        setCategories(res?.data || []);
      } catch (err) {
        message.error("Failed to load categories");
      }
    };
    loadCategories();
  }, []);

  const handleCategoryChange = async (categoryId) => {
    console.log("Selected category", categoryId)
    form.setFieldsValue({ subcategory: undefined, role: undefined });
    try {
      const subRes = await getAllSubCategories(categoryId);
      console.log("SubRes",subRes)
      const roleRes = await getRolesByCategory(categoryId);
      console.log("RoleRes", roleRes?.data?.attributes?.categoryroles?.data)
      setSubcategories(subRes?.data || []);
      setRoles(roleRes?.data?.attributes?.categoryroles?.data || []);
    } catch (err) {
      message.error("Failed to load subcategories or roles");
    }
  };
  const handleUploadSuccess = (newFileId, url) => {
    setFileId(newFileId);
    setAvatarUrl(url);
  };

  const handleSelectClick = () => {
    uploaderRef.current?.querySelector('input')?.click();
  };

  const updateUserSettingJson= async(userId,courseId, role)=>{
    const response = await getSingleUser(userId)
     console.log("response",response?.settingjson)


     
     try {
      const existingCourses = Array.isArray(response?.settingjson?.course)
      ? response.settingjson.course
      : [];
    
    // Check if this courseId already exists
    const isDuplicate = existingCourses.some(entry => entry.courseId === courseId);
    
    if (!isDuplicate) {
      existingCourses.push({ courseId, role:role });
    }
    
    // Build the new settingjson
    const settingjson = {
      ...response?.settingjson,
      course: existingCourses,
    };
    
    console.log("Before submit to userjson", settingjson);
    
    try {
      const updateresponse = await updateUser({ settingjson }, userId);
      
      console.log("Update Response", updateresponse);
      navigate('/coursesadmin');
    } catch (error) {
      console.log("Error in update", error);
    }

     } catch (error) {
        console.log("Error in update");
        
     }
  }
  const handleFinish = async (values) => {
    if (fileId) {
      values['cover']=fileId
    }
    if(values.authorId){
      values['author'] =values.authorId
    }else {
      values['author'] =currentUserId
    }
    setLoading(true);
    try {
      const payload = {
        ...values,
      };
      const response = await createCourse(payload);
      const newCourse = response?.data;
      const update_user_response =await updateUserSettingJson(values['author'],response?.data?.id,"Author")
      console.log("update_user_response",update_user_response)
      onSuccess?.(newCourse); // Notify parent
      form.resetFields();
      setFileId(null);
      setAvatarUrl(null);
    } catch (error) {
      console.error("Course creation failed", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
    <Form form={form} initialValues={initialValues} onFinish={handleFinish} layout="vertical">
      <Card style={styles.card}>
        <div style={styles.photoSection}>
          <div style={styles.avatarContainer}>
            {avatarUrl ? (
              <Avatar src={avatarUrl} style={styles.avatar} />
            ) : (
              <div style={styles.avatarPlaceholder}>
                <CameraOutline style={styles.cameraIcon} />
              </div>
            )}
            <Button style={styles.selectButton} onClick={handleSelectClick} loading={loading}>
              Cover Photo
            </Button>
            <div style={styles.hiddenUploader} ref={uploaderRef}>
              <ProfilePhotoUpload
                setFileId={setFileId}
                setAvatar={setAvatarUrl}
                onSuccess={handleUploadSuccess}
                disabled={loading}
              />
            </div>
          </div>
        </div>
      </Card>
      <Form.Item name="name" label="CourseType" rules={[{ required: true }]}>
  <Select placeholder="Select Course Type" onChange={(coursetype) => setType(coursetype)}>
    {courseTypeList.map(coursetype => (
      <Option key={coursetype.name} value={coursetype.name}>
        {`${coursetype.name} ${coursetype.name_hi}`}
      </Option>
    ))}
  </Select>
</Form.Item>
{type==="ACADEMIC"&&<>
  <Form.Item name="std" label="STD" >
  <Select placeholder="Select Course Type">
    {stdList.map(stdtype => (
      <Option key={stdtype.name} value={stdtype.name}>
        {`${stdtype.name} ${stdtype.name_hi}`}
      </Option>
    ))}
  </Select>
</Form.Item>

<Form.Item name="level" label="Complexity Level" >
  <InputNumber />
</Form.Item></>
}
<Form.Item name="category" label="Category" rules={[{ required: true }]}>
        <Select placeholder="Select category" onChange={handleCategoryChange}>
          {categories.map(cat => (
            <Option key={cat.id} value={cat.id}>{`${cat?.attributes?.icon} ${cat?.attributes?.name}-${cat?.attributes?.name_hi}`}</Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="subcategory" label="Subcategory" rules={[{ required: true }]}>
        <Select placeholder="Select subcategory" disabled={subcategories.length === 0}>
          {subcategories.map(sub => (
            <Option key={sub.id} value={sub.id}>{`${sub?.attributes?.icon} ${sub?.attributes?.name}-${sub?.attributes?.name_hi}`}</Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="role" label="Role" rules={[{ required: true }]}>
        <Select placeholder="Select role" disabled={roles.length === 0}>
          {roles.map(role => (
            <Option key={role.id} value={role.id}>{`${role?.attributes?.name}-${role?.attributes?.name_hi}`}</Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="title" label="Course Name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item name="subtitle" label="Course Subtitle" >
        <Input />
      </Form.Item>

      <Form.Item name="authorId" label="Enter Author Id" >
        <InputNumber />
      </Form.Item>
      <Form.Item name="description" label="Description">
        <Input.TextArea rows={3} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>Save</Button>
      </Form.Item>
    </Form>
  
    </>
  );
}

const styles = {
  card: { marginBottom: 16 },
  photoSection: { display: 'flex', justifyContent: 'center', marginBottom: 12 },
  avatarContainer: { textAlign: 'center' },
  avatar: { width: 100, height: 100, borderRadius: 8 },
  avatarPlaceholder: {  
    width: 100, height: 100, background: '#f0f0f0', borderRadius: 8,
    display: 'flex', alignItems: 'center', justifyContent: 'center'
  },
  cameraIcon: { fontSize: 32, color: '#888' },
  selectButton: { marginTop: 8 },
  hiddenUploader: { display: 'none' },
};