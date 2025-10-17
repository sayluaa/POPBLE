import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSearchParams, Navigate, useNavigate } from "react-router-dom";
import { loginPostAsync } from "../slice/loginSlice";

const useCustomLogin = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const loginState = useSelector((state) => state.loginSlice); // 로그인 상태
  const isLogin = loginState.loginId ? true : false; //로그인 여부

  const [alertModal, setAlertModal] = useState({
        show: false,
        message: "",
        action: () => { },
    });

     const closeAlertModal = () => {
        if (alertModal.action && typeof alertModal.action === 'function') {
            alertModal.action();
        }
        setAlertModal({ show: false, message: "", action: () => { } });
    }

    const showAlert = (message, action = () => { }) => {
        setAlertModal({ show: true, message, action });
    }

    
  const doLogin = async (loginParam) => {
    // 로그인 함수

    const action = await dispatch(loginPostAsync(loginParam));

    return action.payload;
  };

  //    const doLogout = () => { // 로그아웃 함수
  //      dispatch(logout())
  //  }

  const moveToPath = (path) => {
    // 페이지 이동
    navigate({ pathname: path }, { replace: true });
  };

  const moveToLogin = () => {
    // 로그인 페이지로 이동
    navigate({ pathname: "/user/login" }, { replace: true });
  };

  const moveToLoginReturn = () => {
    return <Navigate replace to="/user/login"></Navigate>;
  };

  const exceptionHandle = (ex) => {
    console.log("Exception---------------------------------");

    console.log(ex);

    const errorMsg = ex.response.data.errorMsg;
    const errorStr = createSearchParams({ error: errorMsg }).toString();

    if (errorMsg === "REQUIRE_LOGIN") {
      showAlert("로그인 해야만 합니다");
      navigate({ pathname: "/user/login", search: errorStr });

      return;
    }

    if (ex.response.data.error === "ERROR_ACCESSDENTED")
      showAlert("해당 매뉴를 사용할 수 없는 권한이 없습니다.");
    navigate({ pathname: "/user/login", search: errorStr });
  };
  return {
    loginState,
    isLogin,
    doLogin,
    moveToPath,
    moveToLogin,
    moveToLoginReturn,
    exceptionHandle,
    alertModal,
    closeAlertModal,
    showAlert,
  };
};

export default useCustomLogin;
