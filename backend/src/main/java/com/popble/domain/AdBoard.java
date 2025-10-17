package com.popble.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "ad_board")
public class AdBoard extends Board {

    @Column(length = 500)
    private String externalUrl;

    @Column(length = 100)
    private String contact;

    // 🔹 LocalDate로 변경
    private LocalDate publishStartDate;
    private LocalDate publishEndDate;

    private Boolean pinned = false;   // 고정 여부
    private Boolean visible = true;   // 노출 여부

    @ElementCollection
    @CollectionTable(name = "ad_board_tags", joinColumns = @JoinColumn(name = "board_id"))
    @Column(name = "tag", length = 40)
    private List<String> tags = new ArrayList<>();

    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BoardImage> imageList = new ArrayList<>();

    // ✅ 프론트 BasicInfo 연동용
    @Column(name = "store_name", length = 200)
    private String storeName;

    @Column(name = "address", length = 500)
    private String address;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "popup_id")
    private PopupStore popupStore;

    // ==== 편의 메서드 ====
    public void addImage(BoardImage image) {
        image.setBoard(this);
        image.setSortOrder(imageList.size());
        imageList.add(image);
    }

    public void clearImages() {
        this.imageList.clear();
    }

    // ==== Builder ====
    @Builder
    public AdBoard(String title, String content, UserProfile userProfile, String writer,
                   String externalUrl, String contact,
                   LocalDate publishStartDate, LocalDate publishEndDate,
                   Boolean pinned, Boolean visible, List<String> tags,
                   String storeName, String address, String description,
                   PopupStore popupStore) {

        setTitle(title);
        setContent(content);
        setUserProfile(userProfile);
        setWriter(writer);

        setType(Board.Type.AD);

        this.externalUrl = externalUrl;
        this.contact = contact;
        this.publishStartDate = publishStartDate;
        this.publishEndDate = publishEndDate;
        this.pinned = pinned != null ? pinned : false;
        this.visible = visible != null ? visible : true;
        this.tags = tags != null ? tags : new ArrayList<>();

        this.storeName = storeName;
        this.address = address;
        this.description = description;

        this.popupStore = popupStore;
    }
}
