package com.popble.domain;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "reservation")
public class Reservation {

    // 예약 고유 번호
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reservation_id")
    private Long id;

    // 팝업 번호
    @JsonBackReference("popupStoreRef")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "popup_id")
    private PopupStore popupStore;

    // 회원 번호
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userProfile_id")
    private UserProfile userProfile;

    // 예약번호 (예: 20250829001 형태의 난수 문자열)
    @Column(name = "reservation_number")
    private String reservationNumber;

    // 예약 날짜 (날짜만, 시간은 ReservationTime으로 분리)
    @Column(name = "reservation_date")
    private LocalDate reservationDate;

    // 예약 시간
    @JsonBackReference("reservationTimeRef")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reservation_time_id")
    private ReservationTime reservationTime;

    // 가격
    @Column(name = "price")
    private int price;

    // 인원수
    @Column(name = "reservation_count")
    private int reservationCount;

    // 예약 생성 시각
    private LocalDateTime createDateTime;

    // 예약자 전화번호
    private String phonenumber;
}
