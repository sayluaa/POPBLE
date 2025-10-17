import { useMemo, useState } from "react";
import { FaStar } from "react-icons/fa6";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

{
  /*w, h, readonly, rate,*/
}
const Rating = ({ reviews = [], rate = 0, readonly = true }) => {
  const [rating, setRating] = useState(rate);

  //총 리뷰 개수
  const totalReviews = reviews.length;

  // 평균 평점
  const averageRating = useMemo(() => {
    if (totalReviews === 0) return 0;
    const sum = reviews.reduce((acc, cur) => acc + cur, 0);
    return (sum / totalReviews).toFixed(1);
  }, [reviews, totalReviews]);

  //평점 분포 계산(5~1 막대그래프)
  const distribution = useMemo(() => {
    const counts = [0, 0, 0, 0, 0]; //index 0=5점, 1=4점, 2=3점, 3=2점, 4=1점
    reviews.forEach((r) => {
      if (r >= 1 && r <= 5) {
        counts[5 - r] += 1;
      }
    });
    return [
      { name: "5점", count: counts[0] },
      { name: "4점", count: counts[1] },
      { name: "3점", count: counts[2] },
      { name: "2점", count: counts[3] },
      { name: "1점", count: counts[4] },
    ];
  });

  const handleClickStar = (index) => {
    if (!readonly) {
      setRating(index + 1);
    }
  };

  return (
    <div className="flex flex-center items-center p-4 bg-white w-full max-w-md gap-10">
      {/* 총 리뷰 수 + 평균 */}
      <div className="text-center mb-4">
        <p className="text-sm text-gray-500">총 {totalReviews}건</p>
        <p className="flex justify-center items-end gap-1">
          <p className="text-4xl font-bold">{averageRating}</p>
          <p className="text-gray-500">점</p>
        </p>
        <div className="flex justify-center mt-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <FaStar
              key={i}
              className={`w-6 h-6 ${
                i < Math.round(averageRating)
                  ? "text-yellow-400"
                  : "text-gray-200"
              }`}
            />
          ))}
        </div>
      </div>

      {/* 점수별 분포 */}
      <div className="space-y-2">
        {distribution.map((item, idx) => {
          const score = 5 - idx;
          const percent =
            totalReviews === 0 ? 0 : (item.count / totalReviews) * 100;

          return (
            <div key={score} className="flex items-center gap-2">
              <span className="w-6 text-sm">{score}점</span>
              <div className="flex-1 bg-gray-200 rounded h-2 relative">
                <div
                  className="bg-blue-500 h-2 rounded"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <span className="w-8 text-right text-sm text-gray-500">
                {item.count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Rating;
