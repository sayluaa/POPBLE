// src/pages/board/ReadPage.jsx
import { useParams, useNavigate, useSearchParams, createSearchParams } from "react-router-dom";
import { useCallback } from "react";
import ReadComponent from "../../components/common/board/ReadComponent";

const ReadPage = () => {
  const { id } = useParams();                    // ✅ 게시글 id
  const navigate = useNavigate();
  const [queryParams] = useSearchParams();

  const page = queryParams.get("page") ? parseInt(queryParams.get("page"), 10) : 1;
  const size = queryParams.get("size") ? parseInt(queryParams.get("size"), 10) : 10;

  const queryStr = createSearchParams({ page: String(page), size: String(size) }).toString();

  // ✅ 수정 페이지로 이동
  const moveToModify = useCallback(() => {
    navigate({
      pathname: `/boards/modify/${id}`,
      search: queryStr,
    });
  }, [navigate, id, queryStr]);

  // ✅ 목록으로 이동
  const moveToList = useCallback(() => {
    navigate({
      pathname: "/boards/list",     // 필요 시 /boards/general 등으로 변경
      search: queryStr,
    });
  }, [navigate, queryStr]);

  return (
    <div className="font-extrabold w-full bg-white mt-6">
      <div className="text-2xl">Board ReadPage Component......{id}</div>

      {/* ReadComponent에 이동 콜백 넘겨서 버튼에서 사용 가능 */}
      <ReadComponent id={id} moveToModify={moveToModify} moveToList={moveToList} />
    </div>
  );
};

export default ReadPage;
