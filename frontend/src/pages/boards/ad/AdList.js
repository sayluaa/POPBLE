// src/pages/boards/ad/AdList.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAdList } from "../../../api/AdBoardApi";
import { API_SERVER_HOST } from "../../../api/config";

export default function AdList() {
  const [pageData, setPageData] = useState(null); // PageResponseDTO 전체
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1); // 현재 페이지
  const navigate = useNavigate();

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoading(true);
        setError("");
        // ✅ 한 페이지에 10개씩 요청
        const data = await getAdList({ order: "latest", page, size: 10 });
        if (!ignore) setPageData(data);
      } catch (e) {
        if (!ignore) setError(e?.message || "목록을 불러오지 못했어요");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [page]); // ✅ page 변경될 때마다 다시 fetch

  if (loading) return <SkeletonState />;
  if (error) return <ErrorState msg={error} />;
  if (!pageData) return null;

  const posts = pageData.dtoList ?? [];

  return (
    <div className="p-6">
      {/* 상단 제목 + 글쓰기 */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">홍보게시판</h1>
        <button
          onClick={() => navigate("/boards/ad/write")}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:brightness-95 active:translate-y-[1px]"
        >
          글 작성
        </button>
      </div>

      {/* ✅ 2열 × 5행 (페이지당 10개) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.length === 0 ? (
          <div className="col-span-2 text-center text-gray-500 py-10">
            게시글이 없습니다.
          </div>
        ) : (
          posts.map((post) => <AdCard key={post.id} post={post} />)
        )}
      </div>

      {/* ✅ 페이지네이션 */}
      <div className="flex justify-center mt-8 gap-2 flex-wrap">
        {pageData.prev && (
          <button
            onClick={() => setPage(pageData.prevPage)}
            className="px-3 py-1 rounded border bg-gray-100 hover:bg-gray-200"
          >
            이전
          </button>
        )}

        {pageData.pageNumList?.map((num) => (
          <button
            key={num}
            onClick={() => setPage(num)}
            className={`px-3 py-1 rounded border ${
              num === pageData.current
                ? "bg-blue-500 text-white"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            {num}
          </button>
        ))}

        {pageData.next && (
          <button
            onClick={() => setPage(pageData.nextPage)}
            className="px-3 py-1 rounded border bg-gray-100 hover:bg-gray-200"
          >
            다음
          </button>
        )}
      </div>
    </div>
  );
}

function AdCard({ post }) {
  const title = post?.title ?? "제목 없음";
  const content = post?.content ?? "";
  const writer = post?.writerName || "익명";
  const imgSrc = pickImage(post);
  const href = `/boards/ad/${post?.id}`;

  return (
    <Link to={href} className="block group h-full">
      <article className="h-full rounded-2xl border bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow">
        <div className="grid grid-cols-[120px_1fr] gap-3 p-3 items-stretch">
          <div className="relative h-[120px] w-[120px] overflow-hidden rounded-xl">
            {imgSrc ? (
              <img
                src={imgSrc}
                alt=""
                className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                loading="lazy"
              />
            ) : (
              <NoImagePlaceholder />
            )}
          </div>
          <div className="flex flex-col">
            <h3 className="font-semibold leading-snug line-clamp-2">{title}</h3>
            {content && (
              <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                {content}
              </p>
            )}
            <div className="mt-auto text-xs text-gray-500 truncate">
              {writer}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

function SkeletonState() {
  return (
    <div className="p-6 space-y-6">
      <div className="h-7 w-48 bg-gray-200 rounded animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 10 }).map((_, i) => (
          <CardPlaceholder key={i} />
        ))}
      </div>
    </div>
  );
}

function ErrorState({ msg }) {
  return (
    <div className="p-6 space-y-4">
      <div className="text-red-600">{msg}</div>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 rounded-xl border shadow-sm hover:shadow"
      >
        새로고침
      </button>
    </div>
  );
}

function CardPlaceholder() {
  return (
    <div className="rounded-2xl border bg-white shadow-sm p-3">
      <div className="grid grid-cols-[120px_1fr] gap-3">
        <div className="h-[120px] w-[120px] rounded-xl bg-gray-200 animate-pulse" />
        <div className="space-y-2 py-1">
          <div className="h-4 bg-gray-200 w-3/4 rounded animate-pulse" />
          <div className="h-3 bg-gray-200 w-5/6 rounded animate-pulse" />
          <div className="h-3 bg-gray-200 w-2/3 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}

function NoImagePlaceholder() {
  return (
    <div className="h-full w-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded-xl">
      <div className="text-gray-500 text-xs">이미지 없음</div>
    </div>
  );
}

// ✅ 백엔드의 thumbnail, imageList, detailImages 모두 대응
function pickImage(post) {
  if (post?.thumbnail) {
    return `${API_SERVER_HOST}${post.thumbnail}`;
  }

  const first = post?.imageList?.[0];
  if (first) {
    if (first.url) return `${API_SERVER_HOST}${first.url}`;
    if (first.folder && first.storedName)
      return `${API_SERVER_HOST}/uploads/${first.folder}/${first.storedName}`;
  }

  const detailFirst = post?.detailImages?.[0];
  if (detailFirst) {
    return `${API_SERVER_HOST}${detailFirst.path}/${detailFirst.uuid}_${detailFirst.originalName}`;
  }

  return null;
}
