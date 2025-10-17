import axios from "axios";
import jwtAxios from "../utill/jwtUtill";
import { API_SERVER_HOST } from "./config";

const prefix = `${API_SERVER_HOST}/api/bookmark`;

//북마크 추가하기
export const addBookmark = async (popupId) => {
  const res = await jwtAxios.post(`${prefix}/${popupId}`);

  return res.data;
};

//북마크 삭제하기
export const deleteBookmark = async (popupId) => {
  const res = await jwtAxios.delete(`${prefix}/${popupId}`);
  return res.data;
};

//북마크 목록 조회
export const getBookmarkList = async () => {
  try {
    const res = await jwtAxios.get(`${prefix}/list`);
    return Array.isArray(res.data) ? res.data : res.data.content || [];
  } catch (e) {
    console.error("북마크 조회 실패", e);
    return [];
  }
};

//북마크 여부
export const isBookmark = async (popupId) => {
  const res = await jwtAxios.get(`${prefix}/check/${popupId}`);
  return res.data;
};
