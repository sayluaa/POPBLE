package com.popble.domain;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "popup_recommend")
@NoArgsConstructor
public class PopupRecommend {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "popup_recommend_id")
	private Long id;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false)
	private UserProfile userProfile;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "popup_id", nullable = false)
	private PopupStore popupStore;
	
	@Column(name = "create_time", nullable = false)
	private LocalDateTime createTime;
}
