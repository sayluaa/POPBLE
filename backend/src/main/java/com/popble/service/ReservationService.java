package com.popble.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import com.popble.domain.ReservationTime;
import com.popble.dto.ReservationDTO;
import com.popble.dto.ReservationReactDTO;

public interface ReservationService {
	
	
	//예약등록
	Long register(ReservationDTO reservationDTO);
	
	//예약 조회
	ReservationDTO get(Long id);
	
	//특정 팝업스토어 예약 목록 조회
	List<ReservationDTO>getByPopupStore(Long popupStoreId);
	
	//예약 취소
	void cancel(Long id);
	
	//유저프로필로 예약 목록 조회
	List<ReservationReactDTO> getByUserProfile(Long userProfileId);
	
	//특정 날짜,시간의 예약 내역을 조회 -> 실시간 예약가능여부 확인 가능함
	List<ReservationDTO> getByPopupStoreAndDateTime(Long popupStoreId, LocalDate date, LocalTime startTime);
	
	int getRemainingSeats(Long popupStoreId, LocalDate date, LocalTime startTime, LocalTime endTime);
	
}
