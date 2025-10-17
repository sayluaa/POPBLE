package com.popble.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.popble.dto.BookmarkDTO;
import com.popble.dto.PopupStoreDTO;
import com.popble.dto.UserDTO;
import com.popble.service.BookmarkService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/bookmark")
public class BookmarkController {

	private final BookmarkService bookmarkService;

	// 북마크 추가
	@PostMapping("/{popupId}")
	public boolean addBookmark(@AuthenticationPrincipal UserDTO userDTO, @PathVariable("popupId") Long popupId) {
		Long userId = userDTO.getId();

		log.info("북마크 추가 요청 userId ={}, popupId = {}", userId, popupId);
		
		return bookmarkService.addBookmark(userId, popupId);
	}

	// 북마크 삭제
	@DeleteMapping("/{popupId}")
	public boolean deleteBookmark(@AuthenticationPrincipal UserDTO userDTO, @PathVariable("popupId") Long popupId) {
		Long userId = userDTO.getId();
		log.info("북마크 삭제 요청 userId = {}, popupId = {}", userId, popupId);
		return bookmarkService.deleteBookmark(userId, popupId);
	}

	// 북마크 여부 확인
	@GetMapping("/check/{popupId}")
	public boolean isBookmark(@AuthenticationPrincipal UserDTO userDTO, @PathVariable("popupId") Long popupId){
		Long userId = userDTO.getId();
		
		log.info("북마크 여부 확인 요청 userId={}, popupId ={}",userId, popupId);
		return bookmarkService.isBookmark(userId, popupId);
	}
	
	@GetMapping("/list")
	public Page<BookmarkDTO> getBookmarkList(@AuthenticationPrincipal UserDTO userDTO, Pageable pageable){
		Long userId = userDTO.getId();
		
		log.info("북마크 리스트 요청 userId ={},popupId={}", userId);
		return bookmarkService.bookmarkList(userId, pageable);
	}

}
