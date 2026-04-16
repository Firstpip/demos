'use client'
interface Props { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }
export default function Modal({ isOpen, onClose, title, children }: Props) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-[#E2E8F0] shrink-0">
          <h3 className="text-lg font-bold text-[#1E293B]">{title}</h3>
          <button onClick={onClose} className="text-[#64748B] hover:text-[#1E293B] text-xl">&times;</button>
        </div>
        <div className="p-4 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  )
}
