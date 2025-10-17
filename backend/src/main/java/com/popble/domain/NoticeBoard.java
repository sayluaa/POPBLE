package com.popble.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "notice_board")
public class NoticeBoard extends Board {

    // 게시글 고정 여부
    @Column(name = "pin")
    private boolean pin;

    // NoticeBoard.pin Board.pinnedGlobal 동기화
    public void setPin(boolean pin) {
        this.pin = pin;
//        super.setPinnedGlobal(pin); // 부모 Board.pinnedGlobal 값도 함께 반영
    }
}
