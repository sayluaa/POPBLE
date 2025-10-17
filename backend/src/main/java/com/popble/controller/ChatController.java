package com.popble.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import com.popble.domain.ChatMessage;
import com.popble.domain.ChatRoom;
import com.popble.domain.UserProfile;
import com.popble.dto.ChatMessageDTO;
import com.popble.repository.ChatMessageRepository;
import com.popble.repository.ChatRoomRepository;
import com.popble.repository.UserProfileRepository;
import com.popble.repository.UserRepository;

@Controller
@CrossOrigin
public class ChatController {

	
	private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;

    public ChatController(ChatMessageRepository chatMessageRepository,
                          ChatRoomRepository chatRoomRepository,
                          UserRepository userRepository,
                          UserProfileRepository userProfileRepository) {
        this.chatMessageRepository = chatMessageRepository;
        this.chatRoomRepository = chatRoomRepository;
        this.userRepository = userRepository;
        this.userProfileRepository = userProfileRepository;
    }

    @MessageMapping("/chat.sendMessage/{roomId}")
    @SendTo("/topic/{roomId}")
    public ChatMessageDTO sendMessage(@DestinationVariable Long roomId, ChatMessageDTO dto) {
    	
        ChatRoom room = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("존재하지 않는 채팅방"));
        
        UserProfile sender = userProfileRepository.findById(dto.getSenderId())
                .orElseThrow(() -> new RuntimeException("존재하지 않는 사용자"));

        ChatMessage message = new ChatMessage();
        message.setChatRoom(room);
        message.setSender(sender);
        message.setContent(dto.getContent());
        message.setSentTime(LocalDateTime.now());

        chatMessageRepository.save(message);
      
        // 응답 DTO 변환
        ChatMessageDTO response = new ChatMessageDTO();
        response.setRoomId(roomId);
        response.setSenderId(sender.getId());
        response.setSender(sender.getNickname());  // 닉네임 넣기
        response.setContent(message.getContent());
        
        return response;
    }
}
