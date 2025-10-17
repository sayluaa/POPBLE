package com.popble.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.popble.domain.PopupStore;
import com.popble.domain.Reservation;
import com.popble.domain.ReservationTime;
import com.popble.domain.UserProfile;
import com.popble.domain.Users;
import com.popble.dto.ReservationDTO;
import com.popble.dto.ReservationReactDTO;
import com.popble.repository.PopupStoreRepository;
import com.popble.repository.ReservationRepository;
import com.popble.repository.ReservationTimeRepository;
import com.popble.repository.UserProfileRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@RequiredArgsConstructor
@Transactional
@Log4j2
public class ReservationServiceImpl implements ReservationService{

    private final UserProfileRepository userProfileRepository;

    private final PopupStoreRepository popupStoreRepository;
	
	private final ReservationRepository reservationRepository;
	
	private final ReservationTimeRepository reservationTimeRepository;
	

  
	//예약 등록
	@Override
    public Long register(ReservationDTO dto) {
		
        Reservation reservation = dtoToEntity(dto);
        ReservationTime rTime = reservation.getReservationTime();
        
        //예약후 해당 예약시간의 인원수 업데이트용
        if(rTime != null) {
        	if(rTime.getCurrentCount() + reservation.getReservationCount() > rTime.getMaxCount()) {
        	throw new IllegalArgumentException("예약 가능 인원 초과 메세지");
        }
        	rTime.setCurrentCount(rTime.getCurrentCount()+reservation.getReservationCount());
        	reservationTimeRepository.save(rTime);
        }
        reservationRepository.save(reservation);
        return reservation.getId();
    }
	
	
	//예약 한건 조회
    @Override
    public ReservationDTO get(Long id) {
        return reservationRepository.findById(id)
                .map(this::entityToDto)
                .orElse(null);
    }
    
    //유저프로필 예약 목록
    @Override
    public List<ReservationReactDTO> getByUserProfile(Long userProfileId){
        return reservationRepository.findByUserProfileId(userProfileId)
                .stream()
                .map(this::entityToReactDto)
                .collect(Collectors.toList());
    }
    
    //reservation 엔티티 -> reservatinReactDTO로 변환해주기
    private ReservationReactDTO entityToReactDto(Reservation entity) {
        
    	ReservationTime rTime = entity.getReservationTime();
        PopupStore popupStore = entity.getPopupStore();
        UserProfile userProfile = entity.getUserProfile();
        Users users = (userProfile != null) ? userProfile.getUsers() : null;
        
        return ReservationReactDTO.builder()
                .reservationId(entity.getId())
                .popupStoreId(popupStore != null ? popupStore.getId() : null)
                .popupStoreName(popupStore != null ? popupStore.getStoreName() : "팝업스토어 정보 없음")
                .userProfileId(userProfile != null ? userProfile.getId() : null)
                .userName(users != null ? users.getName() : "이름 정보 없음")
                .reservationDate(rTime != null ? rTime.getDate() : null)
                .startTime(rTime != null ? rTime.getStartTime() : null)
                .endTime(rTime != null ? rTime.getEndTime() : null)
                
                .reservationCount(entity.getReservationCount())
                .maxCount(rTime != null ? rTime.getMaxCount() : 0)
                .price(popupStore != null ? popupStore.getPrice() : 0)
                .description(popupStore != null ? popupStore.getDesc() : "설명 정보 없음")
                .build();
    }
    
    
    //특정팝업스토어 예약 목록   ->?
    @Override
    public List<ReservationDTO> getByPopupStore(Long popupStoreId) {
    	return reservationRepository.findByPopupStoreId(popupStoreId)
    			.stream()
                .map(this::entityToDto)
                .collect(Collectors.toList());
    }
    
