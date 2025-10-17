import { useEffect, useState, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

export default function ChatRoom({roomId, userId, username}){
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const clientRef = useRef(null);

    useEffect(() => {
    // STOMP 클라이언트 생성
    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/chatting"),
      reconnectDelay: 5000, // 연결 끊어졌을 때 재접속
    });

    client.onConnect = () => {
      console.log("WebSocket connected");
      client.subscribe(`/topic/${roomId}`, (message) => {
        const msg = JSON.parse(message.body);
        setMessages((prev) => [...prev, msg]);
      });
    };

    client.onStompError = (frame) => {
      console.error("Broker reported error: ", frame.headers["message"]);
      console.error("Additional details: ", frame.body);
    };

    client.activate();
    clientRef.current = client;

    // 컴포넌트 언마운트 시 연결 해제
    return () => {
      client.deactivate();
    };
  }, [roomId]);

  // 전송 버튼
  const sendMessage = () => {
    if (!input.trim()) return; // 빈 메시지 전송 방지

    const chatMsg = {
      roomId,
      senderId: userId,
      sender: username,
      content: input,
    };

    // 연결 체크
    if (clientRef.current && clientRef.current.connected) {
        console.log("Sending:", chatMsg);
        clientRef.current.publish({
        destination: `/app/chat.sendMessage/${roomId}`,
        body: JSON.stringify(chatMsg),
        });
        setInput(""); // 입력창 초기화
    } else {
        console.log("WebSocket 연결이 아직 준비되지 않았습니다. 잠시 후 다시 시도하세요.");
    }
    };

    return(
        <div className="chat-room">
            <div className="chat-box">
                {messages.map((m, i) => (
                    <div key={i} className={m.sender === username ? "my-msg" : "other-msg"}>
                        <b>{m.sender}:</b> {m.content}
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input value={input} onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}/> {/* 엔터로도 전송 */}
                <button onClick={sendMessage}>전송</button>
            </div>
        </div>
    )
}