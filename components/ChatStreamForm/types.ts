import { ReactNode } from "react";

export interface ChatStreamFormProps {
  children?: ReactNode;
  /** Default model name to pre-fill (optional, serializable) */
  defaultModel?: string;
}
