package com.popble.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "general_board")
public class GeneralBoard extends Board {
	
	
//	//게시판 아이디
//	private Board boardId;
}
