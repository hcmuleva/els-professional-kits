import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';

import { Input, Select, Button, Row, Col, Card, Spin } from 'antd';
import { fetchCustomTempleUsers } from '../../../../../services/temple';
const { Option } = Select;

const PAGE_SIZE = 10;

const UserListWithFilters =  forwardRef(({ templeId }, ref)  => {
  const [users, setUsers] = useState([]);
  const [gender, setGender] = useState(undefined);
  const [minAge, setMinAge] = useState(undefined);
  const [maxAge, setMaxAge] = useState(undefined);
  const [gotra, setGotra] = useState('');
  const [profession, setProfession] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const loadUsers = async (reset = false) => {
    setLoading(true);
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
        setPage(2);
      } else {
        setUsers(prev => [...prev, ...fetchedUsers]);
        setPage(prev => prev + 1);
      }

      setHasMore(fetchedUsers.length >= PAGE_SIZE);
    } catch (err) {
      console.error('Error fetching temple users:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUsers(true);
  }, [gender, minAge, maxAge, search, gotra, profession]);
  useImperativeHandle(ref, () => ({
    reloadUsers: () => loadUsers(true),
  }));
  return (
    <div>
      <Card title="User Filters" style={{ marginBottom: 16 }}>
        <Row gutter={8}>
          <Col span={6}>
            <Select
              allowClear
              placeholder="Gender"
              value={gender}
              onChange={val => setGender(val)}
              style={{ width: '100%' }}
            >
              <Option value="Male">Male</Option>
              <Option value="Female">Female</Option>
            </Select>
          </Col>
          <Col span={6}>
            <Input
              type="number"
              placeholder="Min Age"
              value={minAge}
              onChange={e => setMinAge(e.target.value)}
            />
          </Col>
          <Col span={6}>
            <Input
              type="number"
              placeholder="Max Age"
              value={maxAge}
              onChange={e => setMaxAge(e.target.value)}
            />
          </Col>
          <Col span={6}>
            <Input
              placeholder="Gotra"
              value={gotra}
              onChange={e => setGotra(e.target.value)}
            />
          </Col>
          <Col span={6} style={{ marginTop: 8 }}>
            <Input
              placeholder="Profession"
              value={profession}
              onChange={e => setProfession(e.target.value)}
            />
          </Col>
          <Col span={6} style={{ marginTop: 8 }}>
            <Input
              placeholder="Search Name or Mobile"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </Col>
          <Col span={6} style={{ marginTop: 8 }}>
            <Button type="primary" onClick={() => loadUsers(true)}>
              Apply Filters
            </Button>
          </Col>
        </Row>
      </Card>

      <div>
        {users.map(user => (
          <Card key={user.id} style={{ marginBottom: 8 }}>
            <strong>{user.first_name} {user.last_name}</strong><br />
            Gender: {user.gender}, Age: {user.age}, Gotra: {user.gotra}<br />
            Profession: {user.profession}, Mobile: {user.mobile}
          </Card>
        ))}
        {loading && <Spin />}
        {!loading && hasMore && (
          <Button block onClick={() => loadUsers()} style={{ marginTop: 16 }}>
            Load More
          </Button>
        )}
        {!hasMore && (
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <b>No more users.</b>
          </div>
        )}
      </div>
    </div>
  );
});

export default UserListWithFilters;
