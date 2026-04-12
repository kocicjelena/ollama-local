/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { parseApiError } from "@/lib/errors";
import type { BlobsResponse } from "@/lib/types/blobs";
import styles from '../page.module.css';

export default function BlobsForm({ onSuccess }: { onSuccess?: (digest: string) => void }) {
  const [digest, setDigest] = useState("");
  const [file, setFile] = useState<any| null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BlobsResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // const preformData = new FormData();
      // preformData.append("digest", digest);

      const formData = new FormData();
      formData.append("digest", digest);
      formData.append("file", file);

      const res = await fetch("/api/blobs", {
        method: "POST",
        body: formData,
      });

      const data: BlobsResponse = await res.json();

      if (!res.ok) {
        throw new Error((data as unknown as { error: string }).error || "Upload failed");
      }

      setResult(data);
      onSuccess?.(digest);
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <form onSubmit={handleSubmit} className={styles.form}>
      <label>
        Digest (SHA256) *
        <input
          name="digest"
          type="text"
          value={digest}
          onChange={(e) => setDigest(e.target.value)}
          required
          placeholder="sha256sum [filename] in the terminal"
          className={styles.main2}
        />
      </label>

      <label>
        Model *
        <input
          name="file"
          type="text"
          onChange={(e) => setFile(e.target.value ?? null)}
          required
          className={styles.main2}
        />
      </label> 

      {error && (
        <div role="alert" style={{ color: "red", border: "1px solid red", padding: 8 }}>
          {error}
        </div>
      )}

      {result && (
        <div style={{ background: "#e6ffe6", padding: 8, border: "1px solid green" }}>
          Blob uploaded successfully — digest: <code>{digest}</code>
        </div>
      )}

      <button type="submit" disabled={loading || !file} className={styles.dugme}>
        {loading ? "Uploading…" : "Upload Blob"}
      </button>
    </form>
    </>
  );
}
