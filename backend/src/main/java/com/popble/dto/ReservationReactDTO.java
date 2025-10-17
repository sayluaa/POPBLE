package com.popble.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor

//마이페이지에서 쓰기 좋은 DTO 만들어봤습니다
//리액트에서만 사용하는 DTO라고 생각해주세요
//왜냐하면 마이페이지에서는 유저프로필, 팝업스토어정보(주소,이름 등), 예약이 모두 담겨야해서요
//3개의 DTO연결이 어려워서 만들어 봤습니다요

public class ReservationReactDTO {

    private Long reservationId;      // 예약 고유 ID
    private Long popupStoreId;       // 팝업스토어 ID
    private String popupStoreName;   // 팝업스토어 이름
    private Long userProfileId;      // 유저 프로필 ID
    private String userName;         // 유저 이름

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate reservationDate;  // 예약일자

    @JsonFormat(pattern = "HH:mm:ss")
    private LocalTime startTime;        // 시작 시간

    @JsonFormat(pattern = "HH:mm:ss")
    private LocalTime endTime;          // 종료 시간

    private int reservationCount;       // 예약 인원수
    private int maxCount;               // 최대 인원수
    private int price;                  // 가격 (프론트에서 계산용)
    
    private String description;         // 설명
}