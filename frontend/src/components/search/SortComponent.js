import { useState } from "react";

const SortComponent = ({ onSort }) => {
  const [selectedSort, setSelectedSort] = useState("LATEST");

  const sortList = [
    { label: "최신순", value: "LATEST" },
    { label: "북마크순", value: "BOOKMARK" },
    { label: "조회순", value: "VIEW" },
    { label: "추천순", value: "RECOMMEND" },
    { label: "종료임박순", value: "END_SOON" },
  ];

  const handleSelect = (sort) => {
    setSelectedSort(sort);
    if (onSort) onSort(sort);
  };
  return (
    <div>
      <div className="flex items-center space-x-4 text-sm">
        <h2 className="text-xl font-bold">정렬</h2>
        {sortList.map((sort) => (
          <button
            key={sort.value}
            onClick={() => handleSelect(sort.value)}
            className={`p-1 pl-3 pr-3 m-1 rounded-3xl shadow-md border-hashTagColor border text-sm ${
              selectedSort === sort.value
                ? "bg-subButtonColor text-black"
                : "border borer-black text-black"
            }`}
          >
            {sort.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SortComponent;
