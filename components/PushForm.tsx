"use client";

import { useState } from "react";
import { apiClient } from "@/lib/apiClient";
import { parseApiError } from "@/lib/errors";
import type { PushRequest, PushResponse } from "@/lib/types/push";
import styles from '../page.module.css';


export default function PushForm({ initialModel }: { initialModel?: string }) {
  const [model, setModel] = useState(initialModel ?? "");
  const [insecure, setInsecure] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PushResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const payload: PushRequest = { model, stream: false };
      if (insecure) payload.insecure = true;

      const data = await apiClient<PushRequest, PushResponse>(
        "/api/push",
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
    <h6>Upload a model to a model library. Requires registering for ollama.ai and adding a public key first.</h6>
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
<hr />
      <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input
          name="insecure"
          type="checkbox"
          checked={insecure}
          onChange={(e) => setInsecure(e.target.checked)}
        />
       <h6> Allow insecure connections </h6>
      </label>
      {/* <label>Device keys allow Ollama on macOS, Windows and Linux <br />to access your account's cloud models and allow you to push models to your account.</label> */}

      {error && (
        <div role="alert" style={{ color: "red", border: "1px solid red", padding: 8 }}>
          {error}
        </div>
      )}

      {result && (
        <div style={{ background: "#e6ffe6", padding: 12, border: "1px solid green" }}>
          <strong>Status:</strong> {result.status}
          {result.digest && <div>Digest: <code>{result.digest}</code></div>}
        </div>
      )}

      <button type="submit" disabled={loading} className={styles.dugme}>
        {loading ? "Pushing…" : "Push Model"}
      </button>
    </form>
    </>
  );
}
