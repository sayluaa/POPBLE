import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getList } from "../../../api/BoardApi"

import { FiFilter } from "react-icons/fi"
import ReviewImage from "../../../components/function/ReviewImage"
import { PiHeartBold } from "react-icons/pi"

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [sortOption, setSortOption] = useState("highRating"); // 기본값: 평점 높은순

  useEffect(() => {
    // API 호출 예시
    // fetch("/api/reviews")
    //   .then(res => res.json())
    //   .then(data => setReviews(data));

    // 임시 데이터
    const dummyData = [
      { id: 1, username: "홍길동", content: "정말 좋았어요!", images: [], rating: 4.5, date: "2025-09-20", likes: 2 },
      { id: 2, username: "김철수", content: "가격 대비 만족도가 높습니다.", images: [], rating: 4.0, date: "2025-09-21", likes: 5 },
      { id: 3, username: "이영희", content: "최고예요!", images: [], rating: 5.0, date: "2025-09-19", likes: 1 },
    ];
    setReviews(dummyData);
  }, []);

  // 정렬 함수
  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortOption) {
      case "highRating": // 평점 높은순
        return b.rating - a.rating;
      case "lowRating": // 평점 낮은순
        return a.rating - b.rating;
      case "latest": // 최신순 (date 기준, 문자열 → Date 변환)
        return new Date(b.date) - new Date(a.date);
      case "recommended": // 추천순 (likes 많은 순)
        return b.likes - a.likes;
      default:
        return 0;
    }
  });

  return (
    <div className="flex flex-col justify-center items-center w-full">

      {/* 정렬 */}
      <div className="mt-5 w-full flex flex-center flex-col items-center gap-2">
        <div className="w-full border border-black border-l-2"/>
        <div className="flex ml-auto">
          <FiFilter className="w-5 h-5"/>
          <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className=""
        >
          <option value="highRating">평점 높은순</option>
          <option value="lowRating">평점 낮은순</option>
          <option value="latest">최신순</option>
          <option value="recommended">추천순</option>
        </select>
        </div>
        <div className="w-full border border-black border-l-2"/>
      </div>

      {/* 리뷰목록 */}
      <div className="mt-4 w-full space-y-3">
        {sortedReviews.map((review) => (
          <div key={review.id} className="p-2 border border-black">
            <div className="flex items-center gap-2">
              <div className="felx flex-col">
                <p className="font-semibold">{review.username}</p>
                <p className="text-sm text-gray-500">⭐ {review.rating}</p>
              </div>
              <p className="flex items-center ml-auto gap-1 mr-2"><PiHeartBold/>{review.likes}</p>
            </div>
            <p>{review.content}</p>

            {/* 이미지 */}
            {review.images && review.images.length > 0 && (
              <div className="mt-2">
                <ReviewImage images={review.images}/>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ReviewList