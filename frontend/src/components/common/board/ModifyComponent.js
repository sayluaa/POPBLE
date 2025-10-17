// src/components/common/board/ModifyComponent.js
import { useEffect, useRef, useState } from "react";

import { useNavigate } from "react-router-dom";
import { getOne, patchOne, patchImages } from "../../../api/BoardApi";
import AlertModal from "../../common/AlertModal";


// 공통 Row
const FormRow = ({ label, children }) => (
  <div className="flex justify-center">
    <div className="relative mb-4 w-full flex items-center">
      <div className="w-1/5 p-3 font-bold text-left">{label}</div>
      <div className="w-4/5">{children}</div>
    </div>
  </div>
);


const ModifyComponent = ({ id }) => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ title: "", content: "", type: "GENERAL" }); // ✅ enum 값 그대로 유지
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [post, setPost] = useState(null);
  const [existingImgs, setExistingImgs] = useState([]); // 서버 이미지
  const [newFiles, setNewFiles] = useState([]);         // 새 이미지 파일
  const [allImages, setAllImages] = useState([]);       // 전체 표시용
  const [thumbnailIdx, setThumbnailIdx] = useState(0);  // 대표 이미지 인덱스
  const fileRef = useRef(null);

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


  // 게시글 불러오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getOne(id);
        setPost(data);
        setForm({
          title: data.title || "",
          content: data.content || "",
          type: data.type || "GENERAL", // ✅ 그대로 enum 값
        });

        // 서버 이미지 -> allImages 반영
        const serverImgs = (data.images || []).map((im, i) => ({
          id: im.id,
          url: im.url,
          name: im.originalName || `image-${i + 1}`,
          isNew: false,
          keep: true,
        }));
        setExistingImgs(serverImgs);
        setAllImages(serverImgs);

        // 첫 번째 이미지를 대표로 지정
        if (serverImgs.length > 0) setThumbnailIdx(0);
      } catch (err) {
        console.error("게시글 불러오기 실패:", err);
        setError("게시글을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // 입력 변경
  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // 파일 추가
  const onFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    const newImgs = files.map(f => ({
      file: f,
      url: URL.createObjectURL(f),
      name: f.name,
      isNew: true,
    }));

    setNewFiles(prev => [...prev, ...files]);
    setAllImages(prev => [...prev, ...newImgs]);

    if (fileRef.current) fileRef.current.value = "";
    if (allImages.length === 0 && newImgs.length > 0) {
      setThumbnailIdx(0);
    }
  };

  // 이미지 제거
  const handleRemoveImage = (idx) => {
    const target = allImages[idx];

    if (target.isNew) {
      // 새 이미지면 newFiles에서도 제거
      const updatedNewFiles = newFiles.filter((_, i) => i !== idx);
      setNewFiles(updatedNewFiles);
    } else {
      // 기존 이미지면 keep = false
      setExistingImgs(arr =>
        arr.map(it => (it.id === target.id ? { ...it, keep: false } : it))
      );
    }

    // 화면에서 제거
    const updatedAll = allImages.filter((_, i) => i !== idx);
    setAllImages(updatedAll);

    // 대표 이미지 인덱스 보정
    if (thumbnailIdx === idx) {
      setThumbnailIdx(0);
    } else if (thumbnailIdx > idx) {
      setThumbnailIdx(thumbnailIdx - 1);
    }
  };

  // 저장
  const onSubmit = async () => {
    try {
      await patchOne(id, form); // ✅ enum 값 그대로 전송

      const keepIds = existingImgs.filter(it => it.keep).map(it => it.id);
      await patchImages(id, keepIds, newFiles);

      const typeSlug = form.type.toLowerCase(); // ✅ 라우팅용만 소문자로
      navigate(`/boards/${typeSlug}/${id}`);
    } catch (err) {
      console.error("수정 실패:", err);
      showAlertModal("수정에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    }
  };

  if (loading) return <div>로딩중…</div>;

  return (
    <div className="border-2 border-sky-200 mt-10 p-4 rounded">
      {error && <div className="p-3 rounded bg-red-50 text-red-600 text-sm">{error}</div>}

      {/* 게시판 선택 드롭다운 ✅ AD 제거 */}
      <FormRow label="게시판">
        <select
          name="type"
          value={form.type}
          onChange={onChange}
          className="w-full p-3 rounded border border-neutral-500 shadow-md"
        >
          <option value="GENERAL">자유</option>
          <option value="QNA">질문</option>
          <option value="NOTICE">공지</option>
        </select>
      </FormRow>

      {/* 제목 */}
      <FormRow label="제목">
        <input
          className="w-full p-3 rounded border border-neutral-500 shadow-md"
          name="title"
          value={form.title}
          onChange={onChange}
          maxLength={200}
        />
      </FormRow>

      {/* 내용 */}
      <FormRow label="내용">
        <textarea
          className="w-full p-3 rounded border border-neutral-500 shadow-md h-64"
          name="content"
          value={form.content}
          onChange={onChange}
          placeholder="내용을 입력하세요."
        />
      </FormRow>

      {/* 이미지 */}
      <FormRow label="이미지">
        <div className="flex flex-col gap-4 w-full">
          <div className="flex items-center gap-3">
            <input
              id="fileInput"
              ref={fileRef}
              type="file"
              multiple
              accept="image/*"
              onChange={onFileChange}
              className="hidden"
            />
            <label
              htmlFor="fileInput"
              className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600"
            >
              파일 선택
            </label>
            <span className="text-sm text-gray-600">
              {newFiles.length === 0
                ? "선택된 파일 없음"
                : newFiles.length === 1
                ? newFiles[0].name
                : `${newFiles.length}개 파일 선택됨`}
            </span>
          </div>

          {allImages.length > 0 && (
            <div className="flex gap-4 flex-wrap border-b border-gray-300 pb-4">
              {allImages.map((img, idx) => (
                <div
                  key={idx}
                  className="relative cursor-pointer"
                  onClick={() => setThumbnailIdx(idx)}
                >
                  <img
                    src={img.url}
                    alt={`preview-${idx}`}
                    className={`w-32 h-32 object-cover border rounded ${
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
      </FormRow>

      {/* 저장 버튼 */}
      <div className="flex justify-end">
        <button
          onClick={onSubmit}
          className="rounded p-4 w-36 bg-blue-500 text-xl text-white hover:bg-blue-600"
        >
          저장
        </button>
      </div>
      {showModal && (
          <AlertModal message={modalMessage} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default ModifyComponent;
