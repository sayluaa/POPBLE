import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";
import { registerTimeSlots } from "../../../api/reservationApi";
import { useParams } from "react-router-dom";
import { getAdOne } from "../../../api/AdBoardApi";

const getDatesInRange = (startDate, endDate) => {
  const dates = [];
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
};

const initialTimeSlot = {
  startTime: "",
  endTime: "",
  maxCount: 0,
};

const ReservationTimeComponent = ({ onSuccess }) => {
  const { id } = useParams(); // ✅ boards/ad/:id/reservation 에서 adId 가져오기
  const [popupStoreId, setPopupStoreId] = useState("");
  const [timeSlots, setTimeSlots] = useState([initialTimeSlot]);
  const [message, setMessage] = useState("");

  // 날짜 범위 선택 상태
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);

  // ✅ 마운트 시 adId로 ad 상세 조회 → popupStoreId 세팅
  useEffect(() => {
    const fetchAd = async () => {
      try {
        const ad = await getAdOne(id); // AdResponse 반환
        console.log("🔎 getAdOne 응답:", ad);
        if (ad.popupStoreId) {
          setPopupStoreId(ad.popupStoreId);
        } else {
          setMessage("⚠️ popupStoreId를 찾을 수 없습니다.");
        }
      } catch (err) {
        console.error("Ad 조회 실패:", err);
        setMessage("Ad 정보를 불러오지 못했습니다.");
      }
    };
    fetchAd();
  }, [id]);

  const handleAddSlot = () => {
    setTimeSlots([...timeSlots, { ...initialTimeSlot }]);
  };

  const handleChangeSlot = (index, field, value) => {
    const newTimeSlots = [...timeSlots];
    newTimeSlots[index][field] = value;
    setTimeSlots(newTimeSlots);
  };

  const handleRemoveSlot = (index) => {
    const newTimeSlots = timeSlots.filter((_, i) => i !== index);
    setTimeSlots(newTimeSlots);
  };

  const handleRangeChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const handleSubmit = async () => {
    if (!popupStoreId || !startDate || !endDate || timeSlots.length === 0) {
      setMessage("팝업스토어 ID, 날짜 범위, 최소 하나의 시간 슬롯을 입력하세요.");
      return;
    }

    const selectedDates = getDatesInRange(startDate, endDate);
    const formattedTimeSlots = [];

    selectedDates.forEach((date) => {
      const formattedDate = date.toISOString().slice(0, 10);
      timeSlots.forEach((slot) => {
        formattedTimeSlots.push({
          ...slot,
          date: formattedDate,
          popupStoreId: Number(popupStoreId), // ✅ 올바른 popupStoreId 사용
        });
      });
    });

    try {
      await registerTimeSlots(formattedTimeSlots);
      setMessage("✅ 시간 슬롯 등록 성공");
      setStartDate(new Date());
      setEndDate(null);
      setTimeSlots([initialTimeSlot]);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      setMessage("❌ 시간 슬롯 등록 실패");
      console.error("Error:", error);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h2 className="text-2xl font-bold mb-4">예약 시간 일괄 등록</h2>

      <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          팝업스토어 ID
        </label>
        <input
          type="number"
          value={popupStoreId}
          readOnly // ✅ 자동으로 세팅되므로 직접 입력 불가
          className="w-full px-3 py-2 border rounded-md bg-gray-100"
          placeholder="연결된 팝업스토어 ID"
        />
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
        <h3 className="text-xl font-semibold mb-2">1. 날짜 범위 선택</h3>
        <DatePicker
          selected={startDate}
          onChange={handleRangeChange}
          startDate={startDate}
          endDate={endDate}
          selectsRange
          inline
          locale={ko}
          dateFormat="yyyy-MM-dd"
        />
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
        <h3 className="text-xl font-semibold mb-2">2. 공통 시간표 설정</h3>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">시간 슬롯</span>
          <button
            onClick={handleAddSlot}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300"
          >
            + 시간 추가
          </button>
        </div>
        {timeSlots.map((slot, index) => (
          <div key={index} className="flex gap-2 items-center mb-2">
            <input
              type="time"
              value={slot.startTime}
              onChange={(e) =>
                handleChangeSlot(index, "startTime", e.target.value)
              }
              className="w-1/4 px-2 py-1 border rounded-md"
            />
            <input
              type="time"
              value={slot.endTime}
              onChange={(e) =>
                handleChangeSlot(index, "endTime", e.target.value)
              }
              className="w-1/4 px-2 py-1 border rounded-md"
            />
            <input
              type="number"
              value={slot.maxCount}
              onChange={(e) =>
                handleChangeSlot(index, "maxCount", Number(e.target.value))
              }
              className="w-1/4 px-2 py-1 border rounded-md"
              placeholder="최대 인원"
            />
            <button
              onClick={() => handleRemoveSlot(index)}
              className="bg-red-500 text-white px-3 py-1 rounded-md"
            >
              -
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white font-bold py-3 rounded-md hover:bg-blue-600 transition duration-300"
        >
          등록하기
        </button>
      </div>

      {message && (
        <div className="mt-4 p-4 text-center text-sm font-semibold text-gray-700 bg-yellow-100 rounded-md">
          {message}
        </div>
      )}
    </div>
  );
};

export default ReservationTimeComponent;
