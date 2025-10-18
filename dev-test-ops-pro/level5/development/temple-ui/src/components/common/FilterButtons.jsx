import React from 'react';
import { Button } from 'antd-mobile';

const FilterButtons = () => {
  return (
    <div style={{
      display: 'flex',
      gap: '10px',
      padding: '0 15px 20px',
      overflowX: 'auto'
    }}>
      <Button
        style={{
          borderRadius: '20px',
          backgroundColor: '#f5f5f5',
          color: '#333',
          fontWeight: 'normal',
          padding: '5px 15px',
          fontSize: '14px',
          whiteSpace: 'nowrap'
        }}
      >
        Hardware
      </Button>
      <Button
        style={{
          borderRadius: '20px',
          backgroundColor: '#f5f5f5',
          color: '#333',
          fontWeight: 'normal',
          padding: '5px 15px',
          fontSize: '14px',
          whiteSpace: 'nowrap'
        }}
      >
        All Types
      </Button>
      <Button
        style={{
          borderRadius: '20px',
          backgroundColor: '#f5f5f5',
          color: '#333',
          fontWeight: 'normal',
          padding: '5px 15px',
          fontSize: '14px',
          whiteSpace: 'nowrap'
        }}
      >
        Maxmembers
      </Button>
    </div>
  );
};

export default FilterButtons;