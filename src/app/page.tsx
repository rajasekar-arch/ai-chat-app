"use client";
import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [model, setModel] = useState("openai/gpt-3.5-turbo");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );

  const handleSend = async () => {
    debugger;
    if (!navigator.onLine) {
      alert("You're offline. Please check your internet connection.");
      return;
    }

    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setInput("");

    // First, optimistically add user's message
    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await fetch("/api/generate-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, model }),
      });

      const data = await res.json();

      if (data.error) {
        alert(data.error);
        return;
      }
      const botMessage = { role:"assistant", content: data.story };
      // Append bot response
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Failed to fetch. Please try again.");
    }
  };

  return (
    <main className="p-4 max-w-2xl mx-auto">
      <div className="h-[70vh] overflow-y-auto border p-4 rounded mb-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 ${
              msg.role === "user" ? "text-right" : "text-left"
            }`}
          >
            <span
              className={`px-3 py-2 rounded inline-block ${
                msg.role === "user" ? "bg-blue-100" : "bg-gray-200"
              }`}
            >
              {msg.content}
            </span>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-2">
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="openai/gpt-3.5-turbo">GPT-3.5 Turbo</option>
          <option value="openai/gpt-4">GPT-4</option>
          <option value="mistralai/mixtral-8x7b">Mixtral 8x7B</option>
          <option value="meta-llama/llama-3-70b-instruct">
            LLaMA 3 70B Instruct
          </option>
        </select>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border p-2 rounded flex-1"
          placeholder="Ask me anything..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </main>
  );
}

