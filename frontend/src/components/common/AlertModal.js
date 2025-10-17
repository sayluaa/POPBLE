import { IoIosClose } from "react-icons/io";
import { TbMessageExclamation } from "react-icons/tb";


const AlertModal = ({ message, onClose }) => {

    // 닫기 버튼 또는 배경 클릭 시 호출
    const handleClose = (e) => {
        if (e) e.stopPropagation();
        onClose();
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[1000]" // z-index를 높여서 항상 최상단에 표시
            onClick={handleClose} 
        >
            <div 
                className="bg-hashTagColor p-1 rounded-lg relative"
                onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 배경 닫힘 방지
            >
                {/* 닫기 버튼 (X 아이콘) */}
                <button
                    className="absolute top-3 right-3 text-black hover:text-gray-700 text-3xl z-50 p-2 pointer-events-auto" 
                    onClick={handleClose}
                >
                    <IoIosClose />
                </button>

                {/* 모달 내용 */}
                <div className="bg-white rounded-lg p-8 w-[400px] flex flex-col items-center">
                    
                    {/* 제목 (경고/에러 등의 목적에 따라 title prop으로 변경 가능) */}
                    <p className="text-2xl font-bold mb-6 text-center text-black bg-primaryColor p-4 rounded-full">
                        <TbMessageExclamation size={50} className="text-black" />
                    </p>
                    
                    {/* 메시지 내용 */}
                    <p className="text-lg text-gray-800 mb-6 text-center whitespace-pre-wrap">
                        {message}
                    </p>

                    {/* 확인 버튼 */}
                    <button
                        onClick={handleClose}
                        className="w-full bg-white text-black font-semibold py-3 rounded-md hover:bg-subSecondColor transition"
                    >
                        확인
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AlertModal;