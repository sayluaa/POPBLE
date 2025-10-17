
import React from "react";

const KAKAO_AUTH_URL = "http://localhost:8080/oauth2/authorization/kakao";
                       

const KakaoLoginButton = ({className, children}) => {
  const handleLogin = () => {
    window.location.href = KAKAO_AUTH_URL;
  };

  return (
    <button onClick={handleLogin} className={className}>
   {children}
    </button>
  );
};

export default KakaoLoginButton;