import axios from "axios";
import jwtAxios from "../utill/jwtUtill";
import { API_SERVER_HOST } from "./config";

const prefix = `${API_SERVER_HOST}/api/search`;

//Todo: 목록보기 로그인하면 -> jwtAxios 로그인 안하면 axios로
//목록보기
export const getList = async (filterData) => {
  console.log("categoryType:", filterData.categoryType);
  const { status, sort, categoryType, categoryId, keyword, pageRequestDTO } =
    filterData;
  const { page, size } = pageRequestDTO;

  const res = await axios.get(`${prefix}`, {
    params: {
      status,
      sort,
      categoryType,
      categoryId,
      keyword,
      page,
      size,
    },
  });

  return res.data;
};

//카테고리 조회
export const getCategories = async (type) => {
  try {
    const res = await axios.get(`${API_SERVER_HOST}/api/filter/category`, {
      params: { type },
    });
    return res.data;
  } catch (err) {
    console.log("getCategories 실패", err);
    return [];
  }
};

//팝업스토어 진행상태
export const getStatusList = async () => {
  const res = await axios.get(`${API_SERVER_HOST}/api/filter/status`);
  return res.data;
};
