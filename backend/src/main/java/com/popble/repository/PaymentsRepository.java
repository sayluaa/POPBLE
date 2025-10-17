package com.popble.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.popble.domain.Payments;
import com.popble.domain.Reservation;

import java.util.List;


public interface PaymentsRepository extends JpaRepository<Payments, Long> {

	//예약 번호로
	List<Payments> findByReservation(Reservation reservation);
	
	//상태로
	List<Payments> findByStatus(Payments.Status status);
}

