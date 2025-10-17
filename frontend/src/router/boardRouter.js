//나중에 popup과 병합 여부


import { Suspense, lazy } from "react";
import { Navigate } from "react-router-dom";
import LoadingComponent from "../components/common/LoadingComponent";

const boardRouter = () => {
  const PopupStoreAdd = lazy(() => import("../pages/board/AdBoardPage"));
  const PopupStoreModify = lazy(() => import("../pages/board/ModifyPage"));

  return [
    {
      path: "",
      element: <Navigate replace to="/popup/ad"></Navigate>,
    },
    {
      path: "add",
      element: (
        <Suspense fallback={<LoadingComponent />}>
          <PopupStoreAdd></PopupStoreAdd>
        </Suspense>
      ),
    },
    {
      path: "modify/:id",
      element: (
        <Suspense fallback={<LoadingComponent />}>
          <PopupStoreModify></PopupStoreModify>
        </Suspense>
      ),
    },
  ];
};

export default boardRouter;
