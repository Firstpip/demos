"use client";

import { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  deepLinks,
  influencers,
  products,
  getInfluencer,
  getProduct,
  getVendor,
  formatKRW,
} from "@/lib/data";
import type { DeepLink } from "@/lib/data";
import { toast } from "sonner";
import { Plus } from "lucide-react";

export default function AdminMatchingPage() {
  const [matchingActive, setMatchingActive] = useState<Record<string, boolean>>(
    Object.fromEntries(deepLinks.map((dl) => [dl.id, true]))
  );
  const [createOpen, setCreateOpen] = useState(false);
  const [newInfluencer, setNewInfluencer] = useState("");
  const [newProduct, setNewProduct] = useState("");
  const [newCommission, setNewCommission] = useState("10");

  function toggleMatching(id: string) {
    setMatchingActive((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      toast(next[id] ? "매칭이 활성화되었습니다" : "매칭이 비활성화되었습니다");
      return next;
    });
  }

  function handleCreate() {
    if (!newInfluencer || !newProduct) {
      toast("인플루언서와 상품을 선택해주세요");
      return;
    }
    toast("매칭이 생성되었습니다");
    setCreateOpen(false);
    setNewInfluencer("");
    setNewProduct("");
    setNewCommission("10");
  }

  return (
    <div id="page-admin-matching" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">매칭 관리</h2>
          <p className="text-gray-500 mt-1">
            인플루언서-상품 매칭을 관리합니다
          </p>
        </div>
        <Button
          onClick={() => setCreateOpen(true)}
          id="btn-create-matching"
        >
          <Plus className="h-4 w-4 mr-2" />새 매칭 생성
        </Button>
      </div>

      <Card id="admin-matching">
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>인플루언서</TableHead>
                <TableHead>상품명</TableHead>
                <TableHead>공급사</TableHead>
                <TableHead>수수료율</TableHead>
                <TableHead>클릭수</TableHead>
                <TableHead>전환수</TableHead>
                <TableHead>매출</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>액션</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deepLinks.map((dl) => {
                const inf = getInfluencer(dl.influencerId);
                const prod = getProduct(dl.productId);
                const vendor = prod ? getVendor(prod.vendorId) : null;
                const active = matchingActive[dl.id];
                return (
                  <TableRow key={dl.id}>
                    <TableCell className="font-medium">
                      {inf?.name ?? "-"}
                    </TableCell>
                    <TableCell className="max-w-[160px] truncate">
                      {prod?.name ?? "-"}
                    </TableCell>
                    <TableCell>{vendor?.companyName ?? "-"}</TableCell>
                    <TableCell>
                      {dl.influencerId === "inf-1"
                        ? "15%"
                        : dl.influencerId === "inf-2"
                        ? "12%"
                        : dl.influencerId === "inf-3"
                        ? "13%"
                        : dl.influencerId === "inf-4"
                        ? "14%"
                        : dl.influencerId === "inf-5"
                        ? "11%"
                        : "12%"}
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("ko-KR").format(dl.clicks)}
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("ko-KR").format(dl.conversions)}
                    </TableCell>
                    <TableCell>{formatKRW(dl.revenue)}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          active
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                        }
                      >
                        {active ? "활성" : "비활성"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleMatching(dl.id)}
                        id={`btn-toggle-matching-${dl.id}`}
                      >
                        {active ? "비활성화" : "활성화"}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Matching Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 매칭 생성</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>인플루언서</Label>
              <Select value={newInfluencer} onValueChange={(v) => setNewInfluencer(v ?? "")}>
                <SelectTrigger id="select-matching-influencer">
                  <SelectValue placeholder="인플루언서 선택" />
                </SelectTrigger>
                <SelectContent>
                  {influencers.map((inf) => (
                    <SelectItem key={inf.id} value={inf.id}>
                      {inf.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>상품</Label>
              <Select value={newProduct} onValueChange={(v) => setNewProduct(v ?? "")}>
                <SelectTrigger id="select-matching-product">
                  <SelectValue placeholder="상품 선택" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>수수료율 (%)</Label>
              <Input
                value={newCommission}
                onChange={(e) => setNewCommission(e.target.value.replace(/[^0-9.]/g, ""))}
                placeholder="예: 15"
                id="input-matching-commission"
              />
            </div>
            <Button
              className="w-full"
              onClick={handleCreate}
              id="btn-confirm-create-matching"
            >
              생성
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
