import { useEffect, useState } from "react";
import { getBookmarkList, isBookmark } from "../../../api/bookmarkApi";
import PopupCard from "../../search/PopupCard";
import { FaBookmark } from "react-icons/fa";
import { useSelector } from "react-redux";
import customSwiper from "../../common/CustomSwiper";
import CustomSwiper from "../../common/CustomSwiper";
import { SwiperSlide } from "swiper/react";

const MyPageBookmark = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [scheduled, setScheduled] = useState([]);
  const [active, setActive] = useState([]);
  const [ended, setEnded] = useState([]);

  const userId = useSelector((state) => state.auth?.user?.id);

  useEffect(() => {
    console.log("userId in MyPageBookmark:", userId);
    const fetchBookmarks = async () => {
      try {
        const data = await getBookmarkList();
        const bookmarkItems = Array.isArray(data) ? data : data.content || [];
        //북마크 확인
        console.log("북마크 리스트", bookmarkItems);
        setScheduled(
          bookmarkItems.filter((item) => item.status === "SCHEDULED")
        );
        setActive(bookmarkItems.filter((item) => item.status === "ACTIVE"));
        setEnded(bookmarkItems.filter((item) => item.status === "ENDED"));
        setBookmarks(bookmarkItems);
      } catch (e) {
        console.error(
          "북마크 불러오기 실패",
          e.response?.status,
          e.response?.data || e.message
        );
      }
    };
    fetchBookmarks();
  }, [userId]);

  return (
    <div className="flex flex-col justify-center w-full">
      {/* 진행중 */}
      <div className="m-1">
        <button className="mt-2 w-full flex items-center text-2xl gap-2">
          <FaBookmark size={25} className="ml-5" color="#FFB6B9"></FaBookmark>
          진행중
        </button>
        <hr className="min-w-[300px] border border-black border-l-2 m-2"></hr>
        <CustomSwiper>
          {active.length > 0 ? (
            active.map((item) => (
              <SwiperSlide style={{ width: "400px" }} key={item.popupId}>
                <PopupCard item={{ ...item, isBookmark: true }}></PopupCard>
              </SwiperSlide>
            ))
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-2xl font-semibold">
                북마크한 팝업이 없습니다.
              </p>
            </div>
          )}
        </CustomSwiper>
      </div>
      {/* 예정 카드 시작 */}
      <div className="m-1">
        <p className="mt-2 w-full flex items-center text-2xl gap-2">
          <FaBookmark size={25} className="ml-5" color="#FFD6A5"></FaBookmark>
          예정
        </p>
        <hr className="min-w-[300px] border border-black border-l-2 m-2"></hr>
        <CustomSwiper>
          {scheduled.length > 0 ? (
            scheduled.map((item) => (
              <SwiperSlide style={{ width: "400px" }} key={item.popupId}>
                <PopupCard item={{ ...item, isBookmark: true }}></PopupCard>
              </SwiperSlide>
            ))
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-2xl font-semibold">
                북마크한 팝업이 없습니다.
              </p>
            </div>
          )}
        </CustomSwiper>
      </div>
      
      {/* 종료 */}
      <div className="m-1">
        <button className="mt-2 w-full flex items-center text-2xl gap-2">
          <FaBookmark size={25} className="ml-5" color="#757575"></FaBookmark>
          종료
        </button>
        <hr className="min-w-[300px] border border-black border-l-2 m-2"></hr>
        <CustomSwiper>
          {ended.length > 0 ? (
            ended.map((item) => (
              <SwiperSlide style={{ width: "400px" }} key={item.popupId}>
                <PopupCard item={{ ...item, isBookmark: true }}></PopupCard>
              </SwiperSlide>
            ))
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-2xl font-semibold">
                북마크한 팝업이 없습니다.
              </p>
            </div>
          )}
        </CustomSwiper>
      </div>
    </div>
  );
};

export default MyPageBookmark;
