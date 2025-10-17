import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import CopyrightFooter from "./CopyrightFooter";

import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../slice/authSlice";

import { RxPerson } from "react-icons/rx";
import { IoList } from "react-icons/io5";
import { FiMapPin } from "react-icons/fi";
import AlertModal from "../common/AlertModal";

//햄버거 버튼 스타일(우상단 고정)
const DivIcon = styled.div`
  margin: 5px 5px 0 auto; /* 상단과 오른쪽에 여백 */
  cursor: pointer;
  display: flex;
  width: 50px;
  z-index: 200;
  /* 클릭할 영역 */
  & label {
    display: block;
    width: 35px; /* 네비바 크기 */
    height: 25px;
    position: relative;
  }

  & span {
    z-index: 900;
    display: block;
    position: absolute;
    width: 100%;
    height: 5px;
    border-radius: 25px;
    background-color: #000;
    transition: all 0.35s; /* 부드러운 애니메이션 */
  }

  /* span 첫번째 */
  & span:nth-child(1) {
    top: 0;
  }
  /* span 두번째 */
  & span:nth-child(2) {
    top: 50%;
    transform: translateY(-50%);
  }
  /* span 세번째 */
  & span:nth-child(3) {
    bottom: 0;
  }

  /* 햄버거 → X */
  &.open span:nth-child(1) {
    top: 50%;
    transform: translateY(-50%) rotate(45deg);
  }
  &.open span:nth-child(2) {
    opacity: 0;
  }
  &.open span:nth-child(3) {
    bottom: 50%;
    transform: translateY(50%) rotate(-45deg);
  }
`;

/* 어두운 배경(사이드바가 열렸을 때 뒤에 깔리는 반투명 검정 배경) */
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.28);
  z-index: 120;
  opacity: ${(p) =>
    p.open ? 1 : 0}; /* open props에 따라 opacity와 pointer-events가 달라짐 */
  pointer-events: ${(p) => (p.open ? "auto" : "none")};
  transition: opacity 0.25s;
`;

/* 사이드바 (우측에서 슬라이드) */
const DivSidebar = styled.div`
  width: 270px;
  max-width: 100%;
  height: 100vh;
  background-color: #fff; /* 배경 */
  position: fixed; /* 화면 오른쪽 고정*/
  top: 0;
  right: ${(props) =>
    props.open
      ? "0"
      : "-270px"}; /* 열렸을 때는 0, 닫혔을 때는 화면 밖으로 이동 */
  z-index: 125;
  transition: right 0.35s;
  overflow-y: auto; /* 네비게이션 안 메뉴 내용 많으면 스크롤 나타남 */
  /* 메뉴 리스트 */
`;

/* 상단 헤더 (카테고리 + 닫기 버튼) */
const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px;
  border-bottom: 1px solid #b2d4fd; /* 각각의 구분 선색 */
  font-size: 25px; /* 바로가기 스타일 설정 */
  font-weight: 500;
`;

/* 섹션 카테고리 (파란 배경) */
const SectionTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  background: #b2d4fd; /* 카테고리 구분 배경색 */
  font-weight: 700;
  border-top: 1px solid #b2d4fd;
  border-bottom: 1px solid #b2d4fd;
`;

/* 메뉴 리스트 */
const MenuList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

/* 각 메뉴 항목 */
const MenuItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 22px;
  font-size: 15px;
  border-bottom: 1px solid #e9e9e9;
  cursor: pointer;

  &:hover {
    /* hover 시 배경이 연한 파란색으로 바뀜 */
    background-color: #e6f0ff; /* hover 시 안 변하게 */
  }

  /* 서브메뉴(들여쓰기) 스타일 */
  .submenu li {
    padding-left: 46px;
    font-size: 14px;
    color: #222;
    font-weight: 500;
    background: #fff;
  }
`;

/* 작은 보조 텍스트(원래 이미지의 작은 라벨용) */
const Small = styled.div`
  font-size: 12px;
  text-align: center;
  padding: 10px 20px;
`;

