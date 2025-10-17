import axios from "axios";
import jwtAxios from "../utill/jwtUtill";
import { API_SERVER_HOST } from "./config";

const reservationTimeHost = `${API_SERVER_HOST}/api/reservationTime`;

//팝업스토어 예약 등록
export const postReservation = async ({
  popupStoreId,
  userProfileId,
  count,
  date,
  time,
}) => {
  const payload = {
    popupStoreId,
    userProfileId,
    userName: "",
    reservationCount: count,
    reservationDate: date,
    startTime: time,
    endTime: time,
  };

  const res = await jwtAxios.post(
    `${API_SERVER_HOST}/api/reservation`,
    payload,
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  return res.data;
};

//팝업스토어 예약내역조회
export const getReservation = async (id) => {
  const res = await jwtAxios.get(`${API_SERVER_HOST}/api/reservation/${id}`);
  return res.data;
};

//팝업스토어 기준 예약내역 조회
export const getReservationByPopupStore = async (popupStoreId) => {
  const res = await jwtAxios.get(
    `${API_SERVER_HOST}/api/reservation/popupStore/${popupStoreId}`
  );
  return res.data;
};

//잔여인원조회
export const getRemaining = async (popupStoreId, date, startTime, endTime) => {
  const res = await jwtAxios.get(
    `${API_SERVER_HOST}/api/reservation/remaining`,
    {
      params: {
        popupStoreId,
        date,
        startTime,
        endTime,
      },
    }
  );
  return res.data;
};

//팝업스토어 해당 날짜 예약 가능 시간 조회
export const getAvailableReservationDates = async (popupStoreId, date) => {
  const res = await jwtAxios.get(
    `${API_SERVER_HOST}/api/popup/${popupStoreId}/availableDate/${date}`
  );
  return res.data;
};

// 예약 삭제
export const cancelReservation = async (id) => {
  const res = await jwtAxios.delete(`${API_SERVER_HOST}/api/reservation/${id}`);
  return res.data;
};

//예약 시간 슬롯 등록하기
export const registerTimeSlots = async (dtoList) => {
  const res = await jwtAxios.post(
    `${API_SERVER_HOST}/api/reservationTime/register`,
    dtoList,
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  return res.data;
};

//팝업스토어 id와 날짜로 예약 가능 시간 조회
export const getAvailableTimesByDate = async (popupStoreId, date) => {
  const res = await jwtAxios.get(
    `${API_SERVER_HOST}/api/reservationTime/popup/${popupStoreId}/date/${date}`
  );
  return res.data;
};

//팝업스토어 모든 타임 가져오기(첫,마지막타임 정보 확인용->상세보기)
export const getAllTimes = async (popupStoreId) => {
  const res = await axios.get(
    `${reservationTimeHost}/popup/${popupStoreId}/allTimes`
  );
  return res.data;
};