    //예약취소
    @Override
    public void cancel(Long id) {
        Reservation reservation = reservationRepository.findById(id)
        		.orElseThrow(() -> new IllegalArgumentException("Invalid reservationId"));
        
        
        //예약하면 인원수 차감되게
        ReservationTime rTime = reservation.getReservationTime();
        if(rTime != null) {
        	rTime.setCurrentCount(Math.max(0, rTime.getCurrentCount() - reservation.getReservationCount()));
        	reservationTimeRepository.save(rTime);
        }
        
        reservationRepository.deleteById(id);
    }
    
    
    //잔여인원조회 -> 실시간예약 연결?
    @Override
    public int getRemainingSeats(Long popupStoreId, LocalDate date, LocalTime startTime, LocalTime endTime) {
    	log.info("조회할 팝업스토어 ID :" + popupStoreId);
    	log.info("조회할 날짜 : " + date);
    	log.info("조회할 시작 시간 : "+ startTime);
    	log.info("조회할 종료 시간 : "+ endTime);
    	ReservationTime rTime = reservationTimeRepository
    			.findByPopupStoreIdAndDateAndStartTimeAndEndTime(popupStoreId, date, startTime, endTime)
    			.orElseThrow(() -> new IllegalArgumentException("예약가능시간대없음메세지"));
    	
    	return rTime.getMaxCount() - rTime.getCurrentCount();
    }

    
    
    
    private Reservation dtoToEntity(ReservationDTO dto) {
    	
    	PopupStore popupStore = popupStoreRepository.findById(dto.getPopupStoreId())
    	        .orElseThrow(() -> new IllegalArgumentException("Invalid popupStoreId"));

    	    UserProfile userProfile = userProfileRepository.findById(dto.getUserProfileId())
    	        .orElseThrow(() -> new IllegalArgumentException("Invalid userProfileId"));
    	    

    	    ReservationTime reservationTime = null;
    	    if(dto.getReservationDate() != null && dto.getStartTime() != null && dto.getEndTime() != null) {
    	    	
    	    	reservationTime = reservationTimeRepository.findByPopupStoreIdAndDateAndStartTimeAndEndTime(
    	    			dto.getPopupStoreId(),
    	    			dto.getReservationDate(),
    	    			dto.getStartTime(),
    	    			dto.getEndTime())
    	    			.orElseThrow(() ->  new IllegalArgumentException("Invalid reservationTime"));
    	    }
    	    
        return Reservation.builder()
        		.id(dto.getId())
        		.popupStore(popupStore)
        		.userProfile(userProfile)
        		.reservationTime(reservationTime)
        		.reservationCount(dto.getReservationCount())
                .createDateTime(dto.getCreateDateTime() != null? dto.getCreateDateTime():LocalDateTime.now())
                .phonenumber(dto.getPhonenumber())
                .build();
    }

    
    
    
    private ReservationDTO entityToDto(Reservation entity) {
    	
    	PopupStore popupStore = entity.getPopupStore();
    	
    	ReservationTime rTime = entity.getReservationTime();
    	
    	UserProfile userProfile = entity.getUserProfile();
    	
        return ReservationDTO.builder()
        		.id(entity.getId())
                .popupStoreId(popupStore != null ? popupStore.getId() : null)
                .userProfileId(userProfile != null ? userProfile.getId() : null)
                .userName(userProfile != null && userProfile.getUsers() != null ?
                    userProfile.getUsers().getName() : null)
                .reservationCount(entity.getReservationCount())
                .createDateTime(entity.getCreateDateTime() != null ? entity.getCreateDateTime() : LocalDateTime.now())
                .phonenumber(entity.getPhonenumber())
                .reservationDate(rTime != null ? rTime.getDate() : null)
                .startTime(rTime != null ? rTime.getStartTime() : null)
                .endTime(rTime != null ? rTime.getEndTime() : null)
                .build();
    }
    
    
    //예약 가능 잔여 인원수 체크용
    public List<ReservationDTO> getByPopupStoreAndDateTime(Long popupStoreId, LocalDate date, LocalTime startTime){
    	return reservationRepository.findByPopupStore_IdAndReservationTime_DateAndReservationTime_StartTime(popupStoreId, date, startTime)
    			.stream()
    			.map(this::entityToDto)
    			.collect(Collectors.toList());
    	
    }
    
 
}
