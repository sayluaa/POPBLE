package com.popble.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
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
public class ReservationDTO {
	
	
	private Long id;
	
	private Long popupStoreId;
	
	private Long userProfileId;
	
	//Users.name
	private String userName;
	
	private LocalDateTime createDateTime;
	
//	private String reservationTime;
	
	private String phonenumber;
	
	private int reservationCount;
	
	@JsonFormat(pattern = "yyyy-MM-dd")
	private LocalDate reservationDate;
	
	@JsonFormat(pattern = "HH:mm:ss")
	private LocalTime startTime;

	@JsonFormat(pattern = "HH:mm:ss")
	private LocalTime endTime;
	
	
	

}
