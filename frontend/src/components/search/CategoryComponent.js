import { useEffect, useState } from "react";
import { getCategories, getStatusList } from "../../api/searchApi";

const CategoryComponent = ({ onSelect }) => {
  // 팝업상태
  const [statusList, setStatusList] = useState([]);
  //카테고리
  const [categoryList, setCategoryList] = useState({
    MAIN: [],
    LOCALE: [],
    THEME: [],
  });

  const categoryLabel = {
    STATUS: "진행상태",
    MAIN: "카테고리",
    LOCALE: "지역",
    THEME: "테마",
  };

  //상단
  const [selectedTop, setSelectedTop] = useState(null);
  //하단
  const [selectedBottom, setSelectedBottom] = useState(null);

  //백엔드에서 Status, CategoryType데이터 가져오기
  useEffect(() => {
    //Status
    getStatusList().then(setStatusList);

    ////CategoryType별 데이터 가져오기
    ["MAIN", "LOCALE", "THEME"].forEach((type) => {
      getCategories(type).then((data) => {
        setCategoryList((prev) => ({ ...prev, [type]: data }));
      });
    });
  }, []);

  //상단 버튼 클릭
  const handleTopSelect = (top) => {
    setSelectedTop(top);
    setSelectedBottom(null);
    if (top === "STATUS") return;
  };

  //하단 버튼 클릭
  const handleBottomSelect = (sub) => {
    setSelectedBottom(sub);
    if (selectedTop === "STATUS") {
      onSelect({ type: "status", value: sub.key });
    } else {
      onSelect({
        type: "category",
        categoryType: selectedTop,
        categoryId: sub.id,
      });
    }
  };

  const subList =
    selectedTop === "STATUS"
      ? statusList
      : selectedTop
      ? categoryList[selectedTop]
      : [];

  return (
    // 카테고리
    <div>
      {/* 상단카테고리 */}
      <div className="flex items-center space-x-4 text-sm">
        <h2 className="text-xl font-bold">카테고리</h2>
        {["STATUS", "MAIN", "LOCALE", "THEME"].map((top) => (
          <button
            key={top}
            onClick={() => handleTopSelect(top)}
            className={`p-1 pl-3 pr-3 m-1 rounded-3xl shadow-md border-hashTagColor border text-sm ${
              selectedTop === top
                ? "bg-subButtonColor text-black"
                : "border borer-black text-black"
            }`}
          >
            {categoryLabel[top] || top}
          </button>
        ))}
      </div>

      {/* 하단카테고리 */}
      {subList.length > 0 && (
        <div className="mt-1 ml-20 sm:grid-cols-3 md:grid-cols-4 gap-2 max-w-[500px] mx-auto">
          {subList.map((sub) => (
            <button
              key={sub.id || sub.key}
              className={`p-1 m-1 text-sm ${
                selectedBottom === sub
                  ? "text-black font-bold"
                  : "text-hashTagColor"
              }`}
              onClick={() => handleBottomSelect(sub)}
            >
              {sub.label || sub.name}
            </button>
          ))}
        </div>
      )}
      {/*  */}
    </div>
  );
};

export default CategoryComponent;
