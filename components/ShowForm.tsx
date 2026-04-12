"use client";

import { useState } from "react";
import { apiClient } from "@/lib/apiClient";
import { parseApiError } from "@/lib/errors";
import type { ShowRequest, ShowResponse } from "@/lib/types/show";
import styles from "../page.module.css";


export default function ShowForm({ initialModel, onReviewed }: { initialModel?: string; onReviewed?: (model: string) => void }) {
  const [model, setModel] = useState(initialModel ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ShowResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await apiClient<ShowRequest, ShowResponse>(
        "/api/show",
        "POST",
        { model }
      );
      setResult(data);
      onReviewed?.(model);
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label>
        Model *
        <input
          name="model"
          type="text"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          required
          placeholder="e.g. myuser/mymodel"
          className={styles.model}
        />
      </label>

      {error && (
        <div role="alert" style={{ color: "red", border: "1px solid red", padding: 8 }}>
          {error}
        </div>
      )}

      {result && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ background: "#f0f0f0", padding: 12 }}>
            <strong>Details</strong>
            <table style={{ width: "100%", marginTop: 8, fontSize: 14 }}>
              <tbody>
                <tr><td>Format</td><td>{result.details.format}</td></tr>
                <tr><td>Family</td><td>{result.details.family}</td></tr>
                <tr><td>Parameter Size</td><td>{result.details.parameter_size}</td></tr>
                <tr><td>Quantization</td><td>{result.details.quantization_level}</td></tr>
                <tr><td>Parent Model</td><td>{result.details.parent_model || "—"}</td></tr>
              </tbody>
            </table>
          </div>

          {result.parameters && (
            <details>
              <summary>Parameters</summary>
              <pre style={{ background: "#f0f0f0", padding: 8, fontSize: 12 }}>{result.parameters}</pre>
            </details>
          )}

          {result.template && (
            <details>
              <summary>Template</summary>
              <pre style={{ background: "#f0f0f0", padding: 8, fontSize: 12 }}>{result.template}</pre>
            </details>
          )}

          {result.modelfile && (
            <details>
              <summary>Modelfile</summary>
              <pre style={{ background: "#f0f0f0", padding: 8, fontSize: 12, whiteSpace: "pre-wrap" }}>{result.modelfile}</pre>
            </details>
          )}

          <details>
            <summary>Full response JSON</summary>
            <pre style={{ background: "#f0f0f0", padding: 8, fontSize: 12 }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </details>
        </div>
      )}

      <button type="submit" disabled={loading} className={styles.dugme}>
        {loading ? "Loading…" : "Show Model Info"}
      </button>
    </form>
  );
}
