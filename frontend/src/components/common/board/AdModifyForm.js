// src/pages/boards/ad/AdModifyForm.jsx
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAdOne,
  updateAdWithImages,
} from "../../../api/AdBoardApi"; // 🔹 이미지 포함 API만 사용
import AlertModal from "../../common/AlertModal";

export default function AdModifyForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    content: "",
    externalUrl: "",
    contact: "",
    publishStartDate: "",
    publishEndDate: "",
    tags: "",
  });

  const [files, setFiles] = useState([]); // 새 파일
  const [previews, setPreviews] = useState([]); // 새 파일 미리보기
  const [existingImages, setExistingImages] = useState([]); // 기존 이미지
  const [keepImages, setKeepImages] = useState([]); // 유지할 기존 이미지
  const [thumbnailIdx, setThumbnailIdx] = useState(0); // 대표 이미지 인덱스

  const fileRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  // ===== 기존 데이터 로드 =====
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getAdOne(id);
        setForm({
          title: data.title || "",
          content: data.content || "",
          externalUrl: data.externalUrl || "",
          contact: data.contact || "",
          publishStartDate: data.publishStartDate
            ? data.publishStartDate.split("T")[0]
            : "",
          publishEndDate: data.publishEndDate
            ? data.publishEndDate.split("T")[0]
            : "",
          tags: data.tags ? data.tags.join(",") : "",
        });

        if (data.imageList && data.imageList.length > 0) {
          setExistingImages(data.imageList);
          setKeepImages(data.imageList.map((img) => img.url));
        }
      } catch (e) {
        setError(e.message || "데이터 불러오기 실패");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onFileChange = (e) => {
    const selected = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selected]);

    const previewList = selected.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...previewList]);

    if (files.length === 0 && existingImages.length === 0) {
      setThumbnailIdx(0);
    }
  };

  const handleRemoveExisting = (idx) => {
    const imgToRemove = existingImages[idx];
    setExistingImages(existingImages.filter((_, i) => i !== idx));
    setKeepImages(keepImages.filter((url) => url !== imgToRemove.url));

    if (thumbnailIdx === idx) {
      setThumbnailIdx(0);
    } else if (thumbnailIdx > idx) {
      setThumbnailIdx((prev) => prev - 1);
    }
  };

  const handleRemoveNew = (idx) => {
    setFiles(files.filter((_, i) => i !== idx));
    setPreviews(previews.filter((_, i) => i !== idx));

    if (thumbnailIdx === existingImages.length + idx) {
      setThumbnailIdx(0);
    } else if (thumbnailIdx > existingImages.length + idx) {
      setThumbnailIdx((prev) => prev - 1);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      // ✅ 반드시 "board" 로 맞춰야 컨트롤러와 일치
      formData.append(
        "board",
        new Blob(
          [
            JSON.stringify({
              ...form,
              tags: form.tags ? form.tags.split(",").map((t) => t.trim()) : [],
              thumbnailIndex: thumbnailIdx,
            }),
          ],
          { type: "application/json" }
        )
      );

      files.forEach((file) => formData.append("images", file));
      keepImages.forEach((url) => formData.append("keepImages", url));

      await updateAdWithImages(id, formData);
      showAlertModal("수정 완료!");
      navigate(`/boards/ad/${id}`);
    } catch (err) {
      console.error(err);
      showAlertModal("수정 실패: " + (err.message || "알 수 없는 오류"));
    }
  };

  const onBack = () => navigate(-1);

  if (loading) return <div className="p-6">로딩 중...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="w-full flex justify-center bg-[#faf5ef] min-h-[100vh]">
      <div className="w-full max-w-[920px] px-6 sm:px-10 py-10">
        <h1 className="text-3xl font-bold mb-8">홍보게시글 수정</h1>

        <form onSubmit={onSubmit} className="space-y-8">
          <FormRow label="제목">
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={onChange}
              placeholder="제목을 입력하세요"
              className="w-full rounded-lg border px-4 py-3"
              required
            />
          </FormRow>

          <FormRow label="내용">
            <textarea
              name="content"
              value={form.content}
              onChange={onChange}
              className="min-h-[180px] w-full rounded-lg border px-4 py-3"
            />
          </FormRow>

          <FormRow label="외부 링크">
            <input
              type="url"
              name="externalUrl"
              value={form.externalUrl}
              onChange={onChange}
              className="w-full rounded-lg border px-4 py-3"
            />
          </FormRow>

          <FormRow label="연락처">
            <input
              type="text"
              name="contact"
              value={form.contact}
              onChange={onChange}
              className="w-full rounded-lg border px-4 py-3"
            />
          </FormRow>

          <FormRow label="게시 기간">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                name="publishStartDate"
                value={form.publishStartDate}
                onChange={onChange}
                className="w-full rounded-lg border px-4 py-3"
              />
              <input
                type="date"
                name="publishEndDate"
                value={form.publishEndDate}
                onChange={onChange}
                className="w-full rounded-lg border px-4 py-3"
              />
            </div>
          </FormRow>

          <FormRow label="태그">
            <input
              type="text"
              name="tags"
              value={form.tags}
              onChange={onChange}
              className="w-full rounded-lg border px-4 py-3"
            />
          </FormRow>

          <FormRow label="이미지">
            <div className="flex flex-col gap-4 w-full">
              <input
                type="file"
                multiple
                accept="image/*"
                ref={fileRef}
                onChange={onFileChange}
              />

              {existingImages.length > 0 && (
                <div className="flex gap-4 flex-wrap">
                  {existingImages.map((img, idx) => (
                    <ImagePreview
                      key={idx}
                      src={`${process.env.REACT_APP_API_SERVER}${img.url}`}
                      idx={idx}
                      isThumbnail={thumbnailIdx === idx}
                      onClick={() => setThumbnailIdx(idx)}
                      onRemove={() => handleRemoveExisting(idx)}
                    />
                  ))}
                </div>
              )}

              {previews.length > 0 && (
                <div className="flex gap-4 flex-wrap">
                  {previews.map((src, idx) => {
                    const absoluteIdx = existingImages.length + idx;
                    return (
                      <ImagePreview
                        key={absoluteIdx}
                        src={src}
                        idx={absoluteIdx}
                        isThumbnail={thumbnailIdx === absoluteIdx}
                        onClick={() => setThumbnailIdx(absoluteIdx)}
                        onRemove={() => handleRemoveNew(idx)}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </FormRow>

          <div className="pt-6 flex items-center justify-between border-t">
            <button
              type="button"
              onClick={onBack}
              className="rounded-xl bg-white px-6 py-3 text-sm font-medium border hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="submit"
              className="rounded-xl bg-green-500 px-8 py-3 text-sm font-semibold text-white hover:brightness-95"
            >
              수정 완료
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ===== 재사용 가능한 FormRow 컴포넌트 =====
const FormRow = ({ label, children }) => (
  <div className="grid grid-cols-[140px_1fr] gap-6 items-start">
    <div className="pt-3 text-sm font-medium text-gray-800">{label}</div>
    <div>{children}</div>
  </div>
);

// ===== 이미지 미리보기 컴포넌트 =====
const ImagePreview = ({ src, idx, isThumbnail, onClick, onRemove }) => (
  <div className="relative cursor-pointer" onClick={onClick}>
    <img
      src={src}
      alt={`preview-${idx}`}
      className={`w-32 h-32 object-cover border rounded ${
        isThumbnail ? "ring-4 ring-blue-500" : ""
      }`}
    />
    {isThumbnail && (
      <span className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-2 py-0.5 rounded">
        대표
      </span>
    )}
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onRemove();
      }}
      className="absolute top-1 right-1 bg-gray-700 text-white text-xs px-1 rounded hover:bg-black"
    >
      ✕
    </button>
  </div>
);
