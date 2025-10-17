import { useState } from "react";
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

const getNum = (param, defaultValue) => {
  if (!param) {
    return defaultValue;
  }
  return parseInt(param);
};

const useCustomMove = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [refresh, setRefresh] = useState(false);

  const [queryParams] = useSearchParams();

  const page = getNum(queryParams.get("page"), 1);
  const size = getNum(queryParams.get("size"), 10);
  const type = queryParams.get("type") || "GENERAL"; // ✅ 자유게시판 기본값

  const querySearch = createSearchParams({ page, size }).toString();
  const queryDefault = createSearchParams({ page, size, type }).toString();

  const moveToSearch = (pageParam) => {
    let queryStr = "";
    if (pageParam) {
      const pageNum = getNum(pageParam.page, 1);
      const sizeNum = getNum(pageParam.size, 10);
      queryStr = createSearchParams({
        page: pageNum,
        size: sizeNum,
      }).toString();
    } else {
      queryStr = querySearch;
    }
    setRefresh(!refresh);

    navigate({ pathname: location.pathname, search: queryStr });
  };

  const moveToList = (pageParam) => {
    const pageNum = getNum(pageParam?.page, page);
    const sizeNum = getNum(pageParam?.size, size);

    const queryStr = createSearchParams({
      page: pageNum,
      size: sizeNum,
      type,
    }).toString();

    setRefresh((r) => !r);
    navigate({ pathname: "../list", search: queryStr });
  };

  const moveToModify = (num) => {
    console.log(queryDefault);

    navigate({ pathname: `../modify/${num}`, search: queryDefault });
  };

  const moveToRead = (num) => {
    navigate({ pathname: `../read/${num}`, search: queryDefault });
  };

  return {
    moveToList,
    page,
    size,
    type,
    moveToModify,
    moveToRead,
    refresh,
    moveToSearch,
  };
};

export default useCustomMove;
