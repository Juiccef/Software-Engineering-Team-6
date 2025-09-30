import React, { useState } from 'react';

function OpenAITest() {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const testConnection = async () => {
    setTesting(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch('http://localhost:5001/api/test-openai');
      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data);
      }
    } catch (err) {
      setError({
        status: 'error',
        message: 'Failed to connect to backend server',
        error: err.message
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div style={{
      background: "var(--card)",
      border: "1px solid var(--line)",
      borderRadius: 16,
      padding: 20,
      margin: "20px 0"
    }}>
      <h3 style={{ margin: "0 0 16px 0", color: "var(--fg)" }}>
        🔍 OpenAI Connection Test
      </h3>
      
      <button
        onClick={testConnection}
        disabled={testing}
        style={{
          background: testing ? "var(--line)" : "#0039A6",
          color: "white",
          border: "none",
          padding: "12px 24px",
          borderRadius: 12,
          cursor: testing ? "not-allowed" : "pointer",
          fontSize: "14px",
          fontWeight: 600,
          marginBottom: 16,
          opacity: testing ? 0.6 : 1
        }}
      >
        {testing ? "Testing..." : "Test OpenAI Connection"}
      </button>

      {result && (
        <div style={{
          background: "#d4edda",
          border: "1px solid #c3e6cb",
          borderRadius: 8,
          padding: 16,
          marginTop: 16
        }}>
          <h4 style={{ margin: "0 0 8px 0", color: "#155724" }}>
            ✅ Connection Successful!
          </h4>
          <p style={{ margin: "0 0 8px 0", color: "#155724" }}>
            <strong>Response:</strong> {result.response}
          </p>
          <p style={{ margin: "0 0 8px 0", color: "#155724" }}>
            <strong>Model:</strong> {result.model}
          </p>
          <p style={{ margin: 0, color: "#155724" }}>
            <strong>Usage:</strong> {JSON.stringify(result.usage)}
          </p>
        </div>
      )}

      {error && (
        <div style={{
          background: "#f8d7da",
          border: "1px solid #f5c6cb",
          borderRadius: 8,
          padding: 16,
          marginTop: 16
        }}>
          <h4 style={{ margin: "0 0 8px 0", color: "#721c24" }}>
            ❌ Connection Failed
          </h4>
          <p style={{ margin: "0 0 8px 0", color: "#721c24" }}>
            <strong>Error:</strong> {error.message}
          </p>
          {error.error && (
            <p style={{ margin: 0, color: "#721c24" }}>
              <strong>Details:</strong> {error.error}
            </p>
          )}
        </div>
      )}

      <div style={{
        marginTop: 16,
        padding: 12,
        background: "var(--hover)",
        borderRadius: 8,
        fontSize: "12px",
        color: "var(--fg)",
        opacity: 0.8
      }}>
        <strong>💡 Tips:</strong>
        <ul style={{ margin: "8px 0 0 0", paddingLeft: 20 }}>
          <li>Make sure your backend server is running on port 5001</li>
          <li>Check that your OpenAI API key is set in the .env file</li>
          <li>Ensure you have credits in your OpenAI account</li>
        </ul>
      </div>
    </div>
  );
}

export default OpenAITest;
