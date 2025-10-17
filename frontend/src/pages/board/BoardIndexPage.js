import { Outlet } from "react-router-dom";
import BasicLayout from "../../layout/BasicLayout";

const BoardIndexPage = () => {
  return (
    <BasicLayout>
      <Outlet></Outlet>
    </BasicLayout>
  );
};

export default BoardIndexPage;
