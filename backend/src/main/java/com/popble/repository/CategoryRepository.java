package com.popble.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.popble.domain.Category;
import com.popble.domain.Category.CategoryType;

import java.util.List;


public interface CategoryRepository extends JpaRepository<Category, Long>{

	//카테고리 이름으로 카테고리 찾기
	Optional<Category> findByName(String name);
	//카테고리 타입으로 카테고리 찾기
	List<Category> findByType(Category.CategoryType type);
	
	
}
