import React, { useState, useEffect, useContext } from "react";
import {
  Select,
  Button,
  List,
  Checkbox,
  message,
  Space,
  Card,
  Typography,
  Row,
  Col,
  Spin,
} from "antd";
import {
  DeleteOutlined,
  CheckOutlined,
  UserOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import {
  getAllSkills,
  setUserSkills,
  updateUserSkills,
  getUserSkills,
} from "../../../../services/skills";
import { AuthContext } from "../../../../contexts/AuthContext";

const { Title, Text } = Typography;

export default function SkillSelector() {
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [confirmedSkills, setConfirmedSkills] = useState([]);
  const [selectedForDeletion, setSelectedForDeletion] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [userSkillsId, setUserSkillsId] = useState(null);
  const { user } = useContext(AuthContext);

  // Warm color palette inspired by ProfessionInfo.jsx
  const styles = {
    container: {
      minHeight: "100vh",
      background: "#fef6f0", // Warm off-white
      padding: isMobile ? "16px" : "24px",
    },
    card: {
      background: "#f5e7db", // Warm beige
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      border: "1px solid #fed7aa", // Light coral border
      padding: "16px",
    },
    header: {
      textAlign: "center",
      marginBottom: "24px",
    },
    headerIcon: {
      fontSize: "32px",
      color: "#f97316", // Muted coral
      marginBottom: "12px",
    },
    headerTitle: {
      color: "#7c2d12", // Muted warm brown
      fontSize: "20px",
      fontWeight: "600",
      marginBottom: "8px",
    },
    headerText: {
      color: "#6b7280",
      fontSize: "14px",
    },
    selectSection: {
      marginBottom: "24px",
    },
    sectionTitle: {
      color: "#7c2d12", // Muted warm brown
      fontSize: "16px",
      fontWeight: "600",
      marginBottom: "12px",
    },
    select: {
      background: "#fff7ed", // Light warm background
      borderRadius: "6px",
      border: "1px solid #fed7aa", // Light coral border
    },
    confirmButton: {
      background: "#f97316", // Muted coral
      border: "none",
      borderRadius: "6px",
      height: "40px",
      fontWeight: "600",
      color: "#ffffff",
      transition: "background-color 0.2s",
    },
    confirmButtonHover: {
      background: "#ea580c", // Slightly darker coral on hover
    },
    skillsSection: {
      marginTop: "16px",
    },
    skillsHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "12px",
      flexWrap: "wrap",
      gap: "8px",
    },
    skillsTitle: {
      color: "#7c2d12", // Muted warm brown
      fontSize: "16px",
      fontWeight: "600",
      margin: 0,
    },
    deleteSelectedButton: {
      background: "#b91c1c", // Muted red
      border: "none",
      borderRadius: "6px",
      height: "36px",
      fontWeight: "600",
      color: "#ffffff",
      transition: "background-color 0.2s",
    },
    deleteSelectedButtonHover: {
      background: "#991b1b", // Slightly darker red on hover
    },
    listItem: {
      background: "#fff7ed", // Light warm background
      borderRadius: "6px",
      marginBottom: "8px",
      border: "1px solid #fed7aa", // Light coral border
      padding: "12px 16px",
    },
    listItemText: {
      color: "#3f3f46", // Neutral dark gray
      fontWeight: "600",
      fontSize: "14px",
    },
    removeButton: {
      color: "#b91c1c", // Muted red
      fontSize: "12px",
    },
    noSkills: {
      textAlign: "center",
      padding: "32px 16px",
      background: "#fff7ed", // Light warm background
      borderRadius: "6px",
      border: "1px solid #fed7aa", // Light coral border
      color: "#6b7280",
      fontSize: "14px",
    },
    tipText: {
      color: "#6b7280",
      fontSize: "12px",
      textAlign: "center",
      marginTop: "12px",
    },
    loadingContainer: {
      minHeight: "50vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      gap: "12px",
    },
    loadingText: {
      color: "#7c2d12", // Muted warm brown
      fontSize: "16px",
    },
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);

      const skillsResponse = await getAllSkills();
      if (skillsResponse.data && skillsResponse.data.length > 0) {
        const skillsData = skillsResponse.data[0].attributes.skills_data;
        setOptions(skillsData);
      }

      try {
        const userSkillsResponse = await getUserSkills(user?.id);

        if (userSkillsResponse) {
          setUserSkillsId(userSkillsResponse.user_skill.id);
          const userSkillsData =
            userSkillsResponse.user_skill.user_skills_data || [];
          setConfirmedSkills(userSkillsData);
        }
      } catch (userSkillsError) {
        console.log("No existing user skills found");
      }
    } catch (error) {
      console.error("Error loading initial data:", error);
      message.error("Failed to load skills data");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (value) => {
    setSelectedSkills(value);
  };

  const handleConfirm = async () => {
    if (selectedSkills.length === 0) {
      message.warning("Please select at least one skill");
      return;
    }

    try {
      setActionLoading(true);

      const skillsToAdd = selectedSkills.filter(
        (skill) => !confirmedSkills.includes(skill)
      );

      if (skillsToAdd.length > 0) {
        const updatedSkills = [...confirmedSkills, ...skillsToAdd];

        if (userSkillsId) {
          await updateUserSkills(
            {
              user_skills_data: updatedSkills,
            },
            userSkillsId
          );
        } else {
          const response = await setUserSkills({
            user_skills_data: updatedSkills,
            user: user?.id,
          });
          setUserSkillsId(response.data.id);
        }

        setConfirmedSkills(updatedSkills);
        setSelectedSkills([]);
        message.success(`${skillsToAdd.length} skill(s) added successfully!`);
      } else {
        message.info("All selected skills are already in your list");
        setSelectedSkills([]);
      }
    } catch (error) {
      console.error("Error confirming skills:", error);
      message.error("Failed to confirm skills");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedForDeletion.length === 0) {
      message.warning("Please select skills to delete");
      return;
    }

    try {
      setActionLoading(true);

      const updatedSkills = confirmedSkills.filter(
        (skill) => !selectedForDeletion.includes(skill)
      );

      if (userSkillsId) {
        await updateUserSkills(
          { user_skills_data: updatedSkills },
          userSkillsId
        );
      }

      setConfirmedSkills(updatedSkills);
      setSelectedForDeletion([]);
      message.success(
        `${selectedForDeletion.length} skill(s) removed successfully!`
      );
    } catch (error) {
      console.error("Error deleting skills:", error);
      message.error("Failed to remove skills");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSingleDelete = async (skillToDelete) => {
    try {
      setActionLoading(true);

      const updatedSkills = confirmedSkills.filter(
        (skill) => skill !== skillToDelete
      );

      if (userSkillsId) {
        await updateUserSkills(
          { user_skills_data: updatedSkills },
          userSkillsId
        );
      }

      setConfirmedSkills(updatedSkills);
      message.success("Skill removed successfully!");
    } catch (error) {
      console.error("Error deleting skill:", error);
      message.error("Failed to remove skill");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSelectForDeletion = (skill, checked) => {
    if (checked) {
      setSelectedForDeletion([...selectedForDeletion, skill]);
    } else {
      setSelectedForDeletion(selectedForDeletion.filter((s) => s !== skill));
    }
  };

  const getSkillLabel = (value) => {
    const option = options.find((opt) => opt.value === value);
    return option ? option.label : value;
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <Spin
            size="large"
            indicator={
              <LoadingOutlined
                style={{ fontSize: 32, color: "#f97316" }} // Muted coral
              />
            }
          />
          <div style={styles.loadingText}>Loading skills data...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Row justify="center">
        <Col xs={24} sm={20} md={16} lg={12}>
          <Card style={styles.card}>
            <div style={styles.header}>
              <UserOutlined style={styles.headerIcon} />
              <Title style={styles.headerTitle}>Skill Selector</Title>
              <Text style={styles.headerText}>
                Choose your skills and build your profile
              </Text>
            </div>

            <div style={styles.selectSection}>
              <Title style={styles.sectionTitle}>Select Skills</Title>
              <Space direction="vertical" style={{ width: "100%" }}>
                <Select
                  mode="multiple"
                  allowClear
                  style={{ width: "100%", ...styles.select }}
                  placeholder="Please select your skills"
                  value={selectedSkills}
                  onChange={handleChange}
                  options={options}
                  size={isMobile ? "large" : "middle"}
                  showSearch
                  filterOption={(input, option) =>
                    option.label.toLowerCase().includes(input.toLowerCase())
                  }
                  disabled={actionLoading}
                />
                <Button
                  type="primary"
                  icon={<CheckOutlined />}
                  onClick={handleConfirm}
                  style={styles.confirmButton}
                  size={isMobile ? "large" : "middle"}
                  block={isMobile}
                  disabled={selectedSkills.length === 0 || actionLoading}
                  loading={actionLoading}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      styles.confirmButtonHover.backgroundColor)
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      styles.confirmButton.backgroundColor)
                  }
                >
                  Confirm Selection
                </Button>
              </Space>
            </div>

            {confirmedSkills.length > 0 && (
              <div style={styles.skillsSection}>
                <div style={styles.skillsHeader}>
                  <Title style={styles.skillsTitle}>
                    Your Skills ({confirmedSkills.length})
                  </Title>
                  {selectedForDeletion.length > 0 && (
                    <Button
                      type="primary"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={handleDeleteSelected}
                      style={styles.deleteSelectedButton}
                      size="small"
                      loading={actionLoading}
                      disabled={actionLoading}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          styles.deleteSelectedButtonHover.backgroundColor)
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          styles.deleteSelectedButton.backgroundColor)
                      }
                    >
                      Delete Selected ({selectedForDeletion.length})
                    </Button>
                  )}
                </div>

                <List
                  dataSource={confirmedSkills}
                  renderItem={(skill) => (
                    <List.Item
                      style={styles.listItem}
                      actions={[
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => handleSingleDelete(skill)}
                          style={styles.removeButton}
                          size="small"
                          loading={actionLoading}
                          disabled={actionLoading}
                        >
                          Remove
                        </Button>,
                      ]}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <Checkbox
                          checked={selectedForDeletion.includes(skill)}
                          onChange={(e) =>
                            handleSelectForDeletion(skill, e.target.checked)
                          }
                          style={{ marginRight: "12px" }}
                          disabled={actionLoading}
                        />
                        <div style={styles.listItemText}>
                          {getSkillLabel(skill)}
                        </div>
                      </div>
                    </List.Item>
                  )}
                />

                {confirmedSkills.length > 1 && (
                  <div style={styles.tipText}>
                    💡 Tip: Use checkboxes to select multiple skills for batch
                    deletion
                  </div>
                )}
              </div>
            )}

            {confirmedSkills.length === 0 && (
              <div style={styles.noSkills}>
                No skills selected yet. Choose skills from the dropdown above!
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}