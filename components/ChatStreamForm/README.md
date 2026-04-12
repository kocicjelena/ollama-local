# ChatStreamForm

Server/client split wrapper for the streaming chat component (uses Web Worker + Streams API).

## Usage

```tsx
// In a Server Component:
import ChatStreamForm from './ChatStreamForm/Wrap';

export default function Page() {
  return (
    <ChatStreamForm defaultModel="llama3.2">
      <h1>Streaming Chat</h1>
      <p>This heading is rendered server-side</p>
    </ChatStreamForm>
  );
}
```

## File roles

| File | Directive | Purpose |
|------|-----------|---------|
| Wrap.tsx | none | Server-safe shell, import this |
| WrapComp.tsx | "use client" | Worker lifecycle, hooks, streaming state, UI |
| types.ts | — | Shared prop types |

## Props

| Prop | Type | Description |
|------|------|-------------|
| children | ReactNode | Server-rendered content slotted above the chat |
| defaultModel | string | Pre-fill the model input field |
