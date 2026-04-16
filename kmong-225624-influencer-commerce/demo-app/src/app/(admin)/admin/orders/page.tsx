"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrderStatusBadge } from "@/components/status-badge";
import {
  orders,
  influencers,
  vendors,
  consumers,
  getProduct,
  getInfluencer,
  getVendor,
  formatKRW,
} from "@/lib/data";
import type { Order } from "@/lib/data";
import { Eye } from "lucide-react";

export default function AdminOrdersPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [infFilter, setInfFilter] = useState("all");
  const [vendorFilter, setVendorFilter] = useState("all");
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (statusFilter !== "all" && o.status !== statusFilter) return false;
      if (infFilter !== "all" && o.influencerId !== infFilter) return false;
      if (
        vendorFilter !== "all" &&
        !o.items.some((it) => it.vendorId === vendorFilter)
      )
        return false;
      return true;
    });
  }, [statusFilter, infFilter, vendorFilter]);

  function getConsumerName(userId: string) {
    const c = consumers.find((c) => c.id === userId);
    return c?.name ?? userId;
  }

  return (
    <div id="page-admin-orders" className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">주문 관리</h2>
        <p className="text-gray-500 mt-1">전체 주문을 관리합니다</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4" id="admin-orders">
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "all")}>
              <SelectTrigger className="w-[160px]" id="select-order-status">
                <SelectValue placeholder="주문 상태" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 상태</SelectItem>
                <SelectItem value="pending">주문확인중</SelectItem>
                <SelectItem value="confirmed">주문확인</SelectItem>
                <SelectItem value="shipping">배송중</SelectItem>
                <SelectItem value="delivered">배송완료</SelectItem>
                <SelectItem value="cancelled">주문취소</SelectItem>
              </SelectContent>
            </Select>
            <Select value={infFilter} onValueChange={(v) => setInfFilter(v ?? "all")}>
              <SelectTrigger className="w-[180px]" id="select-order-influencer">
                <SelectValue placeholder="인플루언서" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 인플루언서</SelectItem>
                {influencers.map((inf) => (
                  <SelectItem key={inf.id} value={inf.id}>
                    {inf.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={vendorFilter} onValueChange={(v) => setVendorFilter(v ?? "all")}>
              <SelectTrigger className="w-[180px]" id="select-order-vendor">
                <SelectValue placeholder="공급사" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 공급사</SelectItem>
                {vendors.map((v) => (
                  <SelectItem key={v.id} value={v.id}>
                    {v.companyName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>주문번호</TableHead>
                <TableHead>고객명</TableHead>
                <TableHead>상품</TableHead>
                <TableHead>금액</TableHead>
                <TableHead>인플루언서</TableHead>
                <TableHead>공급사</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>날짜</TableHead>
                <TableHead>상세</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((order) => {
                const firstItem = order.items[0];
                const prod = firstItem ? getProduct(firstItem.productId) : null;
                const inf = order.influencerId
                  ? getInfluencer(order.influencerId)
                  : null;
                const vendor = firstItem
                  ? getVendor(firstItem.vendorId)
                  : null;
                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-sm">
                      {order.id}
                    </TableCell>
                    <TableCell>{getConsumerName(order.userId)}</TableCell>
                    <TableCell className="max-w-[140px] truncate">
                      {prod?.name ?? "-"}
                    </TableCell>
                    <TableCell>{formatKRW(order.totalAmount)}</TableCell>
                    <TableCell>{inf?.name ?? "-"}</TableCell>
                    <TableCell>{vendor?.companyName ?? "-"}</TableCell>
                    <TableCell>
                      <OrderStatusBadge status={order.status} />
                    </TableCell>
                    <TableCell>{order.createdAt}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDetailOrder(order)}
                        id={`btn-order-detail-${order.id}`}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog
        open={!!detailOrder}
        onOpenChange={(open) => {
          if (!open) setDetailOrder(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>주문 상세 - {detailOrder?.id}</DialogTitle>
          </DialogHeader>
          {detailOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-gray-500">고객</span>
                <span>{getConsumerName(detailOrder.userId)}</span>
                <span className="text-gray-500">주문일</span>
                <span>{detailOrder.createdAt}</span>
                <span className="text-gray-500">배송지</span>
                <span>{detailOrder.shippingAddress}</span>
                <span className="text-gray-500">총 금액</span>
                <span className="font-semibold">
                  {formatKRW(detailOrder.totalAmount)}
                </span>
                <span className="text-gray-500">할인 금액</span>
                <span>{formatKRW(detailOrder.discountAmount)}</span>
                <span className="text-gray-500">상태</span>
                <span>
                  <OrderStatusBadge status={detailOrder.status} />
                </span>
              </div>

              <div className="border-t pt-3">
                <h4 className="font-semibold text-sm mb-2">주문 상품</h4>
                {detailOrder.items.map((item, idx) => {
                  const prod = getProduct(item.productId);
                  const vendor = getVendor(item.vendorId);
                  const inf = item.influencerId
                    ? getInfluencer(item.influencerId)
                    : null;
                  return (
                    <div
                      key={idx}
                      className="text-sm space-y-1 py-2 border-b last:border-0"
                    >
                      <div className="flex justify-between">
                        <span>{prod?.name ?? item.productId}</span>
                        <span>
                          {formatKRW(item.price)} x {item.quantity}
                        </span>
                      </div>
                      <div className="text-gray-500 text-xs">
                        공급사: {vendor?.companyName ?? "-"}
                        {inf && ` | 인플루언서 귀속: ${inf.name}`}
                      </div>
                    </div>
                  );
                })}
              </div>

              {detailOrder.influencerId && (
                <div className="border-t pt-3">
                  <h4 className="font-semibold text-sm mb-1">
                    인플루언서 귀속 정보
                  </h4>
                  <p className="text-sm text-gray-600">
                    {getInfluencer(detailOrder.influencerId)?.name} 을 통한 주문
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
