import { FiPlusCircle } from "react-icons/fi";

const ReviewImage = ({images = []}) => {

    return(
        <div className="flex items-center gap-2 overflow-x-auto">
            {images.slice(0, 5).map((src, idx) => (
                <div key={idx}
                    className="w-25 h-25 flex-shrink-0 overflow-hidden">
                        <img src={src}
                            alt={`review-img-${idx}`}
                            className="w-full h-full object-cover"/>
                </div>
            ))}
            {images.length > 5 && (
                <button className="mt-5 flex-col font-semibold">
                    <FiPlusCircle className="w-10 h-10"/>
                더보기
                </button>
            )}
        </div>
    )
}
export default ReviewImage