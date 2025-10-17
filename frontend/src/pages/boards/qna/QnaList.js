// src/pages/boards/qna/QnaList.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAll } from "../../../api/BoardApi";

const QnaList = () => {
  const [pageData, setPageData] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken"); // ✅ 로그인 여부 확인

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoading(true);
        setError("");

        // ✅ /api/boards/all 호출 후 QNA 타입만 필터링
        const data = await getAll({ page, size: 10, order: "date" });

        if (!ignore) {
          data.dtoList = (data.dtoList || []).filter((p) => p.type === "QNA");
          setPageData(data);
        }
      } catch (e) {
        if (!ignore) setError(e?.message || "목록 불러오기 실패");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [page]);

  // ✅ 항상 배열 보장
  const list = Array.isArray(pageData?.dtoList) ? pageData.dtoList : [];

  const filtered = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    return q
      ? list.filter((p) => {
          const title = (p.title ?? "").toLowerCase();
          const writer = (p.writer ?? p.writerName ?? "").toLowerCase();
          return title.includes(q) || writer.includes(q);
        })
      : list;
  }, [list, keyword]);

  return (
    <div className="min-h-screen bg-[#fdfbf7] p-8">
      {/* 상단 */}
      <div className="flex items-center justify-between mb-6 gap-4">
        {/* 게시판 이동 드롭다운 */}
        <select
          className="border rounded px-3 py-2 shadow-sm"
          value="qna"
          onChange={(e) => navigate(`/boards/${e.target.value}`)}
        >
          <option value="all">전체게시판</option>
          <option value="general">자유게시판</option>
          <option value="notice">공지게시판</option>
          <option value="qna">질문게시판</option>
          <option value="ad">홍보게시판</option>
        </select>

        {/* 검색 */}
        <div className="flex items-center border rounded px-3 py-2 bg-white shadow-sm ml-auto">
          <input
            type="text"
            placeholder="검색할 내용을 입력하세요"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="outline-none w-64 text-sm"
          />
          <button className="ml-2">🔍</button>
        </div>
      </div>

      {/* 테이블 */}
      <table className="w-full border-t border-gray-300 text-sm">
        <thead>
          <tr className="bg-white">
            <th className="py-3 border-b border-gray-300 w-16">번호</th>
            <th className="py-3 border-b border-gray-300 text-left">제목</th>
            <th className="py-3 border-b border-gray-300 w-32">작성자</th>
            <th className="py-3 border-b border-gray-300 w-40">작성일자</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan={4} className="py-6 text-center">
                불러오는 중...
              </td>
            </tr>
          )}
          {error && (
            <tr>
              <td colSpan={4} className="py-6 text-center text-red-600">
                에러: {error}
              </td>
            </tr>
          )}
          {!loading && filtered.length === 0 && (
            <tr>
              <td colSpan={4} className="py-6 text-center">
                게시글이 없습니다.
              </td>
            </tr>
          )}
          {filtered.map((post) => (
            <tr
              key={`qna-${post.id}`}
              className={`hover:bg-gray-50 ${
                post.pinnedGlobal ? "bg-red-50 font-semibold" : ""
              }`}
            >
              <td className="py-3 text-center border-b border-gray-200">
                {post.id}
              </td>
              <td className="py-3 border-b border-gray-200">
                <Link to={`/boards/qna/${post.id}`} className="hover:underline">
                  {post.pinnedGlobal && (
                    <span className="mr-1 px-2 py-0.5 bg-red-300 text-xs rounded">
                      필독
                    </span>
                  )}
                  {post.title}
                  {post.images?.length > 0 && (
                    <span
                      title="이미지 포함"
                      aria-label="이미지 포함"
                      className="ml-1"
                    >
                      🖼️
                    </span>
                  )}
                </Link>
              </td>
              <td className="py-3 text-center border-b border-gray-200">
                {post.writer ?? post.writerName ?? "-"}
              </td>
              <td className="py-3 text-center border-b border-gray-200">
                {post.createTime?.slice(0, 10) ?? "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 페이지네이션 */}
      {pageData && (
        <div className="flex justify-center mt-6 gap-2">
          {pageData.prev && (
            <button
              onClick={() => setPage(pageData.prevPage)}
              className="px-3 py-1 rounded border bg-white hover:bg-gray-100"
            >
              이전
            </button>
          )}
          {pageData.pageNumList?.map((num) => (
            <button
              key={num}
              onClick={() => setPage(num)}
              className={`px-3 py-1 rounded border ${
                num === pageData.current
                  ? "bg-blue-400 text-white"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              {num}
            </button>
          ))}
          {pageData.next && (
            <button
              onClick={() => setPage(pageData.nextPage)}
              className="px-3 py-1 rounded border bg-white hover:bg-gray-100"
            >
              다음
            </button>
          )}
        </div>
      )}

      {/* 글쓰기 버튼 */}
      <div className="mt-6 flex justify-end">
        {token ? (
          <Link
            to="/boards/write"
            className="px-6 py-2 bg-blue-300 text-black rounded hover:bg-blue-400"
          >
            글 등록
          </Link>
        ) : (
          <button
            onClick={() => navigate("/user/login")}
            className="px-6 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
          >
            로그인 후 글쓰기
          </button>
        )}
      </div>
    </div>
  );
};

export default QnaList;
