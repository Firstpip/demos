import { Badge } from "@/components/ui/badge";

const orderStatusMap: Record<string, { label: string; className: string }> = {
  pending: { label: "주문확인중", className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" },
  confirmed: { label: "주문확인", className: "bg-blue-100 text-blue-800 hover:bg-blue-100" },
  shipping: { label: "배송중", className: "bg-indigo-100 text-indigo-800 hover:bg-indigo-100" },
  delivered: { label: "배송완료", className: "bg-green-100 text-green-800 hover:bg-green-100" },
  cancelled: { label: "주문취소", className: "bg-red-100 text-red-800 hover:bg-red-100" },
};

const settlementStatusMap: Record<string, { label: string; className: string }> = {
  pending: { label: "대기중", className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" },
  processing: { label: "처리중", className: "bg-blue-100 text-blue-800 hover:bg-blue-100" },
  confirmed: { label: "확인됨", className: "bg-indigo-100 text-indigo-800 hover:bg-indigo-100" },
  completed: { label: "완료", className: "bg-green-100 text-green-800 hover:bg-green-100" },
};

export function OrderStatusBadge({ status }: { status: string }) {
  const info = orderStatusMap[status] ?? { label: status, className: "" };
  return <Badge variant="secondary" className={info.className}>{info.label}</Badge>;
}

export function SettlementStatusBadge({ status }: { status: string }) {
  const info = settlementStatusMap[status] ?? { label: status, className: "" };
  return <Badge variant="secondary" className={info.className}>{info.label}</Badge>;
}
