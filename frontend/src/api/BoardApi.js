import axios from "axios";
import jwtAxios from "../utill/jwtUtill";
import { API_SERVER_HOST } from "./config";

const prefix = `${API_SERVER_HOST}/api/boards`;

// =======================
// 절대 URL 보정 헬퍼
// =======================
const toAbs = (url) => {
  if (!url) return url;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  // "/files/..." 또는 "files/..." 모두 대응
  const path = url.startsWith("/") ? url : `/${url}`;
  return `${API_SERVER_HOST}${path}`;
};

// =======================
// 이미지 URL 보정
// =======================
const mapImagesAbs = (post) => {
  if (!post?.images) return post;
  return {
    ...post,
    images: post.images.map((im) => ({ ...im, url: toAbs(im.url) })),
  };
};

// =======================
// 조회
// =======================

// ✅ 게시글 단건 조회
export const getOne = async (id) => {
  const res = await axios.get(`${prefix}/${id}`);
  return mapImagesAbs(res.data);
};

// ✅ 게시글 목록 조회 (타입별 + 정렬)
export const getList = async ({ type, order = "date" }) => {
  const res = await axios.get(`${prefix}`, { params: { type, order } });
  const list = res.data || [];
  return list.map(mapImagesAbs);
};

// ✅ 전체 게시물 목록 (페이지네이션 + pinned 상단)
//    → 백엔드에서 PageResponseDTO 구조 반환
export const getAll = async ({ order = "date", page = 1, size = 10 } = {}) => {
  const res = await axios.get(`${prefix}/all`, {
    params: { order, page, size },
  });
  const data = res.data;

  // dtoList의 이미지 경로 보정
  if (data?.dtoList) {
    data.dtoList = data.dtoList.map(mapImagesAbs);
  }

  return data; // PageResponseDTO { dtoList, pageNumList, totalCount, ... }
};

// 하위 호환 별칭
export const getAllList = getAll;

// =======================
// 생성
// =======================

// ✅ 게시글 등록 (JSON 전송: 이미지 없을 때 사용)
export const postAdd = async (boardObj) => {
  const res = await jwtAxios.post(`${prefix}`, boardObj);
  return res.data; // 생성된 게시글 id
};

// ✅ 게시글 등록 (이미지 포함: 멀티파트 전송)
export const postAddWithImages = async (boardObj, files = []) => {
  if (!files || files.length === 0) {
    const res = await jwtAxios.post(`${prefix}`, boardObj);
    return res.data;
  }
  const form = new FormData();
  form.append(
    "board",
    new Blob([JSON.stringify(boardObj)], { type: "application/json" })
  );
  for (const f of files) form.append("images", f); // @RequestPart("images")

  // ⚠️ headers 지정하지 말 것 → axios가 boundary 자동 처리
  const res = await jwtAxios.post(`${prefix}`, form);
  return res.data;
};

// =======================
// 수정
// =======================

// ✅ 게시글 본문 수정
export const patchOne = async (id, boardObj) => {
  await jwtAxios.patch(`${prefix}/${id}`, boardObj);
  return true;
};

// ✅ 이미지 수정: 유지할 이미지 id + 새 파일들
export const patchImages = async (id, keepIds = [], files = []) => {
  const form = new FormData();
  keepIds.forEach((k) => form.append("keepIds", k));
  files.forEach((f) => form.append("newImages", f));
  await jwtAxios.patch(`${prefix}/${id}/images`, form);
  return true;
};

// ✅ 핀(공지 고정/해제)
export const patchPin = async (id, { pinned, pinUntil = null }) => {
  await jwtAxios.patch(`${prefix}/${id}/pin`, { pinned, pinUntil });
  return true;
};

// =======================
// 삭제
// =======================

// ✅ 게시글 삭제
export const deleteOne = async (id) => {
  await jwtAxios.delete(`${prefix}/${id}`);
  return true;
};
