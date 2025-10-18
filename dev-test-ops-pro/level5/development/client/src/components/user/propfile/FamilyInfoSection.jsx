"use client"

import React from "react"
import { useState } from "react"
import { Form, Input, Button, List, SwipeAction, Dialog, Empty } from "antd-mobile"
import { AddOutline, DeleteOutline } from "antd-mobile-icons"
import styles from "./profile-card.module.css"


const FamilyInfoSection =({ familyMembers, onAdd, onRemove }) => {
  const [form] = Form.useForm()
  const [isAdding, setIsAdding] = useState(false)
  
  const handleSubmit = (values) => {
    onAdd(values)
    setIsAdding(false)
    form.resetFields()
  }

  const handleDelete = async (id) => {
    const result = await Dialog.confirm({
      content: "Are you sure you want to remove this family member?",
    })

    if (result) {
      onRemove(id)
    }
  }

  if (isAdding) {
    return (
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        footer={
          <div className={styles.formFooter}>
            <Button onClick={() => setIsAdding(false)} className={styles.cancelButton}>
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Add Member
            </Button>
          </div>
        }
      >
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input placeholder="Enter name" />
        </Form.Item>

        <Form.Item name="relation" label="Relation" rules={[{ required: true }]}>
          <Input placeholder="E.g. Spouse, Child, Parent" />
        </Form.Item>

        <Form.Item name="age" label="Age">
          <Input placeholder="Enter age" type="number" />
        </Form.Item>

        <Form.Item name="occupation" label="Occupation">
          <Input placeholder="Enter occupation" />
        </Form.Item>

        <Form.Item name="contact" label="Contact Number">
          <Input placeholder="Enter contact number" />
        </Form.Item>
      </Form>
    )
  }

  return (
    <div className={styles.sectionContent}>
      {familyMembers.length === 0 ? (
        <Empty description="No family members added yet" className={styles.emptyState} />
      ) : (
        <List className={styles.list}>
          {familyMembers.map((member) => (
            <SwipeAction
              key={member.id}
              rightActions={[
                {
                  key: "delete",
                  text: <DeleteOutline />,
                  color: "danger",
                  onClick: () => handleDelete(member.id),
                },
              ]}
            >
              <List.Item
                title={member.name}
                description={`${member.relation} • ${member.age} years`}
                extra={member.occupation}
              />
            </SwipeAction>
          ))}
        </List>
      )}

      <Button className={styles.addButton} onClick={() => setIsAdding(true)} block>
        <AddOutline /> Add Family Member
      </Button>
    </div>
  )
}

export default FamilyInfoSection
