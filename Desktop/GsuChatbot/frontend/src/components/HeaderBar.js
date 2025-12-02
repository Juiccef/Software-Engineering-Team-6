import React from 'react';

function HeaderBar({ onHamburger, onToggleTheme, mode, onLogoClick }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000, // Below sidebar (4000-4001) but above content
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 14px",
        background: "var(--bg)",
        color: "var(--fg)",
        borderBottom: "1px solid var(--line)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
      }}
    >
      <button
        onClick={onHamburger}
        aria-label="Open menu"
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          border: `1px solid var(--line)`,
          background: "transparent",
          color: "var(--fg)",
          display: "grid",
          placeItems: "center",
          fontSize: 20,
          cursor: "pointer",
        }}
      >
        ≡
      </button>
      
      <div 
        onClick={onLogoClick}
        style={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          cursor: "pointer",
          padding: "4px 8px",
          borderRadius: 8,
          transition: "background 0.2s ease"
        }}
        onMouseEnter={(e) => {
          e.target.style.background = "var(--hover)";
        }}
        onMouseLeave={(e) => {
          e.target.style.background = "transparent";
        }}
      >
        <img 
          src="/gsu-panther-logo.png" 
          alt="GSU Panther" 
          width={40} 
          height={40} 
        />
      </div>
      <button
        onClick={onToggleTheme}
        aria-label="Toggle theme"
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          border: `1px solid var(--line)`,
          background: "transparent",
          color: "var(--fg)",
          display: "grid",
          placeItems: "center",
          fontSize: 14,
          cursor: "pointer",
          fontWeight: 700,
        }}
      >
        {mode === "dark" ? "🌙" : "☀️"}
      </button>
    </div>
  );
}

export default HeaderBar;
