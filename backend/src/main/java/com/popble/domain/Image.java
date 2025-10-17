package com.popble.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "images")
public class Image {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(name = "popup_code",nullable = false)
	private String popupCode;
	
	//파일이름
	@Column(name = "file_name",nullable = false )
	private String fileName;
	
	@Column(name = "image_type_code",nullable = false)
	private int imageTypeCode;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "popup_id")
	private PopupStore popupStore;
	
}
