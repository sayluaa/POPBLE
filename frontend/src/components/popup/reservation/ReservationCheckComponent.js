import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReservationSuccessModal from "./ReservationSuccessModal";
import TossPayment from "./TossPayment";
import LoadingComponent from "../../common/LoadingComponent";
import axios from "axios";
import { getRemaining } from "../../../api/reservationApi";
import AlertModal from "../../common/AlertModal";

const ReservationCheckComponent = ({ popupStore, selected, userProfileId, onBack, user }) => {

    const navigate = useNavigate();

    const [userName, setUserName] = useState();
    const [phonenumber, setPhonenumber] = useState();
    const [reservationId, setReservationId] = useState(null);
    const [showLoadingPayment, setShowLoadingPayment] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [tossCompleted, setTossCompleted] = useState(false);

    const [editMode, setEditMode] = useState(false);
    const [editedName, setEditedName] = useState("");
    const [editedPhone, setEditedPhone] = useState("");
    const [remainingSeats, setRemainingSeats] = useState(null);
    const [isBookingAvailable, setIsBookingAvailable] = useState(false);

    const [showAlertModal, setShowAlertModal] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    const reservationDate = selected.date;
    const reservationTime = selected.time?.startTime;
    const year = reservationDate.getFullYear().toString().slice(-2);
    const month = (reservationDate.getMonth() + 1).toString();
    const day = reservationDate.getDate().toString();
    const [hour, minute] = reservationTime?.split(':') || [];
    const ampm = (hour && hour >= 12) ? '오후' : '오전';
    const displayHour = (hour && hour % 12 === 0) ? 12 : hour % 12;
    const formattedDateTime = reservationDate && reservationTime
        ? `${year}년 ${month}월 ${day}일 ${ampm} ${displayHour}시 ${minute}분`
        : "";


        const fetchRemainingSeats = async () => {
        if (!selected.date || !selected.time) {
            setRemainingSeats(null);
            return;
        }

        const { startTime, endTime } = selected.time;
        if (!startTime || !endTime) {
            setRemainingSeats(null);
            return;
        }

        try {
            const formattedDate = selected.date instanceof Date
                ? selected.date.toISOString().split("T")[0]
                : selected.date;

            const formattedStartTime = selected.time.startTime.padStart(5, '0').substring(0, 5);
            const formattedEndTime = selected.time.endTime === '00:00'
                ? '24:00'
                : selected.time.endTime.padStart(5, '0').substring(0, 5);

            const data = await getRemaining(
                popupStore.id,
                formattedDate,
                formattedStartTime,
                formattedEndTime
            );
            setRemainingSeats(data);
        } catch (error) {
            console.error("잔여 인원 조회 실패:", error);
            setRemainingSeats(0);
        }
    };
    
    //핸드폰 번호 자동으로 '-'넣기
    const formatPhone = (value) => {
        if(!value) return ""
        
        const digits = value.replace(/\D/g, "");
        if (digits.length < 4) return digits;
        if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
        return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
    };

    const openAlertModal = (message) => {
        setAlertMessage(message);
        setShowAlertModal(true);
    };

    
    
    useEffect(() => {
        fetchRemainingSeats();
    }, [selected.date, selected.time, popupStore.id]);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!userProfileId) return;

            try {
                const res = await axios.get(`http://localhost:8080/api/user/${userProfileId}`);
                const userData = res.data;

                const fetchedName = userData.name || ""
                const fetchedPhone = userData.phonenumber || ""

            
                setUserName(fetchedName);
                setPhonenumber(fetchedPhone);

            
                setEditedName(fetchedName);
                setEditedPhone(fetchedPhone.replace(/\D/g, ""));
            } catch (error) {
                console.error("사용자 정보 조회 실패:", error);
                
            }
        };
        
        fetchUserProfile();
    }, [userProfileId]);

    useEffect(() => {
        if (remainingSeats !== null && selected.count) {
            setIsBookingAvailable(selected.count <= remainingSeats);
        } else {
            setIsBookingAvailable(false);
        }
    }, [remainingSeats, selected.count]);

    const handleReservationRegister = async (isPaid = true) => {
        try {
            const { startTime, endTime } = selected.time;
            
            if (!startTime || !endTime) {
                openAlertModal("예약 확정 중 시간 정보가 누락되었습니다. 고객센터에 문의해 주세요");
                onBack();
                return;
            }
            
            const cleanedStartTime = startTime.substring(0, 5);
            const cleanedEndTime = endTime.substring(0, 5);
            
            const formattedStartTimeForPayload = cleanedStartTime + ":00";
            const formattedEndTimeForPayload = cleanedEndTime === '00:00'
            ? '24:00:00'
            : cleanedEndTime + ":00";
            
            const payload = {
                popupStoreId: popupStore.id,
                userProfileId,
                userName,
                phonenumber: phonenumber.replace(/\D/g, ""),
                reservationCount: Number(selected.count),
                reservationDate: selected.date instanceof Date
                    ? selected.date.toISOString().split("T")[0]
                    : selected.date,
                    startTime: formattedStartTimeForPayload,
                endTime: formattedEndTimeForPayload,
            };
            
            const res = await axios.post("http://localhost:8080/api/reservation/register", payload);
            
            setReservationId(res.data.id);
            setShowPayment(false);
            setShowLoadingPayment(false);
            setTossCompleted(true); 
            
            await fetchRemainingSeats();
            
        } catch (err) {
            console.error("예약 확정 중 오류 발생:", err);
            openAlertModal("예약 확정 중 오류가 발생했습니다. 고객센터에 문의해주세요.");
            setShowPayment(false);
            setShowLoadingPayment(false);
            setTossCompleted(false);
            onBack();
        }
    };
    
    // 토스결제 성공시 (유료 예약)
    const handleTossComplete = async () => {
        
        await handleReservationRegister(true);
    };

    // 토스결제 실패시 (유료 예약)
    const handleTossFail = () => {
        openAlertModal("결제 실패! 예약 화면으로 돌아갑니다.");
        setShowPayment(false);
        setShowLoadingPayment(false);
        setReservationId(null);
        setTossCompleted(false);
        
    };
    
    const closeAlertModal = () => {
        setShowAlertModal(false);
        setAlertMessage("");

        if (alertMessage.includes("결제 실패")) {
         onBack(); 
    }
    };
    
    
    // 예약하기 상태 (메인 버튼 핸들러)
    const handleReservation = async () => {

        const totalAmount = popupStore.price * selected.count;

        if (!selected.date || !selected.time || !selected.count) {
            openAlertModal("날짜, 시간, 인원을 모두 선택해주세요.");
            return;
        }

        if (remainingSeats === null) {
            openAlertModal("잔여 인원 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
            return;
        }
        if (selected.count > remainingSeats) {
            openAlertModal(`예약 가능한 인원은 ${remainingSeats}명입니다. 인원수를 다시 확인해주세요.`);
            return;
        }
        if (selected.count <= 0) {
            openAlertModal("예약 인원은 최소 1명 이상이어야 합니다.");
            return;
        }

    
        setShowLoadingPayment(true);

    
        if (totalAmount > 0) {
            
            setTimeout(() => {
                setShowLoadingPayment(false);
                setShowPayment(true); 
            }, 200);
            
        } else {
            
            try {
                await handleReservationRegister(false); 
            
            } catch (err) {
                
                setShowLoadingPayment(false);
            }
        }
    };

    const handleModalClose = () => {
    setTossCompleted(false);
    navigate(`/popup/detail`)
};

    return (
        <div>
            {showAlertModal && (
                <AlertModal message={alertMessage} onClose={closeAlertModal} />
            )}
            {showLoadingPayment && <LoadingComponent />}
            {showPayment && !tossCompleted && (
                <TossPayment
                    price={popupStore.price * selected.count}
                    ordername={popupStore.storeName}
                    onSuccess={handleTossComplete}
                    onFail={handleTossFail}
                />
            )}
            {tossCompleted && (
                <ReservationSuccessModal
                    popupStore={popupStore}
                    reservationDate={selected.date}
                    reservationTime={selected.time}
                    onClose={handleModalClose}
                />
            )}

            {!showPayment && !showLoadingPayment && !tossCompleted && (
                <div className="flex flex-col items-center">
                    <div className="mt-10 mb-10 w-4/5 border rounded-2xl border-gray-200 p-4">
                        <div className="text-sm hidden">id: {popupStore.id}</div>
                        <div className="text-4xl font-bold ml-5 mt-8 mb-8">{popupStore.storeName}</div>
                        <div className="text-xl mt-2 ml-5">
                            <span>일정</span>
                            <span style={{ marginLeft: "30px" }}>
                                {formattedDateTime}
                            </span>
                        </div>
                        <div className="text-xl mt-4 ml-5">
                            <span>인원</span>
                            <span style={{ marginLeft: "30px" }}>{selected.count}명</span>
                            {remainingSeats !== null && (
                                <span className="ml-4 text-gray-500 text-base">
                                    (잔여: {remainingSeats}명)
                                </span>
                            )}
                        </div>
                        <div className="text-xl mt-4 ml-5 mb-8">
                            <span>가격</span>
                            <span style={{ marginLeft: "30px" }}>
                                {popupStore.price > 0
                                    ? `${popupStore.price * selected.count}원`
                                    : "무료"}
                            </span>
                        </div>
                    </div>

                    <div className="w-4/5 p-4">
                        <div className="flex items-center justify-between mb-4">
                            <div className="text-2xl">예약자 정보</div>
                            {!editMode && (
                                <button
                                    className="border border-gray-300 rounded px-3 bg-backgroundColor"
                                    onClick={() => {
                                        setEditedName(userName);
                                        setEditedPhone((phonenumber || "").replace(/\D/g, ""));
                                        setEditMode(true);
                                    }}
                                >
                                    변경
                                </button>
                            )}
                        </div>

                        {!editMode ? (
                            <>
                                <div className="text-xl mb-2">이름 : {userName}</div>
                                <div className="text-xl mb-2">
                                    연락처 : {formatPhone(phonenumber)}
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="mb-2">
                                    <label className="block text-xl">이름</label>
                                    <input
                                        type="text"
                                        value={editedName}
                                        onChange={(e) => setEditedName(e.target.value)}
                                        className="border p-1 rounded w-full"
                                    />
                                </div>
                                <div className="mb-2">
                                    <label className="block text-xl">연락처</label>
                                    <input
                                        type="text"
                                        value={formatPhone(editedPhone)}
                                        onChange={(e) =>
                                            setEditedPhone(e.target.value.replace(/\D/g, ""))
                                        }
                                        className="border p-1 rounded w-full"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        className="border rounded px-3 bg-primaryColor text-black"
                                        onClick={async () => {
                                            const cleanedPhone = editedPhone.replace(/\D/g, "");
                                            if (!editedName.trim() || cleanedPhone.length < 10) {
                                                openAlertModal("이름과 올바른 연락처(최소 10자리)를 입력해주세요.");
                                                return;
                                            }

                                            try {
                                                const updateURL = `http://localhost:8080/api/userProfile/reservation/${userProfileId}`;

                                                
                                                const res = await axios.patch(
                                                    updateURL, 
                                                    {
                                                        name: editedName,
                                                        phonenumber: cleanedPhone, // '-'가 없는 번호를 백엔드로 보냄
                                                    }
                                                );
                                                
                                                // 성공 시 상태 업데이트 및 편집 모드 종료
                                                setUserName(res.data.name);
                                                setPhonenumber(res.data.phonenumber);
                                                setEditMode(false);

                                            } catch (err) {
                                                console.error("정보 변경 실패:", err);
                                                openAlertModal("정보 변경에 실패했습니다. 다시 시도해 주세요.");
                                            }
                                        }}
                                    >
                                        저장
                                    </button>
                                    <button
                                        className="border rounded px-3 bg-red-200"
                                        onClick={() => setEditMode(false)}
                                    >
                                        취소
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="flex justify-between w-4/5 mt-4 gap-4">
                        <button
                            className="border border-gray-300 rounded p-2 w-1/5 bg-backgroundColor text-xl text-black"
                            onClick={onBack}
                        >
                            이전
                        </button>
                        <button
                            className={`rounded p-2 w-4/5 text-xl text-black
                                ${!selected.date || !selected.time || selected.count === 0 || remainingSeats === null || !isBookingAvailable
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-primaryColor hover:bg-primaryColor-dark"
                                }`}
                            onClick={handleReservation}
                            disabled={
                                !selected.date ||
                                !selected.time ||
                                selected.count === 0 ||
                                remainingSeats === null ||
                                !isBookingAvailable
                            }
                        >
                            예약하기
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReservationCheckComponent;