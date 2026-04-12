import ChatStreamForm from '@/components/ChatStreamForm/Wrap';

export default function Page() {
  return (
    <ChatStreamForm defaultModel="llama3.2">
      <h1>Streaming Chat</h1>
    </ChatStreamForm>
  );
}
