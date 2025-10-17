import { useState, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import {
  getIsRecommended,
  postRecommend,
  deleteRecommend,
} from "../../../api/popupRecommendApi";
import { useSelector } from "react-redux";
import AlertModal from "../../common/AlertModal";

//팝업 전용 추천 컴포넌트
const PopupRecommendComponent = ({ popupId }) => {
  const userId = useSelector((state) => state.auth?.user?.id);

  const [isRecommended, setIsRecommended] = useState(false);
  const [Loading, setLoading] = useState(false);

  const [modal, setModal] = useState({
        isOpen: false,
        message: "",
        onClose: () => setModal(prev => ({ ...prev, isOpen: false })),
        onConfirm: null,
    });

  useEffect(() => {
    if (!userId) return;
    async function fetchStatus() {
      try {
        const data = await getIsRecommended(popupId);
        setIsRecommended(data);
      } catch (e) {
        console.error("추천 가져오기 실패", e);
      }
    }
    fetchStatus();
  }, [popupId, userId]);

  const handleClick = async () => {
    if (!userId) {
      setModal({
            isOpen: true,
            message: "로그인 후 추천 가능합니다",
            onClose: () => setModal(prev => ({ ...prev, isOpen: false })),
            onConfirm: null,
        });
      return;
    }
    setLoading(true);
    try {
      if (isRecommended) {
        await deleteRecommend(popupId);
        setIsRecommended(false);
      } else {
        await postRecommend(popupId);
        setIsRecommended(true);
      }
    } catch (e) {
       let errorMessage = "추천 오류 발생";
      if (e.response?.data?.message) {
        errorMessage = e.response.data.message;
      }setModal({
            isOpen: true,
            message: errorMessage,
            onClose: () => setModal(prev => ({ ...prev, isOpen: false })),
            onConfirm: null,
      })
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div onClick={handleClick} style={{ cursor: "pointer" }}>
      {isRecommended ? (
        <FaHeart size={25} color="red" />
      ) : (
        <FaRegHeart size={25} />
      )}
    </div>
    {modal.isOpen && (
            <AlertModal
                title={modal.title}
                message={modal.message}
                onClose={modal.onClose}
                onConfirm={modal.onConfirm}
            />
        )}
    </>
  );
};

export default PopupRecommendComponent;
