package com.popble.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.popble.domain.PopupStore;
import com.popble.domain.ReservationTime;
import com.popble.dto.ReservationReactDTO;
import com.popble.repository.ReservationRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@RequiredArgsConstructor

public class ReservationReactServiceImpl implements ReservationReactService {

    private final ReservationRepository reservationRepository;

    @Override
    public Optional<ReservationReactDTO> getReservationReactDTO(Long reservationId) {
        return reservationRepository.findById(reservationId)
            .map(reservation -> {
                PopupStore popupStore = reservation.getPopupStore(); 
                ReservationTime resTime = reservation.getReservationTime();

                return ReservationReactDTO.builder()
                        .reservationId(reservation.getId())
                        .popupStoreId(popupStore != null ? popupStore.getId() : null)
                        .popupStoreName(popupStore != null ? popupStore.getStoreName() : "")
                        .reservationDate(reservation.getReservationDate())
                        .startTime(resTime != null ? resTime.getStartTime() : null)
                        .endTime(resTime != null ? resTime.getEndTime() : null)
                        .reservationCount(reservation.getReservationCount())
                        .price(popupStore != null ? popupStore.getPrice() : 0)
                        .build();
            });
    }
}