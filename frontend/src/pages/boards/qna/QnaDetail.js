// src/pages/boards/qna/QnaDetail.jsx
import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getOne, deleteOne } from "../../../api/BoardApi";

const QnaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getOne(id);
        if (!ignore) setPost(data);
      } catch (e) {
        if (!ignore) {
          const status = e?.response?.status;
          setError(
            status === 404 ? "존재하지 않는 질문입니다." : "불러오기 실패"
          );
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [id]);

  const goModify = () => {
    navigate(`/boards/qna/${id}/modify`);
  };

  const onDelete = async () => {
    if (!window.confirm("정말 삭제할까요?")) return;
    try {
      setDeleting(true);
      await deleteOne(id);
      alert("삭제되었습니다.");
      navigate("/boards/qna");
    } catch (e) {
      alert(
        e?.response?.status === 404
          ? "이미 삭제되었거나 존재하지 않습니다."
          : "삭제 실패"
      );
    } finally {
      setDeleting(false);
    }
  };

  const fmtDate = (v) => (v ? new Date(v).toLocaleString() : "-");

  if (loading) return <div className="p-6">로딩 중...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!post) return null;

  return (
    <div className="min-h-screen bg-[#fdfbf7] p-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* 제목 */}
        <h1 className="text-2xl font-bold mb-4">{post.title}</h1>

        {/* 작성자 + 날짜 */}
        <div className="text-sm text-gray-500 mb-6">
          작성자:{" "}
          <span className="font-semibold">
            {post.writer ?? post.writerId ?? "-"}
          </span>{" "}
          | {fmtDate(post.createTime)}
        </div>

        {/* 이미지 영역 */}
        {post.images?.length > 0 && (
          <div className="flex flex-col gap-4 items-center mb-6">
            {post.images.map((im) => (
              <img
                key={im.id}
                src={im.url}
                alt=""
                loading="lazy"
                className="w-full max-w-[600px] h-auto rounded-lg border"
              />
            ))}
          </div>
        )}

        {/* 본문 */}
        <div className="mb-8 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </div>

        {/* 하단 버튼 */}
        <div className="flex justify-between">
          <Link
            to="/boards/qna"
            className="px-6 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            목록
          </Link>
          <div className="space-x-2">
            <button
              type="button"
              onClick={goModify}
              className="px-6 py-2 bg-yellow-400 text-white rounded hover:bg-yellow-500"
            >
              수정
            </button>
            <button
              type="button"
              onClick={onDelete}
              disabled={deleting}
              className={`px-6 py-2 text-white rounded ${
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
    </div>
  );
};

export default QnaDetail;
