import React from 'react';

function Badge({ children }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "6px 10px",
        borderRadius: 999,
        background: "rgba(0,0,0,0.08)",
        border: `1px solid var(--line)`,
        fontSize: 12,
        gap: 6,
      }}
    >
      {children}
    </span>
  );
}

export default Badge;
