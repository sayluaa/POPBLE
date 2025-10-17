import { Navigate } from "react-router-dom";

const ProtectedRouter = ({ children }) => {
  const token = localStorage.getItem("accessToken"); // ✅ 로그인 여부 확인

  if (!token) {
    // 로그인 안 된 경우 → /user/login 으로 이동
    return <Navigate to="/user/login" replace />;
  }

  // 로그인 된 경우 원래 컴포넌트 반환
  return children;
};

export default ProtectedRouter;
