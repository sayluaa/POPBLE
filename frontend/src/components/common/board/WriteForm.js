import { useState, useRef } from "react";
import { postAddWithImages } from "../../../api/BoardApi"; // ✅ 이미지 포함 API
import ResultModal from "./ResultModal";
import AlertModal from "../../common/AlertModal";

const BOARD_TYPES = [
  { value: "GENERAL", label: "자유게시판" },
  { value: "NOTICE", label: "공지게시판" },
  { value: "QNA", label: "질문게시판" },
];

const initState = {
  id: null,
  type: "",
  title: "",
  content: "",
  writerId: "",
};

const WriteForm = () => {
  const [board, setBoard] = useState({ ...initState });
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [thumbnailIdx, setThumbnailIdx] = useState(0); // ✅ 대표 이미지
  const [result, setResult] = useState(null);
  const fileRef = useRef(null);

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState("");

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successModalMessage, setSuccessModalMessage] = useState("");

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
    setErrorModalMessage("");
  };

  const showAlertErrorModal = (message) => {
      setErrorModalMessage(message);
      setShowErrorModal(true);
  }

 
  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setSuccessModalMessage("");
   
    window.location.href = "/popble/boards/all"; 
  };


  const showAlertSuccessModal = (message) => {
      setSuccessModalMessage(message);
      setShowSuccessModal(true);
  }

  // 입력 변경
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBoard((prev) => ({ ...prev, [name]: value }));
  };

  // 파일 선택
  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    setFiles(selected);

    const previewList = selected.map((file) => URL.createObjectURL(file));
    setPreviews(previewList);

    setThumbnailIdx(0); // 새 업로드 시 첫 번째가 대표
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
      setThumbnailIdx(0); // 대표가 지워지면 0번으로
    } else if (thumbnailIdx > idx) {
      setThumbnailIdx((prev) => prev - 1);
    }
  };

  // 등록
  const handleClickAdd = async () => {
    if (!board.type || !board.title.trim() || !board.content.trim()) {
      showAlertErrorModal("필수 항목을 모두 입력하세요.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append(
        "board",
        new Blob(
          [
            JSON.stringify({
              type: board.type,
              title: board.title,
              content: board.content,
              writerId: Number(board.writerId),
              thumbnailIndex: thumbnailIdx,
            }),
          ],
          { type: "application/json" }
        )
      );

      files.forEach((file) => formData.append("images", file));

      const res = await postAddWithImages(formData);
      const createId = typeof res === "number" ? res : res?.id ?? null;

      showAlertSuccessModal(`[${createId}]번 글 '${board.title}'이(가) 등록되었습니다.`);

      setBoard({ ...initState });
      setFiles([]);
      setPreviews([]);
      setThumbnailIdx(0);
      if (fileRef.current) fileRef.current.value = "";
    } catch (e) {
      console.error(e);
      showAlertErrorModal("등록 중 오류 발생");
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7]">
      <div className="max-w-4xl mx-auto mt-10 p-6">
        {showSuccessModal && (
            <AlertModal 
              message={`글 등록 완료! ${successModalMessage}`} 
              onClose={handleCloseSuccessModal}
            />
        )}
        {showErrorModal && (
            <AlertModal message={errorModalMessage} onClose={handleCloseErrorModal} />
        )}

        <h2 className="text-2xl font-bold mb-8">게시글 등록</h2>
        <hr className="mb-8" />

        {/* 카테고리 */}
        <div className="flex items-center mb-6">
          <label className="w-1/5 font-medium">카테고리</label>
          <select
            name="type"
            value={board.type}
            onChange={handleChange}
            className="border rounded p-2 w-2/5"
          >
            <option value="">게시판 선택</option>
            {BOARD_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* 제목 */}
        <div className="flex items-center mb-6">
          <label className="w-1/5 font-medium">제목</label>
          <input
            type="text"
            name="title"
            value={board.title}
            onChange={handleChange}
            className="border rounded p-2 w-4/5"
          />
        </div>

        {/* 내용 */}
        <div className="flex items-start mb-6">
          <label className="w-1/5 font-medium mt-2">내용</label>
          <textarea
            name="content"
            value={board.content}
            onChange={handleChange}
            className="border rounded p-2 w-4/5 h-48 resize-none"
          />
        </div>

        {/* 첨부 이미지 */}
        <div className="flex items-start mb-8">
          <label className="w-1/5 font-medium mt-2">첨부 이미지</label>
          <div className="w-4/5 flex flex-col gap-4">
            <label className="w-24 h-32 border flex items-center justify-center cursor-pointer rounded">
              <span className="text-3xl">+</span>
              <input
                type="file"
                multiple
                accept="image/*"
                ref={fileRef}
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {/* 미리보기 */}
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
                      className={`w-24 h-24 object-cover border rounded ${
                        idx === thumbnailIdx ? "ring-4 ring-blue-500" : ""
                      }`}
                    />
                    {idx === thumbnailIdx && (
                      <span className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-2 py-0.5 rounded">
                        대표
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(idx);
                      }}
                      className="absolute top-1 right-1 bg-gray-700 text-white text-xs px-1 rounded hover:bg-black"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <hr className="mb-8" />

        {/* 버튼 */}
        <div className="flex justify-center gap-4">
          <button
            type="button"
            onClick={() => (window.location.href = "/popble/boards/all")}
            className="w-28 py-2 border rounded bg-white hover:bg-gray-100"
          >
            이전
          </button>
          <button
            type="button"
            onClick={handleClickAdd}
            className="w-28 py-2 rounded bg-blue-300 text-black hover:bg-blue-400"
          >
            등록
          </button>
        </div>
      </div>
    </div>
  );
};

export default WriteForm;
