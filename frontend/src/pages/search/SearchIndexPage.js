import { Outlet } from "react-router-dom";
import BasicLayout from "../../layout/BasicLayout";

const SearchIndexPage = () => {
  return (
    <BasicLayout>
      <Outlet></Outlet>
    </BasicLayout>
  );
};

export default SearchIndexPage;
