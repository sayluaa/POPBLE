import { useEffect, useRef, useState } from "react";
import BasicLayout from "../layout/BasicLayout";
import Carousel from "../components/function/Carousel";
import SearchBar from "../components/common/SearchBar";
import { useLocation, useNavigate } from "react-router-dom";
import FullMap from "../components/common/kakaoMap/FullMap";

import { FiMapPin } from "react-icons/fi";

import { getList } from "../api/searchApi";
import PopuplarPopupComponent from "../components/popup/popular/PopularPopupComponent";

import { SwiperSlide } from "swiper/react";
import CustomSwiper from "../components/common/CustomSwiper";
import PopularPopupComponent from "../components/popup/popular/PopularPopupComponent";

import { FaHeart } from "react-icons/fa";
import { PiEyesFill } from "react-icons/pi";

const MainPage = () => {
  const navigate = useNavigate();
    const location = useLocation();
  //검색어
  const [keyword, setKeyword] = useState("");
  //인기순(추천)
  const [popularPopups, setPopularPopups] = useState([]);
  //조회수
  const [viewedPopups, setViewedPopups] = useState([]);
  // FullMap 섹션 ref
  const mapSectionRef = useRef(null);

  useEffect(() => {
    const fetchPopuplarAndViewed = async () => {
      try {
        const [recommendResult, viewResult] = await Promise.all([
          //인기
          getList({
            status: "ACTIVE",
            sort: "RECOMMEND",
            pageRequestDTO: { page: 1, size: 10 },
          }),
          //조회
          getList({
            status: "ACTIVE",
            sort: "VIEW",
            pageRequestDTO: { page: 1, size: 10 },
          }),
        ]);

        console.log("추천 결과:", recommendResult);
        console.log("조회 결과:", viewResult);

        setPopularPopups(recommendResult.dtoList || []);
        setViewedPopups(viewResult.dtoList || []);
      } catch (error) {
        console.error("인기 팝업 불러오기 실패", error);
      }
    };
    fetchPopuplarAndViewed();
  }, []);

  const handleSearch = (keyword) => {
    if (!keyword || keyword.trim() === "") {
      navigate("/search");
    } else {
      navigate(`/search?keyword=${encodeURIComponent(keyword.trim())}`);
    }
  };

  // URL 쿼리 파라미터로 스크롤 처리
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("scroll") === "fullmap") {
      mapSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  return (
    <BasicLayout>
      {/* 캐러셀 */}
      <Carousel />

      {/* 검색창 */}
      <div className="flex justify-center m-">
        <SearchBar
          className="w-full max-w-5xl h-[40px] flex-wrap items-center"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onSearch={handleSearch}
        />
      </div>

      <div className="flex flex-col items-center w-full">
        {/* 인기순 */}
        <div className="w-full mx-auto mt-5 ml-5">
          <div className="flex flex-col justify-start text-2xl font-bold">
            <div className="flex items-center gap-3 mb-2">
              <FaHeart className="ml-5" size={30} color="FFB6B9" />
              {`${new Date().getMonth() +1}월 인기 팝업`}
            </div>
          {/* 밑줄 */}
          <hr className="w-full border-t-2 border-black ml-2"></hr>
          </div>
          {/* 팝업리스트 */}
          <CustomSwiper>
            {popularPopups.map((item, index) => (
              <SwiperSlide style={{ width: "200px" }} key={item.id}>
                <PopuplarPopupComponent
                  item={item}
                  index={index}
                  type={"recommend"}
                />
              </SwiperSlide>
            ))}
          </CustomSwiper>
        </div>

        {/* 조회순 */}
        <div className="w-full mx-auto mt-5 ml-5">
          <div className="flex flex-col justify-start mb-2 text-2xl font-bold">
            <h2 className="flex items-center gap-3">              
              <PiEyesFill className="ml-5" size={30} />
              조회수 많은 팝업
            </h2>
          </div>
          {/*  */}
          <hr className="w-full border-t-2 border-black ml-2"></hr>
          {/* 팝업리스트 */}
          <CustomSwiper>
            {viewedPopups.map((item, index) => (
              <SwiperSlide style={{ width: "200px" }} key={item.id}>
                <PopularPopupComponent
                  item={item}
                  index={index}
                  type={"view"}
                />
              </SwiperSlide>
            ))}
          </CustomSwiper>
        </div>

        {/* 메인 지도 */}
        {/* 아이콘+부제목+라인 */}
        <div className="mt-5 ml-5 mr-5 w-full flex flex-col justify-start px-4" ref={mapSectionRef}>
          {/* 아이콘+부제목 */}
          <div className="flex items-center font-semibold text-2xl">
            <FiMapPin className="text-3xl ml-3 gap-3" />
            전체 팝업 지도
          </div>
          {/* 라인 */}
          <div className="w-full border-t-2 border-black mt-3"></div>
        </div>

        {/* 지도 컨테이너 */}
        <div className="m-5 w-full max-w-7xl px-4">
          <div className="border border-hashTagColor rounded-xl overflow-hidden shadow-sm w-full aspect-[16/9]">
            <FullMap />
          </div>
        </div>
      </div>
    </BasicLayout>
  );
};
export default MainPage;