package com.popble.service;

import java.util.Optional;

import com.popble.dto.ReservationReactDTO;

public interface ReservationReactService {

	Optional<ReservationReactDTO> getReservationReactDTO(Long reservationId);
}
