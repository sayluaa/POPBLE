package com.popble.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class AdResponse {

    // ── 기본 식별/작성 정보 ──
    private Long id;
    private String title;
    private String content;

    private Long writerId;     
    private String writerName; 

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createTime;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updateTime;

    // ── 노출/정책 ──
    private boolean pinned;
    private boolean visible;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate publishStartDate;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate publishEndDate;

    // ── 통계 ──
    private int view;
    private int recommend;
    private int commentCount;

    // ── 태그/링크/연락 ──
    private List<String> tags;
    private String externalUrl;
    private String contact;

    // ── 이미지 ──
    private List<ImageDTO> imageList;
    private List<ImageDetailDTO> detailImages;
    private String thumbnail;

    // ── PopupStore 연계 ──
    private Long popupStoreId;
    private String popupStoreName;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate popupStartDate;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate popupEndDate;

    private String popupAddress;

    // ── 프론트 BasicInfo 대응 ──
    private String storeName;
    private String address;
    private String description;

    // ✅ 운영 시간대 추가
    private List<TimeSlotDTO> timeSlots;

    // ── 내부 DTO 클래스들 ──
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ImageDTO {
        private String url;
        private String folder;
        private String storedName;
        private String originalName;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ImageDetailDTO {
        private Long id;
        private Long boardId;
        private String uuid;
        private String originalName;
        private String path;
        private Integer ord;
        private String contentType;
        private Long size;

        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
        private LocalDateTime createdAt;
    }

    // ✅ 운영 시간대 DTO
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TimeSlotDTO {
        private String startTime;
        private String endTime;
    }
}