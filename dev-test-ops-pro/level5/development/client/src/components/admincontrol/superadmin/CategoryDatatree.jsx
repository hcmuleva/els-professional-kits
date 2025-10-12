import React from 'react'
import { Tree, Typography } from "antd";

const { Title } = Typography;
  
export default function CategoryDatatree({data}) {
  return (
    <div style={{ marginTop: 24 }}>
      <Title level={4}>Business Types Tree View</Title>
      <Tree
        treeData={data}
        defaultExpandAll
        selectable={false}
      />
    </div>
  )
}
