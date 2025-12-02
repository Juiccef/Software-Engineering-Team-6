import React, { useState, useRef } from 'react';
import { GSU } from '../constants/colors';
import QuickActions from './QuickActions';
import YearLevelButtons from './YearLevelButtons';
import { uploadFile, formatFileSize, getFileIcon, isFileTypeSupported } from '../services/fileService';

function ChatBox({ messages = [], onSendMessage, onQuickAction, className = "", style = {} }) {
  const [draft, setDraft] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileRef = useRef(null);

  // Check if a message is asking for year level
  const isYearLevelQuestion = (text) => {
    if (!text) return false;
    const lowerText = text.toLowerCase();
    // Remove markdown formatting for better matching
    const cleanText = lowerText.replace(/\*\*/g, '').replace(/\*/g, '');
    return (
      cleanText.includes('what year') ||
      cleanText.includes('year are you') ||
      cleanText.includes('year you are') ||
      (cleanText.includes('freshman') && (cleanText.includes('sophomore') || cleanText.includes('junior') || cleanText.includes('senior'))) ||
      (cleanText.includes('year') && (cleanText.includes('school') || cleanText.includes('student'))) ||
      (cleanText.includes('freshman') && cleanText.includes('sophomore') && cleanText.includes('junior') && cleanText.includes('senior'))
    );
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!draft.trim()) return;
    onSendMessage({ role: "user", text: draft.trim() });
    setDraft("");
  };

  const onPick = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset file input
    e.target.value = '';

    try {
      // Validate file type
      if (!isFileTypeSupported(file.type)) {
        onSendMessage({
          role: "system",
          text: `❌ File type not supported: ${file.type}. Please upload images, PDFs, or Office documents.`,
          isError: true
        });
        return;
      }

      // Check file size (50MB max)
      const maxSize = 50 * 1024 * 1024;
      if (file.size > maxSize) {
        onSendMessage({
          role: "system",
          text: `❌ File too large: ${formatFileSize(file.size)}. Maximum size is 50MB.`,
          isError: true
        });
        return;
      }

      setIsUploading(true);
      setUploadProgress(0);

      // Send upload start message
      onSendMessage({
        role: "system",
        text: `📤 Uploading ${file.name} (${formatFileSize(file.size)})...`,
        isUploading: true
      });

      // Upload file to Supabase
      const result = await uploadFile(file, (progress) => {
        setUploadProgress(progress);
      });

      if (result.success) {
        // Send success message with file info
        onSendMessage({
          role: "user",
          text: `${getFileIcon(file.type)} Uploaded: ${file.name}`,
          file: {
            name: result.file.name,
            fileName: result.file.fileName,
            size: result.file.size,
            type: result.file.type,
            url: result.file.url,
            uploadedAt: result.file.uploadedAt
          }
        });

        // Send a follow-up bot message
        setTimeout(() => {
          onSendMessage({
            role: "bot",
            text: `Great! I've received your file "${file.name}". I can help you analyze or work with this file. What would you like me to do with it?`
          });
        }, 1000);

      } else {
        throw new Error(result.error || 'Upload failed');
      }

    } catch (error) {
      console.error('Upload error:', error);
      onSendMessage({
        role: "system",
        text: `❌ Upload failed: ${error.message}`,
        isError: true
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div
      className={`chat-box ${className}`}
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "var(--card)",
        border: "1px solid var(--line)",
        borderRadius: 16,
        overflow: "hidden",
        ...style,
      }}
    >
      {/* Chat Messages Area */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          minHeight: 200
        }}
      >
        {messages.length === 0 ? (
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            color: "var(--fg)",
            opacity: 0.6,
            textAlign: "center"
          }}>
            <div>
              <div style={{ fontSize: 48, marginBottom: 16 }}>💬</div>
              <p style={{ margin: 0 }}>Start a conversation with Pounce</p>
            </div>
          </div>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              style={{
                alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "80%",
                display: "flex",
                flexDirection: "column",
                gap: 4
              }}
            >
              <div
                style={{
                  background: m.role === "user" ? "var(--bubbleUser)" :
                    m.role === "system" ? (m.isError ? "#ff4444" : "#4caf50") : "var(--bubbleBot)",
                  color: m.role === "user" ? "white" :
                    m.role === "system" ? "white" : "var(--fg)",
                  border: "1px solid var(--line)",
                  borderRadius: 16,
                  padding: 12,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  wordWrap: "break-word",
                }}
              >
                {m.text && <p style={{ margin: 0 }}>{m.text}</p>}

                {/* Legacy image support */}
                {m.image && (
                  <img
                    src={m.image}
                    alt="upload"
                    style={{
                      display: "block",
                      width: "100%",
                      maxWidth: 300,
                      borderRadius: 12,
                      border: "1px solid var(--line)",
                      marginTop: m.text ? 8 : 0
                    }}
                  />
                )}

                {/* New file attachment support */}
                {m.file && (
                  <div style={{
                    marginTop: m.text ? 8 : 0,
                    padding: 8,
                    background: "rgba(255,255,255,0.1)",
                    borderRadius: 8,
                    border: "1px solid rgba(255,255,255,0.2)"
                  }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 4
                    }}>
                      <span style={{ fontSize: 16 }}>{getFileIcon(m.file.type)}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 500, fontSize: 13 }}>
                          {m.file.name}
                        </div>
                        <div style={{ fontSize: 11, opacity: 0.8 }}>
                          {formatFileSize(m.file.size)}
                        </div>
                      </div>
                    </div>
                    {m.file.url && (
                      <a
                        href={m.file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "inherit",
                          textDecoration: "none",
                          fontSize: 11,
                          opacity: 0.9,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4
                        }}
                      >
                        🔗 View File
                      </a>
                    )}
                  </div>
                )}
              </div>
              <div style={{
                fontSize: 11,
                opacity: 0.6,
                alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                marginTop: -2
              }}>
                {m.role === "user" ? "You" : "Pounce"}
              </div>
              {m.showQuickActions && onQuickAction && (
                <div style={{ alignSelf: "flex-start", marginTop: 8 }}>
                  <QuickActions onActionClick={onQuickAction} />
                </div>
              )}
              {/* Show year level buttons if message is asking for year level */}
              {m.role === "bot" && (m.pipelineState === 'collecting_year_level' || isYearLevelQuestion(m.text)) && (
                <div style={{ alignSelf: "flex-start", marginTop: 12, width: "100%" }}>
                  <YearLevelButtons onSendMessage={onSendMessage} />
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Chat Input Area */}
      <div style={{
        borderTop: "1px solid var(--line)",
        padding: 16,
        background: "var(--bg)"
      }}>
        {/* Quick Actions - Centered above textbox */}
        {onQuickAction && (
          <div style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 12
          }}>
            <QuickActions onActionClick={onQuickAction} />
          </div>
        )}

        <form onSubmit={onSubmit} style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={isUploading}
            style={{
              background: isUploading ? "var(--line)" : "transparent",
              color: isUploading ? "var(--muted)" : "var(--fg)",
              border: `1px solid var(--line)`,
              padding: "10px 12px",
              borderRadius: 12,
              cursor: isUploading ? "not-allowed" : "pointer",
              fontSize: 16,
              minWidth: 44,
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: isUploading ? 0.6 : 1,
              transition: "all 0.2s ease"
            }}
            title={isUploading ? `Uploading... ${Math.round(uploadProgress)}%` : "Upload file"}
          >
            {isUploading ? '⏳' : '�'}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*,application/pdf,text/plain,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
            hidden
            onChange={onPick}
            disabled={isUploading}
          />
          <div style={{ flex: 1, position: "relative" }}>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Type your message…"
              style={{
                width: "100%",
                background: "var(--card)",
                color: "var(--fg)",
                border: `1px solid var(--line)`,
                padding: "12px 16px",
                borderRadius: 12,
                fontSize: 14,
                minHeight: 44,
                resize: "none"
              }}
            />
          </div>
          <button
            type="submit"
            disabled={!draft.trim()}
            style={{
              background: draft.trim() ? GSU.blue : "var(--line)",
              color: "white",
              border: 0,
              padding: "12px 16px",
              borderRadius: 12,
              fontWeight: 600,
              cursor: draft.trim() ? "pointer" : "not-allowed",
              fontSize: 14,
              minWidth: 60,
              height: 44,
              opacity: draft.trim() ? 1 : 0.6,
              transition: "all 0.2s ease"
            }}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatBox;
