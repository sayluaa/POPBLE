package com.popble.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.popble.domain.Category;
import com.popble.domain.Category.CategoryType;
import com.popble.domain.PopupStore;
import com.popble.dto.CategoryDTO;
import com.popble.repository.CategoryRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("api/filter")
@RequiredArgsConstructor
public class CategoryController {

	private final CategoryRepository categoryRepository;
	
	@GetMapping("/category")
	public List<CategoryDTO> getCategories(@RequestParam(name = "type", required = false) CategoryType type){
		List<Category> categories;
		if(type ==null) {
			categories = categoryRepository.findAll();
		}else {
			categories = categoryRepository.findByType(type);
		}
		return categories.stream()
				.map(cate->new CategoryDTO(cate.getId(), cate.getName())).collect(Collectors.toList());
	
	}
	
	@GetMapping("/status")
	public List<Map<String,String>> getStatus(){
		return List.of(PopupStore.Status.values()).stream()
				.map(status -> Map.of(
						"key", status.name(),
						"label", switch(status) {
						case SCHEDULED -> "예정";
						case ACTIVE -> "진행";
						case ENDED -> "종료";
						case ALL -> "전체";
						}
						))
				.toList();
	}
}
