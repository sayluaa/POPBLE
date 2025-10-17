import ChatRoom from "./ChatRoom"

export default function TestChat() {
  return (
    <div>
      <h1>실시간 채팅 테스트</h1>
      <ChatRoom roomId={1} userId={999} username="Tester" />
    </div>
  );
}
