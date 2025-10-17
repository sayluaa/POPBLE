package com.popble.controller;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping; // POST 추가
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.popble.domain.MapApi;
import com.popble.dto.MapApiRequest;
import com.popble.service.MapApiService;


@RestController
@RequestMapping("/api/popups")
@CrossOrigin(origins = "http://localhost:3000") 
public class MapController {
	
	private final MapApiService mapApiService;
	
	public MapController(MapApiService mapApiService) {
		this.mapApiService = mapApiService;
	}
	
	// 전체 팝업 좌표 데이터 조회 (React 클러스터 지도용)
		@GetMapping
		public List<MapApi> getAllPopups() {
			return mapApiService.findAllMapData();
		}

    // 전체 popup_store 주소 → map_api 저장
    @PostMapping("/import")
    public String importPopupStores() {
        mapApiService.importPopupStoreAddresses();
        return "팝업스토어 주소가 map_api에 저장되었습니다.";
    }
	
}