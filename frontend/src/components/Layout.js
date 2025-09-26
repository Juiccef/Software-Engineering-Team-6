import React, { useState } from 'react';
import HeaderBar from './HeaderBar';
import Sidebar from './Sidebar';

function Layout({ children, messages = [], onSendMessage, onQuickAction, showChatBox = true, mode, onToggleTheme, onLogoClick, onNavigate }) {
  const [sidebar, setSidebar] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  return (
    <div style={{ 
      display: "flex", 
      height: "100vh", 
      background: "var(--bg)",
      color: "var(--fg)"
    }}>
      {/* Sidebar */}
      <Sidebar 
        open={sidebar} 
        onClose={() => setSidebar(false)} 
        onGo={(route) => {
          setSidebar(false);
          if (onNavigate) {
            onNavigate(route);
          }
        }} 
      />

      {/* Main Content Area */}
      <div style={{ 
        flex: 1, 
        display: "flex", 
        flexDirection: "column",
        overflow: "hidden"
      }}>
        {/* Header */}
        <HeaderBar
          onHamburger={() => setSidebar(true)}
          onToggleTheme={onToggleTheme}
          mode={mode}
          onLogoClick={onLogoClick}
        />

        {/* Content Area */}
        <div style={{ 
          flex: 1, 
          display: "flex", 
          flexDirection: "column",
          overflow: "hidden",
          marginTop: "64px" // Account for fixed header height
        }}>
          {/* Main Content */}
          <div style={{ 
            flex: 1, 
            overflow: "auto",
            padding: "16px 16px 80px 16px" // Extra bottom padding for fixed input bar
          }}>
            {children}
          </div>

          {/* Bottom Input Bar */}
          {showChatBox && (
            <div style={{ 
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              background: "var(--bg)",
              borderTop: "1px solid var(--line)",
              padding: "16px",
              zIndex: 100
            }}>
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 12,
                maxWidth: "100%"
              }}>
                <div style={{ 
                  flex: 1,
                  position: "relative"
                }}>
                  <input
                    placeholder="Enter a prompt here..."
                    style={{ 
                      width: "100%",
                      background: "var(--card)", 
                      color: "var(--fg)", 
                      border: "1px solid var(--line)", 
                      padding: "12px 16px 12px 16px", 
                      borderRadius: 12,
                      fontSize: 14,
                      minHeight: 44,
                      outline: "none"
                    }}
                  />
                  <div style={{ 
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    opacity: 0.6
                  }}>
                    🎤
                  </div>
                </div>
                
                {/* Upload Button */}
                <button 
                  onClick={() => setShowUploadModal(true)}
                  style={{ 
                    background: "var(--card)",
                    color: "var(--fg)", 
                    border: "1px solid var(--line)", 
                    padding: "12px", 
                    borderRadius: "50%", 
                    cursor: "pointer",
                    width: 44,
                    height: 44,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "var(--hover)";
                    e.target.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "var(--card)";
                    e.target.style.transform = "scale(1)";
                  }}
                >
                  📤
                </button>
                
                <button 
                  style={{ 
                    background: "#0039A6",
                    color: "white", 
                    border: 0, 
                    padding: "12px", 
                    borderRadius: "50%", 
                    cursor: "pointer",
                    width: 44,
                    height: 44,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16
                  }}
                >
                  ✈️
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: 20
        }}>
          <div style={{
            background: "var(--card)",
            borderRadius: 20,
            padding: 0,
            width: "100%",
            maxWidth: 450,
            border: "3px solid var(--line)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
            overflow: "hidden",
            position: "relative"
          }}>
            {/* Box Lid - Top Section */}
            <div style={{
              background: `linear-gradient(135deg, #0039A6 0%, #1e3f7f 100%)`,
              padding: "20px 24px",
              color: "white",
              position: "relative"
            }}>
              <div style={{
                position: "absolute",
                top: -10,
                right: -10,
                width: 40,
                height: 40,
                background: "rgba(255,255,255,0.2)",
                borderRadius: "50%"
              }} />
              <div style={{
                position: "absolute",
                bottom: -15,
                right: -15,
                width: 60,
                height: 60,
                background: "rgba(255,255,255,0.1)",
                borderRadius: "50%"
              }} />
              
              <div style={{ position: "relative", zIndex: 1 }}>
                <h2 style={{
                  margin: "0 0 8px 0",
                  fontSize: "1.4rem",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  gap: 8
                }}>
                  📦 Upload Files
                </h2>
                <p style={{ 
                  margin: 0, 
                  opacity: 0.9, 
                  fontSize: "0.95rem" 
                }}>
                  Drop your files into the box below
                </p>
              </div>
            </div>

            {/* Box Content - Main Area */}
            <div style={{ padding: "24px" }}>
              <div style={{
                border: "3px dashed var(--line)",
                borderRadius: 16,
                padding: "40px 20px",
                textAlign: "center",
                marginBottom: 24,
                cursor: "pointer",
                transition: "all 0.3s ease",
                background: "var(--bg)",
                position: "relative",
                overflow: "hidden"
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = "#0039A6";
                e.target.style.background = `#0039A608`;
                e.target.style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = "var(--line)";
                e.target.style.background = "var(--bg)";
                e.target.style.transform = "scale(1)";
              }}
              >
                {/* Box Interior Decoration */}
                <div style={{
                  position: "absolute",
                  top: 10,
                  left: 10,
                  width: 20,
                  height: 20,
                  border: "2px solid var(--line)",
                  borderRadius: 4,
                  opacity: 0.3
                }} />
                <div style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  width: 20,
                  height: 20,
                  border: "2px solid var(--line)",
                  borderRadius: 4,
                  opacity: 0.3
                }} />
                <div style={{
                  position: "absolute",
                  bottom: 10,
                  left: 10,
                  width: 20,
                  height: 20,
                  border: "2px solid var(--line)",
                  borderRadius: 4,
                  opacity: 0.3
                }} />
                <div style={{
                  position: "absolute",
                  bottom: 10,
                  right: 10,
                  width: 20,
                  height: 20,
                  border: "2px solid var(--line)",
                  borderRadius: 4,
                  opacity: 0.3
                }} />

                <div style={{ fontSize: "3rem", marginBottom: 12 }}>📁</div>
                <p style={{ 
                  margin: "0 0 8px 0", 
                  color: "var(--fg)",
                  fontSize: "1.1rem",
                  fontWeight: 600
                }}>
                  Open the box and drop your files
                </p>
                <p style={{ 
                  margin: 0, 
                  opacity: 0.7, 
                  fontSize: "0.95rem" 
                }}>
                  Click to browse or drag files here
                </p>
              </div>

              <div style={{
                display: "flex",
                gap: 12,
                justifyContent: "flex-end"
              }}>
                <button
                  onClick={() => setShowUploadModal(false)}
                  style={{
                    background: "transparent",
                    color: "var(--fg)",
                    border: "2px solid var(--line)",
                    padding: "12px 24px",
                    borderRadius: 12,
                    cursor: "pointer",
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "var(--hover)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "transparent";
                  }}
                >
                  Close Box
                </button>
                <button
                  onClick={() => {
                    // Handle file upload logic here
                    setShowUploadModal(false);
                  }}
                  style={{
                    background: "#0039A6",
                    color: "white",
                    border: "none",
                    padding: "12px 24px",
                    borderRadius: 12,
                    cursor: "pointer",
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "#1e3f7f";
                    e.target.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "#0039A6";
                    e.target.style.transform = "translateY(0)";
                  }}
                >
                  Upload Files
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Layout;
