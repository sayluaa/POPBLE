import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full bg-backgroundColor">
      <h1 className="text-6xl font-extrabold m-2 p-2">404</h1>
      <p className="text-4xl m-2 p-2">페이지를 찾을 수 없습니다.</p>
      <p className="text-4xl m-2 p-2">
        요청하신 페이지가 존재하지 않거나, 경로가 잘못되었습니다.
      </p>
      <button
        className="m-5 p-2 rounded-3xl bg-primaryColor border-2 border-blue-300 shadow-md hover:opacity-90"
        onClick={goHome}
      >
        파블로 돌아가기
      </button>
    </div>
  );
};

export default NotFoundPage;
