package com.popble.dto;



import java.time.LocalDate;
import java.time.LocalTime;



import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReservationTimeDTO {
	private Long id;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private int maxCount; 
    private int remainingSeats;
    private Long popupStoreId;
}