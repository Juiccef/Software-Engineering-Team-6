import React, { useState, useEffect } from 'react';
import { GSU } from '../constants/colors';

function ScreenFiles({ section = 'academic' }) {
  const [activeSection, setActiveSection] = useState(section);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    setActiveSection(section);
  }, [section]);

  const sections = [
    { id: 'academic', title: 'Academic Planning', icon: '📚' },
    { id: 'schedule', title: 'Schedule Building', icon: '📅' },
    { id: 'documents', title: 'Documents', icon: '📋' },
    { id: 'resources', title: 'Resources', icon: '🎯' }
  ];

  const academicData = [
    { id: 1, title: 'Degree Requirements', type: 'PDF', size: '2.3 MB', date: '2024-01-15' },
    { id: 2, title: 'Course Catalog 2024', type: 'PDF', size: '5.1 MB', date: '2024-01-10' },
    { id: 3, title: 'Academic Advisor Notes', type: 'DOC', size: '1.2 MB', date: '2024-01-08' },
    { id: 4, title: 'Major Requirements Checklist', type: 'PDF', size: '890 KB', date: '2024-01-05' }
  ];

  const scheduleData = [
    { id: 1, title: 'Fall 2024 Schedule', type: 'PDF', size: '1.5 MB', date: '2024-01-12' },
    { id: 2, title: 'Spring 2024 Schedule', type: 'PDF', size: '1.3 MB', date: '2024-01-09' },
    { id: 3, title: 'Course Conflict Analysis', type: 'XLS', size: '756 KB', date: '2024-01-07' },
    { id: 4, title: 'Time Block Preferences', type: 'DOC', size: '432 KB', date: '2024-01-03' }
  ];

  const documentsData = [
    { id: 1, title: 'Transcripts', type: 'PDF', size: '3.2 MB', date: '2024-01-14' },
    { id: 2, title: 'Financial Aid Documents', type: 'PDF', size: '2.8 MB', date: '2024-01-11' },
    { id: 3, title: 'Scholarship Applications', type: 'DOC', size: '1.9 MB', date: '2024-01-06' }
  ];

  const resourcesData = [
    { id: 1, title: 'Campus Map', type: 'PDF', size: '4.1 MB', date: '2024-01-13' },
    { id: 2, title: 'Library Resources Guide', type: 'PDF', size: '2.7 MB', date: '2024-01-10' },
    { id: 3, title: 'Career Services Info', type: 'DOC', size: '1.4 MB', date: '2024-01-04' }
  ];

  const getDataForSection = (sectionId) => {
    switch (sectionId) {
      case 'academic': return academicData;
      case 'schedule': return scheduleData;
      case 'documents': return documentsData;
      case 'resources': return resourcesData;
      default: return [];
    }
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'PDF': return '📄';
      case 'DOC': return '📝';
      case 'XLS': return '📊';
      default: return '📁';
    }
  };

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      height: "100%",
      width: "100%",
      padding: "0 16px"
    }}>
      {/* Header */}
      <div style={{ 
        padding: "20px 0 16px 0",
        borderBottom: "1px solid var(--line)"
      }}>
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "flex-start",
          marginBottom: 8
        }}>
          <div>
            <h1 style={{ 
              margin: "0 0 8px 0", 
              fontSize: "1.8rem", 
              fontWeight: "bold", 
              color: "var(--fg)" 
            }}>
              My Files
            </h1>
            <p style={{ 
              margin: 0, 
              opacity: 0.7, 
              fontSize: "0.95rem" 
            }}>
              Manage your academic documents and resources
            </p>
          </div>
          
          <button
            onClick={() => setShowUploadModal(true)}
            style={{
              background: GSU.blue,
              color: "white",
              border: "none",
              padding: "12px 20px",
              borderRadius: 12,
              cursor: "pointer",
              fontSize: "0.9rem",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 8,
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#1e3f7f";
              e.target.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = GSU.blue;
              e.target.style.transform = "translateY(0)";
            }}
          >
            <span>📤</span>
            Upload File
          </button>
        </div>
      </div>

      {/* Section Tabs */}
      <div style={{ 
        display: "flex", 
        gap: 8, 
        marginTop: 20,
        marginBottom: 24,
        overflowX: "auto",
        paddingBottom: 8
      }}>
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            style={{
              background: activeSection === section.id ? GSU.blue : "var(--card)",
              color: activeSection === section.id ? "white" : "var(--fg)",
              border: `1px solid ${activeSection === section.id ? GSU.blue : "var(--line)"}`,
              padding: "12px 16px",
              borderRadius: 12,
              cursor: "pointer",
              fontSize: "0.9rem",
              fontWeight: 600,
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
              gap: 8,
              minWidth: "fit-content"
            }}
          >
            <span>{section.icon}</span>
            {section.title}
          </button>
        ))}
      </div>

      {/* Section Content */}
      <div style={{ flex: 1, overflow: "auto" }}>
        <div style={{ marginBottom: 16 }}>
          <h2 style={{ 
            margin: "0 0 16px 0", 
            fontSize: "1.3rem", 
            color: "var(--fg)",
            display: "flex",
            alignItems: "center",
            gap: 8
          }}>
            <span>{sections.find(s => s.id === activeSection)?.icon}</span>
            {sections.find(s => s.id === activeSection)?.title}
          </h2>
          
          <div style={{ 
            display: "grid", 
            gap: 12 
          }}>
            {getDataForSection(activeSection).map((file) => (
              <div
                key={file.id}
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
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "var(--card)";
                }}
              >
                <div style={{ 
                  width: 40,
                  height: 40,
                  background: `${GSU.blue}20`,
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.2rem"
                }}>
                  {getFileIcon(file.type)}
                </div>
                
                <div style={{ flex: 1 }}>
                  <h3 style={{ 
                    margin: "0 0 4px 0", 
                    fontSize: "0.95rem", 
                    fontWeight: 600,
                    color: "var(--fg)"
                  }}>
                    {file.title}
                  </h3>
                  <div style={{ 
                    display: "flex", 
                    gap: 12, 
                    fontSize: "0.8rem", 
                    opacity: 0.7 
                  }}>
                    <span>{file.type}</span>
                    <span>•</span>
                    <span>{file.size}</span>
                    <span>•</span>
                    <span>{file.date}</span>
                  </div>
                </div>
                
                <div style={{ 
                  display: "flex",
                  gap: 8
                }}>
                  <button style={{
                    background: "transparent",
                    border: "1px solid var(--line)",
                    borderRadius: 8,
                    padding: "6px 12px",
                    fontSize: "0.8rem",
                    cursor: "pointer",
                    color: "var(--fg)"
                  }}>
                    View
                  </button>
                  <button style={{
                    background: "transparent",
                    border: "1px solid var(--line)",
                    borderRadius: 8,
                    padding: "6px 12px",
                    fontSize: "0.8rem",
                    cursor: "pointer",
                    color: "var(--fg)"
                  }}>
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Upload Button */}
      <div style={{
        padding: "20px 0",
        borderTop: "1px solid var(--line)",
        marginTop: 20
      }}>
        <button
          onClick={() => setShowUploadModal(true)}
          style={{
            width: "100%",
            background: GSU.blue,
            color: "white",
            border: "none",
            padding: "16px 24px",
            borderRadius: 12,
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "#1e3f7f";
            e.target.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = GSU.blue;
            e.target.style.transform = "translateY(0)";
          }}
        >
          <span>📤</span>
          Upload New File
        </button>
      </div>

      {/* Upload Modal - Box Opening Effect */}
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
              background: `linear-gradient(135deg, ${GSU.blue} 0%, #1e3f7f 100%)`,
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
                e.target.style.borderColor = GSU.blue;
                e.target.style.background = `${GSU.blue}08`;
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
                    background: GSU.blue,
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
                    e.target.style.background = GSU.blue;
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

export default ScreenFiles;
