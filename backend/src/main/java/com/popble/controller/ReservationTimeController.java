package com.popble.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.popble.dto.ReservationTimeDTO;
import com.popble.service.ReservationTimeService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/reservationTime")
@Log4j2

public class ReservationTimeController {
   
   private final ReservationTimeService reservationTimeService;

    // 예약 시간 폼(슬롯) 등록
    @PostMapping("/register")
    public ResponseEntity<Long> registerTimeSlots(@RequestBody List<ReservationTimeDTO> dtoList) {
        try {
            for (ReservationTimeDTO dto : dtoList) {
                reservationTimeService.createReservationTime(dto);
            }
            return new ResponseEntity<>(1L, HttpStatus.CREATED);
        } catch (Exception e) {
            log.error("Failed to register time slots: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // 팝업스토어 ID와 날짜로 예약 시간 폼 조회
    @GetMapping("/popup/{popupStoreId}/date/{date}")
    public ResponseEntity<List<ReservationTimeDTO>> getAvailableTimes(
            @PathVariable("popupStoreId") Long popupStoreId,
            @PathVariable("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

       List<ReservationTimeDTO> dtoList = reservationTimeService.getAvailableTimesByDate(popupStoreId, date);
        return ResponseEntity.ok(dtoList);
    }
    
    
    //팝업스토어의 첫타임,마지막타임 정보 조회(상세보기용)
    @GetMapping("/popup/{popupStoreId}/allTimes")
    public ResponseEntity<List<ReservationTimeDTO>>getAllTimes(
          @PathVariable("popupStoreId")Long popupStoreId){
       List<ReservationTimeDTO> dtoList = reservationTimeService.getAllTimes(popupStoreId);
       return ResponseEntity.ok(dtoList);
    }

}
