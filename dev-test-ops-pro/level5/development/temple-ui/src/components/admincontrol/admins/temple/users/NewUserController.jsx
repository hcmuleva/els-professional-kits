import React, { useRef } from 'react';
import RegisterPage from '../../../../../pages/authpage/RegisterPage';
import { useParams } from 'react-router-dom';
export default function NewUserController({templeId}) {
    const userListRef = useRef();
    const {id} =useParams();
    const handleUserCreated = ({}) => {
   
      if (userListRef.current?.reloadUsers) {
        userListRef.current.reloadUsers();
      }
    };
  
    return (
      <div>
        <RegisterPage onUserCreated={handleUserCreated} />
      </div>
    );
  };
  
