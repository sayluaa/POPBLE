import { FaUserEdit, FaBookmark } from "react-icons/fa";
import { MdEditDocument } from "react-icons/md";
import { FaCalendarCheck } from "react-icons/fa6";
import React from "react";


const menuList = [
  { 
    key: "edit", 
    label: "회원정보 수정 / 탈퇴", 
    icon: <FaUserEdit size={50} /> },
  {
    key: "bookmark",
    label: "북마크 보기",
    icon: <FaBookmark size={45} />,
  },
  {
    key: "post",
    label: "내 게시글 보기",
    icon: <MdEditDocument size={50} />,
  },
  {
    key: "reservation",
    label: "예약내역 확인 / 취소",
    icon: <FaCalendarCheck size={50} />,
  },
];

const MyPageMenuComponent = ({ selectedMenu, onMenuClick }) => {
  return (
    <div className="grid grid-cols-4 gap-4 bg-subFirstColor p-5 mb-10 w-full h-[180px] shadow-lg">
      {menuList.map(({ key, label, icon }) => (
        
        <div
          key={key}
          onClick={() => onMenuClick(key)}
          className="flex flex-col items-center text-black cursor-pointer"
        >
          <div
            className={`flex justify-center items-center rounded-full size-[90px] mb-2 bg-black shadow-md hover:border-2 border-black
                ${selectedMenu === key
                    ? "bg-black border-2 border-black"
                    : "bg-subSecondColor"
                }`}
          >
            {React.cloneElement(icon, { color: selectedMenu === key ? "#fff" : "#000" })}
          </div>

          <div className="text- m-1 p-3">{label}</div>
        </div>
      ))}
    </div>
  );
};

export default MyPageMenuComponent;