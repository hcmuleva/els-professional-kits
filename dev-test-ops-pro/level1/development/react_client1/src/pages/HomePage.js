import { useEffect, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../AuthContext";

import { useNavigate } from "react-router-dom";
import API from "../api";

export default function HomePage() {
  const navigate = useNavigate();
  const { setToken } = useContext(AuthContext);

  const handleLogout = () => {
    setToken(null); // ✅ Use context
    navigate("/login");
  };


  return (
    <div>
      <h2>Home</h2>
      {/* {user ? <p>Welcome, {user.name}!</p> : <p>Loading...</p>} */}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
