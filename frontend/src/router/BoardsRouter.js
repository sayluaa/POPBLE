import { Suspense, lazy } from "react";
import { Navigate } from "react-router-dom";
import LoadingComponent from "../components/common/LoadingComponent";
import ProtectedRouter from "./ProtectedRouter"; // ✅ 유지

// ✅ 홍보글 작성 단계들
import AdBoardComponent from "../components/popup/reservation/AdBoradComponent";
import ReservationTimeComponent from "../components/popup/reservation/ReservationTimeComponent";
import AboutPage from "../pages/popup/AboutPage";

const AllBoardList = lazy(() => import("../pages/boards/AllBoardList"));

// 📝 게시판 타입별
const GeneralList = lazy(() => import("../pages/boards/general/GeneralList"));
const GeneralDetail = lazy(() =>
  import("../pages/boards/general/GeneralDetail")
);
const QnaList = lazy(() => import("../pages/boards/qna/QnaList"));
const QnaDetail = lazy(() => import("../pages/boards/qna/QnaDetail"));
const NoticeList = lazy(() => import("../pages/boards/notice/NoticeList"));
const NoticeDetail = lazy(() => import("../pages/boards/notice/NoticeDetail"));

// 📝 홍보게시판
const AdList = lazy(() => import("../pages/boards/ad/AdList"));
const AdModifyForm = lazy(() =>
  import("../components/common/board/AdModifyForm")
);

// 📝 공용 페이지
const WritePage = lazy(() => import("../pages/board/write/WritePage"));
const ReadPage = lazy(() => import("../pages/board/ReadPage"));
const ModifyPage = lazy(() => import("../pages/board/ModifyPage"));

const BoardsRouter = () => [
  { index: true, element: <Navigate replace to="all" /> },

  // 전체 글
  {
    path: "all",
    element: (
      <Suspense fallback={<LoadingComponent />}>
        <AllBoardList />
      </Suspense>
    ),
  },

  // 일반 게시판
  {
    path: "general",
    element: (
      <Suspense fallback={<LoadingComponent />}>
        <GeneralList />
      </Suspense>
    ),
  },
  {
    path: "general/:id",
    element: (
      <Suspense fallback={<LoadingComponent />}>
        <GeneralDetail />
      </Suspense>
    ),
  },
  {
    path: "general/:id/modify",
    element: (
      <Suspense fallback={<LoadingComponent />}>
        <ModifyPage />
      </Suspense>
    ),
  },

  // 질문 게시판
  {
    path: "qna",
    element: (
      <Suspense fallback={<LoadingComponent />}>
        <QnaList />
      </Suspense>
    ),
  },
  {
    path: "qna/:id",
    element: (
      <Suspense fallback={<LoadingComponent />}>
        <QnaDetail />
      </Suspense>
    ),
  },
  {
    path: "qna/:id/modify",
    element: (
      <Suspense fallback={<LoadingComponent />}>
        <ModifyPage />
      </Suspense>
    ),
  },

  // 공지 게시판
  {
    path: "notice",
    element: (
      <Suspense fallback={<LoadingComponent />}>
        <NoticeList />
      </Suspense>
    ),
  },
  {
    path: "notice/:id",
    element: (
      <Suspense fallback={<LoadingComponent />}>
        <NoticeDetail />
      </Suspense>
    ),
  },
  {
    path: "notice/:id/modify",
    element: (
      <Suspense fallback={<LoadingComponent />}>
        <ModifyPage />
      </Suspense>
    ),
  },

  // ✅ 홍보게시판 (로그인 체크 제거)
  {
    path: "ad",
    element: (
      <Suspense fallback={<LoadingComponent />}>
        <AdList />
      </Suspense>
    ),
  },
  {
    path: "ad/write",
    element: (
      <Suspense fallback={<LoadingComponent />}>
        <AdBoardComponent /> {/* 🚫 ProtectedRouter 제거 */}
      </Suspense>
    ),
  },
  {
    path: "ad/:id/reservation",
    element: (
      <Suspense fallback={<LoadingComponent />}>
        <ReservationTimeComponent />
      </Suspense>
    ),
  },
  {
    path: "ad/:id",
    element: (
      <Suspense fallback={<LoadingComponent />}>
        <AboutPage />
      </Suspense>
    ),
  },
  {
    path: "ad/:id/modify",
    element: (
      <Suspense fallback={<LoadingComponent />}>
        <AdModifyForm /> {/* 🚫 ProtectedRouter 제거 */}
      </Suspense>
    ),
  },

  // 공용 CRUD 페이지 (여기는 그대로 보호)
  {
    path: "write",
    element: (
      <Suspense fallback={<LoadingComponent />}>
        <ProtectedRouter>
          <WritePage />
        </ProtectedRouter>
      </Suspense>
    ),
  },
  {
    path: "read/:id",
    element: (
      <Suspense fallback={<LoadingComponent />}>
        <ReadPage />
      </Suspense>
    ),
  },
];

export default BoardsRouter;
