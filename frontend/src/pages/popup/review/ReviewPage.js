import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import AlertModal from "../../../components/common/AlertModal";
import { getOne } from "../../../api/popupstoreApi";
import { useSelector } from "react-redux";

const ReviewPage = () => {
const currentUserId = useSelector(state => state.auth?.user?.id);
const currentUserNickname = "user";

console.log("Currnet User Id:", currentUserId)
console.log("Current User Nickname:", currentUserNickname)
console.log("Auth State(전체):",useSelector(state => state.auth))
const [rating, setRating] = useState(0);    //사용자가 선택한 별점(1~5)
const [hover, setHover] = useState(null)    //마우스 올렸을때의 심시 색상 표시
const [content, setContent] = useState("");
const [image, setImage] = useState([]); //이미지파일 배열
const [popupStoreInfo, setPopupStoreInfo] = useState(null);
const [loading, setLoading] = useState(true);
const [alertModal, setAlertModal] = useState({
        show: false,
        message: "",
        action: () => { }, 
    });

const navigate = useNavigate()
const {popupId} = useParams()   //팝업 id url에서 추출

const closeAlertModal = () => {
        if (alertModal.action && typeof alertModal.action === 'function') {
            alertModal.action();
        }
        setAlertModal({ show: false, message: "", action: () => { } });
    }

const showAlert = (message, action = () => { }) => {
        setAlertModal({ show: true, message, action });
    }

    //회원 닉네임 가져옴
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);

            if(currentUserId === undefined || currentUserNickname === undefined){
                return;
            }

            if(!currentUserId || !currentUserNickname){
                showAlert("로그인 정보가 유효하지 않습니다",()=>navigate('/user/login'))
                setLoading(false)
                return;
            }

            if (!popupId) {
                showAlert("리뷰를 등록할 팝업스토어가 없습니다.", () => navigate(-1));
                setLoading(false);
                return; 
            }
            
            try {
                const detail = await getOne(popupId)
                setPopupStoreInfo(detail);
            } catch (error) {
                console.error("팝업스토어 정보 로드 실패함", error)
                showAlert("팝업 정보를 불러오지 못했습니다. 다시 시도해 주세요.", () => {})
            }
            
            setLoading(false);
        }
        
        loadData()
    }, [popupId, currentUserId, currentUserNickname, navigate])

    // 리뷰 등록 요청
    const handleSubmit = async (e) => {
        e.preventDefault();
      
        if(!popupId || !popupStoreInfo || !currentUserId || !currentUserNickname){
            showAlert("사용자 또는 팝업 정보가 없어 리뷰를 등록할 수 없습니다", () => {})
            return
        }

        const formData = new FormData();

        const reviewRequest = {
            popupId: Number(popupId), 
            userId: currentUserId,            
            nickname: currentUserNickname,    
            content: content,
            rating: parseFloat(rating),
        }
        formData.append("reviewRequest", new Blob([JSON.stringify(reviewRequest)], {type: 'application/json'}))
        
        image.forEach((file) => {
            formData.append("images", file)
        })

        try {
            const res = await fetch("http://localhost:8080/api/reviews", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                 const successAction = () => {
                    setContent("");
                    setRating(0);
                    setImage([]);
                    navigate(`/popup/detail/${popupId}`)
                };
                showAlert("리뷰 등록 완료", successAction);
            } else {
                showAlert("리뷰 등록 실패", () => {});
            }
        } catch (err) {
        console.error("Fetch Error:", err);
        showAlert("에러 발생", () => {});
        }
    };

    const handleClickStar = (index) => {
            setRating(index + 1);
        }

    const handleGoBack = () => {
        navigate(-1)
    }

    return(
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
            {alertModal.show && (
                <AlertModal
                    message={alertModal.message}
                    onClose={closeAlertModal} 
                />
            )}
        <h2 className="text-2xl font-semibold">리뷰 등록</h2>
        <div className="w-full flex border border-black"></div>

        {/* 닉네임 자동+수정 불가 */}
        <div>
            <label className="block mb-1">작성자</label>
            <div className="border p-2 w-full rounded select-none bg-subSecondColor">
            {currentUserNickname}</div>
        </div>

        {/* 평점 */}
        <div>
            <label className="block mb-1">평점</label>
            <div className="flex gap-2">
            {[...Array(5)].map((_, index) => (
                <button
                key={index}
                type="button"
                onClick={() => setRating(index + 1)}
                onMouseEnter={() => setHover(index + 1)}
                onMouseLeave={() => setHover(null)}
                >
                <FaStar
                    size={30}
                    className={
                    index < (hover || rating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }
                />
                </button>
            ))}
            </div>
        </div>

        {/* 내용+스크롤*/}
        <div>
            <label className="block mb-1">내용</label>
            <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="border p-2 w-full rounded h-[200px] resize-none overflow-y-auto"
            required
            />
        </div>

        {/* 이미지 업로드 */}
        <div>
            <label className="block mb-1">첨부 이미지</label>
            <input
            type="file"
            multiple    //다중 이미지
            accept="image/*"
            onChange={(e) => setImage(Array.from(e.target.files))}
            />
        </div>
        
        <div className="w-full flex border border-black"></div>

        <div className="flex justify-end gap-5">
            <button
                type="button"
                onClick={handleGoBack}
                className="border border-hash bg-white text-black px-4 py-2 rounded"
            >
                이전
            </button>
            <button
                type="submit"
                className="bg-primaryColor text-black px-4 py-2 rounded"
            >
                등록
            </button>
        </div>   
    </form>
    )
}
export default ReviewPage