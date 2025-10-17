package com.popble.service;

import java.time.LocalDate;
import java.util.List;

import com.popble.dto.ReservationTimeDTO;

public interface ReservationTimeService {
	
	Long createReservationTime(ReservationTimeDTO reservationTimeDTO);
	
	List<ReservationTimeDTO> getAvailableTimesByDate(Long popupStoreId, LocalDate date);
	
	List<ReservationTimeDTO>getAllTimes(Long popupStoreId);
	
    // ✅ 여러 개의 예약 시간 슬롯 한 번에 등록
    void createReservationTimes(List<ReservationTimeDTO> dtoList);

}
