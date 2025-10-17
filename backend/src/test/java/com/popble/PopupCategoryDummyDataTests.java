package com.popble;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.popble.domain.Category;
import com.popble.domain.PopupCategory;
import com.popble.domain.PopupStore;
import com.popble.repository.CategoryRepository;
import com.popble.repository.PopupCategoryRepository;
import com.popble.repository.PopupStoreRepository;

import jakarta.transaction.Transactional;


@SpringBootTest
public class PopupCategoryDummyDataTests {

	@Autowired
	CategoryRepository categoryRepository;
	
	@Autowired
	PopupCategoryRepository popupCategoryRepository;
	
	@Autowired
	PopupStoreRepository popupStoreRepository;
	
	@Test
	public void createPopupCategoryTests() {
		
		//팝업스토어 전체 불러오기
		List<PopupStore> popupStores = popupStoreRepository.findAll();
		PopupStore popupStore = popupStoreRepository.findById(1L).orElseThrow(() -> new RuntimeException("팝업없음"));
		Category cate1 = categoryRepository.findById(102L).orElseThrow(() -> new RuntimeException("102번 카테고리없음"));
		Category cate2 = categoryRepository.findById(204L).orElseThrow(() -> new RuntimeException("204번 카테고리없음"));
		
		
		//카테고리 전체 불러오기
		List<Category> categories = categoryRepository.findAll();
		
		List<PopupCategory> popupCategories = new ArrayList<>();
		
		PopupCategory pc = new PopupCategory();
		pc.setPopupStore(popupStore);
		pc.setCategory(cate1);
		popupCategories.add(pc);
		
		PopupCategory pc1 = new PopupCategory();
		pc1.setPopupStore(popupStore);
		pc1.setCategory(cate2);
		popupCategories.add(pc1);
		
		popupCategoryRepository.saveAll(popupCategories);
	}
}
