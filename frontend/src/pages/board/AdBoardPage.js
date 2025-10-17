import React, { useState } from 'react';
import AdBoardComponent from "../../components/popup/reservation/AdBoradComponent";
import ReservationTimeComponent from "../../components/popup/reservation/ReservationTimeComponent";

const AdBoardPage = () => {

    const [step, setStep] = useState(1);
    const [newPopupStoreId, setNewPopupStoreId] = useState(null);

    
    const handlePopupRegisterSuccess = (popupStoreId) => {
        setNewPopupStoreId(popupStoreId); 
        setStep(2); 
    };

    return (
        <div className="p-4 w-full bg-white">
            <h1 className="text-3xl font-extrabold text-center">
                팝업스토어 등록 및 관리
            </h1>
            
            <div className="mt-8">
                {step === 1 && (
                    <>
                        <h2 className="text-2xl font-bold mb-4">1단계: 팝업스토어 기본 정보 등록</h2>
                   
                        <AdBoardComponent onRegisterSuccess={handlePopupRegisterSuccess} />
                    </>
                )}
                
                {step === 2 && (
                    <>
                        <h2 className="text-2xl font-bold mb-4">2단계: 예약 시간 슬롯 관리</h2>
                       
                        <ReservationTimeComponent popupStoreIdFromParent={newPopupStoreId} />
                    </>
                )}
            </div>
        </div>
    );
}

export default AdBoardPage;