import React from 'react';
import { GSU } from '../constants/colors';

function ScreenHome({ onStart, onGoChat, onGoToFiles, onGoToHistory }) {
  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      gap: 20,
      height: "100%",
      width: "100%",
      padding: "0 16px"
    }}>
      {/* App Title Section */}
      <div style={{ 
        textAlign: "center",
        padding: "20px 0 16px 0"
      }}>
        <h1 style={{ 
          margin: "0 0 8px 0", 
          fontSize: "2rem", 
          fontWeight: "bold", 
          color: "var(--fg)" 
        }}>
          GSU Panther Chat
        </h1>
        <p style={{ 
          margin: "0 0 12px 0", 
          opacity: 0.7, 
          fontSize: "1rem" 
        }}>
          Your AI-powered academic assistant
        </p>
        <p style={{ 
          margin: "0 auto", 
          opacity: 0.8, 
          fontSize: "0.95rem", 
          lineHeight: 1.5,
          maxWidth: "600px"
        }}>
          Get personalized course recommendations and degree planning assistance tailored to your academic goals and requirements.
        </p>
        <p style={{ 
          margin: "12px auto 0 auto", 
          opacity: 0.7, 
          fontSize: "0.9rem", 
          lineHeight: 1.4,
          maxWidth: "500px"
        }}>
          Advanced AI-powered recommendations based on your academic history and career goals.
        </p>
        <p style={{ 
          margin: "8px auto 0 auto", 
          opacity: 0.6, 
          fontSize: "0.85rem", 
          lineHeight: 1.4,
          maxWidth: "450px"
        }}>
          Smart course suggestions tailored to your academic path.
        </p>
      </div>


      {/* Feature Cards */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "1fr 1fr", 
        gap: 16 
      }}>
        {/* Academic Planning Card */}
        <div 
          onClick={() => onGoToFiles('academic')}
          style={{ 
            background: "var(--card)",
            borderRadius: 16,
            padding: 20,
            border: "1px solid var(--line)",
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 8px 25px rgba(0,0,0,0.1)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "none";
          }}
        >
          <div style={{ 
            width: 48,
            height: 48,
            background: `${GSU.blue}20`,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 16,
            fontSize: "1.5rem"
          }}>
            📚
          </div>
          <h3 style={{ margin: "0 0 8px 0", fontSize: "1.1rem", fontWeight: "bold", color: "var(--fg)" }}>
            Academic Planning
          </h3>
          <p style={{ margin: "0 0 16px 0", opacity: 0.7, fontSize: "0.9rem", lineHeight: 1.4 }}>
            Advanced AI-powered recommendations based on your academic history
          </p>
          <div style={{ 
            width: 32,
            height: 32,
            background: "var(--line)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: "auto",
            cursor: "pointer"
          }}>
            →
          </div>
        </div>

        {/* Schedule Building Card */}
        <div 
          onClick={() => onGoToFiles('schedule')}
          style={{ 
            background: "var(--card)",
            borderRadius: 16,
            padding: 20,
            border: "1px solid var(--line)",
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 8px 25px rgba(0,0,0,0.1)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "none";
          }}
        >
          <div style={{ 
            width: 48,
            height: 48,
            background: `${GSU.blue}20`,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 16,
            fontSize: "1.5rem"
          }}>
            📅
          </div>
          <h3 style={{ margin: "0 0 8px 0", fontSize: "1.1rem", fontWeight: "bold", color: "var(--fg)" }}>
            Schedule Building
          </h3>
          <p style={{ margin: "0 0 16px 0", opacity: 0.7, fontSize: "0.9rem", lineHeight: 1.4 }}>
            Build optimal class schedules that fit your preferences and requirements
          </p>
          <div style={{ 
            width: 32,
            height: 32,
            background: "var(--line)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: "auto",
            cursor: "pointer"
          }}>
            →
          </div>
        </div>
      </div>

      {/* Recent History Section */}
      <div style={{ marginTop: 8 }}>
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          marginBottom: 16
        }}>
          <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: "bold", color: "var(--fg)" }}>
            Recent history
          </h3>
          <span 
            onClick={onGoToHistory}
            style={{ 
              color: "var(--fg)", 
              opacity: 0.7, 
              fontSize: "0.9rem",
              cursor: "pointer",
              padding: "4px 8px",
              borderRadius: 6,
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.target.style.opacity = "1";
              e.target.style.background = "var(--hover)";
            }}
            onMouseLeave={(e) => {
              e.target.style.opacity = "0.7";
              e.target.style.background = "transparent";
            }}
          >
            See all
          </span>
        </div>
        
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ 
            background: "var(--card)",
            borderRadius: 12,
            padding: 16,
            border: "1px solid var(--line)",
            display: "flex",
            alignItems: "center",
            gap: 12
          }}>
            <div style={{ 
              width: 40,
              height: 40,
              background: `${GSU.blue}20`,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.2rem"
            }}>
              💬
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: "0.95rem", color: "var(--fg)" }}>
                Help me plan my next semester courses
              </p>
            </div>
            <div style={{ 
              width: 24,
              height: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              opacity: 0.6
            }}>
              ⋮
            </div>
          </div>
          
          <div style={{ 
            background: "var(--card)",
            borderRadius: 12,
            padding: 16,
            border: "1px solid var(--line)",
            display: "flex",
            alignItems: "center",
            gap: 12
          }}>
            <div style={{ 
              width: 40,
              height: 40,
              background: `${GSU.blue}20`,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.2rem"
            }}>
              🎤
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: "0.95rem", color: "var(--fg)" }}>
                What campus resources are available?
              </p>
            </div>
            <div style={{ 
              width: 24,
              height: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              opacity: 0.6
            }}>
              ⋮
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScreenHome;