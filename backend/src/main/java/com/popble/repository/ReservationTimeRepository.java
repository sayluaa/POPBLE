package com.popble.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.popble.domain.PopupStore;
import com.popble.domain.ReservationTime;

public interface ReservationTimeRepository extends JpaRepository<ReservationTime, Long>{
	
	
	//특정 팝업스토어의 모든 예약 시간 슬롯 조회
    List<ReservationTime> findAllByPopupStoreId(Long popupStoreId);
    
    //특정 팝업스토어의 특정 날짜에 대한 예약 시간 슬롯 조회 (시작 시간 오름차순 정렬)
    List<ReservationTime> findByPopupStoreIdAndDateOrderByStartTimeAsc(Long popupStoreId, LocalDate date);
   
    //특정 팝업스토어의 특정 날짜, 시작 시간, 종료 시간에 해당하는 예약 시간 슬롯 조회
    Optional<ReservationTime> findByPopupStoreIdAndDateAndStartTimeAndEndTime(Long popupStoreId, LocalDate date, LocalTime startTime, LocalTime endTime);
    
    //특정 팝업스토어의 특정 날짜에 주어진 시간대와 겹치는 슬롯 조회
    Optional<ReservationTime> findByPopupStoreIdAndDateAndStartTimeLessThanEqualAndEndTimeGreaterThanEqual(
            Long popupStoreId, LocalDate date, LocalTime searchStartTime, LocalTime searchEndTime);

}
