import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, message, Card } from 'antd';
import { createAnnouncement } from '../../../../services/announcement';
import { getAssignedUnAssginedSubcategories } from '../../../../services/community';
import { useParams } from 'react-router-dom';
export default function AnouncementForm() {
    const { id } = useParams()
    const { Option } = Select;
    const { TextArea } = Input;
    const [loading, setLoading] = useState(false);
    const [subcategoryList, setSubcategoryList] = useState([]);
    const [form] = Form.useForm();
    console.log("AnouncementForm")
    useEffect(() => {
        const fetchSubcategories = async () => {
            try {
                setLoading(true);
                const response = await getAssignedUnAssginedSubcategories({ id });
                const fullsubcategort = response?.fullsubcategort || [];
                console.log('Assigned subcategories:', fullsubcategort, response);
                setSubcategoryList(fullsubcategort);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching subcategories', err);
                setLoading(false);
            }
        };

        fetchSubcategories();
    }, []);

    const onFinish = async (values) => {
        try {
            setLoading(true);
            const payload = {
                
                    temple: id,

                    templesubcategory: values.templesubcategory,
                    title: values.title,
                    description: values.description,
                    announcement_type: values.announcement_type,
                
            };

            const response = createAnnouncement(payload);
            console.log('Announcement created:', response);
            message.success('✅ Announcement created successfully');
            form.resetFields();
        } catch (error) {
            console.error(error);
            message.error('❌ Failed to create announcement');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card title="📢 Create New Announcement" bordered style={{ maxWidth: 600, margin: '0 auto' }}>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                    announcement_type: 'Simple Message',
                }}
            >
              
                
                <Form.Item
                    label="Select Subcategory"
                    name="templesubcategory"
                    rules={[{ required: true, message: "Please select a subcategory" }]}
                >
                    <Select placeholder="Choose subcategory">
                        {subcategoryList.map((item) => (
                            <Option key={item.id} value={item.id}>
                                {item?.subcategory?.name} ({item?.subcategory?.name_hi})
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Announcement Title"
                    name="title"
                    rules={[{ required: true, message: 'Please enter title' }]}
                >
                    <Input placeholder="Enter announcement title" />
                </Form.Item>

                <Form.Item
                    label="Description"
                    name="description"
                    rules={[{ required: true, message: 'Please enter description' }]}
                >
                    <TextArea rows={4} placeholder="Enter message/description" />
                </Form.Item>

                <Form.Item
                    label="Announcement Type"
                    name="announcement_type"
                    rules={[{ required: true, message: 'Please select announcement type' }]}
                >
                    <Select>
                        <Option value="Simple Message">Simple Message</Option>
                        <Option value="Event">Event</Option>
                        <Option value="Emergency">Emergency</Option>
                    </Select>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Create Announcement
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    )
}
