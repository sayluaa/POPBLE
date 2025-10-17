package com.popble.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class UserProfileDTO {

	private Long id;
	private String name;
	private String nickname;
	private String profileImg;
	private String phonenumber;
}
