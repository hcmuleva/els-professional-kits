import React, { useState, useEffect, useContext } from "react";
import {
  Calendar,
  Badge,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  TimePicker,
  Button,
  Card,
  Row,
  Col,
  Typography,
  Space,
  Drawer,
  List,
  Tag,
  Divider,
  message,
} from "antd";
import {
  PlusOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  EnvironmentOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import axios from "axios";
import { createEvent, getEvents } from "../../services/event";
import { AuthContext } from "../../contexts/AuthContext";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

// Strapi API configuration
const STRAPI_API_URL = "http://localhost:1337/api";
const EVENTS_ENDPOINT = `${STRAPI_API_URL}/events`;

export default function Events() {
  const { user } = useContext(AuthContext);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [form] = Form.useForm();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  // Check if user is admin
  const isAdmin = user?.userrole === "ADMIN";

  const eventTypes = {
    ritual: { color: "#fa8c16", label: "Ritual", bgColor: "#fff7e6" },
    meeting: { color: "#1677ff", label: "Meeting", bgColor: "#e6f4ff" },
    festival: { color: "#52c41a", label: "Festival", bgColor: "#f6ffed" },
    education: { color: "#722ed1", label: "Education", bgColor: "#f9f0ff" },
    ceremony: { color: "#eb2f96", label: "Ceremony", bgColor: "#fff0f6" },
    maintenance: { color: "#8c8c8c", label: "Maintenance", bgColor: "#f5f5f5" },
  };

  // Fetch events from Strapi API
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await getEvents();
        const formattedEvents = response.map((event) => ({
          id: event.id,
          title: event.attributes.title,
          date: dayjs(event.attributes.date),
          startTime: dayjs(event.attributes.startTime),
          endTime: dayjs(event.attributes.endTime),
          type: event.attributes.type,
          description: event.attributes.description,
          location: event.attributes.location,
          attendees: event.attributes.attendees || 0,
        }));
        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
        message.error("Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const containerStyle = {
    padding: "16px",
    backgroundColor: "#f5f5f5",
    minHeight: "100vh",
  };

  const headerStyle = {
    marginBottom: "24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "12px",
  };

  const calendarStyle = {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "16px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  };

  const getEventsForDate = (date) => {
    return events.filter(
      (event) => event.date.format("YYYY-MM-DD") === date.format("YYYY-MM-DD")
    );
  };

  const getDateCellRender = (value) => {
    const dayEvents = getEventsForDate(value);

    if (dayEvents.length === 0) return null;

    const maxVisible = 2;
    const visibleEvents = dayEvents.slice(0, maxVisible);
    const hiddenCount = dayEvents.length - maxVisible;

    return (
      <div style={{ fontSize: "12px" }}>
        {visibleEvents.map((event) => (
          <div
            key={event.id}
            style={{
              backgroundColor: eventTypes[event.type].bgColor,
              color: eventTypes[event.type].color,
              padding: "2px 6px",
              borderRadius: "4px",
              marginBottom: "2px",
              fontSize: "10px",
              fontWeight: "500",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              border: `1px solid ${eventTypes[event.type].color}20`,
            }}
          >
            {event.title}
          </div>
        ))}
        {hiddenCount > 0 && (
          <div
            style={{
              fontSize: "10px",
              color: "#8c8c8c",
              textAlign: "center",
              marginTop: "2px",
            }}
          >
            +{hiddenCount} more
          </div>
        )}
      </div>
    );
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setIsDrawerVisible(true);
  };

  const handleCreateEvent = () => {
    if (!isAdmin) {
      message.warning("Only administrators can create events");
      return;
    }
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleFormSubmit = async (values) => {
    if (!isAdmin) {
      message.error("Unauthorized: Only administrators can create events");
      return;
    }

    try {
      // Format data for Strapi API
      const payload = {
        data: {
          title: values.title,
          date: values.date.format("YYYY-MM-DD"),
          startTime: values.startTime.format("HH:mm:ss"),
          endTime: values.endTime.format("HH:mm:ss"),
          type: values.type,
          description: values.description,
          location: values.location,
        },
      };

      // Send POST request to Strapi
      const response = await createEvent(payload);
      console.log("Event created:", response);
      // If successful, add the new event to local state
      const newEvent = {
        id: response.id,
        title: response.attributes.title,
        date: dayjs(response.attributes.date),
        startTime: dayjs(response.attributes.startTime, "HH:mm:ss"),
        endTime: dayjs(response.attributes.endTime, "HH:mm:ss"),
        type: response.attributes.type,
        description: response.attributes.description,
        location: response.attributes.location,
      };

      setEvents([...events, newEvent]);
      setIsModalVisible(false);
      form.resetFields();
      message.success("Event created successfully!");
    } catch (error) {
      console.error("Error creating event:", error);
      message.error("Failed to create event");
    }
  };

  const selectedDateEvents = getEventsForDate(selectedDate);

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div>
          <Title
            level={2}
            style={{ margin: 0, fontSize: "clamp(20px, 4vw, 28px)" }}
          >
            Event Calendar
          </Title>
          <Text type="secondary">
            {isAdmin
              ? "Manage and view community events"
              : "View community events"}
          </Text>
        </div>
        {isAdmin && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreateEvent}
            style={{
              height: "40px",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            Create Event
          </Button>
        )}
      </div>

      {/* Legend */}
      <Card style={{ marginBottom: "16px" }} bodyStyle={{ padding: "12px" }}>
        <Space wrap>
          <Text strong style={{ marginRight: "8px", fontSize: "14px" }}>
            Event Types:
          </Text>
          {Object.entries(eventTypes).map(([key, type]) => (
            <Tag
              key={key}
              color={type.color}
              style={{
                fontSize: "12px",
                padding: "4px 8px",
                borderRadius: "12px",
              }}
            >
              {type.label}
            </Tag>
          ))}
        </Space>
      </Card>

      {/* Calendar */}
      <div style={calendarStyle}>
        <Calendar
          onSelect={handleDateSelect}
          cellRender={getDateCellRender}
          loading={loading}
        />
      </div>

      {/* Create Event Modal - Only render if admin */}
      {isAdmin && (
        <Modal
          title="Create New Event"
          open={isModalVisible}
          onCancel={handleModalCancel}
          footer={null}
          width={600}
          style={{ top: 20 }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFormSubmit}
            style={{ marginTop: "16px" }}
          >
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="title"
                  label="Event Title"
                  rules={[
                    { required: true, message: "Please enter event title" },
                  ]}
                >
                  <Input placeholder="Enter event title" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="type"
                  label="Event Type"
                  rules={[
                    { required: true, message: "Please select event type" },
                  ]}
                >
                  <Select placeholder="Select event type">
                    {Object.entries(eventTypes).map(([key, type]) => (
                      <Option key={key} value={key}>
                        <Space>
                          <div
                            style={{
                              width: "12px",
                              height: "12px",
                              backgroundColor: type.color,
                              borderRadius: "50%",
                            }}
                          />
                          {type.label}
                        </Space>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} sm={8}>
                <Form.Item
                  name="date"
                  label="Date"
                  rules={[{ required: true, message: "Please select date" }]}
                >
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col xs={12} sm={8}>
                <Form.Item
                  name="startTime"
                  label="Start Time"
                  rules={[
                    { required: true, message: "Please select start time" },
                  ]}
                >
                  <TimePicker style={{ width: "100%" }} format="HH:mm" />
                </Form.Item>
              </Col>
              <Col xs={12} sm={8}>
                <Form.Item
                  name="endTime"
                  label="End Time"
                  rules={[
                    { required: true, message: "Please select end time" },
                  ]}
                >
                  <TimePicker style={{ width: "100%" }} format="HH:mm" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="location" label="Location">
              <Input
                placeholder="Event location"
                prefix={<EnvironmentOutlined />}
              />
            </Form.Item>

            <Form.Item name="description" label="Description">
              <TextArea rows={3} placeholder="Event description..." />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
              <Space>
                <Button onClick={handleModalCancel}>Cancel</Button>
                <Button type="primary" htmlType="submit">
                  Create Event
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      )}

      {/* Mobile Event Details Drawer */}
      <Drawer
        title={`Events for ${selectedDate.format("MMM DD, YYYY")}`}
        placement="bottom"
        onClose={() => setIsDrawerVisible(false)}
        open={isDrawerVisible}
        height="60%"
        style={{ borderRadius: "16px 16px 0 0" }}
      >
        {selectedDateEvents.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <CalendarOutlined
              style={{
                fontSize: "48px",
                color: "#d9d9d9",
                marginBottom: "16px",
              }}
            />
            <Text type="secondary">No events scheduled for this date</Text>
            <br />
            {isAdmin && (
              <Button
                type="primary"
                style={{ marginTop: "16px" }}
                onClick={() => {
                  setIsDrawerVisible(false);
                  handleCreateEvent();
                }}
              >
                Create Event
              </Button>
            )}
          </div>
        ) : (
          <List
            dataSource={selectedDateEvents}
            renderItem={(event) => (
              <List.Item style={{ padding: "12px 0", border: "none" }}>
                <Card
                  size="small"
                  style={{
                    width: "100%",
                    borderLeft: `4px solid ${eventTypes[event.type].color}`,
                    backgroundColor: eventTypes[event.type].bgColor,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <Title
                        level={5}
                        style={{
                          margin: "0 0 8px 0",
                          color: eventTypes[event.type].color,
                        }}
                      >
                        {event.title}
                      </Title>
                      <Space direction="vertical" size={4}>
                        <Space size={8}>
                          <ClockCircleOutlined
                            style={{ color: "#8c8c8c", fontSize: "12px" }}
                          />
                          <Text style={{ fontSize: "12px", color: "#8c8c8c" }}>
                            {event.startTime.format("HH:mm")} -{" "}
                            {event.endTime.format("HH:mm")}
                          </Text>
                        </Space>
                        {event.location && (
                          <Space size={8}>
                            <EnvironmentOutlined
                              style={{ color: "#8c8c8c", fontSize: "12px" }}
                            />
                            <Text
                              style={{ fontSize: "12px", color: "#8c8c8c" }}
                            >
                              {event.location}
                            </Text>
                          </Space>
                        )}
                        {event.attendees > 0 && (
                          <Space size={8}>
                            <UserOutlined
                              style={{ color: "#8c8c8c", fontSize: "12px" }}
                            />
                            <Text
                              style={{ fontSize: "12px", color: "#8c8c8c" }}
                            >
                              {event.attendees} attendees
                            </Text>
                          </Space>
                        )}
                      </Space>
                      {event.description && (
                        <Text
                          style={{
                            fontSize: "12px",
                            color: "#595959",
                            display: "block",
                            marginTop: "8px",
                          }}
                        >
                          {event.description}
                        </Text>
                      )}
                    </div>
                    {isAdmin && (
                      <Space>
                        <Button
                          type="text"
                          size="small"
                          icon={<EditOutlined />}
                        />
                        <Button
                          type="text"
                          size="small"
                          icon={<DeleteOutlined />}
                          danger
                        />
                      </Space>
                    )}
                  </div>
                </Card>
              </List.Item>
            )}
          />
        )}
      </Drawer>
    </div>
  );
}
