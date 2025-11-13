import { useEffect, useRef, useState } from 'react';

// Minimal hook around the Web Speech API (SpeechRecognition).
// Returns { listening, transcript, error, start, stop, reset }
export default function useSpeechToText({ interimResults = true, lang = 'en-US' } = {}) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Browser compatibility
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError(new Error('SpeechRecognition not supported in this browser'));
      return;
    }

    const recog = new SpeechRecognition();
    recog.lang = lang;
    recog.interimResults = interimResults;
    recog.maxAlternatives = 1;

    recog.onresult = (ev) => {
      let finalTranscript = '';
      let interimTranscript = '';
      
      for (let i = 0; i < ev.results.length; i++) {
        const result = ev.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }
      
      setTranscript(finalTranscript + interimTranscript);
    };

    recog.onerror = (ev) => {
      setError(new Error(ev.error || 'speech_error'));
    };

    recog.onstart = () => {
      // Speech recognition started
    };

    recog.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recog;

    return () => {
      try {
        recog.onresult = null;
        recog.onerror = null;
        recog.onend = null;
        recog.onstart = null;
        recog.stop && recog.stop();
      } catch (err) {
        // ignore
      }
    };
  }, [interimResults, lang]);

  function start() {
    const recog = recognitionRef.current;
    if (!recog) return setError(new Error('SpeechRecognition not available'));
    setError(null);
    setTranscript('');
    try {
      recog.start();
      setListening(true);
    } catch (err) {
      // start may throw if already started
      setError(err);
    }
  }

  function stop() {
    const recog = recognitionRef.current;
    try {
      recog && recog.stop();
    } catch (err) {
      // ignore
    }
    setListening(false);
  }

  function reset() {
    setTranscript('');
    setError(null);
  }

  return { listening, transcript, error, start, stop, reset, setTranscript };
}
