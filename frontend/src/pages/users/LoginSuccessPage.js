import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../slice/authSlice";
import { getCookie, setCookie } from "../../utill/cookieUtill";
import AlertModal from "../../components/common/AlertModal";

const LoginSuccessPage = () => {
  const dispatch = useDispatch();

  const [alertModal, setAlertModal] = useState({
        show: false,
        message: "",
        action: () => { },
    });

    const closeAlertModal = () => {
        const currentAction = alertModal.action; 
        setAlertModal({ show: false, message: "", action: () => { } });
        
        if (currentAction && typeof currentAction === 'function') {
            currentAction();
        }
    }

    const showAlert = (message, action = () => { }) => {
        setAlertModal({ show: true, message, action });
    }

  useEffect(() => {
    axios
      .get("http://localhost:8080/user", { withCredentials: true })
      .then((res) => {
        const { accessToken, refreshToken, user } = res.data;
        dispatch(loginSuccess({ accessToken, refreshToken, user }));
        // localStorage.setItem("token", res.data.accessToken);
        window.location.replace("/");
      })
      .catch((err) => {
        console.error("로그인 실패", err);

        const redirectAction = () => {
        window.location.replace("/");
        }
        showAlert("로그인에 실패했습니다", redirectAction);
      });
  }, [dispatch]);

  return(
    <div className="flex items-center justify-center min-h-screen">
            <div>로그인 처리 중...</div>
            
            {/* Alert Modal 렌더링 */}
            {alertModal.show && (
                <AlertModal
                    message={alertModal.message}
                    onClose={closeAlertModal} 
                />
            )}
        </div>
    );
};

export default LoginSuccessPage;
