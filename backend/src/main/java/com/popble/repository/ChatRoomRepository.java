package com.popble.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.popble.domain.ChatRoom;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {

}
