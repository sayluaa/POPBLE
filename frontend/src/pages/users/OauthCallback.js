import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../../slice/authSlice";
import LoadingComponent from "../../components/common/LoadingComponent";

const OAuthCallback = () => {
  console.log("OAuth Callback 실행");

  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromURL = urlParams.get("token");
    const userFromURL = urlParams.get("user");

    if (tokenFromURL && userFromURL) {
      try {
        let decodedUser;

        // 안전한 디코딩 처리
        try {
          decodedUser = JSON.parse(decodeURIComponent(userFromURL));
        } catch {
          decodedUser = JSON.parse(userFromURL); // fallback
        }

        setToken(tokenFromURL);
        setUser(decodedUser);

        console.log("Received token:", tokenFromURL);
        console.log("Received user:", decodedUser);

        localStorage.setItem("accessToken", tokenFromURL);
        localStorage.setItem("user", JSON.stringify(decodedUser));

        dispatch(loginSuccess({ token: tokenFromURL, user: decodedUser }));

        // 상태 저장 후 리디렉션
        setTimeout(() => {
          navigate("/");
        }, 100);
      } catch (err) {
        console.error("사용자 정보 파싱 실패:", err);
      }
    } else {
      console.error("No token or user found in URL");
    }
  }, [navigate, dispatch]);

  return (
    <div>
      {token && user ? (
        <div>
          <p>Token: {token}</p>
          <p>User: {JSON.stringify(user)}</p>
        </div>
      ) : (
        <LoadingComponent />
      )}
    </div>
  );
};

export default OAuthCallback;
