package com.popble.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// 팝업 스토어 카테고리 연결
@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "popup_category")
public class PopupCategory {

    // 아이디 추가
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "popup_category_id")
    private Long id;

    // 카테고리 번호
    @ManyToOne
    @JsonBackReference("categories") // 🔹 Category와 연결
    @JoinColumn(name = "category_id")
    private Category category;

    // 스토어 번호
    @ManyToOne
    @JsonBackReference("popupCategoryRef") // 🔹 PopupStore와 연결
    @JoinColumn(name = "popup_id")
    private PopupStore popupStore;
}
