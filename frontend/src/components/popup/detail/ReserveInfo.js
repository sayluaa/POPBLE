import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getOne } from "../../../api/popupstoreApi";
import { getUserById } from "../../../api/userApi";
import ReservationDoComponent from "../reservation/ReservationDoComponent";
import ReservationCheckComponent from "../../popup/reservation/ReservationCheckComponent";
import AlertModal from "../../common/AlertModal";

const ReserveInfo = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const loginState = useSelector(state => state.auth);
  const currentUserId = loginState.user ? loginState.user.id:null;

  const [popupStore, setPopupStore] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState({
    date: null,
    time: null,
    count: 0,
  });

  const [showCheckPage, setShowCheckPage] = useState(false);

   const [alertModal, setAlertModal] = useState({
        show: false,
        message: "",
        action: () => { },
        isRedirect: false, 
    });

      const closeAlertModal = () => {
        const currentAction = alertModal.action;
        const shouldRedirect = alertModal.isRedirect;

        setAlertModal({ show: false, message: "", action: () => { }, isRedirect: false });

        if (currentAction && typeof currentAction === 'function') {
            currentAction();
        }
        
        if (shouldRedirect) {
            navigate("/user/login"); 
        }
    }

    const showAlert = (message, action = () => { }, isRedirect = false) => {
        setAlertModal({ show: true, message, action, isRedirect });
    }

  useEffect(() => {
     const fetchData = async () => {
            if (!currentUserId) {
                setLoading(false);
                console.error("로그인된 사용자 ID를 찾을 수 없습니다.");
                showAlert("예약을 진행하시려면 로그인이 필요합니다",() => {},true)
                return; 
            }
      setLoading(true);

      try {
        const popupStoreData = await getOne(id);
        setPopupStore(popupStoreData);

        const userProfileData = await getUserById(currentUserId);
        setUserProfile(userProfileData);

      } catch (err) {
        console.error("데이터 조회 실패:", err);

      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, currentUserId, navigate]);

  if(alertModal.show){
    return(
      <AlertModal
      message={alertModal.message}
      onClose={closeAlertModal}
      />
    )
  }

  if (!popupStore || !userProfile) {
    return <p>필요한 데이터를 불러올 수 없습니다.</p>;
  }

  const handleNextClick = () => {
    if (!selected.date || !selected.time || selected.count <= 0) {
            showAlert("예약 날짜, 시간 및 인원수를 모두 선택해야 합니다.");
            return;
        }
    setShowCheckPage(true);
  };

  const handleBackClick = () => {
    setShowCheckPage(false);
  };

  if (showCheckPage) {
    return (
      <ReservationCheckComponent
        popupStore={popupStore}
        selected={selected}
        userProfileId={userProfile.id}
        onBack={handleBackClick}
      />
    );
  }

  return (
    <div className="flex justify-center items-start min-h-screen p-4 md:p-8">
      <div className="w-full max-w-6xl p-4 md:p-8">
        <ReservationDoComponent
          popupStore={popupStore}
          selected={selected}
          setSelected={setSelected}
          onNext={handleNextClick}
        />
      </div>
    </div>
  );
};

export default ReserveInfo;
