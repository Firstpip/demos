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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  products,
  vendors,
  categories,
  getVendor,
  getCategory,
  formatKRW,
} from "@/lib/data";
import type { Product } from "@/lib/data";
import { toast } from "sonner";
import { Search, CheckCircle, XCircle } from "lucide-react";

const statusMap: Record<string, { label: string; className: string }> = {
  active: {
    label: "판매중",
    className: "bg-green-100 text-green-800 hover:bg-green-100",
  },
  soldout: {
    label: "품절",
    className: "bg-red-100 text-red-800 hover:bg-red-100",
  },
  hidden: {
    label: "숨김",
    className: "bg-gray-100 text-gray-800 hover:bg-gray-100",
  },
};

export default function AdminProductsPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [vendorFilter, setVendorFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [productStatuses, setProductStatuses] = useState<
    Record<string, Product["status"]>
  >(Object.fromEntries(products.map((p) => [p.id, p.status])));

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (search && !p.name.includes(search) && !p.nameEn.toLowerCase().includes(search.toLowerCase())) return false;
      if (categoryFilter !== "all" && p.categoryId !== categoryFilter) return false;
      if (vendorFilter !== "all" && p.vendorId !== vendorFilter) return false;
      if (statusFilter !== "all" && productStatuses[p.id] !== statusFilter) return false;
      return true;
    });
  }, [search, categoryFilter, vendorFilter, statusFilter, productStatuses]);

  function approveProduct(id: string) {
    setProductStatuses((prev) => ({ ...prev, [id]: "active" }));
    toast("상품이 승인되었습니다");
  }

  function rejectProduct(id: string) {
    setProductStatuses((prev) => ({ ...prev, [id]: "hidden" }));
    toast("상품이 반려되었습니다");
  }

  return (
    <div id="page-admin-products" className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">상품 관리</h2>
        <p className="text-gray-500 mt-1">전체 상품을 관리합니다</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4" id="admin-products">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="상품명 검색..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                id="input-product-search"
              />
            </div>
            <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v ?? "all")}>
              <SelectTrigger className="w-[160px]" id="select-category-filter">
                <SelectValue placeholder="카테고리" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 카테고리</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.icon} {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={vendorFilter} onValueChange={(v) => setVendorFilter(v ?? "all")}>
              <SelectTrigger className="w-[180px]" id="select-vendor-filter">
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
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "all")}>
              <SelectTrigger className="w-[140px]" id="select-status-filter">
                <SelectValue placeholder="상태" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 상태</SelectItem>
                <SelectItem value="active">판매중</SelectItem>
                <SelectItem value="soldout">품절</SelectItem>
                <SelectItem value="hidden">숨김</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Product Table */}
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>이미지</TableHead>
                <TableHead>상품명</TableHead>
                <TableHead>공급사</TableHead>
                <TableHead>카테고리</TableHead>
                <TableHead>가격</TableHead>
                <TableHead>재고</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>액션</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => {
                const vendor = getVendor(p.vendorId);
                const category = getCategory(p.categoryId);
                const status = productStatuses[p.id] || p.status;
                const st = statusMap[status] || statusMap.active;
                return (
                  <TableRow key={p.id}>
                    <TableCell>
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="h-10 w-10 rounded object-cover"
                      />
                    </TableCell>
                    <TableCell className="font-medium max-w-[200px] truncate">
                      {p.name}
                    </TableCell>
                    <TableCell>{vendor?.companyName ?? "-"}</TableCell>
                    <TableCell>
                      {category ? `${category.icon} ${category.name}` : "-"}
                    </TableCell>
                    <TableCell>{formatKRW(p.price)}</TableCell>
                    <TableCell>{p.stock}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={st.className}>
                        {st.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => approveProduct(p.id)}
                          id={`btn-approve-${p.id}`}
                          title="승인"
                        >
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => rejectProduct(p.id)}
                          id={`btn-reject-${p.id}`}
                          title="반려"
                        >
                          <XCircle className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
