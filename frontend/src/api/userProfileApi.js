import axios from "axios";
import { API_SERVER_HOST } from "./config";
import jwtAxios from "../utill/jwtUtill";

const host = `${API_SERVER_HOST}/api/userProfile`;

//특정 프로필 조회
export const getUserProfileById = async (id) => {
  const res = await jwtAxios.get(`${host}/${id}`);
  return res.data;
};

//프로필 생성
export const createUserProfile = async (profile) => {
  const formData = new FormData();
  formData.append("userId", profile.userId);
  formData.append("nickname", profile.nickname);
  if (profile.profileImg) {
    formData.append("profileImg", profile.profileImg);
  }
  const head = { headers: { "Content-Type": "multipart/form-data" } };
  const res = await jwtAxios.post(`${host}`, formData, head);
  return res.data;
};

//프로필 수정
export const updateUserProfile = async (id, profile) => {
  const formData = new FormData();
  formData.append("nickname", profile.nickname);
  if (profile.profileImg) {
    formData.append("profileImg", profile.profileImg);
  }
  const head = { headers: { "Content-Type": "multipart/form-data" } };
  const res = await jwtAxios.patch(`${host}/${id}`, formData, head);
  return res.data;
};

//프로필 삭제
export const deleteUserProfile = async (id) => {
  const res = await jwtAxios.delete(`${host}/${id}`);
  return res.data;
};

//전체 프로필 조회
export const getAllUserProfiles = async () => {
  const res = await jwtAxios.get(`${host}/list`);
  return res.data;
};

export const getUserProfileByUserId = async (userId) => {
  const res = await jwtAxios.get(`${host}/edit/${userId}`);
  return res.data;
};

//유저프로필로 예약내역 가져오기
export const getReservationsByUserProfileId = async (userProfileId) => {
  const res = await axios.get(`${host}/${userProfileId}/reservations`);
  return res.data;
};
