import React, { useEffect, useState } from "react";
import { List,Collapse, Avatar, Select, DatePicker, Button, Spin, message, Input, InputNumber } from "antd";

import moment from "moment";
import { assignUserRoleToTemple, fetchCustomTempleUsers, fetchSubcategoryrole } from "../../../../../services/temple";
const { Panel } = Collapse;

const { Option } = Select;

const PAGE_SIZE = 10;

const TempleUserAssignmentList = ({ templeId,subcategoryId }) => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [saving, setSaving] = useState({});
    const [formData, setFormData] = useState({}); // { [userId]: { role, startDate, endDate } }
    const [search, setSearch] = useState("");
    const [minAge, setMinAge] = useState();
    const [maxAge, setMaxAge] = useState();
    const [gender, setGender] = useState();
const [gotra, setGotra] = useState("");
const [profession, setProfession] = useState("");

    useEffect(() => {
        const loadRoles = async () => {
          const res = await fetchSubcategoryrole(subcategoryId); // make sure this returns an array of roles
          setRoles(res.roles || []);
        };
        loadRoles();
      }, []);
  
      const loadUsers = async (reset = false) => {
        try {
          const currentPage = reset ? 1 : page;
          const { users: fetchedUsers } = await fetchCustomTempleUsers({
            id: templeId,
            page: currentPage,
            pageSize: PAGE_SIZE,
            gender,
            minAge,
            maxAge,
            search,
            gotra,
            profession,
          });
      
          if (reset) {
            setUsers(fetchedUsers);
          } else {
            setUsers(prev => [...prev, ...fetchedUsers]);
          }
      
          if (fetchedUsers.length < PAGE_SIZE) {
            setHasMore(false);
          } else {
            setPage(prev => prev + 1);
          }
        } catch (err) {
          console.error("Error fetching temple users:", err);
        }
      };
      
    const handleFilterChange = () => {
      setPage(1);
      setHasMore(true);
      loadUsers(true); // true → reset = true
    };
    useEffect(() => {
      setUsers([]);
      setPage(1);
      setHasMore(true);
      loadUsers(true);
    }, [templeId]);
    useEffect(() => {
      handleFilterChange();
    }, [templeId]);
    
    const handleSave = async (userId) => {
      const data = formData[userId];
      if (!data?.role || !data?.startDate ) {
        message.error("All fields are required");
        return;
      }
  
      try {
        setSaving(prev => ({ ...prev, [userId]: true }));
        console.log("Saving data for user:", userId, data);
        await assignUserRoleToTemple({
          user: userId,
          temple:templeId,
          categoryrole: data.role,
          subcategory:subcategoryId,
          startDate: data.startDate,
          endDate: data.endDate,
          isactive: true,
          status:"APPROVED"
        });
        message.success("User assigned successfully");
      } catch (err) {
        console.error(err);
        message.error("Failed to assign user");
      } finally {
        setSaving(prev => ({ ...prev, [userId]: false }));
      }
    };
  
    const updateFormData = (userId, field, value) => {
      setFormData(prev => ({
        ...prev,
        [userId]: {
          ...prev[userId],
          [field]: value,
        },
      }));
    };
  
    return (
      <div style={{ overflowX: "auto" }}>
<Collapse style={{ marginBottom: "1rem" }} defaultActiveKey={['1']}>
  <Panel header="Filter Users" key="1">
    <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center" }}>
      <Input
        placeholder="Search by username"
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ width: 200 }}
      />
      <Select
  placeholder="Gender"
  value={gender}
  onChange={value => setGender(value)}
  style={{ width: 120 }}
  allowClear
>
  <Option value="Male">Male</Option>
  <Option value="Female">Female</Option>
</Select>

<Input
  placeholder="Gotra"
  value={gotra}
  onChange={e => setGotra(e.target.value)}
  style={{ width: 120 }}
/>

<Input
  placeholder="Profession"
  value={profession}
  onChange={e => setProfession(e.target.value)}
  style={{ width: 150 }}
/>
      <InputNumber
        placeholder="Min Age"
        value={minAge}
        onChange={setMinAge}
        style={{ width: 100 }}
      />
      <InputNumber
        placeholder="Max Age"
        value={maxAge}
        onChange={setMaxAge}
        style={{ width: 100 }}
      />
      <Button type="primary" onClick={() => handleFilterChange()}>
        Apply Filter
      </Button>
    </div>
  </Panel>
</Collapse>
        <List
          itemLayout="vertical"
          dataSource={users}
          loadMore={
            hasMore && (
              <div style={{ textAlign: "center", marginTop: 12 }}>
                <Spin onClick={loadUsers} />
              </div>
            )
          }
          renderItem={user => (
            <List.Item key={user.id}>
              <div style={{
                display: "flex",
                gap: "1rem",
                alignItems: "center",
                minWidth: "800px", // enough space to fit in a row
                whiteSpace: "nowrap"
              }}>
                <Avatar style={{ minWidth: "40px" }}>{user.username.charAt(0)}</Avatar>
                <div style={{ minWidth: "150px" }}>{user.id}</div>
                <div style={{ minWidth: "150px" }}>{user.username}</div>
                <div style={{ minWidth: "200px" }}>{user.email}</div>
  
                <Select
                  placeholder="Select Role"
                  style={{ minWidth: "160px" }}
                  onChange={val => updateFormData(user.id, "role", val)}
                  value={formData[user.id]?.role}
                >
                  {roles.map(role => (
                    <Option key={role.id} value={role.id}>
                      {`${role.name}(${role.name_hi})`}
                    </Option>
                  ))}
                </Select>
  
                <DatePicker
                  placeholder="Start Date"
                  style={{ minWidth: "140px" }}
                  onChange={date => updateFormData(user.id, "startDate", date?.format("YYYY-MM-DD"))}
                  value={formData[user.id]?.startDate ? moment(formData[user.id].startDate) : null}
                />
  
                <DatePicker
                  placeholder="End Date"
                  style={{ minWidth: "140px" }}
                  onChange={date => updateFormData(user.id, "endDate", date?.format("YYYY-MM-DD"))}
                  value={formData[user.id]?.endDate ? moment(formData[user.id].endDate) : null}
                />
  
                <Button
                  type="primary"
                  loading={saving[user.id]}
                  onClick={() => handleSave(user.id)}
                >
                  Save
                </Button>
              </div>
            </List.Item>
          )}
        />
      </div>
    );
  };
  

export default TempleUserAssignmentList;
