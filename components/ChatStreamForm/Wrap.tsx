// Server-safe wrapper — no "use client" directive
// Import this file from Server Components
import WrapComp from "./WrapComp";
import type { ChatStreamFormProps } from "./types";

const ChatStreamForm = ({ children, defaultModel }: ChatStreamFormProps) => {
  return <WrapComp defaultModel={defaultModel}>{children}</WrapComp>;
};

export default ChatStreamForm;
