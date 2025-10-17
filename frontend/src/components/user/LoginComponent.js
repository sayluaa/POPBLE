import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { postAdd } from "../../api/userApi";
import TextField from "@mui/material/TextField";
import useCustomLogin from "../../hooks/useCustomLogin";

import { Link } from "react-router-dom";
import KakaoLoginButton from "../../pages/users/KakaoLoginButton";
import KaKaoImage from "../../pages/users/KakaoImage";
import KakaoImg from "../../assets/img/Kakao.jpg";
import GoogleImage from "../../pages/users/GoogleImge";
import GoogleImg from "../../assets/img/Google.jpg";
import GoogleLoginButton from "../../pages/users/GoogleLoginButton";
import NaverImage from "../../pages/users/NaverImge";
import NaverLoginButton from "../../pages/users/NaverLoginButton";
import NaverImg from "../../assets/img/Naver.jpg";
import React from "react";
import { render } from "@testing-library/react";
import { loginPost } from "../../api/userApi";
import PopbleImg from "../../assets/img/POPBLE Logo.png";
import PopbleImage from "../../pages/users/PopbleImge";
import { useDispatch } from "react-redux";
import { login } from "../../slice/loginSlice";
import { setCookie } from "../../utill/cookieUtill";
import { loginSuccess } from "../../slice/authSlice";
import AlertModal from "../common/AlertModal";

const initState = {
  loginId: "",
  password: "",
};

const LoginComponent = () => {
  const {
    control,
    handleSubmit,
    getValues,
    trigger,

    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: initState,
  });

  const { doLogin, moveToPath } = useCustomLogin();

  const dispatch = useDispatch();

  const [alertModal, setAlertModal] = useState({
    show:false,
    message:"",
    action: () => {},
  })

  const closeAlertModal = () => {
  if (alertModal.action && typeof alertModal.action === 'function') {
        alertModal.action();
    }
    setAlertModal({show:false, message:"", action:()=>{}})
  }

  const showAlert = (message, action = closeAlertModal)=>{
    setAlertModal({show:true, message, action})
  }

  const handleClickLogin = (e) => {
    const values = getValues();
    loginPost(values).then((data) => {
      console.log(data);

      if (data.error) {
        showAlert("아이디와 비밀번호를 확인하세요");
      } else {
        dispatch(
          loginSuccess({
            accessToken: data.accessToken,
            receivedToken: data.receivedToken,
            refreshToken: data.refreshToken,
            user: data,
          })
        );
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("user", JSON.stringify(data));
        // localStorage.setItem("token", data.token);
        showAlert("로그인 성공",()=>{
          moveToPath("/");
        });
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {alertModal.show && (
                <AlertModal
                    message={alertModal.message}
                    onClose={closeAlertModal}
                />
            )}
      <form className="w-full max-w-[480px] bg-white p-6 rounded shadow space-y-4">
        <div className="w-[430px] h-[170px] top-[200px] bg-primaryColor flex justify-center items-center ">
          <PopbleImage src={PopbleImg} />
        </div>
        {/* 닉네임 */}

        {/* 아이디 */}
        <Controller
          name="loginId"
          control={control}
          rules={{ required: "ID를 입력하세요" }}
          render={({ field }) => (
            <TextField
              {...field}
              label="아이디"
              fullWidth
              variant="standard"
              InputProps={{ disableUnderline: true }}
              sx={{
                backgroundColor: "#efefef",
                paddingLeft: 1,
              }}
              InputLabelProps={{
                sx: { fontSize: "13px", left: "10px" },
              }}
              onChange={(e) => {
                field.onChange(e);
                trigger("loginId");
              }}
              helperText={errors.loginId && errors.loginId.message}
            />
          )}
        />

        {/* 비밀번호 */}
        <Controller
          name="password"
          control={control}
          rules={{ required: "비밀번호를 입력하세요" }}
          render={({ field }) => (
            <TextField
              {...field}
              label="비밀번호"
              type="password"
              fullWidth
              variant="standard"
              InputProps={{ disableUnderline: true }}
              sx={{
                backgroundColor: "#efefef",
                paddingLeft: 1,
              }}
              InputLabelProps={{
                sx: { fontSize: "13px", left: "10px" },
              }}
              onChange={(e) => {
                field.onChange(e);
                trigger("password");
              }}
              helperText={errors.password && errors.password.message}
            />
          )}
        />

        {/* 로그인 */}
        <button
          onClick={handleSubmit(handleClickLogin)}
          className="w-full h-[55px] bg-secondaryAccentColor text-black font-bold text-lg rounded-md"
        >
          로그인
        </button>

        {/* 아이디/비밀번호 재설정/회원가입 링크 */}
        <div className="text-right text-sm">
          <Link to="/user/login" className="text-black-500 hover:underline">
            아이디 /
          </Link>
          <Link to="/user/login" className="text-black-500 hover:underline">
            &nbsp; 비밀번호 재설정
          </Link>
          &nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;
          <Link to="/user/signup" className="text-black-500 hover:underline">
            회원가입
          </Link>
        </div>

        {/* 구분선 */}
        <div className="w-full h-[2px] bg-black" />

        {/* 소셜 로그인 버튼 */}
        <div className="flex justify-center gap-9">
          <KakaoLoginButton>
            <KaKaoImage src={KakaoImg} />
          </KakaoLoginButton>

          <GoogleLoginButton>
            <GoogleImage src={GoogleImg} />
          </GoogleLoginButton>

          <NaverLoginButton>
            <NaverImage src={NaverImg} />
          </NaverLoginButton>
        </div>
      </form>
    </div>
  );
};

export default LoginComponent;
