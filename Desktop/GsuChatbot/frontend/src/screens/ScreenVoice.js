import React from 'react';
import { GSU } from '../constants/colors';
import useSpeechToText from '../hooks/useSpeechToText';

function ScreenVoice({ onBackToChat, onSendMessage, voiceConversation, setVoiceConversation }) {
  const { listening, transcript, error, start, stop, reset, setTranscript } = useSpeechToText({ interimResults: true });
  const [selectedVoice, setSelectedVoice] = React.useState('alloy');
  const [loading, setLoading] = React.useState(false);
  const [status, setStatus] = React.useState(''); // 'thinking', 'speaking'
  const currentAudioRef = React.useRef(null);
  const isProcessingRef = React.useRef(false);
  const [isSpeaking, setIsSpeaking] = React.useState(false);
  const [botResponseText, setBotResponseText] = React.useState('');
  const [editedBotText, setEditedBotText] = React.useState('');
  const [showEditableTranscript, setShowEditableTranscript] = React.useState(false);
  const [pendingTranscript, setPendingTranscript] = React.useState('');
  const [showPendingTranscript, setShowPendingTranscript] = React.useState(false);

  // Cancel any ongoing audio playback
  function stopAllAudio() {
    // Stop any current audio element
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      if (currentAudioRef.current.src) {
        URL.revokeObjectURL(currentAudioRef.current.src);
      }
      currentAudioRef.current = null;
    }
    
    // Cancel browser TTS
    const synth = window.speechSynthesis;
    if (synth) {
      synth.cancel();
    }
    
    setIsSpeaking(false);
  }

  // Handle cancel button click
  function handleCancelAudio() {
    stopAllAudio();
    setLoading(false);
    setStatus('');
    setBotResponseText(''); // Clear bot response when cancelled
    // Keep editedBotText so user can still edit it
  }

  // Handle sending edited transcript
  async function handleSendEditedText() {
    if (!editedBotText || !editedBotText.trim() || loading) return;
    
    // Clear the editable transcript
    setShowEditableTranscript(false);
    const textToSend = editedBotText.trim();
    setEditedBotText('');
    setBotResponseText('');
    
    // Use the edited text as if it's a new transcript
    await handleSendTranscript(textToSend);
  }

  // Handle dismissing the editable transcript
  function handleDismissTranscript() {
    setShowEditableTranscript(false);
    setEditedBotText('');
    setBotResponseText('');
  }

  async function playOpenAIVoice(text, voice = 'alloy') {
    // Stop any existing audio first
    stopAllAudio();
    
    // Use browser TTS for instant playback (much faster than API call)
    // This provides immediate feedback while maintaining good quality
    return new Promise((resolve) => {
      try {
        const synth = window.speechSynthesis;
        if (synth) {
          synth.cancel(); // Cancel any ongoing speech
          
          // Set voice properties for better quality
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.rate = 0.9;
          utterance.pitch = 1;
          utterance.volume = 1;
          
          // Try to match the selected voice if possible
          const voices = synth.getVoices();
          if (voices.length > 0) {
            // Prefer voices that match the selected type
            const voiceMap = {
              'alloy': 'neutral',
              'echo': 'male',
              'onyx': 'male',
              'nova': 'female',
              'shimmer': 'female',
              'fable': 'male'
            };
            
            const voiceType = voiceMap[voice] || 'neutral';
            const preferredVoice = voices.find(v => 
              voiceType === 'male' ? (v.name.toLowerCase().includes('male') || 
                                     v.name.toLowerCase().includes('david') ||
                                     v.name.toLowerCase().includes('thomas') ||
                                     v.name.toLowerCase().includes('alex')) :
              voiceType === 'female' ? (v.name.toLowerCase().includes('female') ||
                                       v.name.toLowerCase().includes('samantha') ||
                                       v.name.toLowerCase().includes('karen') ||
                                       v.name.toLowerCase().includes('susan')) :
              true
            );
            
            if (preferredVoice) {
              utterance.voice = preferredVoice;
            }
          }
          
          setIsSpeaking(true);
          utterance.onend = () => {
            currentAudioRef.current = null;
            setIsSpeaking(false);
            setBotResponseText(''); // Clear when done, but keep editedBotText for editing
            resolve();
          };
          utterance.onerror = () => {
            currentAudioRef.current = null;
            setIsSpeaking(false);
            setBotResponseText(''); // Clear on error, but keep editedBotText for editing
            resolve();
          };
          
          // Start speaking immediately
          synth.speak(utterance);
        } else {
          // Fallback to OpenAI TTS if browser TTS is not available
          console.log('Browser TTS not available, trying OpenAI TTS');
          fetch('/api/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, voice }),
          })
          .then(response => {
            if (response.ok) {
              return response.blob();
            }
            throw new Error(`OpenAI TTS failed: ${response.status}`);
          })
          .then(audioBlob => {
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            currentAudioRef.current = audio;
            setIsSpeaking(true);
            
            audio.onended = () => {
              URL.revokeObjectURL(audioUrl);
              currentAudioRef.current = null;
              setIsSpeaking(false);
              setBotResponseText('');
              resolve();
            };
            audio.onerror = () => {
              URL.revokeObjectURL(audioUrl);
              currentAudioRef.current = null;
              setIsSpeaking(false);
              setBotResponseText('');
              resolve();
            };
            return audio.play();
          })
          .catch(err => {
            console.error('Both browser and OpenAI TTS failed:', err);
            setIsSpeaking(false);
            setBotResponseText('');
            resolve();
          });
        }
      } catch (err) {
        console.error('TTS error:', err);
        setIsSpeaking(false);
        setBotResponseText('');
        resolve();
      }
    });
  }

  async function handleSendTranscript(text) {
    // Prevent duplicate sends
    if (!text || !onSendMessage || loading || isProcessingRef.current) return;
    
    isProcessingRef.current = true;
    
    try {
      setLoading(true);
      setStatus('thinking');
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
          
          // Store bot response text for display during speaking
          setBotResponseText(responseText);
          setEditedBotText(responseText);
          setShowEditableTranscript(true);
          
          setStatus('speaking');
          console.log('Speaking response with voice:', selectedVoice);
          await playOpenAIVoice(responseText, selectedVoice);
          // Note: botResponseText is cleared in audio onended handlers, but editedBotText stays
        }
      }
      
      // Clear the transcript after successful send
      reset();
    } catch (err) {
      console.error('Failed to send transcript:', err);
      setStatus('error');
    } finally {
      setLoading(false);
      isProcessingRef.current = false;
      // Clear status after a short delay
      setTimeout(() => setStatus(''), 500);
    }
  }

  React.useEffect(() => {
    // When transcript is finalized and not empty, show it for editing/confirmation
    // DON'T auto-send - user must confirm
    if (!transcript || transcript.trim() === '' || loading || isProcessingRef.current) {
      setShowPendingTranscript(false);
      return;
    }
    
    // Show transcript after a short delay for user to review
    const timer = setTimeout(() => {
      setPendingTranscript(transcript);
      setShowPendingTranscript(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [transcript, loading]);

  // Cleanup audio on unmount
  React.useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, []);

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
          }}>Review & Confirm</span>
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
        
        {/* Loading Indicator */}
        {loading && (
          <>
            <style>{`
              @keyframes voice-spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
            <div style={{ 
              marginTop: 16, 
              padding: 16, 
              borderRadius: 12, 
              background: 'rgba(70, 130, 180, 0.1)',
              border: '1px solid rgba(70, 130, 180, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              gap: 12
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: 12,
                flexWrap: 'wrap'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 20,
                    height: 20,
                    border: '3px solid rgba(70, 130, 180, 0.3)',
                    borderTop: '3px solid ' + GSU.blue,
                    borderRadius: '50%',
                    animation: 'voice-spin 1s linear infinite'
                  }} />
                  <div style={{ fontSize: 14, color: GSU.blue, fontWeight: 500 }}>
                    {status === 'thinking' ? '🤔 Thinking...' : status === 'speaking' ? '🔊 Speaking...' : '⏳ Processing...'}
                  </div>
                </div>
                {(status === 'speaking' || isSpeaking) && (
                  <button
                    onClick={handleCancelAudio}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 6,
                      border: '1px solid #ff6b6b',
                      background: '#ff6b6b',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: 12,
                      fontWeight: 500
                    }}
                    title="Stop audio playback"
                  >
                    ⏹️ Stop
                  </button>
                )}
              </div>
              
              {/* Bot Response Transcription - Editable */}
              {(botResponseText || showEditableTranscript) && editedBotText && (
                <div style={{
                  marginTop: 8,
                  padding: 12,
                  borderRadius: 8,
                  background: 'var(--card)',
                  border: '1px solid var(--line)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8
                }}>
                  <div style={{
                    fontSize: 11,
                    color: 'var(--muted)',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span>🤖 {status === 'speaking' || isSpeaking ? 'Pounce is saying:' : 'Pounce said:'}</span>
                    {!loading && (
                      <button
                        onClick={handleDismissTranscript}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--muted)',
                          cursor: 'pointer',
                          fontSize: 16,
                          padding: 0,
                          width: 20,
                          height: 20,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        title="Dismiss"
                      >
                        ×
                      </button>
                    )}
                  </div>
                  <textarea
                    value={editedBotText}
                    onChange={(e) => setEditedBotText(e.target.value)}
                    disabled={loading}
                    style={{
                      fontSize: 14,
                      lineHeight: 1.6,
                      color: 'var(--fg)',
                      background: 'var(--card)',
                      border: '1px solid var(--line)',
                      borderRadius: 6,
                      padding: 8,
                      minHeight: '80px',
                      maxHeight: '200px',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                      outline: 'none',
                      width: '100%',
                      boxSizing: 'border-box'
                    }}
                    placeholder="Edit the bot's response..."
                  />
                  {!loading && (
                    <div style={{
                      display: 'flex',
                      gap: 8,
                      justifyContent: 'flex-end'
                    }}>
                      <button
                        onClick={handleDismissTranscript}
                        style={{
                          padding: '6px 12px',
                          borderRadius: 6,
                          border: '1px solid var(--line)',
                          background: 'transparent',
                          color: 'var(--fg)',
                          cursor: 'pointer',
                          fontSize: 12,
                          fontWeight: 500
                        }}
                      >
                        Dismiss
                      </button>
                      <button
                        onClick={handleSendEditedText}
                        disabled={!editedBotText.trim()}
                        style={{
                          padding: '6px 12px',
                          borderRadius: 6,
                          border: 'none',
                          background: editedBotText.trim() ? GSU.blue : 'var(--muted)',
                          color: 'white',
                          cursor: editedBotText.trim() ? 'pointer' : 'not-allowed',
                          fontSize: 12,
                          fontWeight: 500,
                          opacity: editedBotText.trim() ? 1 : 0.6
                        }}
                      >
                        📤 Send as new message
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
        
        {/* Pending Transcript - Editable before sending */}
        {showPendingTranscript && pendingTranscript && !loading && (
          <div style={{ 
            marginTop: 12, 
            fontSize: 14, 
            padding: 16, 
            borderRadius: 12, 
            background: 'rgba(70, 130, 180, 0.08)',
            border: '1px solid rgba(70, 130, 180, 0.2)'
          }}>
            <div style={{
              fontSize: 11,
              color: 'var(--muted)',
              marginBottom: 8,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              🎤 Your Message (Edit if needed):
            </div>
            <textarea
              value={pendingTranscript}
              onChange={(e) => setPendingTranscript(e.target.value)}
              style={{
                fontSize: 14,
                lineHeight: 1.6,
                color: 'var(--fg)',
                background: 'var(--card)',
                border: '1px solid var(--line)',
                borderRadius: 8,
                padding: 10,
                minHeight: '60px',
                maxHeight: '150px',
                resize: 'vertical',
                fontFamily: 'inherit',
                outline: 'none',
                width: '100%',
                boxSizing: 'border-box',
                marginBottom: 12
              }}
              placeholder="Review and edit your message before sending..."
            />
            <div style={{ 
              display: 'flex', 
              gap: 8,
              justifyContent: 'flex-end'
            }}>
              <button 
                onClick={() => { 
                  reset(); 
                  setPendingTranscript('');
                  setShowPendingTranscript(false);
                }} 
                style={{ 
                  padding: '8px 16px',
                  borderRadius: 8,
                  border: '1px solid var(--line)',
                  background: 'transparent',
                  color: 'var(--fg)',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 500
                }}
              >
                Clear
              </button>
              <button 
                onClick={async () => {
                  if (!pendingTranscript.trim()) return;
                  const textToSend = pendingTranscript.trim();
                  setPendingTranscript('');
                  setShowPendingTranscript(false);
                  reset();
                  await handleSendTranscript(textToSend);
                }}
                disabled={!pendingTranscript.trim()}
                style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  border: 'none',
                  background: pendingTranscript.trim() ? GSU.blue : 'var(--muted)',
                  color: 'white',
                  cursor: pendingTranscript.trim() ? 'pointer' : 'not-allowed',
                  fontSize: 13,
                  fontWeight: 500,
                  opacity: pendingTranscript.trim() ? 1 : 0.6
                }}
              >
                ✓ Send Message
              </button>
            </div>
          </div>
        )}
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

    </div>
  );
}

export default ScreenVoice;
