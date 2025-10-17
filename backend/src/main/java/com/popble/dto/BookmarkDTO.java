package com.popble.dto;

import java.time.LocalDate;
import java.util.List;

import com.popble.domain.PopupStore.Status;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class BookmarkDTO {

	private Long popupId;
	private String storeName;
	private String address;
	private LocalDate startDate;
	private LocalDate endDate;
	private int bookmarkCount;
	private List<String> uploadFileNames;
	private boolean isBookmark;
	private Status status;

}
