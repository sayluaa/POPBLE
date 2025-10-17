package com.popble.controller;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.popble.dto.PopupStoreDTO;
import com.popble.dto.ReservationDTO;
import com.popble.service.PopupStoreService;
import com.popble.service.ReservationService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/reservation")
public class ReservationController {

    private final ReservationService reservationService;
    private final PopupStoreService popupStoreService;

    // ===== 기존 HEAD 코드: 팝업스토어 정보 조회 =====
    @GetMapping("/popup/{id}")
    public PopupStoreDTO getPopupInfo(@PathVariable("id") Long id) {
        return popupStoreService.get(id);
    }

    // ===== 예약 단건 조회 =====
    @GetMapping("/{id}")
    public ResponseEntity<ReservationDTO> getReservation(@PathVariable("id") Long id) {
        return ResponseEntity.ok(reservationService.get(id));
    }

    // ===== 예약 등록 =====
    @PostMapping("/register")
    public ResponseEntity<ReservationDTO> reservationRegister(@RequestBody ReservationDTO reservationDTO) {
        Long id = reservationService.register(reservationDTO);
        reservationDTO.setId(id);
        return ResponseEntity.ok(reservationDTO);
    }

    // ===== 팝업스토어별 예약 조회 =====
    @GetMapping("/popupStore/{popupStoreId}")
    public ResponseEntity<List<ReservationDTO>> getReservationByPopupStore(@PathVariable("popupStoreId") Long popupStoreId) {
        return ResponseEntity.ok(reservationService.getByPopupStore(popupStoreId));
    }

    // ===== 예약 취소 =====
    @DeleteMapping("/{id}")
    public ResponseEntity<String> cancelReservation(@PathVariable("id") Long id) {
        reservationService.cancel(id);
        return ResponseEntity.ok("예약이 성공적으로 취소되었습니다.");
    }

    // ===== 남은 좌석 수 조회 =====
    @GetMapping("/remaining")
    public ResponseEntity<Integer> getRemainingSeats(
            @RequestParam("popupStoreId") Long popupStoreId,
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam("startTime") @DateTimeFormat(pattern = "HH:mm") LocalTime startTime,
            @RequestParam("endTime") @DateTimeFormat(pattern = "HH:mm") LocalTime endTime) {

        int remainingSeats = reservationService.getRemainingSeats(popupStoreId, date, startTime, endTime);

        return ResponseEntity.ok(remainingSeats);
    }
}
