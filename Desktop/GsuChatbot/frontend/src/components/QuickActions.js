import React from 'react';
import { GSU } from '../constants/colors';

function QuickActions({ onActionClick }) {
  const actions = [
    { id: 'transcript', label: 'Upload Transcripts', color: GSU.blue },
    { id: 'audit', label: 'Check Degree Audit', color: '#17cf6e' },
    { id: 'schedule', label: 'Build Schedule', color: '#ff6b35' },
    { id: 'resources', label: 'Find Resources', color: '#8b5cf6' },
    { id: 'events', label: 'Campus Events', color: '#f59e0b' },
    { id: 'voice', label: 'Voice Chat', color: '#ef4444' }
  ];

  return (
    <div style={{ 
      display: "flex", 
      flexWrap: "wrap", 
      gap: 6, 
      marginTop: 8,
      justifyContent: "center"
    }}>
      {actions.map((action) => (
        <button
          key={action.id}
          onClick={() => onActionClick(action.id)}
          style={{
            padding: "6px 10px",
            borderRadius: 16,
            border: `1px solid ${action.color}40`,
            background: `${action.color}10`,
            color: action.color,
            cursor: "pointer",
            fontSize: "0.75rem",
            fontWeight: 500,
            transition: "all 0.2s ease",
            minWidth: "fit-content"
          }}
          onMouseOver={(e) => {
            e.target.style.background = `${action.color}20`;
            e.target.style.borderColor = action.color;
            e.target.style.transform = "translateY(-1px)";
          }}
          onMouseOut={(e) => {
            e.target.style.background = `${action.color}10`;
            e.target.style.borderColor = `${action.color}40`;
            e.target.style.transform = "translateY(0)";
          }}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}

export default QuickActions;
