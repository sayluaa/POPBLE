package com.popble.domain;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@Table(name = "popup_store")
public class PopupStore {
	
	//팝업스토어 상태(예정, 진행, 종료)
	public enum Status{
		SCHEDULED, ACTIVE, ENDED, ALL
	}
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "popup_id")
	//팝업 고유 번호
	private Long id;
	
	
	//팝업스토어 이름
	@Column(name = "store_name")
	private String storeName;
	
	//팝업스토어 상세정보
	@Column(name = "description", length = 1000)
	private String desc;
	
	//팝업스토어 주소
	@Column(name = "address")
	private String address;
	
	//시작일
	@Column(name = "start_date")
	private LocalDate startDate;
	
	//종료일
	@Column(name = "end_date")
	private LocalDate endDate;
	
	//가격
	@Column(name = "price")
	private int price;
	
	//팝업스토어 상태
	@Column(name = "status")
	@Enumerated(EnumType.STRING)
	private Status status;
	
	//조회수
	@Column(name = "view", nullable = false)
	private Integer view = 0 ;
	
	//추천수
	@Column(name = "recommend", nullable = false)
	private Integer recommend = 0;
	
    // ✅ 오픈/마감 시간
    @Column(name = "open_time")
    private LocalTime openTime;

    @Column(name = "close_time")
    private LocalTime closeTime;
	
	//예약시간 오전/오후 기업이 나눌수 있게
	
	@OneToMany(mappedBy = "popupStore", cascade = CascadeType.ALL, orphanRemoval = true)
	@Builder.Default
	private List<ReservationTime> reservationTimes = new ArrayList<>();
	
	//예약
	//미사용시 삭제할것(reservation에서 popupstore로 조회가능)
	@JsonManagedReference("popupStoreRef")
	@OneToMany(mappedBy = "popupStore")
	private List<Reservation> reservations = new ArrayList<>();
	
	//카카오맵 관련 위도,경도
	//위도
	@Column(name = "latitude")
	private Double latitude;
	
	//경도
	@Column(name = "longitude")
	private Double longitude;
	
	//소프트 삭제(1달? 3달 6달? 팝업 소프트삭제)
	@Column(name = "deleted", nullable = false)
	private boolean deleted = false;
	
	//카테고리연결
	@OneToMany(mappedBy = "popupStore", cascade = CascadeType.ALL, orphanRemoval = true)
	@JsonManagedReference("popupCategoryRef")
	private List<PopupCategory> categories = new ArrayList<>();
	
	//북마크수(0으로 기본값 세팅)
	@Column(name = "bookmark_count", nullable = false)
	private Integer bookmarkCount = 0 ;
	
	//UserProfile과 연결해야할지 말지 고민...
	//나중에 기업이 본인이 작성한거 확인 또는 삭제할수 있도록
	@ManyToOne
	@JoinColumn(name = "userProfile_id")
	private UserProfile owner;
		
	@Column(name="parking")
	private boolean parking; 


	   // ===== 이미지 (BoardImage 기준으로 통일) =====
    @OneToMany(mappedBy = "popupStore", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<BoardImage> imageList = new ArrayList<>();

    // ✅ AdBoard와 1:1 연결 (역방향)
    @OneToOne(mappedBy = "popupStore")
    private AdBoard adBoard;

    // ===== 편의 메서드 =====
    public void addImage(BoardImage image) {
        image.setPopupStore(this); // 연관관계 설정
        image.setSortOrder(this.imageList.size()); // 0부터 순서 매김
        imageList.add(image);
    }

    public void clearImages() {
        this.imageList.clear();
    }
    
    //나스용 이미지
    @OneToMany(mappedBy = "popupStore",cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @OrderBy("imageTypeCode ASC")
    private List<Image> images = new ArrayList<>();
    
    //편의 메서드
    public void addNasImage(Image image) {
    	image.setPopupStore(this);
    	this.images.add(image);
    }
    
    public void clearNasImages() {
    	this.images.clear();
    }
    
}
