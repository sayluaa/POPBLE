package com.popble.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.popble.domain.ChatMessage;
import com.popble.domain.ChatRoom;
import com.popble.domain.UserProfile;
import com.popble.repository.ChatMessageRepository;
import com.popble.repository.ChatRoomRepository;
import com.popble.repository.UserProfileRepository;
import com.popble.repository.UserRepository;

@RestController
@RequestMapping("/chat")
public class ChatRestController {

	private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;

    public ChatRestController(ChatRoomRepository chatRoomRepository,
                              ChatMessageRepository chatMessageRepository,
                              UserRepository userRepository,
                              UserProfileRepository userProfileRepository) {
        this.chatRoomRepository = chatRoomRepository;
        this.chatMessageRepository = chatMessageRepository;
        this.userRepository = userRepository;
        this.userProfileRepository = userProfileRepository;
    }

    // 채팅방 생성 (회원 ↔ 관리자 1:1)
    @PostMapping("/room")
    public ChatRoom createRoom(@RequestParam(name = "userId") Long userId) {
        UserProfile user = userProfileRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("존재하지 않는 사용자"));

        ChatRoom room = new ChatRoom();
        room.setUser(user);
        return chatRoomRepository.save(room);
    }

    // 모든 채팅방 조회 (관리자)
    @GetMapping("/rooms")
    public List<ChatRoom> getAllRooms() {
        return chatRoomRepository.findAll();
    }

    // 특정 채팅방 메시지 조회
    @GetMapping("/messages/{roomId}")
    public List<ChatMessage> getMessages(@PathVariable Long roomId) {
        return chatMessageRepository.findByChatRoomId(roomId);
    }
}
