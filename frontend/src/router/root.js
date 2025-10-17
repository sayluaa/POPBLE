import { createBrowserRouter, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import popupRouter from "./popupRouter";
import userRouter from "./userRouter";
import BoardsRouter from "./BoardsRouter"; // ← 여기!
import LoadingComponent from "../components/common/LoadingComponent";
import searchRouter from "./searchRouter";
import boardRouter from "./boardRouter";
import NotFoundPage from "../pages/NotFoundPage";
import BasicLayout from "../layout/BasicLayout";
import TestChat from "../components/function/TestChat";

const BoardsLayout = lazy(() => import("../layout/BoardsLayout"));

const Main = lazy(() => import("../pages/MainPage"));
const Popup = lazy(() => import("../pages/popup/PopupIndexPage"));
const User = lazy(() => import("../pages/users/IndexPage"));
const Search = lazy(() => import("../pages/search/SearchIndexPage"));
const Board = lazy(() => import("../pages/board/BoardIndexPage"));
const Oauth = lazy( () => import("../pages/users/OauthCallback") )

const root = createBrowserRouter(
  [
    {
      path: "",
      element: (
        <Suspense fallback={<LoadingComponent />}>
          <Main></Main>
        </Suspense>
      ),
    },
    {
      path: "popup",
      element: (
        <Suspense fallback={<LoadingComponent />}>
          <Popup></Popup>
        </Suspense>
      ),
      children: popupRouter(),
    },
    {
      path: "user",
      element: (
        <Suspense fallback={<LoadingComponent />}>
          <User></User>
        </Suspense>
      ),
      children: userRouter(),
    },
    {
      path: "boards",
      element: (
        <Suspense fallback={<LoadingComponent />}>
          <BoardsLayout/>
        </Suspense>
      ),
      children: BoardsRouter(),
    },
    {
      path: "search",
      element: (
        <Suspense fallback={<LoadingComponent />}>
          <Search></Search>
        </Suspense>
      ),
      children: searchRouter(),
    },
       {
        path:"/oauth/callback",
        element: <Suspense fallback={<LoadingComponent/>}><Oauth></Oauth></Suspense>



    },
    {
      path: "*",
      element: (
        <BasicLayout>
          <NotFoundPage />
        </BasicLayout>
      ),
    },
    {
      path:"/test-chat",
      element: <TestChat/>,
    }
  ],
  { basename: "/popble" }
);

export default root;
