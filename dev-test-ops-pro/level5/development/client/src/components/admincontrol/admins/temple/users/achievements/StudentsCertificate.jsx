import React from 'react';
import './StudentsCertificate.css';

export const StudentsCertificate = ({ 
  type = 'academic', // 'sports', 'academic', or 'innovation'
  studentName = 'Student Name',
  achievement = 'Outstanding Achievement',
  date = new Date().toLocaleDateString(),
  schoolName = 'School Name',
  signature = 'Principal',
  customMessage = 'This certificate is awarded in recognition of exemplary performance.'
}) => {
  
  // Background colors based on certificate type
  const bgColors = {
    sports: '#E3F2FD',
    academic: '#FFF8E1',
    innovation: '#E8F5E9'
  };

  // Border colors based on type
  const borderColors = {
    sports: '#2196F3',
    academic: '#FFC107',
    innovation: '#4CAF50'
  };

  // Icons based on type
  const icons = {
    sports: '🏆',
    academic: '📚',
    innovation: '💡'
  };

  return (
    <div 
      className="certificate-container" 
      style={{ 
        backgroundColor: bgColors[type],
        borderColor: borderColors[type]
      }}
    >
      <div className="certificate-header">
        <h1>CERTIFICATE OF ACHIEVEMENT</h1>
        <div className="certificate-icon">{icons[type]}</div>
        <h2>{type.toUpperCase()} EXCELLENCE</h2>
      </div>
      
      <div className="certificate-body">
        <p className="certificate-text">This is to certify that</p>
        <h3 className="student-name">{studentName}</h3>
        <p className="certificate-text">has demonstrated {customMessage.toLowerCase()} in</p>
        <h4 className="achievement">{achievement}</h4>
        
        <div className="details-grid">
          <div className="detail-item">
            <span className="detail-label">Date:</span>
            <span className="detail-value">{date}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Institute:</span>
            <span className="detail-value">{schoolName}</span>
          </div>
        </div>
      </div>
      
      <div className="certificate-footer">
        <div className="signature-block">
          <div className="signature-line"></div>
          <p className="signature-name">{signature}</p>
        </div>
      </div>
      
      <div className="certificate-border-decoration"></div>
    </div>
  );
};
