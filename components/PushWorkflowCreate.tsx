"use client";

import { useState } from "react";
//import BlobsForm from "./BlobsForm";
import ShowForm from "./ShowForm";
import PushForm from "./PushForm";
import BlobsForm from "./BlobsForm";
import styles from '../../page.module.css';


type Step = "blob" | "show" | "push";

const STEPS: { key: Step; label: string; description: string }[] = [
  { key: "blob", label: "1. Upload Blob", description: "Upload your model blob to the Ollama server" },
  { key: "show", label: "2. Review Model", description: "Inspect the model details before pushing" },
  { key: "push", label: "3. Push to Cloud", description: "Push your model to the Ollama registry" },
];

export default function PushWorkflow() {
  const [currentStep, setCurrentStep] = useState<Step>("blob");
  const [modelName, setModelName] = useState("");

  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      {/* <h2>Push Model Workflow</h2> */}

      {/* Step indicator */}
      <div style={{ display: "flex", gap: 4, marginBottom: 24 }}>
        {STEPS.map((step) => (
          <button
            key={step.key}
            onClick={() => setCurrentStep(step.key)}
            style={{
              flex: 1,
              padding: "8px 4px",
              background: currentStep === step.key ? "#67c2c2" : "#e0e0e0",
              color: currentStep === step.key ? "#fff" : "#333",
              border: "none",
              cursor: "pointer",
              fontWeight: currentStep === step.key ? 600 : 400,
              fontSize: 14,
            }}
          >
            {step.label}
          </button>
        ))}
      </div>

      {/* Step description */}
      <p style={{ color: "#666", marginBottom: 16 }}>
        {STEPS.find((s) => s.key === currentStep)?.description}
      </p>

      {/* Step content */}
      {currentStep === "blob" && (
        <BlobsForm
          onSuccess={() => setCurrentStep("show")}
        />
      )}

      {currentStep === "show" && (
        <>
          <ShowForm
            initialModel={modelName}
            onReviewed={(name) => {
              setModelName(name);
              // Don't auto-advance — let user review first
            }}
          />
          <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between" }}>
            <button onClick={() => setCurrentStep("blob")} className={styles.main2}> 
              ← Back to Blob
            </button>
            <button
              onClick={() => setCurrentStep("push")}
              style={{ padding: "8px 16px", background: "#0070f3", color: "#fff", border: "none", cursor: "pointer" }}
            >
              Proceed to Push →
            </button>
          </div>
        </>
      )}

      {currentStep === "push" && (
        <>
          <PushForm initialModel={modelName} />
          <div style={{ marginTop: 16 }}>
            <button onClick={() => setCurrentStep("show")} style={{ padding: "8px 16px" }}>
              ← Back to Review
            </button>
          </div>
        </>
      )}
    </div>
  );
}
