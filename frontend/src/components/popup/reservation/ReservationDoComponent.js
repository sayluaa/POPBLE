import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";
import { SelectBoxComponent } from "../../common/SelectBoxComponent";
import "./Calendar.css";
import { getAvailableTimesByDate } from "../../../api/reservationApi";

const CustomHeader = ({
  date,
  changeYear,
  changeMonth,
}) => {
  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - 50 + i);
  const months = [
    "1월", "2월", "3월", "4월", "5월", "6월",
    "7월", "8월", "9월", "10월", "11월", "12월",
  ];

  return (
    <div className="custom-header-dropdowns">
      <select
        value={date.getFullYear()}
        onChange={({ target: { value } }) => changeYear(value)}
      >
        {years.map((option) => (
          <option key={option} value={option}>
            {option}년
          </option>
        ))}
      </select>

      <select
        value={months[date.getMonth()]}
        onChange={({ target: { value } }) =>
          changeMonth(months.indexOf(value))
        }
      >
        {months.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

const ReservationDoComponent = ({ popupStore, selected, setSelected, onNext }) => {
  const [amTimes, setAmTimes] = useState([]);
  const [pmTimes, setPmTimes] = useState([]);
  const [isTimesLoading, setIsTimesLoading] = useState(false);
  const [currentTimeKey, setCurrentTimeKey] = useState(Date.now())

  useEffect(()=>{
    const timer = setInterval(()=>{
      setCurrentTimeKey(Date.now());
    }, 60000)

    return () => clearInterval(timer)
  },[])

  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isPastTime = (timeString, date) => {
    const now = new Date();

    const [hour, minute] = timeString.split(":").map(Number);

    const timeToCheck = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      hour,
      minute,
      0,
      0

    )

    const isPast = timeToCheck.getTime() < now.getTime();
       
    return isPast;
  };

  const isSelectedTimePast = selected.date && selected.time 
    ? isPastTime(selected.time.startTime, selected.date)
    : false;


  const isOffDays = (date) => (popupStore.offDays || []).includes(date.getDay());

  useEffect(() => {
    if (!popupStore || !selected.date) {
      setAmTimes([]);
      setPmTimes([]);
      return;
    }

    setIsTimesLoading(true);

    const fetchAvailableTimes = async () => {
      try {
        const formattedDate = selected.date.toISOString().slice(0, 10);
        const times = await getAvailableTimesByDate(popupStore.id, formattedDate);

        const am = [];
        const pm = [];

        times.forEach((t) => {
          const hour = parseInt(t.startTime.split(":")[0], 10);
          if (hour < 12) {
            am.push(t);
          } else {
            pm.push(t);
          }
        });

        setAmTimes(am);
        setPmTimes(pm);
      } catch (error) {
        console.error("Failed to fetch available times:", error);
        setAmTimes([]);
        setPmTimes([]);
      } finally {
        setIsTimesLoading(false);
      }
    };

    fetchAvailableTimes();
  }, [popupStore.id, selected.date, currentTimeKey]);

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="calendar-container w-full pr-10 flex">
        <DatePicker
          inline
          locale={ko}
          selected={selected.date}
          renderCustomHeader={CustomHeader}
          onChange={(date) => {
            setSelected((prev) => ({ ...prev, date, time: null, count: 0 }));
          }}
          minDate={popupStore.startDate ? new Date(popupStore.startDate) : null}
          maxDate={popupStore.endDate ? new Date(popupStore.endDate) : null}
          dateFormat="yyyy-MM-dd"
          filterDate={(date) => {
            const isDateInRange =
              popupStore.startDate && popupStore.endDate && new Date(popupStore.startDate) <= date && date <= new Date(popupStore.endDate);
            const isNotOffDay = !isOffDays(date);
            const isNotPastDate = !isPastDate(date);
            return isNotPastDate && isNotOffDay && isDateInRange;
          }}
        />
      </div>

      <div className="reservation-info w-full sm:w-1/2 md:w-1/2 lg:w-1/2 ml-4">
        {selected.date && (
          <>
            <div className="text-3xl mb-4">예약 시간</div>

            {isTimesLoading ? (
              <p>시간 정보 불러오는 중...</p>
            ) : (
              <>
                <div className="text-2xl mb-2">오전</div>
                <div>
                  {amTimes.length > 0 ? (
                    amTimes.map((t) => {
                      const today = new Date();
                      const isToday =
                        selected.date.getFullYear() === today.getFullYear() &&
                        selected.date.getMonth() === today.getMonth() &&
                        selected.date.getDate() === today.getDate();

                      const isPastSlot = isToday && isPastTime(t.startTime, selected.date);
                      const isDisabled = t.remainingSeats <= 0 || isPastSlot;
                      return (
                        <button
                          key={t.id}
                          className={`inline-flex items-center px-3 py-1 m-1 border rounded-full ${
                            selected.time && selected.time.id === t.id
                              ? "bg-primaryColor text-black"
                              : "bg-subSecondColor"
                          } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                          onClick={() => setSelected((prev) => ({ ...prev, time: t }))}
                          disabled={isDisabled}
                        >
                          {`${t.startTime.slice(0, 5)} - ${t.endTime.slice(0, 5)} (${t.remainingSeats}석)`}
                        </button>
                      );
                    })
                  ) : (
                    <p>오전 예약 불가</p>
                  )}
                </div>
                <div className="text-2xl mt-4 mb-2">오후</div>
                <div>
                  {pmTimes.length > 0 ? (
                    pmTimes.map((t) => {
                      const today = new Date();
                      const isToday =
                        selected.date.getFullYear() === today.getFullYear() &&
                        selected.date.getMonth() === today.getMonth() &&
                        selected.date.getDate() === today.getDate();
                      const isPastSlot = isToday && isPastTime(t.startTime, selected.date);
                      const isDisabled = t.remainingSeats <= 0 || isPastSlot;
                      return (
                        <button
                          key={t.id}
                          className={`inline-flex items-center px-3 py-1 m-1 border rounded-full ${
                            selected.time && selected.time.id === t.id
                              ? "bg-primaryColor text-black"
                              : "bg-subSecondColor"
                          } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                          onClick={() => setSelected((prev) => ({ ...prev, time: t }))}
                          disabled={isDisabled}
                        >
                          {`${t.startTime.slice(0, 5)} - ${t.endTime.slice(0, 5)} (${t.remainingSeats}석)`}
                        </button>
                      );
                    })
                  ) : (
                    <p>오후 예약 불가</p>
                  )}
                </div>
              </>
            )}

            {selected.time && (
              <>
                <div className="text-xl mt-4">
                  인원수
                  <SelectBoxComponent
                    max={selected.time.maxCount}
                    value={selected.count}
                    onChange={(val) => setSelected((prev) => ({ ...prev, count: val }))}
                  />
                </div>
                <div className="text-xl mt-2">
                  총 가격: {popupStore.price > 0 ? `${popupStore.price * selected.count} 원` : "무료"}
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    className="py-2 px-4 bg-primaryColor text-xl rounded text-black"
                    onClick={onNext}
                    disabled={!selected.date || !selected.time || selected.count === 0 || isSelectedTimePast}
                  >
                    다음
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ReservationDoComponent;