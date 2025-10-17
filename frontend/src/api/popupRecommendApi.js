import jwtAxios from "../utill/jwtUtill";
import { API_SERVER_HOST } from "./config";

const prefix = `${API_SERVER_HOST}/api/popup`;

//추천 추가
export const postRecommend = async (popupId) => {
  const res = await jwtAxios.post(`${prefix}/${popupId}/recommend`);
  return res.data;
};
//추천 삭제
export const deleteRecommend = async (popupId) => {
  const res = await jwtAxios.delete(`${prefix}/${popupId}/recommend`);
  return res.data;
};

//추천 여부확인
export const getIsRecommended = async (popupId) => {
  const res = await jwtAxios.get(`${prefix}/${popupId}/recommend`);
  return res.data;
};
