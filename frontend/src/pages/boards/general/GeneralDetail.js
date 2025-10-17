import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getOne, deleteOne } from "../../../api/BoardApi";
import AlertModal from "../../../components/common/AlertModal"; 

const DummyConfirmModal = ({ message, onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <p className="text-lg mb-4">{message}</p>
            <div className="flex justify-end space-x-3">
                <button
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    onClick={onCancel}
                >
                    취소
                </button>
                <button
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={onConfirm}
                >
                    확인
                </button>
            </div>
        </div>
    </div>
);


const GeneralDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [error, setError] = useState("");
    const [deleting, setDeleting] = useState(false);

    const [showAlertModal, setShowAlertModal] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState("");
    const [confirmAction, setConfirmAction] = useState(null);

    const openAlertModal = (message) => {
        setAlertMessage(message);
        setShowAlertModal(true);
    };

    const closeAlertModal = () => {
        setShowAlertModal(false);
        setAlertMessage("");
    };

    const openConfirmModal = (message, action) => {
        setConfirmMessage(message);
        setConfirmAction(() => action);
        setShowConfirmModal(true);
    };

    const closeConfirmModal = () => {
        setShowConfirmModal(false);
        setConfirmMessage("");
        setConfirmAction(null);
    };

    const handleConfirm = () => {
        if (confirmAction) {
            confirmAction();
        }
        closeConfirmModal();
    };

    useEffect(() => {
        let ignore = false;
        (async () => {
            try {
                const data = await getOne(id);
                if (!ignore) setPost(data);
            } catch (e) {
                if (!ignore)
                    setError(
                        e?.response?.status === 404
                            ? "존재하지 않는 글입니다."
                            : e?.message || "불러오기 실패"
                    );
            }
        })();
        return () => {
            ignore = true;
        };
    }, [id]);

    const goModify = () => {
        navigate(`/boards/general/${id}/modify`);
    };

    // ✅ 실제 삭제 로직을 담는 함수
    const executeDelete = async () => {
        try {
            setDeleting(true);
            await deleteOne(id);
            openAlertModal("삭제되었습니다."); 
            navigate("/boards/general");
        } catch (e) {
            openAlertModal(
                e?.response?.status === 404
                    ? "이미 삭제되었거나 존재하지 않습니다."
                    : "삭제 실패"
            );
        } finally {
            setDeleting(false);
        }
    };

    const onDelete = () => {
        openConfirmModal("정말 삭제할까요?", executeDelete);
    }

    const fmtDate = (v) => (v ? new Date(v).toLocaleString() : "");

    if (error) return <div className="p-6">에러: {error}</div>;
    if (!post) return <div className="p-6">로딩 중...</div>;

    return (
        <div className="p-6 bg-white rounded shadow">
            {showAlertModal && (
                <AlertModal message={alertMessage} onClose={closeAlertModal} />
            )}
            
            {showConfirmModal && (
                <DummyConfirmModal
                    message={confirmMessage}
                    onConfirm={handleConfirm}
                    onCancel={closeConfirmModal}
                />
            )}
            {/* ----------------- */}

            {/* 제목 */}
            <h1 className="text-2xl font-bold mb-4">{post.title}</h1>

            {/* 작성자 / 작성일 */}
            <div className="text-sm text-gray-500 mb-6">
                작성자:{" "}
                <span className="font-semibold">
                    {post.writer ?? post.writerId ?? "-"}
                </span>{" "}
                | {fmtDate(post.createTime)}
            </div>

            {/* 🔹 이미지 영역 (세로 배치 + 원본크기, 최대 600px 제한, 반응형) */}
            {post.images?.length > 0 && (
                <div className="flex flex-col gap-4 items-center mb-6">
                    {post.images.map((im) => (
                        <img
                            key={im.id}
                            src={im.url}
                            alt=""
                            loading="lazy"
                            className="w-full max-w-[600px] h-auto rounded-lg"
                        />
                    ))}
                </div>
            )}

            {/* 본문 */}
            <div className="mb-8 leading-relaxed whitespace-pre-wrap">
                {post.content}
            </div>

            {/* 버튼 영역 */}
            <div className="flex justify-between">
                <Link
                    to="/boards/general"
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                    목록
                </Link>
                <div className="space-x-2">
                    <button
                        type="button"
                        onClick={goModify}
                        className="px-4 py-2 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                    >
                        수정
                    </button>
                    <button
                        type="button"
                        onClick={onDelete} // ✅ 연결
                        disabled={deleting}
                        className={`px-4 py-2 text-white rounded ${
                            deleting
                                ? "bg-red-300 cursor-not-allowed"
                                : "bg-red-500 hover:bg-red-600"
                        }`}
                    >
                        {deleting ? "삭제중..." : "삭제"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GeneralDetail;