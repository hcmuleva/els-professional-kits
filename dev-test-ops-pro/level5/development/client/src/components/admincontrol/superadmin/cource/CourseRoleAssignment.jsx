import { BackwardOutlined, PlusOutlined } from '@ant-design/icons';
import React from 'react'
import { Form, Select, InputNumber, Button } from 'antd';

import { useNavigate, useParams } from 'react-router-dom';
import { getSingleUser } from '../../../../services/course';
import { updateUser } from '../../../../services/auth';
const { Option } = Select;

export default function CourseRoleAssignment() {
    const { courseId } = useParams();
    const navigate = useNavigate()
    const [form] = Form.useForm();

    const onFinish = async (values) => {
      console.log('Submitted values:', values);
      console.log("Role",values.role)
     const response = await getSingleUser(values.userId)
     console.log("response",response?.settingjson)


     
     try {
      const existingCourses = Array.isArray(response?.settingjson?.course)
      ? response.settingjson.course
      : [];
    
    // Check if this courseId already exists
    const isDuplicate = existingCourses.some(entry => entry.courseId === courseId);
    
    if (!isDuplicate) {
      existingCourses.push({ courseId, role: values.role });
    }
    
    // Build the new settingjson
    const settingjson = {
      ...response?.settingjson,
      course: existingCourses,
    };
    
    console.log("Before submit to userjson", settingjson);
    
    try {
      const updateresponse = await updateUser({ settingjson }, values.userId);
      console.log("Update Response", updateresponse);
      navigate('/coursesadmin');
    } catch (error) {
      console.log("Error in update", error);
    }

     } catch (error) {
        console.log("Error in update");
        
     }

    };
  return (
    <>
    <div>
        <Button 
    type="primary" 
    icon={<PlusOutlined />} 
    size="small"
    style={{
      backgroundColor: '#ffffff',
      color: '#000',
      borderColor: '#fff',
      fontWeight: 'bold'
    }}
     variant="dashed"
    onClick={() => navigate(`/coursesadmin`)}
  >
    <BackwardOutlined/>
    Course
  </Button>

      <h1>Role Assignmentfor {courseId}</h1>
    </div>
    <Form
    form={form}
    layout="vertical"
    onFinish={onFinish}
    initialValues={{ role: 'Author', number: 1 }}
  >
    <Form.Item
      name="role"
      label="Role"
      rules={[{ required: true, message: 'Please select a role' }]}
    >
      <Select placeholder="Select Role">
        <Option value="Author">Author</Option>
        <Option value="Co-author">Co-author</Option>
        <Option value="Reviewer">Reviewer</Option>
        <Option value="Sponsored">Sponsored</Option>
      </Select>
    </Form.Item>

    <Form.Item
      name="userId"
      label="Enter UserId"
      rules={[{ required: true, message: 'Please enter UserId' }]}
    >
      <InputNumber min={1} style={{ width: '100%' }} />
    </Form.Item>

    <Form.Item>
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form.Item>
  </Form>
  </>
  )
}
