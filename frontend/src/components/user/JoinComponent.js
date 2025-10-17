import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { postAdd } from "../../api/userApi";
import TextField from "@mui/material/TextField";
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
import useCustomLogin from "../../hooks/useCustomLogin";
const SignUpFormValues = {
  loginId: "",
  password: "",
  passwordConfirm: "",
  email: "",
  name: "",
};

const JoinComponent = () => {
  const { doLogin, moveToPath } = useCustomLogin();

  const {
    control,
    handleSubmit,
    getValues,
    trigger,

    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: SignUpFormValues,
  });

  const onSubmit = async (join) => {
    console.log("회원가입 시도 객체(join):", join);

    const finalJoin = {
      ...join,

      phonenumber: "010-0000-0000",
      role: "MEMBER",
      social: false,
    };

    try {
      const response = await postAdd(finalJoin);
      console.log("회원가입 성공:", response);
      moveToPath("/");
    } catch (e) {
      console.error("회원가입 실패:", e);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-[480px] bg-white p-6 rounded shadow space-y-4"
      >
        {/* 닉네임 */}
        <Controller
          name="name"
          control={control}
          rules={{ required: "닉네임을 입력하세요" }}
          render={({ field }) => (
            <TextField
              {...field}
              label="닉네임"
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
                trigger("name");
              }}
              helperText={errors.name && errors.name.message}
            />
          )}
        />

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

        {/* 비밀번호 확인 */}
        <Controller
          name="passwordConfirm"
          control={control}
          rules={{
            validate: (value) =>
              value === getValues("password") ||
              "비밀번호가  일치하지 않습니다",
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="비밀번호확인"
              fullWidth
              variant="standard"
              type="password"
              InputProps={{
                disableUnderline: true,
                inputProps: { style: { paddingLeft: "15px" } },
              }}
              sx={{
                backgroundColor: "#efefef",
              }}
              InputLabelProps={{
                sx: { fontSize: "13px", left: "10px" },
              }}
              onChange={(e) => {
                field.onChange(e);
                trigger("passwordConfirm");
              }}
              helperText={
                errors.passwordConfirm && errors.passwordConfirm.message
              }
            />
          )}
        />

        {/* 이메일 */}
        <Controller
          name="email"
          control={control}
          rules={{
            required: "이메일을 입력해주세요.",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
              message: "유효한 이메일 주소를 입력해주세요.",
            },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="이메일"
              fullWidth
              variant="standard"
              placeholder="example@email.com"
              InputProps={{
                disableUnderline: true,
                inputProps: { style: { paddingLeft: "15px" } },
              }}
              sx={{
                backgroundColor: "#efefef",
              }}
              InputLabelProps={{
                sx: { fontSize: "13px", left: "10px" },
              }}
              onChange={(e) => {
                field.onChange(e);
                trigger("eamail");
              }}
              helperText={errors.email && errors.email.message}
            />
          )}
        />

        {/* 가입하기 버튼 */}
        <button
          onClick={handleSubmit(onSubmit)}
          className="w-full h-[55px] bg-secondaryAccentColor text-black font-bold text-lg rounded-md"
        >
          가입하기
        </button>

        {/* 로그인 링크 */}
        <div className="text-right text-sm">
          <Link to="/user/login" className="text-black-500 hover:underline">
            로그인
          </Link>
        </div>

     


        {/* 구분선 */}
        <div className="w-full h-[2px] bg-black" />

        {/* 소셜 로그인 버튼들 */}
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

export default JoinComponent;