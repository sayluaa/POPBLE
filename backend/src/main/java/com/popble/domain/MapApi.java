package com.popble.domain;

import com.fasterxml.jackson.annotation.JsonProperty;

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

/* 팝업스토어 위치 및 부가 정보를 저장하는 엔티티 클래스 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "map_api")
public class MapApi {
	
	//지도 고유 id
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "map_api_id")
	private Long id;
	
	//팝업 id
	@ManyToOne
	@JoinColumn(name = "popup_id")
	private PopupStore popupStore;
	
	//위도
	@Column(nullable = false)
	@JsonProperty("lat")	//리액트에서 쓰는 코드
    private double latitude;
	
	//경도
	@Column(nullable = false)
	@JsonProperty("lng")	//리액트에서 쓰는 코드
    private double longitude;
	
	//주소
	@Column(length = 255)
    private String address;
	
    //팝업 위치
	@Column(name = "pop_location", length = 255)
	private String popLocation;
	
	//주차
	@Column(name = "parking", length = 100)
	private String parking;
	
	//숙박
	@Column(name = "accomodation", length = 100)
	private String accomodation;
}
