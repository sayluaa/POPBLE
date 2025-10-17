import { useEffect, useState, useCallback } from "react";
import { getList } from "../../api/searchApi";
import PageComponent from "../common/PageComponent";
import useCustomMove from "../../hooks/useCustomMove";
import PopupCard from "./PopupCard";
import CategoryComponent from "./CategoryComponent";
import SortComponent from "./SortComponent";
import SearchBar from "../common/SearchBar";
import { getBookmarkList, isBookmark } from "../../api/bookmarkApi";
import { useLocation, useParams } from "react-router-dom";
import LoadingComponent from "../common/LoadingComponent";
import { useSelector } from "react-redux";

const initState = {
  dtoList: [],
  pageNumList: [],
  pageRequestDTO: null,
  prev: false,
  next: false,
  totalCount: 0,
  prevPage: 0,
  nextPage: 0,
  totalPage: 0,
  current: 0,
};

const SearchComponent = () => {
  const { page, size, refresh, moveToSearch } = useCustomMove();

  const userId = useSelector((state) => state.auth?.user?.id);

  //URL읽기
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const searchKeyword = params.get("keyword") || null;

  // useEffect(() => {
  //   const params = new URLSearchParams(location.search);
  //   const keyword = params.get("keyword");
  //   if (keyword) {
  //     setFilter((prev) => ({ ...prev, keyword }));
  //   }
  // }, [location.search]);

  //필터 관리
  const [filter, setFilter] = useState({
    status: null,
    sort: null,
    categoryType: null,
    categoryId: null,
    keyword: searchKeyword,
  });

  const [serverData, setServerData] = useState(initState);
  const [bookmarkIds, setBookmarkIds] = useState([]);
  const [loading, setLoading] = useState(true);

  //전체 팝업 불러오기
  const fetchData = useCallback(async () => {
    const filterData = {
      ...filter,
      pageRequestDTO: { page, size },
    };
    getList(filterData)
      .then((data) => setServerData(data))
      .catch((err) => console.error("조회실패", err));
  }, [filter, page, size]);

  //북마크 불러오기
  const fetchBookmarks = useCallback(async () => {
    if (!userId) {
      setBookmarkIds([]);
      return Promise.resolve();
    }
    try {
      const data = await getBookmarkList();
      const items = Array.isArray(data) ? data : data.content || [];
      setBookmarkIds(items.map((b) => b.popupId));
    } catch (e) {
      console.error("북마크 조회 실패", e);
      setBookmarkIds([]);
    }
  }, [userId]);

  useEffect(() => {
    console.log("userId in SearchPage:", userId);
    const fetchAll = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchBookmarks(), fetchData()]);
      } catch (e) {
        console.error("데이터를 불러오는데 실패했습니다", e);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [filter, fetchData, fetchBookmarks, refresh]);

  return (
    <div className="relative">
      {/* 로딩 */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-50">
          <LoadingComponent></LoadingComponent>
        </div>
      )}
      <div className={loading ? "pointer-events-none opacity-40" : ""}>
        <div className="flex flex-col items-center p-4">
          {/* 검색창 */}
          <SearchBar
            className="w-full max-w-4xl h-[40px] flex-wrap items-center"
            onSearch={(keyword) => {
              setFilter((prev) => ({
                ...prev,
                keyword,
              }));
            }}
          ></SearchBar>
          {/* 검색창 끝 */}
          {/* 카테고리정렬 시작*/}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {/* 카테고리 */}
            <CategoryComponent
              selectedStatus={filter.status}
              selectedCategoryId={filter.categoryId}
              selectedCategoryType={filter.categoryType}
              onSelect={(selected) => {
                if (selected.type === "status") {
                  setFilter((prev) => ({
                    ...prev,
                    status: selected.value,
                    categoryType: null,
                    categoryId: null,
                  }));
                } else if (selected.type === "category") {
                  setFilter((prev) => ({
                    ...prev,
                    status: null,
                    categoryType: selected.categoryType,
                    categoryId: selected.categoryId,
                  }));
                }
              }}
            />
            <SortComponent
              onSort={(sort) =>
                setFilter((prev) => ({
                  ...prev,
                  sort,
                }))
              }
            />
            {/* 정렬 */}
          </div>
          {/* 카테고리정렬 끝 */}
          {/* 구분선 */}
          <div className="flex justify-center w-full mt-2 mb-5">
            <hr className="border-t-2 border-black w-full max-w-5xl" />
          </div>
          {/* 카드 시작 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {serverData.dtoList.map((item) => (
              <PopupCard
                key={item.id}
                item={{
                  ...item,
                  popupId: item.id,
                  isBookmark: userId && bookmarkIds.includes(item.id),
                }}
              ></PopupCard>
            ))}
          </div>
          {/* 카드 끝 */}
        </div>
        <PageComponent
          serverData={serverData}
          movePage={moveToSearch}
        ></PageComponent>
      </div>
    </div>
  );
};

export default SearchComponent;