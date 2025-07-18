import React, { useState } from "react";

const ChatPage = () => {
  const [input, setInput] = useState("");
  const [query, setQuery] = useState(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSummary("");
    setQuery(null);
    setInput("");

    try {
      const res = await fetch("http://localhost:5001/api/chat/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const json = await res.json();
      if (res.ok) {
        setQuery(json.query);
        setSummary(json.summary);
      } else {
        setError(json.error || "Unknown error");
      }
    } catch (err) {
      setError("Network error or server not responding.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Chat Assistant</h1>

      <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
        <input
          type="text"
          className="border px-4 py-2 flex-1 rounded"
          placeholder="Ask something like: How many jobs failed in US last month?"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          disabled={loading}
        >
          {loading ? "Thinking..." : "Send"}
        </button>
      </form>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      {query && (
        <div className="mb-4">
          <h2 className="font-semibold">Generated Query:</h2>
          <pre className="bg-gray-100 p-3 rounded overflow-auto text-sm">
            {JSON.stringify(query, null, 2)}
          </pre>
        </div>
      )}

      {summary && (
        <div className="mb-4">
          <h2 className="font-semibold">Summary:</h2>
          <div className="bg-green-50 border border-green-200 p-3 rounded">
            {summary}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
