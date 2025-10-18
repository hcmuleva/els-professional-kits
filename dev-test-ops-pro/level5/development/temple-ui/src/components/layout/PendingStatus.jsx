import { Button, Result } from 'antd'
import React from 'react'
import { AuthContext, useAuth } from '../../contexts/AuthContext'

export default function PendingStatus() {
    const {user} = useAuth(AuthContext)
  return (
    <Result
    status="403"
    title="403"
    subTitle={`Sorry, Your profile Id ${user.id} userId ${user.username}is in pending state.`}
    extra={<Button type="primary">Back Home</Button>}
  />
  )
}
