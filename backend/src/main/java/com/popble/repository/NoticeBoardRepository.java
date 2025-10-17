package com.popble.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.popble.domain.NoticeBoard;

public interface NoticeBoardRepository extends JpaRepository<NoticeBoard, Long> {

}
