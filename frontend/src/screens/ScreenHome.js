import React from 'react';
import { GSU } from '../constants/colors';

function ScreenHome({ onStart, onGoChat, onGoToFiles, onGoToHistory, onGoVoice }) {
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
        {/* FBX Model Container */}
        <div 
          onClick={onGoVoice}
          style={{
            width: "100%",
            maxWidth: "800px",
            height: "400px",
            margin: "0 auto",
            background: "var(--card)",
            borderRadius: 16,
            border: "2px solid var(--line)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            cursor: "pointer",
            transition: "all 0.3s ease"
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-4px)";
            e.target.style.boxShadow = "0 12px 40px rgba(0,0,0,0.15)";
            e.target.style.borderColor = GSU.blue;
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 8px 32px rgba(0,0,0,0.1)";
            e.target.style.borderColor = "var(--line)";
          }}
        >
          {/* FBX Model Placeholder */}
          <div style={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg, var(--bg) 0%, var(--hover) 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative"
          }}>
            {/* Voice Assistant Icon */}
            <div style={{
              fontSize: "4rem",
              marginBottom: 16,
              opacity: 0.8
            }}>
              🎤
            </div>
            
            {/* Loading Indicator */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 12
            }}>
              <div style={{
                width: 8,
                height: 8,
                background: GSU.blue,
                borderRadius: "50%",
                animation: "pulse 1.5s infinite ease-in-out"
              }} />
              <div style={{
                width: 8,
                height: 8,
                background: GSU.blue,
                borderRadius: "50%",
                animation: "pulse 1.5s infinite ease-in-out 0.2s"
              }} />
              <div style={{
                width: 8,
                height: 8,
                background: GSU.blue,
                borderRadius: "50%",
                animation: "pulse 1.5s infinite ease-in-out 0.4s"
              }} />
            </div>
            
            {/* Status Text */}
            <p style={{
              margin: 0,
              fontSize: "1.1rem",
              fontWeight: 600,
              color: "var(--fg)",
              opacity: 0.8
            }}>
              🎤 Voice Assistant
            </p>
            <p style={{
              margin: "8px 0 0 0",
              fontSize: "0.9rem",
              color: "var(--fg)",
              opacity: 0.6,
              textAlign: "center"
            }}>
              Click to start voice chat
            </p>
          </div>
          
          {/* Corner Decorations */}
          <div style={{
            position: "absolute",
            top: 12,
            left: 12,
            width: 20,
            height: 20,
            border: "2px solid var(--line)",
            borderRadius: 4,
            opacity: 0.3
          }} />
          <div style={{
            position: "absolute",
            top: 12,
            right: 12,
            width: 20,
            height: 20,
            border: "2px solid var(--line)",
            borderRadius: 4,
            opacity: 0.3
          }} />
          <div style={{
            position: "absolute",
            bottom: 12,
            left: 12,
            width: 20,
            height: 20,
            border: "2px solid var(--line)",
            borderRadius: 4,
            opacity: 0.3
          }} />
          <div style={{
            position: "absolute",
            bottom: 12,
            right: 12,
            width: 20,
            height: 20,
            border: "2px solid var(--line)",
            borderRadius: 4,
            opacity: 0.3
          }} />
        </div>
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

      {/* Suggestions Section */}
      <div style={{ marginTop: 8 }}>
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          marginBottom: 16
        }}>
          <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: "bold", color: "var(--fg)" }}>
            💡 Quick Suggestions
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
            View History
          </span>
        </div>
        
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div 
            onClick={() => onGoToFiles('academic')}
            style={{ 
              background: "var(--card)",
              borderRadius: 12,
              padding: 16,
              border: "1px solid var(--line)",
              display: "flex",
              alignItems: "center",
              gap: 12,
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "var(--hover)";
              e.target.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "var(--card)";
              e.target.style.transform = "translateY(0)";
            }}
          >
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
              🎓
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: "0 0 4px 0", fontSize: "0.95rem", color: "var(--fg)", fontWeight: 600 }}>
                Check your degree progress
              </p>
              <p style={{ margin: 0, fontSize: "0.8rem", opacity: 0.7 }}>
                Review remaining requirements and plan your path to graduation
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
              →
            </div>
          </div>
          
          <div 
            onClick={() => onGoToFiles('schedule')}
            style={{ 
              background: "var(--card)",
              borderRadius: 12,
              padding: 16,
              border: "1px solid var(--line)",
              display: "flex",
              alignItems: "center",
              gap: 12,
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "var(--hover)";
              e.target.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "var(--card)";
              e.target.style.transform = "translateY(0)";
            }}
          >
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
              📅
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: "0 0 4px 0", fontSize: "0.95rem", color: "var(--fg)", fontWeight: 600 }}>
                Build your next semester schedule
              </p>
              <p style={{ margin: 0, fontSize: "0.8rem", opacity: 0.7 }}>
                Get personalized course recommendations and optimal scheduling
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
              →
            </div>
          </div>

          <div 
            onClick={() => onGoChat()}
            style={{ 
              background: "var(--card)",
              borderRadius: 12,
              padding: 16,
              border: "1px solid var(--line)",
              display: "flex",
              alignItems: "center",
              gap: 12,
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "var(--hover)";
              e.target.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "var(--card)";
              e.target.style.transform = "translateY(0)";
            }}
          >
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
              <p style={{ margin: "0 0 4px 0", fontSize: "0.95rem", color: "var(--fg)", fontWeight: 600 }}>
                Ask Pounce anything
              </p>
              <p style={{ margin: 0, fontSize: "0.8rem", opacity: 0.7 }}>
                Get instant help with academic questions and campus resources
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
              →
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScreenHome;