"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { OrderStatusBadge } from "@/components/status-badge";
import { ProductCard } from "@/components/product-card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Star,
  Package,
  Truck,
  CheckCircle,
  Clock,
  User,
  Mail,
  CalendarDays,
  Heart,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import {
  orders,
  products,
  getProduct,
  formatKRW,
  reviews,
  consumers,
} from "@/lib/data";

const stepIcons = [
  { label: "주문확인", icon: Package, statuses: ["confirmed", "shipping", "delivered"] },
  { label: "준비중", icon: Clock, statuses: ["shipping", "delivered"] },
  { label: "배송중", icon: Truck, statuses: ["shipping", "delivered"] },
  { label: "배송완료", icon: CheckCircle, statuses: ["delivered"] },
];

function isStepActive(stepStatuses: string[], orderStatus: string) {
  return stepStatuses.includes(orderStatus);
}

type StatusFilter = "all" | "confirmed" | "shipping" | "delivered" | "cancelled";

const statusFilters: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "confirmed", label: "주문확인" },
  { value: "shipping", label: "배송중" },
  { value: "delivered", label: "배송완료" },
  { value: "cancelled", label: "취소" },
];

// Seeded random for consistent "wishlist" products
function seededShuffle<T>(arr: T[], seed: number): T[] {
  const copy = [...arr];
  let s = seed;
  for (let i = copy.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function MyPage() {
  const router = useRouter();
  const { isLoggedIn, userName } = useAuth();
  const [activeTab, setActiveTab] = useState("orders");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  // Review dialog state
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewTargetOrderId, setReviewTargetOrderId] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewText, setReviewText] = useState("");

  // Use a subset of orders for demo
  const myOrders = orders.slice(0, 8);
  const myReviews = reviews.slice(0, 5);

  // Consumer profile (first one for demo)
  const profile = consumers[0];

  // Wishlist: 5 random products (stable)
  const wishlistProducts = useMemo(
    () => seededShuffle(products.filter((p) => p.status === "active"), 42).slice(0, 5),
    []
  );

  // Filtered orders
  const filteredOrders = useMemo(() => {
    if (statusFilter === "all") return myOrders;
    return myOrders.filter((o) => o.status === statusFilter);
  }, [statusFilter, myOrders]);

  // Tracking orders sorted by date descending
  const trackingOrders = useMemo(
    () =>
      myOrders
        .filter((o) => o.status !== "cancelled")
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .slice(0, 5),
    [myOrders]
  );

  const handleOpenReviewDialog = (orderId: string) => {
    setReviewTargetOrderId(orderId);
    setReviewRating(0);
    setReviewHover(0);
    setReviewText("");
    setReviewDialogOpen(true);
  };

  const handleSubmitReview = () => {
    if (reviewRating === 0) {
      toast.error("별점을 선택해주세요.");
      return;
    }
    if (!reviewText.trim()) {
      toast.error("리뷰 내용을 입력해주세요.");
      return;
    }
    setReviewDialogOpen(false);
    toast.success("리뷰가 등록되었습니다");
  };

  if (!isLoggedIn) {
    return (
      <div id="page-mypage" className="mx-auto max-w-7xl px-4 py-16 text-center">
        <p className="text-gray-500 mb-4">로그인이 필요합니다.</p>
        <Button
          className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white"
          onClick={() => router.push("/login/")}
        >
          로그인하기
        </Button>
      </div>
    );
  }

  const reviewTargetOrder = myOrders.find((o) => o.id === reviewTargetOrderId);
  const reviewTargetProduct = reviewTargetOrder
    ? getProduct(reviewTargetOrder.items[0].productId)
    : null;

  return (
    <div id="page-mypage" className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">마이페이지</h1>
      <p className="text-gray-500 mb-6">{userName}님, 안녕하세요!</p>

      {/* Profile Section */}
      <Card className="mb-6" id="mypage-profile">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={profile.avatar}
              alt={profile.name}
              className="h-16 w-16 rounded-full bg-gray-100 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-gray-900">{userName || profile.name}</h2>
              <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
                <Mail className="h-3.5 w-3.5" />
                <span>{profile.email}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-0.5">
                <CalendarDays className="h-3.5 w-3.5" />
                <span>가입일: {profile.createdAt}</span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.info("프로필 수정 기능은 데모에서 지원하지 않습니다.")}
            >
              <User className="h-4 w-4 mr-1" />
              프로필 수정
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="orders">주문 내역</TabsTrigger>
          <TabsTrigger value="tracking">배송 추적</TabsTrigger>
          <TabsTrigger value="reviews">리뷰 관리</TabsTrigger>
          <TabsTrigger value="wishlist">찜한 상품</TabsTrigger>
        </TabsList>

        {/* Orders Tab */}
        <TabsContent value="orders" id="mypage-orders">
          {/* Status Filter */}
          <div className="flex flex-wrap gap-2 mb-4" id="mypage-orders-filter">
            {statusFilters.map((f) => (
              <Button
                key={f.value}
                variant={statusFilter === f.value ? "default" : "outline"}
                size="sm"
                className={
                  statusFilter === f.value
                    ? "bg-[#2563EB] hover:bg-[#1d4ed8] text-white"
                    : ""
                }
                onClick={() => setStatusFilter(f.value)}
              >
                {f.label}
              </Button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredOrders.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-8">
                해당 상태의 주문이 없습니다.
              </p>
            )}
            {filteredOrders.map((order) => {
              const prod = getProduct(order.items[0].productId);
              return (
                <Card key={order.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex gap-3">
                        {prod && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={prod.images[0]}
                            alt={prod.name}
                            className="h-14 w-14 rounded bg-gray-100 object-cover shrink-0"
                          />
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900 line-clamp-1">
                            {prod?.name ?? "상품"}{" "}
                            {order.items[0].quantity > 1
                              ? `x${order.items[0].quantity}`
                              : ""}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {order.createdAt}
                          </p>
                          <p className="text-sm font-semibold mt-1">
                            {formatKRW(order.totalAmount - order.discountAmount)}
                          </p>
                        </div>
                      </div>
                      <OrderStatusBadge status={order.status} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Tracking Tab */}
        <TabsContent value="tracking" id="mypage-tracking">
          <div className="space-y-6">
            {trackingOrders.map((order) => {
              const prod = getProduct(order.items[0].productId);
              return (
                <Card key={order.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <p className="text-sm font-medium text-gray-900 flex-1">
                        {prod?.name ?? "상품"}{" "}
                        <span className="text-gray-400 text-xs">({order.id})</span>
                      </p>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    {/* Step indicator */}
                    <div className="flex items-center justify-between">
                      {stepIcons.map((step, i) => {
                        const active = isStepActive(step.statuses, order.status);
                        return (
                          <div
                            key={step.label}
                            className="flex flex-col items-center flex-1"
                          >
                            <div className="relative flex items-center w-full">
                              {i > 0 && (
                                <div
                                  className={`h-0.5 flex-1 ${
                                    active ? "bg-[#2563EB]" : "bg-gray-200"
                                  }`}
                                />
                              )}
                              <div
                                className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                                  active
                                    ? "bg-[#2563EB] text-white"
                                    : "bg-gray-200 text-gray-400"
                                }`}
                              >
                                <step.icon className="h-4 w-4" />
                              </div>
                              {i < stepIcons.length - 1 && (
                                <div
                                  className={`h-0.5 flex-1 ${
                                    isStepActive(
                                      stepIcons[i + 1].statuses,
                                      order.status
                                    )
                                      ? "bg-[#2563EB]"
                                      : "bg-gray-200"
                                  }`}
                                />
                              )}
                            </div>
                            <span
                              className={`text-[10px] mt-1 ${
                                active
                                  ? "text-[#2563EB] font-medium"
                                  : "text-gray-400"
                              }`}
                            >
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews" id="mypage-reviews">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700">작성한 리뷰</h3>
            {myReviews.map((rev) => {
              const prod = getProduct(rev.productId);
              return (
                <Card key={rev.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {prod && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={prod.images[0]}
                          alt={prod.name}
                          className="h-12 w-12 rounded bg-gray-100 object-cover shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 line-clamp-1">
                          {prod?.name}
                        </p>
                        <div className="flex items-center gap-1 mt-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`h-3 w-3 ${
                                s <= rev.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                          <span className="text-xs text-gray-400 ml-1">
                            {rev.createdAt}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mt-1">{rev.content}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            <Separator className="my-6" />

            <h3 className="text-sm font-semibold text-gray-700">작성 가능한 리뷰</h3>
            {myOrders
              .filter((o) => o.status === "delivered")
              .slice(0, 3)
              .map((order) => {
                const prod = getProduct(order.items[0].productId);
                return (
                  <Card key={order.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        {prod && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={prod.images[0]}
                            alt={prod.name}
                            className="h-10 w-10 rounded bg-gray-100 object-cover shrink-0"
                          />
                        )}
                        <p className="text-sm font-medium text-gray-900 flex-1 line-clamp-1">
                          {prod?.name}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenReviewDialog(order.id)}
                      >
                        리뷰 작성하기
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
          </div>

          {/* Review Write Dialog */}
          <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>리뷰 작성</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                {reviewTargetProduct && (
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={reviewTargetProduct.images[0]}
                      alt={reviewTargetProduct.name}
                      className="h-12 w-12 rounded bg-gray-100 object-cover shrink-0"
                    />
                    <p className="text-sm font-medium text-gray-900 line-clamp-1">
                      {reviewTargetProduct.name}
                    </p>
                  </div>
                )}
                {/* Star Rating */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">별점</p>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        className="p-0.5"
                        onClick={() => setReviewRating(s)}
                        onMouseEnter={() => setReviewHover(s)}
                        onMouseLeave={() => setReviewHover(0)}
                      >
                        <Star
                          className={`h-6 w-6 transition-colors ${
                            s <= (reviewHover || reviewRating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                    {reviewRating > 0 && (
                      <span className="text-sm text-gray-500 ml-2 self-center">
                        {reviewRating}점
                      </span>
                    )}
                  </div>
                </div>
                {/* Review Text */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">리뷰 내용</p>
                  <Textarea
                    placeholder="상품에 대한 솔직한 리뷰를 작성해주세요."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    rows={4}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white w-full sm:w-auto"
                  onClick={handleSubmitReview}
                >
                  등록하기
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* Wishlist Tab */}
        <TabsContent value="wishlist" id="mypage-wishlist">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="h-4 w-4 text-red-500 fill-red-500" />
            <h3 className="text-sm font-semibold text-gray-700">
              찜한 상품 ({wishlistProducts.length})
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {wishlistProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
