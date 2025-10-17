package com.popble.service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.popble.domain.PopupStore;
import com.popble.domain.ReservationTime;
import com.popble.dto.ReservationTimeDTO;
import com.popble.repository.PopupStoreRepository;
import com.popble.repository.ReservationTimeRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ReservationTimeServiceImpl implements ReservationTimeService{
	
	
	private final ReservationTimeRepository reservationTimeRepository;
    private final PopupStoreRepository popupStoreRepository;

 // 여러 개의 시간 슬롯을 한 번에 등록하는 메서드
    @Override
    public void createReservationTimes(List<ReservationTimeDTO> dtoList) {
        dtoList.forEach(this::createReservationTime);
    }

    // 단일 시간 슬롯을 등록하는 메서드
    @Override
    public Long createReservationTime(ReservationTimeDTO dto) {
        PopupStore popupStore = popupStoreRepository.findById(dto.getPopupStoreId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid popupStoreId: " + dto.getPopupStoreId()));

        ReservationTime reservationTime = ReservationTime.builder()
                .popupStore(popupStore)
                .date(dto.getDate())
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .maxCount(dto.getMaxCount())
                .currentCount(0)
                .build();

        return reservationTimeRepository.save(reservationTime).getId();
    }
    
    // 특정 날짜의 예약 가능한 시간 슬롯 목록을 조회하는 메서드
    @Override
    public List<ReservationTimeDTO> getAvailableTimesByDate(Long popupStoreId, LocalDate date) {
        List<ReservationTime> times = reservationTimeRepository.findByPopupStoreIdAndDateOrderByStartTimeAsc(
            popupStoreId, date);
        
        return times.stream()
            .map(time -> ReservationTimeDTO.builder()
                .id(time.getId())
                .popupStoreId(popupStoreId)
                .date(time.getDate())
                .startTime(time.getStartTime())
                .endTime(time.getEndTime())
                .maxCount(time.getMaxCount())
                .remainingSeats(time.getMaxCount() - time.getCurrentCount())
                .build())
            .collect(Collectors.toList());
    }
    
    //팝업스토어의 첫타임,마지막타임 정보 조회(상세보기용)
    @Override
    public List<ReservationTimeDTO>getAllTimes(Long popupStoreId){
    	List<ReservationTime> result = reservationTimeRepository.findAllByPopupStoreId(popupStoreId);
    	return result.stream()
    			.map(this::entityToDTO)
    			.collect(Collectors.toList());
    	
    }
    
    private ReservationTimeDTO entityToDTO(ReservationTime entity) {
       
        return ReservationTimeDTO.builder()
                .id(entity.getId())
                .popupStoreId(entity.getPopupStore().getId())
                .startTime(entity.getStartTime())
                .endTime(entity.getEndTime())
                .build();
    }

}
