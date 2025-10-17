package com.popble.dto;

import com.popble.domain.Category;
import com.popble.domain.PopupStore;
import com.popble.domain.SortType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PopupFilterDTO {

	private PageRequestDTO pageRequestDTO;
	
	private PopupStore.Status status;
	
	private Category.CategoryType categoryType;
	
	private Integer categoryId;
	
	private SortType sort;

	private String keyword;
}
