/**
 * Settings Screen Component
 * 
 * Allows users to fine-tune the AI model and adjust chat behavior preferences.
 * 
 * @author GSU Software Engineering Team 6
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { GSU } from '../constants/colors';

const defaultSettings = {
  // Model Settings
  model: 'gpt-3.5-turbo',
  temperature: 0.7,
  maxTokens: 500,
  topP: 1,
  frequencyPenalty: 0,
  presencePenalty: 0,
  
  // Chat Behavior
  responseStyle: 'balanced', // concise, balanced, detailed
  personality: 'friendly', // formal, friendly, casual
  contextMemory: 20, // Increased default from 10 to 20 for better context retention
  
  // UI Preferences
  autoScroll: true,
  typingIndicator: true,
  animations: true,
  
  // Advanced
  usePinecone: true,
  quickResponses: false
};

function ScreenSettings({ onBack, onSettingsChange }) {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('gsu-chatbot-settings');
    if (saved) {
      try {
        return { ...defaultSettings, ...JSON.parse(saved) };
      } catch (error) {
        console.error('Error loading settings:', error);
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Save to localStorage whenever settings change
    localStorage.setItem('gsu-chatbot-settings', JSON.stringify(settings));
    setHasChanges(true);
    if (onSettingsChange) {
      onSettingsChange(settings);
    }
  }, [settings, onSettingsChange]);

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetToDefaults = () => {
    if (window.confirm('Reset all settings to defaults?')) {
      setSettings(defaultSettings);
    }
  };

  const sectionStyle = {
    background: "var(--card)",
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
    border: "1px solid var(--line)"
  };

  const labelStyle = {
    display: "block",
    marginBottom: 8,
    fontWeight: 600,
    color: "var(--fg)",
    fontSize: "0.95rem"
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid var(--line)",
    background: "var(--bg)",
    color: "var(--fg)",
    fontSize: "0.9rem",
    marginBottom: 4
  };

  const sliderStyle = {
    width: "100%",
    marginBottom: 8
  };

  const checkboxStyle = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
    cursor: "pointer"
  };

  return (
    <div style={{
      padding: "24px",
      maxWidth: "900px",
      margin: "0 auto",
      height: "100%",
      overflowY: "auto"
    }}>
      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 32
      }}>
        <div>
          <h1 style={{
            margin: "0 0 8px 0",
            fontSize: "2rem",
            fontWeight: "bold",
            color: "var(--fg)"
          }}>
            Settings
          </h1>
          <p style={{
            margin: 0,
            opacity: 0.7,
            fontSize: "0.9rem"
          }}>
            Fine-tune the AI model and customize your chat experience
          </p>
        </div>
        <button
          onClick={onBack}
          style={{
            background: "transparent",
            border: "1px solid var(--line)",
            color: "var(--fg)",
            padding: "10px 20px",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: "0.9rem",
            fontWeight: 600
          }}
        >
          ← Back
        </button>
      </div>

      {/* Model Configuration Section */}
      <section style={sectionStyle}>
        <h2 style={{
          margin: "0 0 20px 0",
          fontSize: "1.3rem",
          fontWeight: "bold",
          color: "var(--fg)",
          borderBottom: "2px solid var(--line)",
          paddingBottom: 12
        }}>
          🤖 Model Configuration
        </h2>
        
        <div style={{ marginBottom: 24 }}>
          <label style={labelStyle}>AI Model</label>
          <select 
            value={settings.model}
            onChange={(e) => handleChange('model', e.target.value)}
            style={inputStyle}
          >
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Fast, Cost-effective)</option>
            <option value="gpt-4">GPT-4 (More Accurate)</option>
            <option value="gpt-4-turbo">GPT-4 Turbo (Best Quality)</option>
          </select>
          <small style={{ opacity: 0.7, fontSize: "0.85rem" }}>
            Higher models are more accurate but slower and more expensive
          </small>
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={labelStyle}>
            Temperature: {settings.temperature.toFixed(1)}
          </label>
          <input 
            type="range" 
            min="0" 
            max="2" 
            step="0.1"
            value={settings.temperature}
            onChange={(e) => handleChange('temperature', parseFloat(e.target.value))}
            style={sliderStyle}
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", opacity: 0.7 }}>
            <span>Focused (0)</span>
            <span>Balanced (1)</span>
            <span>Creative (2)</span>
          </div>
          <small style={{ opacity: 0.7, fontSize: "0.85rem" }}>
            Controls randomness. Lower = more consistent, Higher = more creative
          </small>
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={labelStyle}>
            Max Response Length: {settings.maxTokens} tokens
          </label>
          <input 
            type="range" 
            min="100" 
            max="2000" 
            step="50"
            value={settings.maxTokens}
            onChange={(e) => handleChange('maxTokens', parseInt(e.target.value))}
            style={sliderStyle}
          />
          <small style={{ opacity: 0.7, fontSize: "0.85rem" }}>
            Maximum length of AI responses (1 token ≈ 4 characters)
          </small>
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={labelStyle}>
            Top P: {settings.topP.toFixed(2)}
          </label>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.05"
            value={settings.topP}
            onChange={(e) => handleChange('topP', parseFloat(e.target.value))}
            style={sliderStyle}
          />
          <small style={{ opacity: 0.7, fontSize: "0.85rem" }}>
            Nucleus sampling - controls diversity of responses
          </small>
        </div>
      </section>

      {/* Chat Behavior Section */}
      <section style={sectionStyle}>
        <h2 style={{
          margin: "0 0 20px 0",
          fontSize: "1.3rem",
          fontWeight: "bold",
          color: "var(--fg)",
          borderBottom: "2px solid var(--line)",
          paddingBottom: 12
        }}>
          💬 Chat Behavior
        </h2>
        
        <div style={{ marginBottom: 24 }}>
          <label style={labelStyle}>Response Style</label>
          <select 
            value={settings.responseStyle}
            onChange={(e) => handleChange('responseStyle', e.target.value)}
            style={inputStyle}
          >
            <option value="concise">Concise (Short, to-the-point answers)</option>
            <option value="balanced">Balanced (Default - Moderate detail)</option>
            <option value="detailed">Detailed (Comprehensive explanations)</option>
          </select>
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={labelStyle}>Personality</label>
          <select 
            value={settings.personality}
            onChange={(e) => handleChange('personality', e.target.value)}
            style={inputStyle}
          >
            <option value="formal">Formal (Professional tone)</option>
            <option value="friendly">Friendly (Default - Warm and approachable)</option>
            <option value="casual">Casual (Relaxed, conversational)</option>
          </select>
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={labelStyle}>
            Context Memory: {settings.contextMemory} messages
          </label>
          <input 
            type="range" 
            min="5" 
            max="20" 
            step="1"
            value={settings.contextMemory}
            onChange={(e) => handleChange('contextMemory', parseInt(e.target.value))}
            style={sliderStyle}
          />
          <small style={{ opacity: 0.7, fontSize: "0.85rem" }}>
            Number of previous messages the AI remembers in conversation
          </small>
        </div>
      </section>

      {/* UI Preferences */}
      <section style={sectionStyle}>
        <h2 style={{
          margin: "0 0 20px 0",
          fontSize: "1.3rem",
          fontWeight: "bold",
          color: "var(--fg)",
          borderBottom: "2px solid var(--line)",
          paddingBottom: 12
        }}>
          🎨 UI Preferences
        </h2>
        
        <label style={checkboxStyle}>
          <input 
            type="checkbox"
            checked={settings.autoScroll}
            onChange={(e) => handleChange('autoScroll', e.target.checked)}
            style={{ width: 18, height: 18, cursor: "pointer" }}
          />
          <span>Auto-scroll to new messages</span>
        </label>

        <label style={checkboxStyle}>
          <input 
            type="checkbox"
            checked={settings.typingIndicator}
            onChange={(e) => handleChange('typingIndicator', e.target.checked)}
            style={{ width: 18, height: 18, cursor: "pointer" }}
          />
          <span>Show typing indicator ("Pounce is typing...")</span>
        </label>

        <label style={checkboxStyle}>
          <input 
            type="checkbox"
            checked={settings.animations}
            onChange={(e) => handleChange('animations', e.target.checked)}
            style={{ width: 18, height: 18, cursor: "pointer" }}
          />
          <span>Enable message animations</span>
        </label>
      </section>

      {/* Advanced Settings */}
      <section style={sectionStyle}>
        <h2 style={{
          margin: "0 0 20px 0",
          fontSize: "1.3rem",
          fontWeight: "bold",
          color: "var(--fg)",
          borderBottom: "2px solid var(--line)",
          paddingBottom: 12
        }}>
          ⚙️ Advanced
        </h2>
        
        <label style={checkboxStyle}>
          <input 
            type="checkbox"
            checked={settings.usePinecone}
            onChange={(e) => handleChange('usePinecone', e.target.checked)}
            style={{ width: 18, height: 18, cursor: "pointer" }}
          />
          <span>Use Pinecone context (GSU knowledge base)</span>
        </label>

        <label style={checkboxStyle}>
          <input 
            type="checkbox"
            checked={settings.quickResponses}
            onChange={(e) => handleChange('quickResponses', e.target.checked)}
            style={{ width: 18, height: 18, cursor: "pointer" }}
          />
          <span>Enable quick response shortcuts</span>
        </label>

        <div style={{ marginBottom: 24 }}>
          <label style={labelStyle}>
            Frequency Penalty: {settings.frequencyPenalty.toFixed(1)}
          </label>
          <input 
            type="range" 
            min="0" 
            max="2" 
            step="0.1"
            value={settings.frequencyPenalty}
            onChange={(e) => handleChange('frequencyPenalty', parseFloat(e.target.value))}
            style={sliderStyle}
          />
          <small style={{ opacity: 0.7, fontSize: "0.85rem" }}>
            Reduces repetition of tokens (higher = less repetition)
          </small>
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={labelStyle}>
            Presence Penalty: {settings.presencePenalty.toFixed(1)}
          </label>
          <input 
            type="range" 
            min="0" 
            max="2" 
            step="0.1"
            value={settings.presencePenalty}
            onChange={(e) => handleChange('presencePenalty', parseFloat(e.target.value))}
            style={sliderStyle}
          />
          <small style={{ opacity: 0.7, fontSize: "0.85rem" }}>
            Encourages talking about new topics (higher = more diverse topics)
          </small>
        </div>
      </section>

      {/* Reset Button */}
      <div style={{
        display: "flex",
        justifyContent: "flex-end",
        gap: 12,
        marginTop: 32,
        paddingTop: 24,
        borderTop: "1px solid var(--line)"
      }}>
        <button
          onClick={resetToDefaults}
          style={{
            background: "transparent",
            border: "1px solid var(--line)",
            color: "var(--fg)",
            padding: "12px 24px",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: "0.9rem",
            fontWeight: 600
          }}
        >
          Reset to Defaults
        </button>
        {hasChanges && (
          <div style={{
            padding: "12px 24px",
            background: GSU.blue + "20",
            color: GSU.blue,
            borderRadius: 8,
            fontSize: "0.9rem",
            fontWeight: 600
          }}>
            ✓ Settings saved
          </div>
        )}
      </div>
    </div>
  );
}

export default ScreenSettings;

