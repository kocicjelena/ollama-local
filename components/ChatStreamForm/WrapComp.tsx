"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  ChatMessage,
  ChatRequest,
  WorkerRequestMessage,
  WorkerOutMessage,
} from "@/lib/types/chat";
import type { ChatStreamFormProps } from "./types";
import styles from '../../page.module.css';


export default function ChatStreamFormComp({
  children,
  defaultModel = "",
}: ChatStreamFormProps) {
  const [model, setModel] = useState<string>(defaultModel);
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const workerRef = useRef<Worker | null>(null);

  // Spin up the worker once
  useEffect(() => {
    workerRef.current = new Worker(
      new URL("../../streamWorker.ts", import.meta.url)
    );
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  // Listen for worker messages
  useEffect(() => {
    const worker = workerRef.current;
    if (!worker) return;

    const handler = (e: MessageEvent<WorkerOutMessage>) => {
      const msg = e.data;

      switch (msg.type) {
        case "token":
          setStreamingText((prev) => prev + msg.token);
          break;

        case "done": {
          setStreamingText((prev) => {
            const fullContent = prev;
            setMessages((msgs) => [
              ...msgs,
              {
                role: "assistant",
                content: fullContent,
                tool_calls: msg.response.message?.tool_calls,
                thinking: msg.response.message?.thinking,
              },
            ]);
            return "";
          });
          setStreaming(false);
          break;
        }

        case "error":
          setError(msg.error);
          setStreaming(false);
          setStreamingText("");
          break;
      }
    };

    worker.addEventListener("message", handler);
    return () => worker.removeEventListener("message", handler);
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim() || !model.trim() || streaming) return;

      const userMessage: ChatMessage = { role: "user", content: input.trim() };
      const updatedMessages = [...messages, userMessage];

      setMessages(updatedMessages);
      setInput("");
      setStreaming(true);
      setStreamingText("");
      setError(null);

      const payload: ChatRequest = {
        model,
        messages: updatedMessages,
        stream: true,
      };

      const msg: WorkerRequestMessage = { type: "start", payload };
      workerRef.current?.postMessage(msg);
    },
    [input, model, messages, streaming]
  );

  const handleClear = () => {
    setMessages([]);
    setStreamingText("");
    setError(null);
  };

  return (
    <>
    <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 640 }}>
      {/* Server-rendered children slot */}
      {children}

      {/* Model selector */}
      <label>
        Model *
        <input
          type="text"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          placeholder="e.g. llama3.2, mistral, phi4"
          required
    className={styles.model}        />
      </label>

      {/* Conversation history */}
      {(messages.length > 0 || streamingText) && (
        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: 4,
            padding: 12,
            display: "flex",
            flexDirection: "column",
            gap: 8,
            maxHeight: 400,
            overflowY: "auto",
          }}
        >
          {messages.map((msg, i) => (
            <div key={i}>
              <strong style={{ textTransform: "capitalize" }}>{msg.role}:</strong>
              {msg.thinking && (
                <details style={{ color: "#888", fontSize: "0.85em", marginTop: 2 }}>
                  <summary>Thinking</summary>
                  <pre style={{ whiteSpace: "pre-wrap" }}>{msg.thinking}</pre>
                </details>
              )}
              <p style={{ margin: "2px 0 0", whiteSpace: "pre-wrap" }}>{msg.content}</p>
              {msg.tool_calls && msg.tool_calls.length > 0 && (
                <pre style={{ background: "#f5f5f5", padding: 6, fontSize: "0.8em" }}>
                  {JSON.stringify(msg.tool_calls, null, 2)}
                </pre>
              )}
            </div>
          ))}

          {/* Live streaming text */}
          {streamingText && (
            <div>
              <strong>Assistant:</strong>
              <p style={{ margin: "2px 0 0", whiteSpace: "pre-wrap" }}>
                {streamingText}
                <span style={{ opacity: 0.5 }}>▌</span>
              </p>
            </div>
          )}
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div
          role="alert"
          style={{ color: "red", border: "1px solid red", padding: 8, borderRadius: 4 }}
        >
          {error}
        </div>
      )}

      {/* Input form */}
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message…"
          disabled={streaming}
          required
          className={styles.main2}

        />
        <button type="submit" disabled={streaming || !model.trim()} className={styles.main2}>
          {streaming ? "Streaming…" : "Send"}
        </button>
      </form>

      {messages.length > 0 && (
        <button
          type="button"
          onClick={handleClear}
          className={styles.dugme}>
          Clear conversation
        </button>
      )}
    </div>
    </>
  );
}
