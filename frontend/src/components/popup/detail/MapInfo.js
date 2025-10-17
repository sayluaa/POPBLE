import React, { useState } from "react";
import BasicMap from "../../common/kakaoMap/BasicMap";

import { FiMapPin } from "react-icons/fi";
import { RxCopy } from "react-icons/rx";

import AlertModal from "../../common/AlertModal";


const MapInfo = ({popupLocation}) => {
  const [address, setAddress] = useState(""); // BasicMap에서 전달받을 주소

  const [modal, setModal] = useState({
        isOpen: false,
        message: "",
        onClose: () => setModal(prev => ({ ...prev, isOpen: false })),
    });

    const handleCopyAddress = () => {
        // 주소 복사
        navigator.clipboard.writeText(address);
    
        setModal({
            isOpen: true,
            message: "주소가 클립보드에 복사되었습니다.",
            onClose: () => setModal(prev => ({ ...prev, isOpen: false })),
        });
    };
  
  return (
      <>
        {/* 지도 API 컴포넌트 자리 */}
        {/* 지도 형태 */}
        <div className="border border-hashTagColor rounded-xl overflow-hidden">
          <BasicMap onLoad={(addr) => setAddress(addr)}/>
        </div>
        {/* 주소표시 */}
        <div className="mt-5 inline-block w-full rounded-xl p-2 bg-subSecondColor">
          <p className="flex items-center gap-2">
            <FiMapPin/>{address}
            <RxCopy
              className="cursor-pointer"
              onClick={handleCopyAddress}
            />
          </p>
        </div>
        {modal.isOpen && (
            <AlertModal
                title={modal.title}
                message={modal.message}
                onClose={modal.onClose}
            />
        )}
      </>

  );
};
export default MapInfo;