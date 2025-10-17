import BasicMenu from "../components/BasicMenu";
import { useState } from "react";

import { IoIosArrowUp } from "react-icons/io";
import { FaHeadset } from "react-icons/fa6";
import { LuMessageCircleQuestion } from "react-icons/lu";
import { GiCancel } from "react-icons/gi";

import profileTest from "../../src/assets/img/POPBLE - P.jpg";

const BasicLayout = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  // 메시지 예시 배열
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "무엇을 도와드릴까요?",
      isMine: false,
      profile: profileTest,
    }, // 상대방 메시지
    { id: 2, text: "코드 좀 대신 만들어주세요", isMine: true }, // 내 메시지
  ]);

  return (
    //메인화면 레이아웃
    <BasicMenu>
      {/* 캐러셀 */}
      <div>{children}</div>

      {/* 스크롤 버튼 + 실시간 문의 채팅 버튼*/}
      <div className="flex flex-col items-end gap-4">
        <button
          className="fixed bottom-10 right-5 z-50 p-1 flex justify-center items-center shadow-md rounded-full bg-secondaryAccentColor w-12 h-12"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <IoIosArrowUp className="text-2xl stroke-2" />
        </button>
        <div className="relative">
          <button
            className="fixed bottom-24 right-5 z-50 p-1 flex justify-center items-center shadow-md rounded-full bg-secondaryAccentColor w-12 h-12"
            onClick={() => setIsChatOpen(!isChatOpen)}
          >
            {/* (헤드셋 ↔ X) */}
            {isChatOpen ? (
              <GiCancel className="text-2xl" />
            ) : (
              <FaHeadset className="text-2xl" />
            )}
          </button>

          {/* 채팅창 */}
          {isChatOpen && ( //isChatOpen이 true일 때만 채팅이 나타남
            <div className="fixed bottom-5 right-24 w-80 h-96 bg-white border border-black shadow-lg flex flex-col z-10">
              <div className="flex-1 p-2 pt-4 overflow-y-auto flex flex-col gap-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.isMine ? "justify-end" : "justify-start"
                    } gap-2`}
                  >
                    {/* 추가: 상대방 프로필 */}
                    {!msg.isMine && (
                      <img
                        src={msg.profile}
                        alt="상대"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    )}
                    <div
                      className={`${
                        msg.isMine
                          ? "bg-secondaryAccentColor text-black"
                          : "bg-gray-200"
                      } p-2 rounded-lg`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
              {/* 메세지 입력창 */}
              <div className="p-2 bg-secondaryColor border-t flex">
                <input
                  type="text"
                  placeholder="메시지를 입력하세요..."
                  className="flex-1 border rounded px-2 py-1"
                />
                <button className="ml-2 bg-secondaryAccentColor text-black px-3 rounded">
                  전송
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </BasicMenu>
  );
};
export default BasicLayout;
