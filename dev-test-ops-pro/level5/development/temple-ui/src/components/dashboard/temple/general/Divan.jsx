import React, { useState } from 'react';
import './Diwansahab.css';

const DiwansahbCard = ({ person }) => {
  console.log("person", person)
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const renderContent = (content) => {
    return content.map((item, index) => {
      if (typeof item === 'string') {
        return <p key={index}>{item}</p>;
      } else if (item.type === 'poem') {
        return (
          <div key={index} className="poem">
            {item.content.map((line, i) => (
              <React.Fragment key={i}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </div>
        );
      }
      return null;
    });
  };

  return (
    <div className="person-card">
      <div className="card-header">
        <div className="avatar-section">
          <div className="avatar-placeholder">
            <img src={person.avatar} alt={person.name} />
          </div>
        </div>
        <div className="details-section">
          <h2>{person.name}</h2>
          <div className="timeline-details">
            {Object.entries(person.details).map(([label, value]) => (
              <div key={label} className="detail-item">
                <span className="detail-label">{label}:</span>
                <span className="detail-value">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card-body">
        <div className={`brief ${expanded ? 'expanded' : ''}`}>
          {expanded ? (
            renderContent(person.fullText)
          ) : (
            <p>{person.brief}</p>
          )}
        </div>
        <button className="expand-button" onClick={toggleExpand}>
          {expanded ? 'कम देखें' : 'अधिक जानें...'}
        </button>
      </div>
    </div>
  );
};

export default DiwansahbCard;