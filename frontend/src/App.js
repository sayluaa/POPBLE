import { RouterProvider } from "react-router-dom";
import root from "./router/root";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getCookie } from "./utill/cookieUtill";
import { loginSuccess } from "./slice/authSlice";


function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    //쿠키에서 로그인 정보 가져오기
    const cookie = getCookie("user");
    if (cookie) {
      try {
        //cookie 중복 파싱이 되어서 로그인 상태에서 F5누르면 로그아웃처럼 보임
        const parsed =
          typeof cookieUser === "string" ? JSON.parse(cookie) : cookie;
        const { accessToken, refreshToken, user } = parsed;
        //정보 있으면 Redux에 저장
        if (accessToken && refreshToken && user) {
          dispatch(loginSuccess({ accessToken, refreshToken, user }));
        }
      } catch (e) {
        console.error("쿠키에서 로그인 정보 가져오기 실패", e);
      }
    }
  }, [dispatch]);
  return <RouterProvider router={root}></RouterProvider>;
}
export default App;
