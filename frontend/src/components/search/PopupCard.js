import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { addBookmark, deleteBookmark } from "../../api/bookmarkApi";
import { GoBookmark } from "react-icons/go";
import { FcBookmark } from "react-icons/fc";
import getImageSrc from "../function/getImageSrc";

const PopupCard = ({ item }) => {
  const [isBookmark, setIsBookmark] = useState(item.isBookmark);

  useEffect(() => {
    setIsBookmark(item.isBookmark ?? false);
  }, [item.isBookmark]);

  const toggleBookmark = async (e) => {
    e.preventDefault();

    try {
      if (isBookmark) {
        await deleteBookmark(item.popupId);
      } else {
        await addBookmark(item.popupId);
      }
      setIsBookmark(!isBookmark);
    } catch (e) {
      console.error("북마크 변경실패", e);
    }
  };

  return (
    <Link
      to={`/popup/detail/${item.popupId}`}
      className="relative flex flex-shrink-0 bg-secondaryColor w-[380px] h-[180px] rounded-lg shdow-md m-5 p-3 hover:shadow-lg transition border-secondaryAccentColor border-2"
    >
      {/* 북마크 */}
      <button
        onClick={toggleBookmark}
        className="absolute top-2 right-2 text-xl"
      >
        {isBookmark ? <FcBookmark /> : <GoBookmark />}
      </button>
      {/* 팝업간단정보 */}
      <img
        src={getImageSrc(item.uploadFileNames?.[0])}
        alt={item.title}
        className="w-[150px] h-[150px] object-cover rounded-md flex-shrink-0"
      ></img>
      <div className="ml-4 flex flex-col justify-between">
        <h3 className="font-bold text-lg">{item.storeName}</h3>
        <p className="text-sm text-gray-500">{item.address}</p>
        <p className="text-sm text-gray-500">
          {item.startDate} ~ {item.endDate}
        </p>
      </div>
    </Link>
  );
};

export default PopupCard;
