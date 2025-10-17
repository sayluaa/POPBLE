package com.popble.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.popble.domain.Category;
import com.popble.domain.PopupCategory;
import com.popble.domain.PopupStore;

import java.util.List;


public interface PopupCategoryRepository extends JpaRepository<PopupCategory, Long>{

	//특정 팝업스토어가 포함된 카테고리 리스트
	List<PopupCategory> findByCategory(Category category);
	
	//특정 카테고리에 속한 모든 팝업스토어
	List<PopupCategory> findByPopupStore(PopupStore popupStore);
}
