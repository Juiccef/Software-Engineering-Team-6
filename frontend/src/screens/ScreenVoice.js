import React from 'react';
import { GSU } from '../constants/colors';
import useSpeechToText from '../hooks/useSpeechToText';

function ScreenVoice({ onBackToChat, onSendMessage, voiceConversation, setVoiceConversation }) {
  const { listening, transcript, error, start, stop, reset, setTranscript } = useSpeechToText({ interimResults: true });
  const [selectedVoice, setSelectedVoice] = React.useState('alloy');

  async function playOpenAIVoice(text, voice = 'alloy') {
    try {
      console.log(`Trying OpenAI TTS with voice: ${voice}`);
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice }),
      });

      if (response.ok) {
        console.log('OpenAI TTS successful');
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        return new Promise((resolve, reject) => {
          audio.onended = () => {
            URL.revokeObjectURL(audioUrl);
            resolve();
          };
          audio.onerror = () => {
            URL.revokeObjectURL(audioUrl);
            reject(new Error('Audio playback failed'));
          };
          audio.play().catch(reject);
        });
      } else {
        throw new Error(`OpenAI TTS failed: ${response.status}`);
      }
    } catch (err) {
      console.warn('OpenAI TTS failed, falling back to browser TTS:', err);
      // Fallback to browser TTS
      return new Promise((resolve) => {
        try {
          const synth = window.speechSynthesis;
          if (synth) {
            synth.cancel(); // Cancel any ongoing speech
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9;
            utterance.pitch = 1;
            utterance.onend = resolve;
            utterance.onerror = resolve;
            synth.speak(utterance);
          } else {
            resolve();
          }
        } catch (fallbackErr) {
          console.error('Both OpenAI and browser TTS failed:', fallbackErr);
          resolve();
        }
      });
    }
  }

  async function handleSendTranscript(text) {
    if (!text || !onSendMessage) return;
    
    try {
      console.log('Sending transcript to chat:', text);
      
      // Add user message to voice conversation history
      setVoiceConversation(prev => [...prev, {
        role: 'user',
        text: text,
        timestamp: new Date().toLocaleTimeString()
      }]);
      
      // Format the message correctly - onSendMessage expects { role: "user", text: message }
      const response = await onSendMessage({ role: "user", text: text });
      console.log('Got response from chat:', response);
      
      // Add bot response to voice conversation history
      if (response) {
        const responseText = typeof response === 'string' ? response : response?.response || '';
        if (responseText) {
          setVoiceConversation(prev => [...prev, {
            role: 'assistant',
            text: responseText,
            timestamp: new Date().toLocaleTimeString()
          }]);
          
          console.log('Speaking response with voice:', selectedVoice);
          await playOpenAIVoice(responseText, selectedVoice);
        }
      }
      
      // Clear the transcript after successful send
      reset();
    } catch (err) {
      console.error('Failed to send transcript:', err);
    }
  }

  React.useEffect(() => {
    // When transcript is finalized and not empty, auto-send after a short debounce
    if (!transcript || transcript.trim() === '') return;
    
    const timer = setTimeout(() => {
      handleSendTranscript(transcript);
    }, 1000); // Give user 1 second to see transcript before auto-sending
    
    return () => clearTimeout(timer);
  }, [transcript]);

  function toggleListening() {
    if (listening) stop(); else start();
  }

  const hintText = error ? `Voice error: ${error.message}` : (listening ? 'Listening… Tap to stop.' : 'Tap the mic to start');

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ 
        background: "var(--card)",
        border: "1px solid var(--line)",
        borderRadius: 16,
        padding: 16,
        boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        textAlign: "center" 
      }}>
        <img
          src="https://upload.wikimedia.org/wikipedia/en/0/0c/Georgia_State_Panthers_logo.svg"
          alt="Panther head"
          style={{ width: 96, height: 96, margin: "0 auto" }}
        />
        <h2 style={{ marginBottom: 8 }}>Speak to Pounce</h2>
        <p style={{ marginTop: 0, opacity: 0.9 }}>
          Ask advising questions, say a course list, or describe your schedule constraints.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 6 }}>
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "6px 10px",
            borderRadius: 999,
            background: "rgba(0,0,0,0.08)",
            border: `1px solid var(--line)`,
            fontSize: 12,
            gap: 6,
          }}>Speech → Text</span>
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "6px 10px",
            borderRadius: 999,
            background: "rgba(0,0,0,0.08)",
            border: `1px solid var(--line)`,
            fontSize: 12,
            gap: 6,
          }}>Auto-send to chat</span>
        </div>
        
        {/* Voice Selector */}
        <div style={{ marginTop: 12 }}>
          <label style={{ fontSize: 13, opacity: 0.8, marginRight: 8 }}>Voice:</label>
          <select 
            value={selectedVoice} 
            onChange={(e) => setSelectedVoice(e.target.value)}
            style={{ 
              padding: "4px 8px", 
              borderRadius: 6, 
              border: "1px solid var(--line)",
              background: "var(--card)",
              color: "var(--fg)",
              fontSize: 12
            }}
          >
            <option value="alloy">Alloy (Neutral)</option>
            <option value="echo">Echo (Male)</option>
            <option value="fable">Fable (British Male)</option>
            <option value="onyx">Onyx (Deep Male)</option>
            <option value="nova">Nova (Young Female)</option>
            <option value="shimmer">Shimmer (Soft Female)</option>
          </select>
        </div>
        <div style={{ marginTop: 18 }}>
          <button
            onClick={toggleListening}
            style={{
              width: 84,
              height: 84,
              borderRadius: 999,
              border: `2px solid ${GSU.blue}`,
              background: listening ? GSU.blue : "transparent",
              color: listening ? "white" : GSU.blue,
              fontSize: 28,
              cursor: "pointer",
            }}
            aria-pressed={listening}
            aria-label="Toggle microphone"
          >
            🎤
          </button>
        </div>
        <div style={{ marginTop: 12, fontSize: 13, opacity: 0.8 }}>
          {hintText}
        </div>
        
        {transcript ? (
          <div style={{ marginTop: 12, fontSize: 14, padding: 10, borderRadius: 8, background: 'rgba(0,0,0,0.04)' }}>
            <strong>Transcript:</strong>
            <div style={{ marginTop: 6 }}>{transcript}</div>
            <div style={{ marginTop: 8 }}>
              <button onClick={() => { reset(); }} style={{ marginRight: 8 }}>Clear</button>
              <button onClick={() => handleSendTranscript(transcript)}>Send</button>
            </div>
          </div>
        ) : null}
        <div style={{ marginTop: 18 }}>
          <button 
            onClick={onBackToChat} 
            style={{ 
              background: "transparent", 
              color: "var(--fg)", 
              border: `1px solid var(--line)`, 
              padding: "10px 14px", 
              borderRadius: 12, 
              cursor: "pointer" 
            }}
          >
            Back to chat
          </button>
        </div>
      </div>

      {/* Voice Conversation History */}
      {voiceConversation.length > 0 && (
        <div style={{ 
          background: "var(--card)",
          border: "1px solid var(--line)",
          borderRadius: 16,
          padding: 16,
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)"
        }}>
          <h3 style={{ marginTop: 0, marginBottom: 16, fontSize: 16 }}>Voice Conversation</h3>
          <div style={{ 
            maxHeight: '300px', 
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 12
          }}>
            {voiceConversation.map((msg, index) => (
              <div key={index} style={{
                padding: '12px',
                borderRadius: '12px',
                background: msg.role === 'user' 
                  ? 'rgba(70, 130, 180, 0.1)' 
                  : 'rgba(0, 0, 0, 0.05)',
                border: `1px solid ${msg.role === 'user' 
                  ? 'rgba(70, 130, 180, 0.2)' 
                  : 'var(--line)'}`,
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%'
              }}>
                <div style={{ 
                  fontSize: '11px', 
                  opacity: 0.7, 
                  marginBottom: '4px',
                  fontWeight: 'bold'
                }}>
                  {msg.role === 'user' ? '🎤 You' : '🤖 Pounce'} • {msg.timestamp}
                </div>
                <div style={{ fontSize: '14px', lineHeight: '1.4' }}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, textAlign: 'center' }}>
            <button 
              onClick={() => setVoiceConversation([])}
              style={{ 
                background: "transparent", 
                color: "var(--fg)", 
                border: `1px solid var(--line)`, 
                padding: "6px 12px", 
                borderRadius: 8, 
                cursor: "pointer",
                fontSize: 12
              }}
            >
              Clear History
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default ScreenVoice;
