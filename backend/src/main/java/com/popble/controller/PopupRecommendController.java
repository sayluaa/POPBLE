package com.popble.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.popble.dto.UserDTO;
import com.popble.service.PopupRecommendService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/popup")
@RequiredArgsConstructor
public class PopupRecommendController {

	private final PopupRecommendService popupRecommendService;

	// 추천 추가
	@PostMapping("/{popupId}/recommend")
	public ResponseEntity<Void> recommend(@AuthenticationPrincipal UserDTO userDTO,
			@PathVariable(name = "popupId") Long popupId) {
		Long userId = userDTO.getId();
		popupRecommendService.recommend(userId, popupId);
		return ResponseEntity.ok().build();
	}

	// 추천 취소
	@DeleteMapping("/{popupId}/recommend")
	public ResponseEntity<Void> cancelRecommend(@AuthenticationPrincipal UserDTO userDTO,
			@PathVariable(name = "popupId") Long popupId) {
		Long userId = userDTO.getId();
		popupRecommendService.cancelRecommend(userId, popupId);
		return ResponseEntity.ok().build();
	}

	// 추천 여부 확인
	@GetMapping("/{popupId}/recommend")
	public ResponseEntity<Boolean> isRecommended(@AuthenticationPrincipal UserDTO userDTO,
			@PathVariable(name = "popupId") Long popupId) {
		Long userId = userDTO.getId();
		boolean result = popupRecommendService.isRecommended(userId, popupId);
		return ResponseEntity.ok(result);
	}
}
