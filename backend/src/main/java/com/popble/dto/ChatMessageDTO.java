package com.popble.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatMessageDTO {

	@NotNull
    private Long roomId;     // 채팅방 ID
    
	@NotNull
	private Long senderId;   // 보낸 유저 ID
    
	@NotBlank
	private String sender;   // 프론트 표시용 (닉네임 같은 것)
    
    @NotBlank(message = "메시지는 비워둘 수 없습니다.")
    @Size(max = 500, message = "메시지는 최대 500자까지 입력할 수 있습니다.")
    private String content;  // 메시지 내용
}
