import { useState } from 'react'
import { Input, CapsuleTabs, Toast } from 'antd-mobile'
import { SearchOutline } from 'antd-mobile-icons'

const tags = ['Cricket', 'Science', 'Quiz', 'News']

export default function SearchHeader() {
  const [value, setValue] = useState('')

  const handleSubmit = (val) => {
    console.log('Search:', val)
    Toast.show({ content: `Searching: ${val}`, duration: 800 })
  }

  const handleTagClick = (tag) => {
    setValue(tag)
    console.log('Tag Clicked:', tag)
  }

  return (
    <div style={{
      backgroundColor: '#fff',
      padding: '12px 16px',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: '#f5f5f5',
        borderRadius: '20px',
        padding: '8px 12px',
        border: '1px solid #eee'
      }}>
        <SearchOutline style={{ fontSize: 20, marginRight: 8, color: '#999' }} />
        <Input
          value={value}
          onChange={setValue}
          onEnterPress={() => handleSubmit(value)}
          placeholder="Search communities, businesses, or education..."
          style={{
            '--font-size': '15px',
            '--placeholder-color': '#aaa',
            flex: 1,
            backgroundColor: 'transparent'
          }}
        />
      </div>

      <div style={{
        marginTop: 12,
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        {tags.map(tag => (
          <div
            key={tag}
            onClick={() => handleTagClick(tag)}
            style={{
              background: '#fef3e2',
              color: '#e67e22',
              padding: '6px 14px',
              borderRadius: '16px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              userSelect: 'none'
            }}
          >
            {tag}
          </div>
        ))}
      </div>
    </div>
  )
}
