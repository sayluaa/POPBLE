package com.popble.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "qna_board")
public class QnaBoard extends Board{

//	//게시판 아이디
//	//상속 @Inheritance(strategy = InheritanceType.JOINED) 어노테이션 작성시 필요없음
//	private Board boardId;
}
