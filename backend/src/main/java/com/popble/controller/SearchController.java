package com.popble.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.popble.domain.Category;
import com.popble.domain.PopupStore;
import com.popble.domain.SortType;
import com.popble.dto.PageRequestDTO;
import com.popble.dto.PageResponseDTO;
import com.popble.dto.PopupFilterDTO;
import com.popble.dto.PopupStoreDTO;
import com.popble.service.PopupStoreService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/search")
public class SearchController {

	private final PopupStoreService popupStoreService;

	@GetMapping("")
	public PageResponseDTO<PopupStoreDTO> getList(
			@RequestParam(required = false, name = "status") PopupStore.Status status,
			@RequestParam(required = false, name = "sort") SortType sort,
			@RequestParam(required = false, name = "categoryType") Category.CategoryType categoryType,
			@RequestParam(required = false, name = "categoryId") Integer categoryId,
			@RequestParam(required = false, name = "keyword") String keyword,
			@RequestParam(defaultValue = "1", name = "page") int page,
			@RequestParam(defaultValue = "10", name = "size") int size) {

		PageRequestDTO pageRequestDTO = PageRequestDTO.builder().page(page).size(size).build();

		PopupFilterDTO popupFilterDTO = PopupFilterDTO.builder().status(status).sort(sort).categoryType(categoryType)
				.categoryId(categoryId).keyword(keyword).pageRequestDTO(pageRequestDTO).build();
		log.info("--------------------------------------------------------------");
		log.info("status={}, sort={}, categoryType={}, categoryId={}, keyword = {}", status, sort, categoryType,
				categoryId, keyword);
		return popupStoreService.getFilteredList(popupFilterDTO);
	}
}