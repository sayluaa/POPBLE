import { useEffect, useState } from "react";
import MyPageMenuComponent from "../mypage/MyPageMenuComponent";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { API_SERVER_HOST } from "../../../api/config";
import { getUserProfileByUserId } from "../../../api/userProfileApi";

const MyPageComponent = () => {
  const { menu } = useParams();
  const navigate = useNavigate();
  const [selectedMenu, setSelectedMenu] = useState(menu || "edit");

  const user = useSelector((state) => state.auth?.user);
  //현재 userProfile이 undefined로 나옴
  // const userProfile = useSelector((state) => state.auth?.userProfile);
  // console.log("REDUX에 저장된 userProfile:", userProfile);
  const [profileImgUrl, setProfileImgUrl] = useState(null);
  const [nickname, setNickname] = useState("POPBLE");
  const [email, setEmail] = useState("popble@popble.com");

  const formatImageUrl = (path) => {
    if (!path) return null;
    return `${API_SERVER_HOST}${path}`;
  };

  useEffect(() => {
    if (!user?.id) return;
    setEmail(user.email || "");
    getUserProfileByUserId(user.id).then((data) => {
      setNickname(data.nickname || "");
      if (data.profileImg) {
        setProfileImgUrl(formatImageUrl(data.profileImg));
      } else {
        setProfileImgUrl(null);
      }
    });
  }, [user]);

  const handleMenuClick = (key) => {
    setSelectedMenu(key); 
    navigate(`/user/mypage/${key}`);
  };

   useEffect(() => {
      setSelectedMenu(menu || null);
  }, [menu]);

  return (
    <div className="bg-gradient-to-b from-backgroundColor min-h-screen">
      <div className="flex flex-col justify-start">
        {/* 프로필사진 이메일 */}
        <div className="flex flex-row justify-start p-4 ml-5 mb-5 mt-5">
          <div className={`size-[150px] shadow-md m-3 rounded-full flex items-center justify-center text-white text-4xl font-bold
              ${profileImgUrl ? "bg-transparent border border-hashTagColor" : "bg-secondaryAccentColor"}`}
          >
            {profileImgUrl ? (
              <img
                src={profileImgUrl}
                alt="프로필사진"
                className="object-cover h-full w-full rounded-full"
              />
            ) : (
              // 이미지 없을경우 닉네임 앞글자+배경색
              <span>
                {nickname ? nickname.charAt(0).toUpperCase() : "?"}
              </span>
            )}
          </div>
          <div className="m-2 p-3">
            <h2 className="text-5xl font-bold p-2 m-2">
              {nickname}
            </h2>
            <p className="text-2xl p-2 m-2">{email}</p>
          </div>
        </div>
        {/* 프로필사진 이메일 끝 */}
        {/* 마이페이지 메뉴 시작*/}
        <MyPageMenuComponent
          selectedMenu={selectedMenu}
          onMenuClick={handleMenuClick}
        ></MyPageMenuComponent>
        {/* 마이페이지 메뉴 끝 */}
        {/* 마이페이지 내용 시작 */}
        <div>
          <Outlet></Outlet>
        </div>
        {/* 마이페이지 내용 끝 */}
      </div>
    </div>
  );
};

export default MyPageComponent;