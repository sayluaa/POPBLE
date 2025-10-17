package com.popble.dto;

import com.popble.domain.Board;

import lombok.Data;

@Data

public class BoardCreateRequest {

	private Board.Type type;
	
	private String title;
	
	private String content;
	
	private Long writerId;
	
}
