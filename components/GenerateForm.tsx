"use client";

import { useState } from "react";
import { apiClient } from "@/lib/apiClient";
import { parseApiError } from "@/lib/errors";
import type { GenerateRequest, GenerateResponse } from "@/lib/types/generate";
import styles from '../page.module.css';


const INITIAL: GenerateRequest = {
  model: "",
  prompt: "",
  suffix: "",
  system: "",
  stream: false,
};

export default function GenerateForm() {
  const [form, setForm] = useState<GenerateRequest>(INITIAL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerateResponse | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const payload: Record<string, unknown> = {
        model: form.model,
        prompt: form.prompt,
        stream: false,
      };
      if (form.suffix) payload.suffix = form.suffix;
      if (form.system) payload.system = form.system;

      const data = await apiClient<Record<string, unknown>, GenerateResponse>(
        "/api/generate",
        "POST",
        payload
      );
      setResult(data);
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <form onSubmit={handleSubmit} className={styles.form}>
      {/* model — required */}
      <label>
        Model *
        <input
          name="model"
          type="text"
          value={form.model}
          onChange={handleChange}
          required
          placeholder="e.g. llama3.2"
        />
      </label>

      {/* prompt — required */}
      <label>
        Prompt *
        <textarea
          name="prompt"
          value={form.prompt}
          onChange={handleChange}
          required
          rows={4}
          placeholder="Why is the sky blue?"
        />
      </label>

      {/* suffix — optional */}
      <label>
        Suffix
        <input
          name="suffix"
          type="text"
          value={form.suffix ?? ""}
          onChange={handleChange}
        />
      </label>

      {/* system — optional */}
      <label>
        System
        <textarea
          name="system"
          value={form.system ?? ""}
          onChange={handleChange}
          rows={2}
          placeholder="System prompt override"
        />
      </label>

      {error && (
        <div role="alert" style={{ color: "red", border: "1px solid red", padding: 8 }}>
          {error}
        </div>
      )}

      {result && (
        <div>
          <div style={{ background: "#f0f0f0", padding: 12, marginBottom: 8, whiteSpace: "pre-wrap" }}>
            {result.response}
          </div>
          <details>
            <summary>Full response</summary>
            <pre style={{ background: "#f0f0f0", padding: 8, fontSize: 12 }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </details>
        </div>
      )}

      <button type="submit" disabled={loading}>
        {loading ? "Generating…" : "Generate"}
      </button>
    </form>
    </>
  );
}
