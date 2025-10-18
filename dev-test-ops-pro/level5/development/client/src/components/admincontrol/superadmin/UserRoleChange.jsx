import React, { useState } from 'react';
import axios from 'axios';
import { searchUserWithQuery, updateUserProfile } from '../../../services/user';


export default function UserRoleChange() {
    const [query, setQuery] = useState('');
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newRole, setNewRole] = useState('');
  
    const handleSearch = async () => {
      if (!query.trim()) return;
  
      try {
        const response = await searchUserWithQuery(query)
        console.log("response", response)
        setUsers(response);
      } catch (error) {
        console.error('Search error:', error);
      }
    };
  
    const handleRoleChange = async () => {
      if (!selectedUser || !newRole) return;
  
      try {
        updateUserProfile(selectedUser.id, {userrole: newRole})
        alert('Role updated successfully!');
        setQuery('');
        setUsers([]);
        setSelectedUser(null);
        setNewRole('');
      } catch (error) {
        console.error('Error updating role:', error);
      }
    };
  return (
    <div style={{ padding: 20 }}>
      <h2>User Role Management</h2>
      <input
        type="text"
        placeholder="Enter username/email/mobile/id"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ marginRight: 10 }}
      />
      <button onClick={handleSearch}>Search</button>

      {users.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h3>Select a User</h3>
          <ul>
            {users.map((user) => (
              <li key={user.id}>
                <label>
                  <input
                    type="radio"
                    name="selectedUser"
                    value={user.id}
                    checked={selectedUser?.id === user.id}
                    onChange={() => setSelectedUser(user)}
                  />
                  {user.username} ({user.email})
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedUser && (
        <div style={{ marginTop: 20 }}>
          <h3>Change Role for {selectedUser.username}</h3>
          <select
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
          >
            <option value="">Select Role</option>
            <option value="ADMIN">ADMIN</option>
            <option value="USER">USER</option>
            <option value="CENTER">CENTER</option>
            <option value="SUPERADMIN">SUPERADMIN</option>
          </select>
          <button onClick={handleRoleChange} style={{ marginLeft: 10 }}>
            Update Role
          </button>
        </div>
      )}
    </div>
  );
}
