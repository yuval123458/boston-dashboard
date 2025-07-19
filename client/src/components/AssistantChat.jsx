import React, { useState } from "react";

const ChatPage = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const userInput = input;
    setInput("");

    try {
      const res = await fetch("http://localhost:5001/api/chat/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput }),
      });

      const json = await res.json();
      if (res.ok) {
        setMessages((prev) => [
          { role: "user", text: userInput },
          {
            role: "assistant",
            text: json.summary,
            query: json.query,
          },
          ...prev,
        ]);
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
    <>
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
      </div>
      <div className="space-y-4 mb-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded ${
              msg.role === "user"
                ? "bg-blue-50 text-right border border-blue-200"
                : "bg-gray-100 border border-gray-300"
            }`}
          >
            <strong>{msg.role === "user" ? "You" : "Assistant"}:</strong>{" "}
            {msg.text}
            {msg.role === "assistant" && msg.query && (
              <pre className="bg-gray-50 mt-2 p-2 text-xs border rounded overflow-auto max-h-64">
                {JSON.stringify(msg.query, null, 2)}
              </pre>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default ChatPage;
