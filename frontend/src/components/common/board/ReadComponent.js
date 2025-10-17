// src/components/common/board/ReadComponent.jsx
import { useEffect, useState } from "react";
import { getOne } from "../../../api/BoardApi";
import { API_SERVER_HOST } from "../../../api/config";

export default function ReadComponent({ id, moveToModify, moveToList }) {
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getOne(id); // 백엔드가 images 포함해서 내려와야 함
        setBoard(data);
      } catch (e) {
        console.error("getOne 실패:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (!board) return <div className="p-4">게시글을 찾을 수 없습니다.</div>;

  return (
    <div className="p-4">
      <div className="mb-3 text-xl font-bold">{board.title}</div>
      <div className="mb-4 whitespace-pre-wrap">{board.content}</div>

      {/* 🔹 이미지 렌더링 */}
      {Array.isArray(board.images) && board.images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
          {board.images
            .slice()
            .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
            .map((img) => (
              <img
                key={img.id}
                src={`${API_SERVER_HOST}${img.url}`} // ← 반드시 백엔드 호스트를 붙여서
                alt=""
                className="w-full h-auto rounded border"
              />
            ))}
        </div>
      )}

      <div className="flex gap-2">
        <button className="px-3 py-1 border rounded" onClick={moveToModify}>
          수정
        </button>
        <button className="px-3 py-1 border rounded" onClick={moveToList}>
          목록
        </button>
      </div>
    </div>
  );
}
