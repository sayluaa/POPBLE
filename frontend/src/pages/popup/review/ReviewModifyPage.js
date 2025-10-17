import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import BasicMenu from "../../../components/BasicMenu";

const dummyPost = {
    id:1,
    title:"리뷰 게시판 테스트",
    content:"테스트 중",
    writer:"ㅇㅇ",
    createTime:"2025-09-20"
}

const ReviewModifyPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [post, setPost] = useState(null)

    useEffect(() => {
        setPost(dummyPost)
    }, [id])
    
    if (!post) return <div>로딩 중...</div>

  const goModify = () => {
    console.log("수정 버튼 클릭, 이동할 id:", id)
    navigate(`/popup/review/modify/${id}`)
  }

    return (
    <div className="p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
      <div className="text-sm text-gray-500 mb-6">
        작성자: <span className="font-semibold">{post.writer}</span> | {post.createTime}
      </div>
      <div className="mb-8 leading-relaxed">{post.content}</div>

      <div className="flex justify-between">
        <Link
          to="/boards/review"
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          목록
        </Link>
        <div className="space-x-2">
          <button
            type="button"
            onClick={goModify}
            className="px-4 py-2 bg-primaryColor rounded text-black"
          >
            수정
          </button>
        </div>
      </div>
    </div>
  )
    
}
export default ReviewModifyPage