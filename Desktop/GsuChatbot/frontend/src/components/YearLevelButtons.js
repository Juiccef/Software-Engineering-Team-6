import React from 'react';
import { GSU } from '../constants/colors';

function YearLevelButtons({ onSelect, onSendMessage }) {
  const yearLevels = [
    { id: 'freshman', label: 'Freshman', color: GSU.blue },
    { id: 'sophomore', label: 'Sophomore', color: '#17cf6e' },
    { id: 'junior', label: 'Junior', color: '#ff6b35' },
    { id: 'senior', label: 'Senior', color: '#8b5cf6' }
  ];

  const handleClick = (yearLevel) => {
    // Send the year level as a message
    if (onSendMessage) {
      onSendMessage({ 
        role: "user", 
        text: yearLevel.label.toLowerCase() 
      });
    }
    // Also call the onSelect callback if provided
    if (onSelect) {
      onSelect(yearLevel.id);
    }
  };

  return (
    <div style={{ 
      display: "flex", 
      flexWrap: "wrap", 
      gap: 8, 
      marginTop: 12,
      justifyContent: "center"
    }}>
      {yearLevels.map((level) => (
        <button
          key={level.id}
          onClick={() => handleClick(level)}
          style={{
            padding: "10px 20px",
            borderRadius: 12,
            border: `2px solid ${level.color}40`,
            background: `${level.color}15`,
            color: level.color,
            cursor: "pointer",
            fontSize: "0.9rem",
            fontWeight: 600,
            transition: "all 0.2s ease",
            minWidth: "100px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
          }}
          onMouseEnter={(e) => {
            e.target.style.background = `${level.color}25`;
            e.target.style.borderColor = level.color;
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.15)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = `${level.color}15`;
            e.target.style.borderColor = `${level.color}40`;
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
          }}
        >
          {level.label}
        </button>
      ))}
    </div>
  );
}

export default YearLevelButtons;

