import React, { useState, useContext } from "react";
import LoginPage from "../../pages/authpage/LoginPage";
import RegisterPage from "../../pages/authpage/RegisterPage";

const MyLogin = ({ setIsLogined }) => {
  const [isLogined, setIsLogined] = useState(true);

  return (
    <>
      {
        isLogined ? (
          <LoginPage isLogined={isLogined} setIsLogined={setIsLogined} />
        ) : (
          <RegisterPage isLogined={isLogined} setIsLogined={setIsLogined} />
        )
        // <ReferralRegistration isLogined={isLogined} setIsLogined={setIsLogined}/>
      }
    </>
  );
};

export default MyLogin;
