import React, { useState } from 'react';
import {
  FireOutlined,
  StarOutlined,
  BookOutlined,
  TeamOutlined,
  HistoryOutlined,
  StarFilled
} from '@ant-design/icons';
import Arati from './Arati';
import BelKeNiyam from './BelKeNiyam';
import Diwansahablist from './Diwansahablist';
import Itihaas from './Itihas'; // Importing the Itihas component
import PoojaPath from './dharmik/pooja/PoojaPath';

const componentMap = {
  arati: <Arati />,
  belkeNiyam: <BelKeNiyam />,
  diwansahab: <Diwansahablist />,
  itihaas: <Itihaas /> ,// Adding the Itihas component to the map
  poojapath:<PoojaPath />
};

const buttonConfig = [
  { key: 'poojapath', icon: <FireOutlined style={{ fontSize: 20, color: '#921e05' }}/>, label: 'पूजा' },
  { key: 'arati', icon: <StarFilled style={{ fontSize: 20, color: '#921e05' }}/>, label: 'आईमाता' },
  { key: 'belkeNiyam', icon: <BookOutlined style={{ fontSize: 20, color: '#921e05' }}/>, label: 'नियम' },
  { key: 'diwansahab', icon: <TeamOutlined style={{ fontSize: 20, color: '#921e05' }}/>, label: 'दीवानसाहेब' },
  { 
    key: 'itihaas',  // Added new key for history 
    icon: <HistoryOutlined style={{ fontSize: 20, color: '#921e05' }} />,  // Changed icon
    label: 'इतिहास',  // Corrected Hindi spelling
    description: 'दीवान साहिब का इतिहास'
  }
];
export default function GeneralAllInOne() {
  const [activeComponent, setActiveComponent] = useState('poojapath');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Fixed top panel */}
      <div style={{
        backgroundColor: '#FF9933', // Saffron color
        padding: '12px 16px',
        display: 'flex',
        justifyContent: 'center',
        gap: '24px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        zIndex: 100,
        position: 'sticky',
        top: 0
      }}>
        {buttonConfig.map((btn) => (
          <button
            key={btn.key}
            onClick={() => setActiveComponent(btn.key)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: 'none',
              border: 'none',
              color: activeComponent === btn.key ? '#fff' : 'rgba(255,255,255,0.8)',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: activeComponent === btn.key ? 'bold' : 'normal',
              padding: '4px 8px',
              borderRadius: '4px'
            }}
          >
            <div style={{ fontSize: '20px', marginBottom: '4px' }}>{btn.icon}</div>
            <span>{btn.label}</span>
          </button>
        ))}
      </div>

      {/* Content area */}
      <div style={{ flex: 1, padding: '1px' }}>
        {componentMap[activeComponent]}
      </div>
    </div>
  );
}