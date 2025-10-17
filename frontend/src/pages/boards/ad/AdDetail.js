import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAdOne, deleteAd } from "../../../api/AdBoardApi";
import BasicInfo from "../../../components/popup/detail/BasicInfo";

export default function AdDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id || isNaN(Number(id))) {
      setError("잘못된 게시글 ID입니다.");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        setLoading(true);
        const data = await getAdOne(id);
        setPost(data);
      } catch (e) {
        setError("게시글을 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div className="p-6">불러오는 중...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!post) return <div className="p-6">존재하지 않는 게시글입니다.</div>;

  const handleDelete = async () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      await deleteAd(id);
      navigate("/boards/ad");
    }
  };

  return (
    <div className="p-6 flex flex-col min-h-[80vh]">
      {/* ✅ BasicInfo로 본문 표시 */}
      <BasicInfo popupStore={post} />

      {/* 버튼 영역 */}
      <div className="mt-6 flex justify-between items-center border-t pt-4">
        <button
          onClick={() => navigate("/boards/ad")}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          목록
        </button>

        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/boards/ad/${id}/modify`)}
            className="px-4 py-2 bg-yellow-400 text-white rounded-lg hover:brightness-95"
          >
            수정
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:brightness-95"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}
