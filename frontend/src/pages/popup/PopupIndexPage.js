import { Outlet } from "react-router-dom";
import BasicLayout from "../../layout/BasicLayout";

const PopupIndexPage = () => {
  return (
    <BasicLayout>
      <Outlet></Outlet>
    </BasicLayout>
  );
};

export default PopupIndexPage;
