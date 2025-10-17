// src/pages/boards/ad/AdWriteForm.jsx
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createAd, createAdWithImages } from "../../../api/AdBoardApi";
import AlertModal from "../../common/AlertModal";

export default function AdWriteForm() {
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    title: "",
    content: "",
    contact: "",
    externalUrl: "",
    publishStartDate: "",
    publishEndDate: "",
    writerId: "1", // ✅ 테스트용 (로그인 연동 후 제거 예정)
  });

  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleCloseModal = () => {
    setShowModal(false);
    setModalMessage("");
  };

  const showAlertModal = (message) => {
      setModalMessage(message);
      setShowModal(true);
  }

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onPickImage = () => fileRef.current?.click();

  const onFileChange = (e) => {
    const fileList = Array.from(e.target.files || []);
    setFiles(fileList);
  };

  // 🔹 파일 변경 시 미리보기 URL 생성
  useEffect(() => {
    previews.forEach((u) => URL.revokeObjectURL(u));
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]); // ✅ previews는 의존성에 넣지 않고 경고 무시

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      let id;
      if (files.length > 0) {
        id = await createAdWithImages(form, files);
      } else {
        id = await createAd(form);
      }
      navigate(`/boards/ad/${id}`);
    } catch (err) {
      console.error("등록 실패:", err);
      showAlertModal("게시글 등록에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  return (
    <form className="p-6 space-y-4" onSubmit={onSubmit}>
      <input
        name="title"
        value={form.title}
        onChange={onChange}
        placeholder="제목"
        className="w-full border p-2 rounded"
        required
      />
      <textarea
        name="content"
        value={form.content}
        onChange={onChange}
        placeholder="내용"
        rows={6}
        className="w-full border p-2 rounded"
        required
      />
      <input
        name="contact"
        value={form.contact}
        onChange={onChange}
        placeholder="연락처"
        className="w-full border p-2 rounded"
      />
      <input
        name="externalUrl"
        value={form.externalUrl}
        onChange={onChange}
        placeholder="외부 링크"
        className="w-full border p-2 rounded"
      />
      <div className="flex gap-2">
        <input
          type="date"
          name="publishStartDate"
          value={form.publishStartDate}
          onChange={onChange}
          className="border p-2 rounded"
        />
        <input
          type="date"
          name="publishEndDate"
          value={form.publishEndDate}
          onChange={onChange}
          className="border p-2 rounded"
        />
      </div>

      <input
        name="writerId"
        value={form.writerId}
        onChange={onChange}
        placeholder="작성자 ID (테스트용)"
        type="number"
        className="w-full border p-2 rounded"
      />

      {/* 이미지 업로드 */}
      <div>
        <button
          type="button"
          onClick={onPickImage}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          이미지 선택
        </button>
        <input
          type="file"
          ref={fileRef}
          multiple
          hidden
          onChange={onFileChange}
        />

        {/* 🔹 여러 장 세로 나열 + 반응형 (600px 제한) */}
        {previews.length > 0 && (
          <div className="flex flex-col gap-4 mt-3 items-start">
            {previews.map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                className="w-full max-w-[600px] h-auto rounded"
              />
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        등록
      </button>
      {showModal && (
          <AlertModal message={modalMessage} onClose={handleCloseModal} />
      )}
    </form>
  );
}
