import { useState, useEffect } from "react";
import { getUserById, updateUser, deleteUser } from "../../../api/userApi";
import { FaUserEdit } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { logout, updateUserProfileRedux } from "../../../slice/authSlice";
import { useNavigate } from "react-router-dom";
import {
  getUserProfileByUserId,
  updateUserProfile,
} from "../../../api/userProfileApi";
import { API_SERVER_HOST } from "../../../api/config";
import AlertModal from "../../common/AlertModal";

const DummyConfirmModal = ({ message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
      <p className="text-lg mb-4">{message}</p>
      <div className="flex justify-end space-x-3">
        <button
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          onClick={onCancel}
        >
          취소
        </button>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={onConfirm}
        >
          확인
        </button>
      </div>
    </div>
  </div>
);

const MyPageEdit = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth?.user);

  const { token, isAuthenticated } = useSelector((state) => state.auth);

  // Modal 상태
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);

  // User 폼
  const [userForm, setUserForm] = useState({
    password: "",
    passwordConfirm: "",
    email: "",
    name: "",
    phonenumber: "",
  });

  // UserProfile 폼
  const [profileForm, setProfileForm] = useState({
    nickname: "",
    profileImg: null,
  });
  const [isSocial, setIsSocial] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  // --- Modal Helper Functions ---
  const openAlertModal = (message) => {
    setAlertMessage(message);
    setShowAlertModal(true);
  };

  const closeAlertModal = () => {
    setShowAlertModal(false);
    setAlertMessage("");
  };

  const openConfirmModal = (message, action) => {
    setConfirmMessage(message);
    setConfirmAction(() => action);
    setShowConfirmModal(true);
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
    setConfirmMessage("");
    setConfirmAction(null);
  };

  const handleConfirm = () => {
    if (confirmAction) {
      confirmAction();
    }
    closeConfirmModal();
  };
  // ------------------------------

  useEffect(() => {
    if (!user || !user.id) return;

    // User 내용
    getUserById(user.id).then((data) => {
      setUserForm({
        email: data.email || "",
        password: "",
        passwordConfirm: "",
        name: data.name || "",
        phonenumber: data.phonenumber || "",
      });
      setIsSocial(data.isSocial);
    });

    // Profile 내용
    getUserProfileByUserId(user.id).then((data) => {
      setProfileForm({
        nickname: data.nickname || "",
        profileImg: data.profileImg || null,
      });
      if (data.profileImg) {
        setProfileImage(`${API_SERVER_HOST}${data.profileImg}`);
      }
    });
  }, [user]);

  if (!user || !user.loginId) {
    return <div className="text-red-500">로그인이 필요합니다</div>;
  }

  const handleUserChange = (e) => {
    setUserForm({ ...userForm, [e.target.name]: e.target.value });
  };

  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      // User
      if (!isSocial && userForm.password !== userForm.passwordConfirm) {
        openAlertModal("비밀번호가 일치하지 않습니다");
        return;
      }
      await updateUser(user.id, {
        email: userForm.email,
        password: isSocial ? null : userForm.password,
        name: userForm.name,
        phonenumber: userForm.phonenumber,
      });

      // UserProfile
      const updatedProfile = await updateUserProfile(user.id, {
        nickname: profileForm.nickname,
        profileImg: profileForm.profileImg,
      });
      dispatch(
        updateUserProfileRedux({
          ...updatedProfile,
          nickname: updatedProfile.nickname,
          profileImg: updatedProfile.profileImg
            ? `${API_SERVER_HOST}/uploads/${updatedProfile.profileImg}`
            : null,
        })
      );

      openAlertModal("회원정보 수정 완료");
    } catch (err) {
      openAlertModal("회원정보 수정 실패:" + err.message);
    }
  };

  const executeDelete = async () => {
    try {
      await deleteUser(user.id);
      dispatch(logout());
      openAlertModal("회원 탈퇴가 완료되었습니다.");
      navigate("/");
    } catch (err) {
      openAlertModal(`회원 탈퇴에 실패했습니다: ${err.message}`);
    }
  };

  const handleDelete = () => {
    openConfirmModal("정말로 탈퇴하시겠습니까?", executeDelete);
  };
  // ---------------------------------------------------

  // 프로필 이미지 관리
  const handleImageChange = (e) => { // async 제거
    const file = e.target.files[0];
    if (file) {
      setProfileForm({ ...profileForm, profileImg: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        //미리보기
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col justify-center w-full">
      {/* Modal 렌더링 */}
      {showAlertModal && (
        <AlertModal message={alertMessage} onClose={closeAlertModal} />
      )}

      {showConfirmModal && (
        <DummyConfirmModal
          message={confirmMessage}
          onConfirm={handleConfirm}
          onCancel={closeConfirmModal}
        />
      )}

      {/* 정렬 */}
      <div className="mt-2 w-full flex flex-center items-center gap-2">
        <FaUserEdit size={25} className="ml-8" />
        <p className="m-1 text-2xl">회원정보 수정 / 탈퇴</p>
      </div>
      <hr className="min-w-[300px] border border-black border-l-2 m-2"></hr>
      <div className="flex flex-row space-x-16 justify-center m-10">
        {/* 프로필사진 추가 편집 */}
        <div className="flex flex-col items-center space-y-6 mb-8">
          {/* 원형 */}
          <div className="w-20 h-20 rounded-full border-2 border-hashTagColor flex overflow-hidden items-center justify-center">
            {profileImage ? (
              <img
                src={profileImage}
                alt="프로필사진"
                className="object-cover w-full h-full"
              ></img>
            ) : (
              <span className="text-gray-500 text-sm">프로필 사진</span>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="profileImageUpload"
          ></input>
          <label
            className="px-3 py-1 rounded-lg border-2 border-hashTagColor bg-white cursor-pointer"
            htmlFor="profileImageUpload"
          >
            편집
          </label>
        </div>
        {/* 내용 */}
        <div className="space-y-2">
          <div className="flex items-center">
            <label className="w-32 font-medium">아이디</label>
            <input
              disabled
              value={user.loginId}
              className="flex-1 p-2 rounded-lg border-2 border-subSecondColor"
            ></input>
          </div>
          <div className="flex items-center">
            <span className="w-32 font-medium">이름</span>
            <input
              disabled
              className="flex-1 p-2 rounded-lg border-2 border-subSecondColor"
              value={userForm.name}
              onChange={handleUserChange}
              name="name"
            ></input>
          </div>
          <div className="flex items-center">
            <span className="w-32 font-medium">닉네임</span>
            <input
              className="flex-1 p-2 rounded-lg border-2 border-subSecondColor"
              value={profileForm.nickname}
              onChange={handleProfileChange}
              name="nickname"
            ></input>
          </div>
          <div className="flex items-center">
            <span className="w-32 font-medium">비밀번호</span>
            <input
              disabled={isSocial}
              className="flex-1 p-2 rounded-lg border-2 border-subSecondColor"
              value={userForm.password}
              onChange={handleUserChange}
              name="password"
              type="password"
            ></input>
          </div>
          <div className="flex items-center">
            <span className="w-32 font-medium">비밀번호 재확인</span>
            <input
              disabled={isSocial}
              className="flex-1 p-2 rounded-lg border-2 border-subSecondColor"
              value={userForm.passwordConfirm}
              onChange={handleUserChange}
              name="passwordConfirm"
              type="password"
            ></input>
          </div>
          <div className="flex items-center">
            <span className="w-32 font-medium">이메일</span>
            <input
              className="flex-1 p-2 rounded-lg border-2 border-subSecondColor"
              value={userForm.email}
              onChange={handleUserChange}
              name="email"
              type="email"
            ></input>
          </div>
          <div className="flex items-center">
            <span className="w-32 font-medium">전화번호</span>
            <input
              className="flex-1 p-2 rounded-lg border-2 border-subSecondColor"
              value={userForm.phonenumber}
              onChange={handleUserChange}
              name="phonenumber"
              type="phonenumber"
            ></input>
          </div>
        </div>
      </div>
      <hr className="min-w-[300px] border border-black border-l-2 m-2"></hr>
      {/* 버튼 */}
      <div className="flex justify-end space-x-4 m-5 mr-20">
        <button
          className="w-[220px] h-[40px] rounded-lg text-black bg-primaryColor border-blue-300 border-2 hover:opacity-90 shadow-md"
          onClick={handleUpdate}
        >
          수정
        </button>
        <button
          className="text-sm w-[120px] h-[40px] rounded-lg text-black bg-subButtonAccentColor border-red-300 border-2 hover:opacity-90 shadow-md"
          onClick={handleDelete}
        >
          회원탈퇴
        </button>
      </div>
    </div>
  );
};

export default MyPageEdit;