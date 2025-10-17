package com.popble.domain;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(
    name = "reservation_time",
    uniqueConstraints = @UniqueConstraint(columnNames = {"popup_id", "date", "start_time"})
)
public class ReservationTime {

    // 아이디
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reservation_time_id")
    private Long id;

    // 팝업스토어 연결
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "popup_id")
    private PopupStore popupStore;

    // 예약 가능 날짜
    private LocalDate date;

    // 행사 시작시간
    @Column(name = "start_time", columnDefinition = "TIME(0)")
    private LocalTime startTime;

    // 행사 종료시간
    @Column(name = "end_time", columnDefinition = "TIME(0)")
    private LocalTime endTime;

    // 한 타임당 예약 가능한 최대 인원
    private int maxCount;

    // 현재 예약된 인원수
    private int currentCount;

    // 예약 연결
    @JsonManagedReference("reservationTimeRef")
    @OneToMany(mappedBy = "reservationTime", cascade = CascadeType.ALL)
    private List<Reservation> reservations = new ArrayList<>();
}
