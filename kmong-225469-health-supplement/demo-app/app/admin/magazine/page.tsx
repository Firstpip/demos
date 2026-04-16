'use client'
import { articles } from '../../data/magazine'
import { useToast } from '../../components/Toast'

export default function AdminMagazinePage() {
  const { toast } = useToast()
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-[#1E293B]">매거진 관리</h1>
        <button onClick={() => toast('글 작성 기능 (데모)')} className="bg-[#22C55E] text-white text-sm px-4 py-2 rounded-lg">+ 글 작성</button>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="bg-[#F8FAFC] text-[#64748B] text-xs"><th className="py-3 px-4 text-left">제목</th><th className="py-3 px-4 text-left">카테고리</th><th className="py-3 px-4 text-left">날짜</th><th className="py-3 px-4 text-center">관리</th></tr></thead>
          <tbody>{articles.map(a => (
            <tr key={a.id} className="border-t border-[#E2E8F0]"><td className="py-3 px-4 font-medium">{a.title}</td><td className="py-3 px-4 text-xs">{a.category}</td><td className="py-3 px-4">{a.date}</td>
            <td className="py-3 px-4 text-center"><button onClick={() => toast('수정 (데모)')} className="text-xs text-[#3B82F6] mr-2">수정</button><button onClick={() => toast('삭제 (데모)')} className="text-xs text-red-500">삭제</button></td></tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  )
}
