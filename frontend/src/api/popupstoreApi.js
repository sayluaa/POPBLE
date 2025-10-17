import axios from "axios";
import jwtAxios from "../utill/jwtUtill";

// 스프링부트 서버 주소
import { API_SERVER_HOST } from "./config";
const prefix = `${API_SERVER_HOST}/api/popup`;

// ===== 목록 조회 =====
export const getList = async (pageParam) => {
  const { page, size } = pageParam;
  const res = await axios.get(`${prefix}/list`, { params: { page, size } });
  return res.data;
};

// ===== 등록 =====
export const createPopupStore = async (payload, imageFile) => {
  try {
    if (imageFile) {
      const fd = new FormData();
      fd.append(
        "dto",
        new Blob([JSON.stringify(payload)], { type: "application/json" })
      );
      fd.append("images", imageFile);

      const res = await jwtAxios.post(`${prefix}/`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } else {
      const res = await jwtAxios.post(`${prefix}`, payload);
      return res.data;
    }
  } catch (err) {
    console.error("[createPopupStore]", err);
    throw err;
  }
};

// ===== 단건 조회 =====
export const getOne = async (id) => {
  const res = await axios.get(`${prefix}/${id}`);
  return res.data;
};

// ===== 수정 (이미지 없이) =====
export const updatePopupStore = async (id, payload) => {
  try {
    const res = await axios.put(`${prefix}/${id}`, payload);
    return res.data;
  } catch (err) {
    console.error("[updatePopupStore]", err);
    throw err;
  }
};

// ===== 수정 (이미지 포함) =====
export const updatePopupStoreWithImages = async (
  id,
  payload,
  files = [],
  keepImages = []
) => {
  try {
    const fd = new FormData();
    fd.append(
      "popup",
      new Blob([JSON.stringify(payload)], { type: "application/json" })
    );

    // 기존 이미지 유지 목록
    keepImages.forEach((img) => fd.append("keepImages", img));

    // 신규 이미지 추가
    files.forEach((f) => fd.append("images", f));

    const res = await axios.put(`${prefix}/${id}`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    console.error("[updatePopupStoreWithImages]", err);
    throw err;
  }
};

// ===== 삭제 =====
export const deleteOne = async (id) => {
  const res = await axios.delete(`${prefix}/${id}`);
  return res.data;
};

//팝업스토어 홍보 게시판 등록하기(사진첨부)
export const postAdd = async (formData) => {
  const res = await jwtAxios.post(`${prefix}/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

//팝업스토어정보수정(사진변경)
export const putOne = async (id, popupStore) => {
  const header = { headers: { "Content-Type": "multipart/form-data" } };

  const res = await axios.put(`${prefix}/${id}`, popupStore, header);

  return res.data;
};
