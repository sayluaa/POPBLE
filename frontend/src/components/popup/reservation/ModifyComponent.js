import { useEffect, useRef, useState } from "react";
import {
  API_SERVER_HOST,
  deleteOne,
  getOne,
  putOne,
} from "../../api/popupstoreApi";
import FetchingModal from "../common/FetchingModal";
import useCustomMove from "../../hooks/useCustomMove";
import ResultModal from "../common/ResultModal";
import SelectBoxComponent from "../common/SelectBoxComponent";

const host = API_SERVER_HOST;

const initState = {
  id: 0,
  storeName: "",
  address: "",
  startDate: "",
  endDate: "",
  reservationTimes: { am: ["", "", "", ""], pm: ["", "", "", ""] },
  maxCount: null,
  desc: "",
  price: 0,
  deleted: false,
  uploadFileNames: [],
};
const ModifyComponent = ({ id }) => {
  const [popupstore, setPopupstore] = useState(initState);

  const [result, setResult] = useState(null);

  const [fetching, setFetching] = useState(false);

  const { moveToList, moveToRead } = useCustomMove();

  const uploadRef = useRef();

  useEffect(() => {
    setFetching(true);

    getOne(id).then((data) => {
      setPopupstore(data);
      setFetching(false);
    });
  }, [id]);

  const handleChangePopupstore = (e) => {
    popupstore[e.target.name] = e.target.value;

    setPopupstore({ ...popupstore });
  };

  const deleteOldImages = (imageName) => {
    const resultFileNames = popupstore.uploadFileNames.filter(
      (fileName) => fileName !== imageName
    );

    popupstore.uploadFileNames = resultFileNames;

    setPopupstore({ ...popupstore });
  };

  const handleClickModify = () => {
    const files = uploadRef.current.files;
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    formData.append("storeName", popupstore.storeName);
    formData.append("address", popupstore.address);
    formData.append("startDate", popupstore.startDate);
    formData.append(
      "reservationTimes",
      JSON.stringify(popupstore.reservationTimes)
    );
    formData.append("maxCount", popupstore.maxCount);
    formData.append("desc", popupstore.desc);
    formData.append("price", popupstore.price);
    formData.append("deleted", popupstore.deleted);

    for (let i = 0; i < popupstore.uploadFileNames.length; i++) {
      formData.append("uploadFileNames", popupstore.uploadFileNames[i]);
    }
    setFetching(true);

    putOne(id, formData).then((data) => {
      setResult("수정");
      setFetching(false);
    });
  };

  const closeModal = () => {
    if (result === "수정") {
      moveToRead(id);
    } else if (result === "삭제") {
      moveToList({ page: 1 });
    }
    setResult(null);
  };

  const handleClickDelete = () => {
    setFetching(true);
    deleteOne(id).then((data) => {
      setResult("삭제");
      setFetching(false);
    });
  };

  const amTime = [
    { name: "amTime1", type: "text" },
    { name: "amTime2", type: "text" },
    { name: "amTime3", type: "text" },
    { name: "amTime4", type: "text" },
  ];

  const pmTime = [
    { name: "pmTime1", type: "text" },
    { name: "pmTime2", type: "text" },
    { name: "pmTime3", type: "text" },
    { name: "pmTime4", type: "text" },
  ];

  return (
    <div className="border-2 border-sky-200 mt-10 m-2 p-4">
      {fetching ? <FetchingModal /> : <></>}
      {result ? (
        <ResultModal
          title={`${result}`}
          content={"정상적으로 처리되었습니다"}
          callbackFn={closeModal}
        ></ResultModal>
      ) : (
        <></>
      )}

      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">팝업스토어이름</div>
          <input
            className="rounded-r border border-solid border-neutral-500 shadow-md"
            name="storeName"
            type={"text"}
            value={popupstore.storeName}
            onChange={handleChangePopupstore}
          ></input>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">주소</div>
          <input
            className="w-4/5 p-6 rounded-r border border-solid border-neutral-500 shadow-md"
            name="address"
            type={"text"}
            value={popupstore.address}
            onChange={handleChangePopupstore}
          ></input>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">행사시작일</div>
          <input
            className="rounded-r border border-solid border-neutral-500 shadow-md"
            name="startDate"
            type={"date"}
            value={popupstore.startDate}
            onChange={handleChangePopupstore}
          ></input>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">행사종료일</div>
          <input
            className="rounded-r border border-solid border-neutral-500 shadow-md"
            name="endDate"
            type={"date"}
            value={popupstore.endDate}
            onChange={handleChangePopupstore}
          ></input>
        </div>
      </div>

      <div style={{ display: "flex", gap: "1px", marginBottom: "10px" }}>
        AM_TIME
        {amTime.map((amTime, idx) => (
          <div key={idx} style={{ display: "flex" }}>
            <input
              className="border border-gray-400 rounded p-2 w-24"
              type="time"
              value={popupstore.reservationTimes.am[idx]}
              onChange={(e) => {
                const newAm = [...popupstore.reservationTimes.am];
                newAm[idx] = e.target.value;
                setPopupstore({
                  ...popupstore,
                  reservationTimes: {
                    ...popupstore.reservationTimes,
                    am: newAm,
                  },
                });
              }}
            ></input>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "1px", marginBottom: "10px" }}>
        PM_TIME
        {pmTime.map((pmTime, idx) => (
          <div key={idx} style={{ display: "flex" }}>
            <input
              className="border border-gray-400 rounded p-2 w-24"
              type="time"
              value={popupstore.reservationTimes.pm[idx]}
              onChange={(e) => {
                const newPm = [...popupstore.reservationTimes.pm];
                newPm[idx] = e.target.value;
                setPopupstore({
                  ...popupstore,
                  reservationTimes: {
                    ...popupstore.reservationTimes,
                    pm: newPm,
                  },
                });
              }}
            ></input>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">
            입장가능인원수
            <SelectBoxComponent
              value={popupstore.maxCount}
              onChange={(val) =>
                setPopupstore({ ...popupstore, maxCount: val })
              }
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">행사입장가격</div>
          <input
            className="rounded-r border border-solid border-neutral-500 shadow-md"
            name="price"
            type={"text"}
            value={popupstore.price}
            onChange={handleChangePopupstore}
          >
            {/* 폼에 '천원단위로 입력' or 입력뒤에'원'글자 항상 뜨게? */}
          </input>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">행사정보</div>
          <input
            className="rounded-r border border-solid border-neutral-500 shadow-md"
            name="desc"
            type={"text"}
            value={popupstore.desc}
            onChange={handleChangePopupstore}
          >
            {/* 폼에 '행사 정보를 입력해주세요' */}
          </input>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="relative md-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">삭제</div>
          <select
            name="deleted"
            value={popupstore.deleted}
            onChange={handleChangePopupstore}
            className="w-4/5 p-6 rouded-r border border-solid border-neutral-300 shadow-md"
          >
            <option value={false}>사용</option>
            <option value={true}>삭제</option>
          </select>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">이미지첨부</div>
          <input
            ref={uploadRef}
            className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md"
            type={"file"}
            multiple={true}
          ></input>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">이미지</div>
          <div className="w-4/5 justify-center flex flex-wrap items-start">
            {popupstore.uploadFileNames.map((imgfile, i) => (
              <div className="flex justify-center flex-col w-1/3" key={i}>
                <button
                  className="bg-blue-500 text-3xl text-white"
                  onClick={() => deleteOldImages(imgfile)}
                >
                  이미지삭제
                </button>
                <img
                  alt="img"
                  src={`${host}/api/popup/view/s_${imgfile}`}
                ></img>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          className="rounded p-4 m-2 w-32 bg-red-500 text-xl text-white"
          onClick={handleClickDelete}
        >
          삭제
        </button>
        <button
          type="button"
          className="rounded p-4 m-2 w-32 bg-red-300 text-xl text-white"
          onClick={handleClickModify}
        >
          수정
        </button>
        <button
          type="button"
          className="rounded p-4 m-2 w-32 bg-blue-300 text-xl text-white"
          onClick={moveToList}
        >
          목록
        </button>
      </div>
    </div>
  );
};

export default ModifyComponent;
