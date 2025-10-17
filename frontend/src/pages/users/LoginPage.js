import LoginComponent from "../../components/user/LoginComponent";

const LoginPage = () => {
  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex flex-wrap w-full h-full justify-center items-center border-2">
        <LoginComponent></LoginComponent>
      </div>
    </div>
  );
};

export default LoginPage;
