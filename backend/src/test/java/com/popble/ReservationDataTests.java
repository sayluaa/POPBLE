package com.popble;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.popble.dto.PopupStoreDTO;
import com.popble.service.PopupStoreService;

import lombok.extern.log4j.Log4j2;

@SpringBootTest
@Log4j2
public class ReservationDataTests {
	
	@Autowired
	private PopupStoreService popupStoreService;
	
	@Test
	public void reservationTest() {
		
		Long id = 3L;
		
		PopupStoreDTO popupStoreDTO = popupStoreService.get(id);
		
		log.info(id + "번 팝업스토어 조회");
		
		log.info("결과DTO :"+  popupStoreDTO);
		
	}

}
