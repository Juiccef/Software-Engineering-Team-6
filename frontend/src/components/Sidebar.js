import React from 'react';

const navBtnStyle = {
  textAlign: "left",
  border: `1px solid var(--line)`,
  padding: "10px 12px",
  borderRadius: 12,
  background: "transparent",
  color: "var(--fg)",
  cursor: "pointer",
};

function Sidebar({ open, onClose, onGo }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: open ? "auto" : "none",
      }}
    >
      {/* backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: open ? "rgba(0,0,0,0.4)" : "transparent",
          transition: "background 200ms ease",
        }}
      />
      {/* panel (20% of left on desktop, 80% on mobile) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: "min(20vw, 360px)",
          maxWidth: "80vw",
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 240ms ease",
          background: "var(--card)",
          color: "var(--fg)",
          borderRight: "1px solid var(--line)",
          display: "flex",
          flexDirection: "column",
          padding: 16,
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <strong>Menu</strong>
          <button 
            onClick={onClose} 
            style={{ border: 0, background: "transparent", color: "var(--fg)", cursor: "pointer" }}
          >
            ✕
          </button>
        </div>
        <nav style={{ display: "grid", gap: 8 }}>
          <button className="navbtn" onClick={() => onGo("home")} style={navBtnStyle}>Home</button>
          <button className="navbtn" onClick={() => onGo("chat")} style={navBtnStyle}>Chat</button>
          <button className="navbtn" onClick={() => onGo("voice")} style={navBtnStyle}>Voice</button>
          <hr style={{ borderColor: "var(--line)", width: "100%" }} />
          <button className="navbtn" style={navBtnStyle}>Settings</button>
          <button className="navbtn" onClick={() => onGo("files")} style={navBtnStyle}>Files</button>
          <button className="navbtn" onClick={() => onGo("history")} style={navBtnStyle}>History</button>
        </nav>
        <div style={{ marginTop: "auto", fontSize: 12, opacity: 0.8 }}>
          GSU Blue/Black (dark) • GSU Blue/White (light)
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
