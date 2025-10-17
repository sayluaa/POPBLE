import React, { useState } from "react";

import { FaRegEye } from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";
import { MdOutlineWatchLater } from "react-icons/md";
import { LuTimerReset } from "react-icons/lu";
import { RiAlarmWarningLine } from "react-icons/ri";
import { BsStars } from "react-icons/bs";

import { FiInstagram } from "react-icons/fi";
import { MdOutlineEmail } from "react-icons/md";
import { FiPhone } from "react-icons/fi";

import Car from "../../../assets/img/icon_car.png";
import NoCar from "../../../assets/img/icon_car_no.png";
import Card from "../../../assets/img/icon_card_free.png";
import Paid from "../../../assets/img/icon_card_paid.png";

const formatTime = (timeString) => {
  if (!timeString) return "정보 없음";

  const timeOnly = timeString.substring(0, 5);

  const [hour, minute] = timeOnly.split(":");

  return `${parseInt(hour, 10)}시 ${parseInt(minute, 10)}분`;
};

const calculatePopupTimes = (timeSlots) => {
  let firstTime = "정보 없음";
  let lastTime = "정보 없음";

  if (!timeSlots || timeSlots.length === 0) {
    return { firstTime, lastTime };
  }

  const startTimes = timeSlots.map((slot) => slot.startTime).filter((t) => t);
  const endTimes = timeSlots.map((slot) => slot.endTime).filter((t) => t);

  if (startTimes.length === 0 || endTimes.length === 0) {
    return { firstTime, lastTime };
  }

  const firstStartTime = startTimes.reduce(
    (min, current) => (current < min ? current : min),
    startTimes[0]
  );
  const lastEndTime = endTimes.reduce(
    (max, current) => (current > max ? current : max),
    endTimes[0]
  );

  firstTime = formatTime(firstStartTime);
  lastTime = formatTime(lastEndTime);

  return { firstTime, lastTime };
};

const BasicInfo = ({ popupStore }) => {
  console.log("popup:", popupStore);
  // 카테고리 태그
  // const [text] = useState("애니 / 캐릭터");

  //팝업스토어정보데이터(desc)
  const store = popupStore || {};

  //주차가능여부 아이콘
  const parkingIcon = store.parking;

  //가격여부 아이콘
  const priceIcon = store.price === 0;

  const timeSlots = store.timeSlots || [];

  const { firstTime, lastTime } = calculatePopupTimes(timeSlots) || {
    firstTime: null,
    lastTime: null,
  };

  const getFormattedDesc = (desc) => {
    if (typeof desc !== "string" || !desc) return [];

    return desc.split("\\n");
  };

  const formattedDesc = getFormattedDesc(store.desc);

  return (
    <div>
      {/* 카테고리
            <div className="flex mb-4">
                <span className="inline-block px-3 py-1 rounded-3xl bg-subButtonColor shadow-md text-center text-sm">
                    {text}
                </span>
            </div> */}

      {/* 조회수 */}
      <div className="flex justify-end gap-1">
        <FaRegEye size={25} className="mr-2" />
        {popupStore.recommend || 0}
      </div>

      {/* 이름, 기간 */}
      <h2 className="text-3xl font-bold mb-2">{popupStore.storeName || ""}</h2>
      <h3 className="text-lg font-semibold mb-2">
        {popupStore.startDate || ""} ~ {popupStore.endDate || ""}
      </h3>

      {/* 위치, 시간, 러닝타임 */}
      <div className="mt-10 mb-4 text-lg flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <FiMapPin size={20} />
          <span>{popupStore.address || "주소 정보 없음"}</span>
        </div>
        <div className="flex items-start gap-2">
          <MdOutlineWatchLater className="mt-1.5" size={20} />
          <div className="flex flex-col gap-1">
            <span>첫 타임 : {firstTime || "첫 타임 데이터 없음"}</span>
            <span>마지막 타임 : {lastTime || "마지막 타임 데이터 없음"}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <LuTimerReset size={22} />
          <span>러닝타임 : 약 60 분</span>
        </div>
      </div>

      {/* 주차, 입장료 */}
      <div className="mt-5 mb-10 ml-6 text-sm flex items-center gap-20">
        <div className="flex flex-col items-center gap-2">
          {parkingIcon ? (
            <img src={Car} alt="주차 가능" style={{ width: 60, height: 60 }} />
          ) : (
            <img
              src={NoCar}
              alt="주차 불가"
              style={{ width: 60, height: 60 }}
            />
          )}
          <span>{parkingIcon ? "주차가능" : "주차불가"}</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          {priceIcon ? (
            <img
              src={Card}
              alt="입장료 유료"
              style={{ width: 60, height: 60 }}
            />
          ) : (
            <img
              src={Paid}
              alt="입장료 무료"
              style={{ width: 60, height: 60 }}
            />
          )}
          <span>{priceIcon ? "입장료 무료" : "입장료 유료"}</span>
        </div>
      </div>

      {/* 콘텐츠 */}
      <h3 className="flex items-center text-r font-semibold mt-5 mb-3 gap-2">
        <BsStars size={20}/>
        콘텐츠
      </h3>
      <p className="leading-2 mb-5">
        {formattedDesc.length > 0
          ? formattedDesc.map((line, index) => (
              <React.Fragment key={index}>
                {line}
                {index < formattedDesc.length - 1 && <br />}
              </React.Fragment>
            ))
          : "콘텐츠 정보가 없음"}
      </p>

      {/* 관람 유의사항 */}
      <h3 className="flex text-r font-semibold mt-10 mb-3 gap-2">
        <RiAlarmWarningLine size={20} />
        관람 유의사항
      </h3>

      <p className="leading-6 mb-10">
        • 외부 음식물 및 음료는 반입이 불가합니다.
        <br />
        • 쾌적한 관람 환경을 위해 개인 촬영 장비(ex.액션캠, DSLR, 삼각대,
        셀카봉), 대형 쇼핑백은 전시장 반입이 제한됩니다. 보관이 필요하신 경우
        IFC몰 내 물품 보관소를 이용해 주세요.
        <br />
        • 전시장 내 유모차 보관이 불가하오니, 유모차는 차량에 보관해 주시거나
        아기 띠를 이용해 주시기 바랍니다.
        <br />
        • 우천 시 장우산은 입구 데스크에 맡겨주세요. 단, 소지품 분실에 대한
        책임은 지지 않습니다.
        <br />
        • 현장 대기가 발생할 수 있으며 주말엔 웨이팅시간이 길 수 있으므로 이 점
        방문시 양해(고려) 부탁드립니다.
        <br />
      </p>
    </div>
  );
};
export default BasicInfo;