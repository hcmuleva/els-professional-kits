import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import { useContext } from "react";

import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import { AuthContext } from "./AuthContext";

function App() {
  const { token } = useContext(AuthContext); // ✅ Use context instead of localStorage

  return (
    <Router>
      <Routes>
        <Route path="/login" element={token ? <Navigate to="/home" /> : <LoginPage />} />
        <Route path="/register" element={token ? <Navigate to="/home" /> : <RegisterPage />} />
        <Route path="/home" element={token ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
