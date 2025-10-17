import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createPopupStore } from "../../../api/popupstoreApi";
import { createAdWithImages } from "../../../api/AdBoardApi";
import AlertModal from "../../common/AlertModal";

const initState = {
  storeName: "",
  address: "",
  desc: "",
  price: 0,
  startDate: "", 
  endDate: "", 
  files: [],
};

const FormRow = ({ label, children }) => (
  <div className="flex justify-center">
    <div className="relative mb-6 w-full flex items-center">
      <div className="w-1/5 p-3 font-bold text-left">{label}</div>
      <div className="w-4/5">{children}</div>
    </div>
  </div>
);

const AdBoardComponent = () => {
  const [adBoard, setAdBoard] = useState({ ...initState });
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [thumbnailIdx, setThumbnailIdx] = useState(0);

  const fileRef = useRef(null);
  const navigate = useNavigate();

  const [modal, setModal] = useState({
        isOpen: false,
        message: "",
        onClose: () => setModal(prev => ({ ...prev, isOpen: false })),
        onConfirm: null,
    });

  // 입력값 변경
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdBoard((prev) => ({ ...prev, [name]: value }));
  };

  // 파일 업로드
  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    setFiles(selected);
    setPreviews(selected.map((file) => URL.createObjectURL(file)));
    setThumbnailIdx(0);
  };

  // 이미지 삭제
  const handleRemoveImage = (idx) => {
    const newFiles = files.filter((_, i) => i !== idx);
    const newPreviews = previews.filter((_, i) => i !== idx);
    setFiles(newFiles);
    setPreviews(newPreviews);

    if (fileRef.current) {
      fileRef.current.value = "";
      const dataTransfer = new DataTransfer();
      newFiles.forEach((file) => dataTransfer.items.add(file));
      fileRef.current.files = dataTransfer.files;
    }

    if (thumbnailIdx === idx) {
      setThumbnailIdx(0);
    } else if (thumbnailIdx > idx) {
      setThumbnailIdx((prev) => prev - 1);
    }
  };

  // 등록
  const handleSubmit = async () => {
    if (!adBoard.storeName.trim()) {
      setModal({
        isOpen: true,
        message: "제목을 입력하세요.",
        onClose: () => setModal(prev => ({ ...prev, isOpen: false })),
      });
      return;
    }
    if (!adBoard.desc.trim()) {
      setModal({
        isOpen: true,
        message: "내용을 입력하세요.",
        onClose: () => setModal(prev => ({ ...prev, isOpen: false })),
      });
      return;
    }
    if (!adBoard.startDate || !adBoard.endDate) {
      setModal({
        isOpen: true,
        message: "운영 시작일과 종료일을 입력하세요.",
        onClose: () => setModal(prev => ({ ...prev, isOpen: false })),
      });
      return;
    }

    try {
      const popupPayload = {
        storeName: adBoard.storeName,
        address: adBoard.address,
        desc: adBoard.desc,
        price: adBoard.price,
        startDate: adBoard.startDate, 
        endDate: adBoard.endDate, 
      };

      const popupResult = await createPopupStore(popupPayload, files);

      if (!popupResult?.id) {
        setModal({
          isOpen: true,
          message: "팝업 등록에 실패했습니다: ID를 가져오지 못했습니다.",
          onClose: () => setModal(prev => ({ ...prev, isOpen: false })),
        });
        return;
      }

      const adPayload = {
        title: adBoard.storeName,
        content: adBoard.desc,
        contact: "010-0000-0000",
        externalUrl: adBoard.address,
        writerId: 1, // TODO: 로그인 연동
        price: adBoard.price,
        thumbnailIndex: thumbnailIdx,
        popupStoreId: popupResult.id,
      };

      const adResult = await createAdWithImages(adPayload, files);

      if (adResult?.id) {
       const successMessage = adResult.message || "홍보글 등록 성공!";
        
        setModal({
          isOpen: true,
          message: successMessage,
          onClose: () => {
                setModal(prev => ({ ...prev, isOpen: false }));
                navigate(`/boards/ad/${adResult.id}/reservation`, {
                    state: {
                      popupStoreId: popupResult.id,
                      startDate: adBoard.startDate, 
                      endDate: adBoard.endDate, 
                    },
                });
            },
          onConfirm: null,
        });
      } else {
        setModal({
          isOpen: true,
          message: "홍보글 등록은 되었지만 ID를 가져오지 못했습니다.",
          onClose: () => {
                setModal(prev => ({ ...prev, isOpen: false }));
                navigate("/boards/ad");
            },
          onConfirm: null,
        });
      }
    } catch (e) {
      console.error(e);
      setModal({
        isOpen: true,
        message: "팝업 홍보글 등록 과정에서 오류가 발생했습니다.",
        onClose: () => setModal(prev => ({ ...prev, isOpen: false })),
        onConfirm: null,
      });
    }
  };


  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded shadow-md mt-10">
      <h2 className="text-3xl font-bold mb-8 border-b pb-4">홍보글 등록</h2>

      {/* 제목 */}
      <FormRow label="제목">
        <input
          className="w-full p-3 rounded-2xl border border-gray-300 shadow-sm focus:ring focus:ring-blue-300"
          name="storeName"
          type="text"
          value={adBoard.storeName}
          onChange={handleChange}
          placeholder="제목을 입력하세요"
        />
      </FormRow>

      {/* 주소 */}
      <FormRow label="주소">
        <input
          className="w-full p-3 rounded-2xl border border-gray-300 shadow-sm focus:ring focus:ring-blue-300"
          name="address"
          type="text"
          value={adBoard.address}
          onChange={handleChange}
          placeholder="주소를 입력하세요"
        />
      </FormRow>

      {/* 운영 시작일 */}
      <FormRow label="운영 시작일">
        <input
          className="w-full p-3 rounded-2xl border border-gray-300"
          name="startDate"
          type="date"
          value={adBoard.startDate}
          onChange={handleChange}
        />
      </FormRow>

      {/* 운영 종료일 */}
      <FormRow label="운영 종료일">
        <input
          className="w-full p-3 rounded-2xl border border-gray-300"
          name="endDate"
          type="date"
          value={adBoard.endDate}
          onChange={handleChange}
        />
      </FormRow>

      {/* 가격 */}
      <FormRow label="입장 가격">
        <input
          className="w-full p-3 rounded-2xl border border-gray-300 shadow-sm focus:ring focus:ring-blue-300"
          name="price"
          type="number"
          value={adBoard.price}
          onChange={handleChange}
          placeholder="가격을 입력하세요"
        />
      </FormRow>

      {/* 내용 */}
      <FormRow label="내용">
        <textarea
          className="w-full p-3 rounded-2xl border border-gray-300 shadow-sm h-48 focus:ring focus:ring-blue-300"
          name="desc"
          value={adBoard.desc}
          onChange={handleChange}
          placeholder="내용을 입력하세요."
        />
      </FormRow>

      {/* 이미지 업로드 */}
      <FormRow label="이미지 첨부">
        <div className="w-full flex flex-col gap-4">
          <label className="w-32 h-32 flex items-center justify-center border-2 border-dashed border-gray-400 rounded-2xl cursor-pointer hover:bg-gray-50">
            <span className="text-3xl text-gray-500">＋</span>
            <input
              type="file"
              multiple
              accept="image/*"
              ref={fileRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {previews.length > 0 && (
            <div className="flex gap-4 flex-wrap">
              {previews.map((src, idx) => (
                <div
                  key={idx}
                  className="relative cursor-pointer"
                  onClick={() => setThumbnailIdx(idx)}
                >
                  <img
                    src={src}
                    alt={`preview-${idx}`}
                    className={`w-32 h-32 object-cover border rounded-2xl ${
                      idx === thumbnailIdx ? "ring-4 ring-blue-500" : ""
                    }`}
                  />
                  {idx === thumbnailIdx && (
                    <span className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                      대표
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage(idx);
                    }}
                    className="absolute top-1 right-1 bg-gray-700 text-white text-xs px-1 rounded-full hover:bg-black"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </FormRow>

      {/* 버튼 */}
      <div className="flex justify-between border-t pt-6">
        <button
          type="button"
          className="rounded-2xl px-6 py-3 bg-gray-200 hover:bg-gray-300"
          onClick={() => navigate(-1)}
        >
          이전
        </button>
        <button
          type="button"
          className="rounded-2xl px-6 py-3 bg-blue-500 text-white hover:bg-blue-600"
          onClick={handleSubmit}
        >
          등록
        </button>
      </div>
      {modal.isOpen && (
            <AlertModal
                title={modal.title}
                message={modal.message}
                onClose={modal.onClose}
                onConfirm={modal.onConfirm}
            />
        )}
    </div>
  );
};

export default AdBoardComponent;
