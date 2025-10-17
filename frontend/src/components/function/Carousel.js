import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  EffectCoverflow,
  Pagination,
  Navigation,
  Autoplay,
  Mousewheel,
} from "swiper/modules";
import { getList } from "../../api/searchApi";
import { useNavigate } from "react-router-dom";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

import logo from "../../assets/img/POPBLE - P.jpg"

const Number_Of_Images = 10; //랜덤 이미지 개수

const Carousel = () => {
  const navigate = useNavigate()
  const [popups, setPopups] = useState([])
  const [isLoading, setIsLoading] = useState(true); 
  const paginationRef = useRef(null);

  useEffect(() => {
    const fetchPopupImages = async () => {
      try{
        //데이터베이스의 전체 목록 조회 (getList 실행)
        const result = await getList({
          status: "ACTIVE",
          sort: "VIEW",
          pageRequestDTO: { page: 1, size: 50 }, // 넉넉하게 요청
        });

        const allPopups = result.dtoList || [];
          
        //배열 복사 후 무작위로 섞기 (랜덤 선택 로직)
        const shuffled = [...allPopups].sort(() => 0.5 - Math.random());
          
        //캐러셀에 표시할 개수(10개)만큼 자르기
        const randomPopups = shuffled.slice(0, Number_Of_Images);
          
        setPopups(randomPopups);
        setIsLoading(false);

      } catch (error) {
        console.error("캐러셀 불러오기 실패", error);
        setPopups([]); // 데이터 로드 실패 시 빈 배열로 설정
        setIsLoading(false);
      }
    }
    fetchPopupImages()
  }, [])

  //로딩 중이거나 데이터가 없을 때 조건부 렌더링
  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: '100px', color: '#fff' }}>
      데이터를 불러오는 중입니다...</div>
  }
  if (popups.length === 0) {
    return <div style={{ textAlign: 'center', padding: '100px', color: '#fff' }}>
      표시할 팝업 이미지가 없습니다.</div>
  }

  return (
    <div
      style={{
        width: "100%",
        margin: "0 auto",
        paddingTop: "40px",
        position: "relative", // 버튼 absolute 기준
      }}
    >
      <div style={{ position: "relative" }}>
        <Swiper
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          loop={popups.length > 1}     //루프
          autoplay={{     //자동재생
            delay: 2500,  //딜레이 시간
            disableOnInteraction: false,
          }}
          coverflowEffect={{
            rotate: 0, //회전 각도
            stretch: 0, //양옆 벌어진 정도
            depth: 150,   //깊이감
            modifier: 1.2, //효과 강도(위의 전체 효과 강도)
            slideShadows: true, //그림자 효과
          }}
          pagination={{ clickable: true, el: ".custom-pagination"}} //하단의 .....
          navigation={{
            nextEl: ".swiper-button-next-custom",
            prevEl: ".swiper-button-prev-custom",
          }}
          mousewheel={false}
          modules={[EffectCoverflow, Pagination, Navigation, Autoplay, Mousewheel]}
          className="mySwiper"
          style={{
            position: "relative", // 버튼 기준점
          }}
          slidesPerView={1} // 카드 고정 크기를 기준으로 자동 배치
          breakpoints={{
            0: { slidesPerView: 1, centeredSlides: true }, // 모바일
            768: { slidesPerView: 3, centeredSlides: true }, // 태블릿 + 데스크탑
          }}
          spaceBetween={10}
        >
          {popups.map((item) => (
              <SwiperSlide    //박스 스타일 지정
                key={item.id}
                style={{
                  aspectRatio: "9/10",  //가로 세로 비율
                  minWidth: "250px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "10px",   //박스 rounder 정도
                  overflow: "hidden",
                  background: "#111",
                  boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.5)", //섀도우 크기 조절
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer", //클릭 가능
                }}
                onClick={() => navigate(`/popup/detail/${item.id}`)} //클릭 시 상세페이지 이동
              >
                <img
                  src={item.uploadFileNames?.[0]}
                  alt={item.storeName}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",   //이미지 꽉 채우기
                  }}
                  // 이미지 로드 실패 시 대체 처리 (옵션)
                  onError={(e) => (e.target.src = logo)} // 이미지 깨질 때 대체 이미지
                  className="w-full h-64 object-cover"
                />
              </SwiperSlide>
            ))} 

          {/* 커스텀 네비게이션 버튼 */}
          {/* {popups.length > 1 && ( //(데이터가 2개 이상일 때만 표시 권장)  */}
          <div
            className="swiper-button-prev-custom"
            style={{
              position: "absolute",
              top: "50%",
              left: "10px",
              transform: "translateY(-50%)",
              zIndex: 10,
              background: "rgba(0,0,0,0.6)",
              borderRadius: "50%",
              width: "50px",
              height: "50px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              color: "#fff",
              fontSize: "20px",
            }}
          >
            ◀
          </div>
          <div
            className="swiper-button-next-custom"
            style={{
              position: "absolute",
              top: "50%",
              right: "10px",
              transform: "translateY(-50%)",
              zIndex: 10,
              background: "rgba(0,0,0,0.6)",
              borderRadius: "50%",
              width: "50px",
              height: "50px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              color: "#fff",
              fontSize: "20px",
            }}
          >
            ▶
          </div>
        </Swiper>
        {/* 페이지네이션을 카드 하단에 위치 */} 
        <div className="custom-pagination" 
            style={{ marginTop: "10px", textAlign: "center", }} />
      </div>
    </div>
  );
};

export default Carousel;