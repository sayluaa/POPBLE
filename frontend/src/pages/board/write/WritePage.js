import { useSearchParams } from "react-router-dom";
import WriteForm from "../../../components/common/board/WriteForm";

const WritePage = () => {
  const [queryParams] = useSearchParams();
  const type = queryParams.get("type") || "GENERAL"; // 기본값 GENERAL

  return (
    <div className="p-4 w-full bg-white">
      <div className="text-3xl font-extrabold">
        새 글 등록
      </div>
      <WriteForm />
    </div>
  );
};

export default WritePage;
