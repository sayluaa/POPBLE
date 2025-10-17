// src/api/AdBoardApi.js
import axios from "axios";
import { API_SERVER_HOST } from "./config";
import jwtAxios from "../utill/jwtUtill";
const prefix = `${API_SERVER_HOST}/api/ad`;

// // 🔒 JWT 토큰 가져오기
// const getAuthHeader = () => {
//   const token = localStorage.getItem("accessToken");
//   return token ? { Authorization: `Bearer ${token}` } : {};
// };

// 🔹 목록 조회
export const getAdList = async ({
  page = 1,
  size = 10,
  order,
  keyword,
} = {}) => {
  const url = `${prefix}/list`;
  const res = await axios.get(url, {
    params: { page, size, order, keyword },
  });
  return res.data;
};

// 🔹 단건 조회
export const getAdOne = async (id) => {
  const res = await axios.get(`${prefix}/${id}`);
  return res.data;
};

// 🔹 등록 (JSON)
export const createAd = async (payload) => {
  const res = await axios.post(prefix, payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.data;
};

// 🔹 등록 (이미지 포함)
export const createAdWithImages = async (
  payload,
  files = [],
  thumbnailIndex = 0
) => {
  const fd = new FormData();
  fd.append(
    "board",
    new Blob([JSON.stringify({ ...payload, thumbnailIndex })], {
      type: "application/json",
    })
  );
  files.forEach((file) => fd.append("images", file));

  const res = await axios.post(`${prefix}/with-images`, fd, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

// 🔹 수정 (JSON)
export const updateAd = async (id, payload) => {
  const res = await axios.put(`${prefix}/${id}`, payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.data;
};

// 🔹 수정 (이미지 포함)
export const updateAdWithImages = async (
  id,
  payload,
  files = [],
  keepImages = [],
  thumbnailIndex = 0
) => {
  const fd = new FormData();
  fd.append(
    "board",
    new Blob([JSON.stringify({ ...payload, thumbnailIndex })], {
      type: "application/json",
    })
  );
  files.forEach((f) => fd.append("images", f));
  keepImages.forEach((k) => fd.append("keepImages", k));

  const res = await axios.put(`${prefix}/${id}/with-images`, fd, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

// 🔹 삭제
export const deleteAd = async (id) => {
  const res = await axios.delete(`${prefix}/${id}`, {});
  return res.data;
};
