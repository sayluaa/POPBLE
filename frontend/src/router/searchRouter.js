import { Suspense } from "react";
import LoadingComponent from "../components/common/LoadingComponent";
import SearchPage from "../pages/search/SearchPage";

const searchRouter = () => {
  return [
    {
      path: "",
      element: (
        <Suspense fallback={<LoadingComponent />}>
          <SearchPage></SearchPage>
        </Suspense>
      ),
    },
  ];
};
export default searchRouter;
