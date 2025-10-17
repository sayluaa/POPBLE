package com.popble.repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.popble.domain.Reservation;
import com.popble.domain.PopupStore;
import com.popble.domain.UserProfile;
import com.popble.domain.ReservationTime;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    // ===== HEAD 방식 =====
    // 특정 유저의 예약 내역 (엔티티 기반)
    List<Reservation> findByUserProfile(UserProfile userProfile);

    // 특정 팝업스토어의 예약 내역 (엔티티 기반)
    List<Reservation> findByPopupStore(PopupStore popupStore);

    // 예약 생성일 기준 조회
    List<Reservation> findByCreateDateTime(LocalDateTime createDateTime);

    // ===== main 방식 =====
    // 특정 유저의 모든 예약 내역 (ID 기반)
    List<Reservation> findByUserProfileId(Long userProfileId);

    // 특정 팝업스토어의 모든 예약 내역 (ID 기반)
    List<Reservation> findByPopupStoreId(Long popupStoreId);

    // 특정 예약 시간(ReservationTime)에 대한 모든 예약 조회
    List<Reservation> findByReservationTime(ReservationTime reservationTime);

    // 특정 팝업스토어의 특정 날짜에 대한 모든 예약 조회
    List<Reservation> findByPopupStoreIdAndReservationTime_Date(Long popupStoreId, LocalDate date);

    // 특정 팝업스토어의 특정 날짜, 특정 시작시간에 대한 모든 예약 조회 (예약 충돌 방지)
    List<Reservation> findByPopupStore_IdAndReservationTime_DateAndReservationTime_StartTime(Long popupStoreId, LocalDate date, LocalTime startTime);
}
