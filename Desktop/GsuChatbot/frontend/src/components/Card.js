import React from 'react';

function Card({ children, style }) {
  return (
    <div
      style={{
        background: "var(--card)",
        border: "1px solid var(--line)",
        borderRadius: 16,
        padding: 16,
        boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export default Card;
