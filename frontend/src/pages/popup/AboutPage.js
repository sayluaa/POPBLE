import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import BasicInfo from "../../components/popup/detail/BasicInfo";
import DetailImages from "../../components/popup/detail/DetailImages";
import MapInfo from "../../components/popup/detail/MapInfo";
import ReserveInfo from "../../components/popup/detail/ReserveInfo";
import ReviewInfo from "../../components/popup/detail/ReviewInfo";
import { getOne } from "../../api/popupstoreApi";
import { getAllTimes } from "../../api/reservationApi";


import { IoShareSocialOutline } from "react-icons/io5";
import PopupRecommendComponent from "../../components/popup/recommend/PopupRecommendComponent";
import PopupBookmarkComponent from "../../components/popup/bookmark/PopupBookmarkComponent";
import LoadingComponent from "../../components/common/LoadingComponent";

const AboutPage = () => {
  const [activeTab, setActiveTab] = useState("basic");
  const [popupStore, setPopupStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const popupStoreId = id;

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const data = await getOne(popupStoreId);

        const timeSlotsData = await getAllTimes(popupStoreId);

        setPopupStore({
          ...data,
          timeSlots: timeSlotsData || [],
        });
      } catch (error) {
        console.error("데이터 불러오기 실패", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStoreData();
  }, [popupStoreId]);

  if (loading) {
    return <div><LoadingComponent/></div>;
  }

  if (!popupStore) {
    return <div>데이터가 없습니다</div>;
  }

  return (
    <div>
      {/* 이미지 삽입 및 여백 지정 */}
      <div className="flex justify-center mt-10">
        {/* 수정된 코드 */}
        {popupStore &&
          popupStore.uploadFileNames &&
          popupStore.uploadFileNames.length > 0 && (
            <img
              src={popupStore.uploadFileNames[0]}
              height="600px"
              width="600px"
              alt="팝업 스토어 이미지"
            />
          )}
      </div>

      {/* 아이콘 버튼 */}
      <div className="flex justify-end items-center mt-5 mr-8 gap-3">
        <PopupRecommendComponent popupId={popupStoreId} />
        <PopupBookmarkComponent popupId={popupStoreId} />
        <IoShareSocialOutline className="share" size={23} />
      </div>

      {/* 페이지 나눔 */}
      <div className="flex flex-nowrap mt-4">
        <button
          onClick={() => setActiveTab("basic")}
          className={`flex-1 min-w-[100px] rounded-t-xl px-10 py-3 ${
            activeTab === "basic"
              ? "bg-secondaryAccentColor text-black"
              : "bg-secondaryColor"
          }`}
        >
          기본정보
        </button>
        <button
          onClick={() => setActiveTab("image")}
          className={`flex-1 min-w-[100px] rounded-t-xl px-10 py-3 ${
            activeTab === "image"
              ? "bg-secondaryAccentColor text-black"
              : "bg-secondaryColor"
          }`}
        >
          상세이미지
        </button>
        <button
          onClick={() => setActiveTab("map")}
          className={`flex-1 min-w-[100px] rounded-t-xl px-10 py-3 ${
            activeTab === "map"
              ? "bg-secondaryAccentColor text-black"
              : "bg-secondaryColor"
          }`}
        >
          지도
        </button>
        <button
          onClick={() => setActiveTab("reserve")}
          className={`flex-1 min-w-[100px] rounded-t-xl px-10 py-3 ${
            activeTab === "reserve"
              ? "bg-secondaryAccentColor text-black"
              : "bg-secondaryColor"
          }`}
        >
          예약
        </button>
        <button
          onClick={() => setActiveTab("review")}
          className={`flex-1 min-w-[100px] rounded-t-xl px-10 py-3 ${
            activeTab === "review"
              ? "bg-secondaryAccentColor text-black"
              : "bg-secondaryColor"
          }`}
        >
          후기
        </button>
      </div>

      {/* 내용 영역 */}
      <div className="p-6">
        {activeTab === "basic" && <BasicInfo popupStore={popupStore} />}
        {activeTab === "image" && (
          <DetailImages uploadFileNames={popupStore.uploadFileNames} />
        )}
        {activeTab === "map" && <MapInfo popupStore={popupStore} />}
        {activeTab === "reserve" && <ReserveInfo popupStore={popupStore} />}
        {activeTab === "review" && <ReviewInfo popupStore={popupStore} />}
      </div>
    </div>
  );
};
export default AboutPage;
