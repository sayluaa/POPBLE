package com.popble.controller;

import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.popble.dto.ReservationReactDTO;
import com.popble.service.ReservationReactService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/popup/react-reservation")
@RequiredArgsConstructor
public class ReservationReactController {

    private final ReservationReactService reservationReactService;

    // 예약 ID로 React용 DTO 가져오기
    @GetMapping("/{reservationId}")
    public ResponseEntity<ReservationReactDTO> getReservationReact(
            @PathVariable("reservationId") Long reservationId) {

        Optional<ReservationReactDTO> reservationDTO = reservationReactService.getReservationReactDTO(reservationId);

        return reservationDTO
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
