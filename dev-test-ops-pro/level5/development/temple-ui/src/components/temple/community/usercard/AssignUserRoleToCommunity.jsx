import { 
    Avatar, 
    Button, 
    Card, 
    DatePicker, 
    Picker, 
    Toast,
    Space,
    Grid
  } from "antd-mobile";
  import dayjs from "dayjs";
  import React, { useEffect, useState } from "react";
  import { fetchRoles, assignRoleToUser } from "../../../../services/community";
  import styles from "./usercard.css";
  
  export default function AssignUserRoleToCommunity({ 
    userdata, 
    communityId, 
    templeId, 
    setIsAssignedRole,
    onClose 
  }) {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(null);
    const [rolePickerVisible, setRolePickerVisible] = useState(false);
    const [startDatePickerVisible, setStartDatePickerVisible] = useState(false);
    const [endDatePickerVisible, setEndDatePickerVisible] = useState(false);
  
    const thumbnail = userdata?.attributes?.profilePicture?.data?.attributes?.formats?.thumbnail?.url;
  
    useEffect(() => {
      const loadRoles = async () => {
        try {
          setLoading(true);
          const response = await fetchRoles(communityId);
          const roleOptions = (response?.data || []).map(role => ({
            label: role.attributes?.name || `Role ${role.id}`,
            value: role.id,
          }));
          setRoles(roleOptions);
        } catch (error) {
          console.error("Failed to fetch roles", error);
          Toast.show({ content: "Failed to load roles", position: "bottom" });
        } finally {
          setLoading(false);
        }
      };
  
      if (communityId) {
        loadRoles();
      }
    }, [communityId]);
    console.log("selectedRole",selectedRole)
    const handleAssign = async () => {

        console.log("Start date:", startDate, "End date:", endDate, "roleid", selectedRole[0]);
        console.log(roles[selectedRole[0]], "Selected role")
      if (!selectedRole) {
        Toast.show({ content: "Please select a role", position: "bottom" });
        return;
      }
  
      try {
        setLoading(true);
        await assignRoleToUser({
            users_permissions_user: userdata.id,
            community:communityId,
            temple:templeId,
            communityrole: selectedRole[0],
          startdate: startDate ? dayjs(startDate).format("YYYY-MM-DD") : null,
          enddate: endDate ? dayjs(endDate).format("YYYY-MM-DD") : null
        });
        
        Toast.show({ content: "Role assigned successfully", position: "bottom" });
        setIsAssignedRole(true);
        onClose();
      } catch (error) {
        Toast.show({ content: "Failed to assign role", position: "bottom" });
        console.error("Role assignment error:", error);
      } finally {
        setLoading(false);
      }
    };
  
    const renderDateButton = (value, placeholder) => {
      return (
        <Button 
          size='small'
          fill='outline'
          onClick={() => placeholder.includes('start') 
            ? setStartDatePickerVisible(true) 
            : setEndDatePickerVisible(true)
          }
        >
          {value ? dayjs(value).format('YYYY-MM-DD') : placeholder}
        </Button>
      );
    };
  
    return (
      <Card className={styles.card}>
        <div className={styles.cardContent}>
          <div className={styles.avatarSection}>
            <Avatar src={thumbnail} className={styles.avatar} />
          </div>
          
          <div className={styles.infoSection}>
            <h2 className={styles.name}>
              {userdata?.attributes?.first_name || 'User'}:{userdata?.id}
            </h2>
            
            {/* Replaced stats with role assignment fields */}
            <div className={styles.statsContainer}>
              <Grid columns={1} gap={12}>
                <Grid.Item>
                  <div className={styles.formItem}>
                    <div className={styles.statLabel}>Role</div>
                    <Button 
                      size='small'
                      fill='outline'
                      onClick={() => setRolePickerVisible(true)}
                    >
                      {selectedRole ? roles.find(r => r.value === selectedRole[0])?.label : 'Select role'}
                    </Button>
                    <Picker
                      columns={[roles]}
                      visible={rolePickerVisible}
                      onClose={() => setRolePickerVisible(false)}
                      onConfirm={(val) => {
                        console.log("Selected role: picker", val);
                        setSelectedRole(val);
                        setRolePickerVisible(false);
                      }}
                    />
                  </div>
                </Grid.Item>
                
                <Grid.Item>
                  <div className={styles.formItem}>
                    <div className={styles.statLabel}>Start Date</div>
                    <DatePicker
                      min={new Date(1900, 0, 1)}
                      value={startDate}
                      visible={startDatePickerVisible}
                      onClose={() => setStartDatePickerVisible(false)}
                      onConfirm={(val) => {
                        setStartDate(val);
                        setStartDatePickerVisible(false);
                      }}
                    >
                      {(value) => renderDateButton(value, 'Select start')}
                    </DatePicker>
                  </div>
                </Grid.Item>
                
                <Grid.Item>
                  <div className={styles.formItem}>
                    <div className={styles.statLabel}>End Date</div>
                    <DatePicker
                      min={new Date(1900, 0, 1)}
                      value={endDate}
                      visible={endDatePickerVisible}
                      onClose={() => setEndDatePickerVisible(false)}
                      onConfirm={(val) => {
                        setEndDate(val);
                        setEndDatePickerVisible(false);
                      }}
                    >
                      {(value) => renderDateButton(value, 'Select end')}
                    </DatePicker>
                  </div>
                </Grid.Item>
              </Grid>
            </div>
  
            <Space className={styles.buttonContainer}>
              <Button 
                className={styles.chatButton} 
                onClick={() => onClose()}
              >
                Cancel
              </Button>
              <Button 
                className={styles.followButton} 
                color="primary" 
                onClick={handleAssign}
                loading={loading}
                disabled={!selectedRole}
              >
                Assign Role
              </Button>
            </Space>
          </div>
        </div>
      </Card>
    );
  }