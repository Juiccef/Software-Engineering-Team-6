/**
 * Schedule Display Component
 * 
 * Displays generated course schedule with export options (PDF, Notion template)
 * 
 * @author GSU Software Engineering Team 6
 * @version 1.0.0
 */

import React from 'react';
import { GSU } from '../constants/colors';

const API_BASE_URL = 'http://localhost:5002/api/chat';

/**
 * Get the current or next semester based on the current date
 * @returns {string} - Semester string like "Fall 2026" or "Spring 2026"
 */
function getCurrentSemester() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-12
  
  // Academic year typically runs:
  // Fall: August-December (months 8-12)
  // Spring: January-May (months 1-5)
  // Summer: June-July (months 6-7)
  
  if (currentMonth >= 8 || currentMonth <= 1) {
    // August-December or January: Current/Next Fall
    if (currentMonth >= 8) {
      // We're in Fall semester
      return `Fall ${currentYear}`;
    } else {
      // We're in January, so next major semester is Fall of this year
      return `Fall ${currentYear}`;
    }
  } else if (currentMonth >= 2 && currentMonth <= 5) {
    // February-May: Spring semester
    return `Spring ${currentYear}`;
  } else {
    // June-July: Summer, so next is Fall
    return `Fall ${currentYear}`;
  }
}

function ScheduleDisplay({ schedule, sessionId, onRegenerate, onClose }) {
  if (!schedule || !schedule.courses) {
    return null;
  }

  const handleExport = async (format) => {
    try {
      const url = `${API_BASE_URL}/schedule-export/${sessionId}?format=${format}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Export failed');
      }

      // Get the blob
      const blob = await response.blob();
      
      // Create download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      
      const extension = format === 'pdf' ? 'pdf' : format === 'csv' ? 'csv' : 'md';
      link.download = `schedule-${sessionId}.${extension}`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Export error:', error);
      alert(`Failed to export schedule: ${error.message}`);
    }
  };

  const copyNotionTemplate = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/schedule-export/${sessionId}?format=notion`);
      const text = await response.text();
      
      await navigator.clipboard.writeText(text);
      alert('Notion template copied to clipboard! You can paste it into Notion.');
    } catch (error) {
      console.error('Copy error:', error);
      alert(`Failed to copy template: ${error.message}`);
    }
  };

  return (
    <div style={{
      background: "var(--card)",
      borderRadius: 16,
      padding: 24,
      border: "1px solid var(--line)",
      marginTop: 16,
      marginBottom: 16
    }}>
      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20
      }}>
        <div>
          <h2 style={{
            margin: "0 0 8px 0",
            fontSize: "1.5rem",
            fontWeight: "bold",
            color: "var(--fg)"
          }}>
            📅 {schedule.semester || getCurrentSemester()} Schedule
          </h2>
          <p style={{
            margin: 0,
            opacity: 0.7,
            fontSize: "0.9rem"
          }}>
            {schedule.major || 'N/A'} • {schedule.totalCredits || 0} credits • {schedule.workloadPreference || 'medium'} workload
          </p>
        </div>
        <button
          onClick={copyNotionTemplate}
          style={{
            background: "var(--card)",
            color: "var(--fg)",
            border: "1px solid var(--line)",
            padding: "10px 12px",
            borderRadius: 8,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease",
            width: 40,
            height: 40
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--hover)";
            e.currentTarget.style.borderColor = GSU.blue;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "var(--card)";
            e.currentTarget.style.borderColor = "var(--line)";
          }}
          title="Copy Notion Template"
          aria-label="Copy Notion Template"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        </button>
      </div>

      {/* Schedule Table */}
      <div style={{
        overflowX: "auto",
        marginBottom: 20
      }}>
        <table style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "0.9rem"
        }}>
          <thead>
            <tr style={{
              background: "var(--hover)",
              borderBottom: "2px solid var(--line)"
            }}>
              <th style={{ padding: "12px", textAlign: "left", fontWeight: "bold" }}>Course</th>
              <th style={{ padding: "12px", textAlign: "left", fontWeight: "bold" }}>Name</th>
              <th style={{ padding: "12px", textAlign: "center", fontWeight: "bold" }}>Credits</th>
            </tr>
          </thead>
          <tbody>
            {schedule.courses.map((course, courseIndex) => (
              <tr
                key={courseIndex}
                style={{
                  borderBottom: "1px solid var(--line)",
                  background: "var(--card)"
                }}
              >
                <td style={{ padding: "12px", fontWeight: "600" }}>
                  {course.code}
                </td>
                <td style={{ padding: "12px" }}>
                  {course.name}
                </td>
                <td style={{ padding: "12px", textAlign: "center" }}>
                  {course.credits}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Export Options */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
        flexWrap: "wrap",
        paddingTop: 16,
        borderTop: "1px solid var(--line)"
      }}>
        <button
          onClick={() => handleExport('pdf')}
          style={{
            background: GSU.blue,
            color: "white",
            border: "none",
            padding: "12px 20px",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: "0.9rem",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 8,
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#002a80"}
          onMouseLeave={(e) => e.currentTarget.style.background = GSU.blue}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          <span>Download PDF</span>
        </button>
        {onRegenerate && (
          <button
            onClick={onRegenerate}
            style={{
              background: "transparent",
              color: "var(--fg)",
              border: "1px solid var(--line)",
              padding: "12px 20px",
              borderRadius: 8,
              cursor: "pointer",
              fontSize: "0.9rem",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 8
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10"></polyline>
              <polyline points="1 20 1 14 7 14"></polyline>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
            </svg>
            <span>Regenerate</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default ScheduleDisplay;



