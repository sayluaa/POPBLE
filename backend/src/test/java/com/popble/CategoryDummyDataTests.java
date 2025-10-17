package com.popble;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.popble.domain.Category;
import com.popble.domain.Category.CategoryType;
import com.popble.repository.CategoryRepository;

@SpringBootTest
public class CategoryDummyDataTests {

	@Autowired
	CategoryRepository categoryRepository;
	
	@Test
	public void categoryDummy() {
		
		List<Category> categories = new ArrayList<>();
		
		//분류
		categories.add(new Category(1, "패션/뷰티", CategoryType.MAIN, new ArrayList<>()));
		
		categories.add(new Category(2, "식품/음료", CategoryType.MAIN, new ArrayList<>()));
		
		categories.add(new Category(3, "애니", CategoryType.MAIN, new ArrayList<>()));
		
		categories.add(new Category(4, "음악", CategoryType.MAIN, new ArrayList<>()));
		
		categories.add(new Category(5, "운동", CategoryType.MAIN, new ArrayList<>()));
		
		//지역
		categories.add(new Category(101, "강남", CategoryType.LOCALE, new ArrayList<>()));
		
		categories.add(new Category(102, "성수", CategoryType.LOCALE, new ArrayList<>()));

		categories.add(new Category(103, "홍대", CategoryType.LOCALE, new ArrayList<>()));
		
		categories.add(new Category(104, "잠실", CategoryType.LOCALE, new ArrayList<>()));
		
		categories.add(new Category(105, "여의도", CategoryType.LOCALE, new ArrayList<>()));
		
		//테마
		categories.add(new Category(201, "체험", CategoryType.THEME, new ArrayList<>()));
		
		categories.add(new Category(202, "한정판", CategoryType.THEME, new ArrayList<>()));
		
		categories.add(new Category(203, "콜라보레이션", CategoryType.THEME, new ArrayList<>()));
		
		categories.add(new Category(204, "이벤트/프로모션", CategoryType.THEME, new ArrayList<>()));
		
		categories = categoryRepository.saveAll(categories);
	
		
	}
}
