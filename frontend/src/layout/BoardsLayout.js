import { Outlet } from "react-router-dom";
import BasicLayout from "./BasicLayout";

const BoardsLayout = () => {
  return (
    <BasicLayout>
      <div className="p-6 w-full">
        {/* 게시판 페이지가 렌더링될 영역 */}
        <div className="bg-white p-4 rounded shadow">
          <Outlet />
        </div>
      </div>
    </BasicLayout>
  );
};

export default BoardsLayout;
