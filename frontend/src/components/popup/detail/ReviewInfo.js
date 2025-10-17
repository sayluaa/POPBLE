import ReviewList from "../../../pages/popup/review/ReviewList";
import Rating from "../../function/Rating";
import ReviewImage from "../../function/ReviewImage";

const ReviewInfo = () => {
  return (
    <div className="flex flex-col justify-center items-center w-full">
      {/* 평점 */}
      <div className="w-3/5 p-2 flex justify-center items-center bg-white border border-hashTagColor rounded-xl shadow-sm">
        <Rating/>
      </div>

      {/* 이미지 리스트 */}
      <ReviewImage/>

      {/* 리뷰 목록*/}
      <div className="mt-4 w-full space-y-3">
        <ReviewList/>
      </div>
    </div>
  );
};

export default ReviewInfo;