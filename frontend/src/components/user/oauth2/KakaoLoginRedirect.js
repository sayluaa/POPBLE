import { useSearchParams } from "react-router-dom";

const makeRedirectUrl = (token, userJson) => {
  const baseUrl = "http://localhost:3000/oauth2/redirect";
  const encodedUser = encodeURIComponent(userJson);

  return `${baseUrl}?token=${token}&user=${encodedUser}`;
};

const KakaoLoginRedirect = () => {
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");
  const userJson = searchParams.get("user");

  // 필요하다면 이곳에서 URL 생성 가능
  const redirectUrl = makeRedirectUrl(token, userJson);

  return (
    <div>
      <p>생성된 리디렉션 URL:</p>
      <p>{redirectUrl}</p>
    </div>
  );
};