const NavBar = () => {
  // 메뉴 클릭시 페이지 이동 후 사이드바 닫기
  const navigate = useNavigate();

  const { token, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false); //사이드바 열림 여부 상태

  const [alertModal, setAlertModal] = useState({
    show:false,
    message:"",
    action:()=>{},
  })

  const closeAlertModal = () => {
        const currentAction = alertModal.action;
        setAlertModal({ show: false, message: "", action: () => { } });
        if (currentAction && typeof currentAction === 'function') {
            currentAction();
        }
    }

    const showAlert = (message, action = () => { }) => {
        setAlertModal({ show: true, message, action });
    }

  return (
    <>
    {alertModal.show && (
            <AlertModal
                message={alertModal.message}
                onClose={closeAlertModal} 
            />
        )}
      {/* 햄버거 버튼 토글 -> 열기/닫기 */}
      <DivIcon className={open ? "open" : ""}>
        <label onClick={() => setOpen(!open)}>
          {" "}
          {/* 햄버거 클릭 시 상태 반전 */}
          <span></span>
          <span></span>
          <span></span>
        </label>
      </DivIcon>
      <Overlay open={open} onClick={() => setOpen(false)} />{" "}
      {/* false/true에 따라 보이는게 결정 */}
      {/* open 상태에 따라 오른쪽에서 슬라이드로 나타남 */}
      <DivSidebar open={open}>
        <SidebarHeader>
          <div>바로가기</div>
        </SidebarHeader>

        {/* 클릭하면 navigate()로 페이지 이동 후 사이드바 닫힘 */}
        <MenuList>
          {/* 로그인 상태에 따라 로그인/로그아웃 */}
          {!isAuthenticated ? (
            <MenuItem
              onClick={() => {
                navigate("/user/login");
                setOpen(false);
              }}
            >
              <div className="left">로그인</div>
              <div className="chev">›</div>
            </MenuItem>
          ) : (
            <MenuItem
              onClick={() => {
                dispatch(logout());
                setOpen(false);
                showAlert("로그아웃 되었습니다",() => {
                navigate("/");
              });
              }}
            >
              <div className="left">로그아웃</div>
              <div className="chev"></div>
            </MenuItem>
          )}

          {/* 섹션: 마이페이지 */}
          {isAuthenticated ? (
            <>
              <SectionTitle
                className="cursor-pointer"
                onClick={() => {
                  navigate("/user/mypage");
                  setOpen(false);
                }}
              >
                <span>
                  <RxPerson size="17" />
                </span>
                <span>마이페이지</span>
              </SectionTitle>

              <MenuItem
                className="submenu"
                onClick={() => {
                  navigate("/user/mypage/edit");
                  setOpen(false);
                }}
              >
                <div className="left">회원 정보 수정</div>
                <div className="chev">›</div>
              </MenuItem>
              <MenuItem
                className="submenu"
                onClick={() => {
                  navigate("/user/mypage/bookmark");
                  setOpen(false);
                }}
              >
                <div className="left">북마크 목록</div>
                <div className="chev">›</div>
              </MenuItem>
              <MenuItem
                className="submenu"
                onClick={() => {
                  navigate("/user/mypage/post");
                  setOpen(false);
                }}
              >
                <div className="left">내 작성 글 목록</div>
                <div className="chev">›</div>
              </MenuItem>
              <MenuItem
                className="submenu"
                onClick={() => {
                  navigate("/user/mypage/reservation");
                  setOpen(false);
                }}
              >
                <div className="left">예약 목록</div>
                <div className="chev">›</div>
              </MenuItem>
            </>
          ) : (
            <></>
          )}

          {/* 섹션: 게시판 */}
          <SectionTitle
            className="cursor-pointer"
            onClick={() => {
              navigate("/boards");
            }}
          >
            <span>
              <IoList size="20" />
            </span>
            <span>게시판</span>
          </SectionTitle>
          <MenuItem
            className="submenu"
            onClick={() => {
              navigate("/boards/notice");
              setOpen(false);
            }}
          >
            <div className="left">공지 게시판</div>
            <div className="chev">›</div>
          </MenuItem>
          <MenuItem
            className="submenu"
            onClick={() => {
              navigate("/boards/ad");
              setOpen(false);
            }}
          >
            <div className="left">홍보 게시판</div>
            <div className="chev">›</div>
          </MenuItem>
          <MenuItem
            className="submenu"
            onClick={() => {
              navigate("/boards/general");
              setOpen(false);
            }}
          >
            <div className="left">자유 게시판</div>
            <div className="chev">›</div>
          </MenuItem>
          <MenuItem
            className="submenu"
            onClick={() => {
              navigate("/boards/qna");
              setOpen(false);
            }}
          >
            <div className="left">Q&A 게시판</div>
            <div className="chev">›</div>
          </MenuItem>

          {/* 섹션: 팝업 지도 */}
          <SectionTitle>
            <span>
              <FiMapPin />
            </span>
            <span>팝업 지도</span>
          </SectionTitle>
          <MenuItem
            className="submenu"
            onClick={() => {
              setOpen(false);
              navigate("/?scroll=fullmap");
            }}
          >
            <div className="left">주변 팝업 보기</div>
            <div className="chev">›</div>
          </MenuItem>

          <Small>
            <CopyrightFooter />
          </Small>
        </MenuList>
      </DivSidebar>
    </>
  );
};

export default NavBar;
