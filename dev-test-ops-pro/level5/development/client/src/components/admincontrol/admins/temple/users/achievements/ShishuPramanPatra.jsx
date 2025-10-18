import React, { useRef } from 'react';
import { usePDF } from 'react-to-pdf';

import './ShishuPramanPatra.css';

const ShishuPramanPatra = ({
  babyName = 'शिशु का नाम',
  birthDate = '15-05-2023',
  birthTime = '10:30 AM',
  birthWeight = '3.2 किलोग्राम',
  parentsName = 'माता-पिता का नाम',
  hospitalName = 'जन्म स्थान',
  doctorName = 'डॉक्टर का नाम'
}) => {
    const certificateRef = useRef();

    const { toPDF, targetRef } = usePDF({
        filename: 'shishu-praman-patr.pdf',
        page: {
          margin: 10,
          format: 'a4',
          orientation: 'portrait'
        },
        // Add these options to improve PDF rendering
        canvas: {
          mimeType: 'image/jpeg',
          qualityRatio: 1
        },
        overrides: {
          // Remove shadows and effects that don't render well in PDF
          filter: 'none'
        }
      });
  return (
    <div className="certificate-container">
      <div ref={targetRef} className="shishu-certificate" style={{ height: '1123px' }}> {/* A4 height in pixels (297mm) */}

      <div className="border-decoration top-left"></div>
      <div className="border-decoration top-right"></div>
      <div className="border-decoration bottom-left"></div>
      <div className="border-decoration bottom-right"></div>
      
      <div className="header">
        <div className="lotus">🌸</div>
        <h1>शिशु प्रमाण पत्र</h1>
        <div className="lotus">🌸</div>
      </div>
      
      <div className="subheader">जन्म की शुभ सूचना</div>
      
      <div className="content">
        <div className="section">
          <p>यह प्रमाण पत्र इस बात का साक्षी है कि</p>
          <div className="baby-name">{babyName}</div>
          <p>का जन्म हुआ है</p>
        </div>
        
        <div className="details">
          <div className="detail-row">
            <span>जन्म तिथि:</span>
            <strong>{birthDate}</strong>
          </div>
          <div className="detail-row">
            <span>जन्म समय:</span>
            <strong>{birthTime}</strong>
          </div>
          <div className="detail-row">
            <span>जन्म के समय वजन:</span>
            <strong>{birthWeight}</strong>
          </div>
          <div className="detail-row">
            <span>माता-पिता:</span>
            <strong>{parentsName}</strong>
          </div>
          <div className="detail-row">
            <span>जन्म स्थान:</span>
            <strong>{hospitalName}</strong>
          </div>
          {/* <div className="detail-row">
            <span>चिकित्सक:</span>
            <strong>{doctorName}</strong>
          </div> */}
        </div>
      </div>
      
      <div className="blessings">
        <h3>हार्दिक शुभकामनाएं</h3>
        <div className="shloka">
          <p>आयु: शतं समा जीव, शरद: शतमुत्तमम् |</p>
          <p>पुत्रान् पौत्रांश्च धर्मार्थान्, दृश्यास्त्वं कीर्तिमान् भव ||</p>
        </div>
        <p className="meaning">(इस शिशु को सौ वर्ष की दीर्घ आयु प्राप्त हो, यह धर्म और अर्थ के लिए पुत्रों-पौत्रों को प्राप्त करे तथा यशस्वी बने)</p>
      </div>
      
      <div className="signatures">
        <div className="signature-box">
          <div className="signature-line"></div>
          <p>माता के हस्ताक्षर</p>
        </div>
        <div className="signature-box">
          <div className="signature-line"></div>
          <p>पिता के हस्ताक्षर</p>
        </div>
      </div>
      
      <div className="footer">
        <p>हमारे परिवार में नन्हें मेहमान के आगमन पर हर्षोल्लास</p>
      </div>
    </div>
    <div className="download-controls">
        <button 
          onClick={() => toPDF()} 
          className="download-button"
        >
          PDF डाउनलोड करें
        </button>
        
        <select 
          onChange={(e) => toPDF({ page: { orientation: e.target.value } })}
          className="format-select"
        >
          <option value="portrait">पोर्ट्रेट</option>
          <option value="landscape">लैंडस्केप</option>
        </select>
      </div>
    </div>
  );
};

export default ShishuPramanPatra;