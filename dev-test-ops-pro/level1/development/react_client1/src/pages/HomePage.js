import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import API from "../api";

export default function HomePage() {
  const navigate = useNavigate();
  const { token, setToken } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ username: "", email: "", password: "", role: "student" });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    if (!token) navigate("/login");
    else fetchUsers();
  }, [token]);

  const fetchUsers = async () => {
    const res = await API.get("/api/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(res.data);
  };

  const handleLogout = () => {
    setToken(null);
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = editId ? `/api/users/${editId}` : "/api/users";
    const method = editId ? "put" : "post";

    await API[method](endpoint, form, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setForm({ username: "", email: "", password: "", role: "student" });
    setEditId(null);
    fetchUsers();
  };

  const handleEdit = (user) => {
    setForm({ username: user.username, email: user.email, password: "", role: user.role });
    setEditId(user.id);
  };

  const handleDelete = async (id) => {
    await API.delete(`/api/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchUsers();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>User Management</h2>
      <button onClick={handleLogout}>Logout</button>

      <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
        <input
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required={!editId}
        />
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">{editId ? "Update" : "Add"} User</button>
      </form>

      <table border="1" style={{ marginTop: 20, width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th><th>Username</th><th>Email</th><th>Role</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <button onClick={() => handleEdit(u)}>Edit</button>
                <button onClick={() => handleDelete(u.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
