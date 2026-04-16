"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { OrderStatusBadge } from "@/components/status-badge";
import { toast } from "sonner";
import {
  orders as initialOrders,
  products,
  type Order,
} from "@/lib/data";

const VENDOR_ID = "ven-1";

const customerNames = [
  "김지훈", "이수진", "박민호", "정예은", "최도현",
  "강서윤", "윤재혁", "임하늘", "한소율", "오진우",
];

function formatKRW(value: number) {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function VendorOrdersPage() {
  const [orderList, setOrderList] = useState<Order[]>(() =>
    initialOrders.filter((o) =>
      o.items.some((item) => item.vendorId === VENDOR_ID)
    )
  );
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const sortedOrders = useMemo(
    () =>
      [...orderList].sort((a, b) =>
        b.createdAt.localeCompare(a.createdAt)
      ),
    [orderList]
  );

  const openDetail = useCallback((order: Order) => {
    setSelectedOrder(order);
    setDetailOpen(true);
  }, []);

  const handleStatusUpdate = useCallback(
    (orderId: string, newStatus: Order["status"]) => {
      setOrderList((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) =>
          prev ? { ...prev, status: newStatus } : prev
        );
      }
      const statusLabels: Record<string, string> = {
        pending: "주문확인중",
        confirmed: "주문확인",
        shipping: "배송중",
        delivered: "배송완료",
        cancelled: "주문취소",
      };
      toast.success(`배송 상태가 "${statusLabels[newStatus]}"(으)로 변경되었습니다`);
    },
    [selectedOrder]
  );

  const getCustomerName = (userId: string) => {
    const idx = parseInt(userId.replace("user-", ""), 10) - 1;
    return customerNames[idx % customerNames.length];
  };

  return (
    <div id="page-vendor-orders" className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">주문 내역</h2>
        <p className="text-muted-foreground">
          공급사 상품의 주문 내역을 확인하세요
        </p>
      </div>

      <Card id="vendor-orders">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>주문번호</TableHead>
                <TableHead>고객명</TableHead>
                <TableHead>상품</TableHead>
                <TableHead>수량</TableHead>
                <TableHead>금액</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>날짜</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedOrders.map((order) => {
                const vendorItem = order.items.find(
                  (i) => i.vendorId === VENDOR_ID
                );
                const product = products.find(
                  (p) => p.id === vendorItem?.productId
                );
                return (
                  <TableRow
                    key={order.id}
                    className="cursor-pointer"
                    onClick={() => openDetail(order)}
                  >
                    <TableCell className="font-mono text-sm">
                      {order.id}
                    </TableCell>
                    <TableCell>{getCustomerName(order.userId)}</TableCell>
                    <TableCell className="truncate max-w-[150px]">
                      {product?.name ?? "-"}
                    </TableCell>
                    <TableCell>{vendorItem?.quantity ?? 0}</TableCell>
                    <TableCell>
                      {formatKRW(
                        (vendorItem?.price ?? 0) * (vendorItem?.quantity ?? 0)
                      )}
                    </TableCell>
                    <TableCell>
                      <OrderStatusBadge status={order.status} />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {order.createdAt}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>주문 상세</DialogTitle>
            <DialogDescription>
              {selectedOrder?.id} 주문 정보
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (() => {
            const vendorItem = selectedOrder.items.find(
              (i) => i.vendorId === VENDOR_ID
            );
            const product = products.find(
              (p) => p.id === vendorItem?.productId
            );
            return (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">주문번호</p>
                    <p className="font-mono font-medium">{selectedOrder.id}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">주문일</p>
                    <p className="font-medium">{selectedOrder.createdAt}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">고객명</p>
                    <p className="font-medium">
                      {getCustomerName(selectedOrder.userId)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">현재 상태</p>
                    <OrderStatusBadge status={selectedOrder.status} />
                  </div>
                </div>

                <Separator />

                <div className="text-sm space-y-2">
                  <p className="font-semibold">상품 정보</p>
                  <div className="flex items-center gap-3">
                    {product && (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-12 w-12 rounded object-cover"
                      />
                    )}
                    <div>
                      <p className="font-medium">{product?.name ?? "-"}</p>
                      <p className="text-muted-foreground">
                        {formatKRW(vendorItem?.price ?? 0)} x{" "}
                        {vendorItem?.quantity ?? 0}개 ={" "}
                        {formatKRW(
                          (vendorItem?.price ?? 0) *
                            (vendorItem?.quantity ?? 0)
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="text-sm space-y-2">
                  <p className="font-semibold">배송지</p>
                  <p className="text-muted-foreground">
                    {selectedOrder.shippingAddress}
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>배송 상태 업데이트</Label>
                  <Select
                    value={selectedOrder.status}
                    onValueChange={(v) => {
                      if (v) {
                        handleStatusUpdate(
                          selectedOrder.id,
                          v as Order["status"]
                        );
                      }
                    }}
                  >
                    <SelectTrigger id="order-status-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="confirmed">주문확인</SelectItem>
                      <SelectItem value="shipping">배송중</SelectItem>
                      <SelectItem value="delivered">배송완료</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            );
          })()}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailOpen(false)}>
              닫기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
