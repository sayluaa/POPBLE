// src/pages/boards/notice/NoticeDetail.jsx
import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getOne, deleteOne, patchPin } from "../../../api/BoardApi"; // ✅ patchPin 추가

const NoticeDetail = () => {
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
          setError(status === 404 ? "존재하지 않는 공지입니다." : "불러오기 실패");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, [id]);

  const goModify = () => {
    navigate(`/boards/notice/${id}/modify`);
  };

  const onDelete = async () => {
    if (!window.confirm("정말 삭제할까요?")) return;
    try {
      setDeleting(true);
      await deleteOne(id);
      alert("삭제되었습니다.");
      navigate("/boards/notice");
    } catch (e) {
      alert(e?.response?.status === 404 ? "이미 삭제되었거나 존재하지 않습니다." : "삭제 실패");
    } finally {
      setDeleting(false);
    }
  };

  // ✅ 핀 토글
  const onTogglePin = async () => {
    if (!post) return;
    try {
      const next = !post.pinnedGlobal;
      await patchPin(post.id, { pinned: next, pinUntil: null }); // 무기한
      alert(next ? "상단 고정되었습니다." : "상단 고정이 해제되었습니다.");
      setPost(prev => prev ? ({
        ...prev,
        pinnedGlobal: next,
        pinnedAt: next ? new Date().toISOString() : null,
        pinUntil: null
      }) : prev);
    } catch (e) {
      alert("고정 설정에 실패했습니다.");
    }
  };

  const fmtDate = (v) => (v ? new Date(v).toLocaleString() : "-");

  if (loading) return <div className="p-6">로딩 중...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!post) return null;

  return (
    <div className="p-6 bg-white rounded shadow">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">
          {post.title}{" "}
          {post.pinnedGlobal && (
            <span className="ml-2 text-sm px-2 py-1 bg-purple-100 text-purple-700 rounded">
              고정
            </span>
          )}
        </h1>

        {/* 🔹 공지에서만 핀 버튼 노출 */}
        {post.type === "NOTICE" && (
          <button
            type="button"
            onClick={onTogglePin}
            className={`px-4 py-2 rounded ${
              post.pinnedGlobal
                ? "bg-gray-500 hover:bg-gray-600"
                : "bg-purple-600 hover:bg-purple-700"
            } text-white`}
          >
            {post.pinnedGlobal ? "고정 해제" : "상단 고정"}
          </button>
        )}
      </div>

      <div className="text-sm text-gray-500 mb-6">
        작성자:{" "}
        <span className="font-semibold">
          {post.writer ?? post.writerId ?? "-"}
        </span>{" "}
        | {fmtDate(post.createTime)}
      </div>

      {/* 🔹 이미지 영역 (세로 배치 + 최대 600px 제한 + 반응형) */}
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

      <div className="mb-8 leading-relaxed whitespace-pre-wrap">
        {post.content}
      </div>

      <div className="flex justify-between">
        <Link
          to="/boards/notice"
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
            onClick={onDelete}
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

export default NoticeDetail;
