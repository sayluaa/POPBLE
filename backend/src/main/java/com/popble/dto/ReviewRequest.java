package com.popble.dto;

import lombok.Data;

@Data
public class ReviewRequest {

	private Long userId;	//실제 유저 식별
    private Long popupId; 
    private String nickname; 
    private double rating;
    private String content;
}