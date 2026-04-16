"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, ChevronDown, Pencil } from "lucide-react";
import { products as initialProducts, categories, type Product } from "@/lib/data";

const VENDOR_ID = "ven-1";

const statusMap: Record<string, { label: string; className: string }> = {
  active: { label: "판매중", className: "bg-green-100 text-green-800 hover:bg-green-100" },
  soldout: { label: "품절", className: "bg-red-100 text-red-800 hover:bg-red-100" },
  hidden: { label: "숨김", className: "bg-gray-100 text-gray-800 hover:bg-gray-100" },
};

function formatKRW(value: number) {
  return new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW", maximumFractionDigits: 0 }).format(value);
}

export default function VendorProductsPage() {
  const [productList, setProductList] = useState<Product[]>(
    () => initialProducts.filter((p) => p.vendorId === VENDOR_ID)
  );

  const handleStatusChange = useCallback(
    (productId: string, newStatus: Product["status"]) => {
      setProductList((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, status: newStatus } : p))
      );
      toast.success(`상태가 "${statusMap[newStatus].label}"(으)로 변경되었습니다`);
    },
    []
  );

  return (
    <div id="page-vendor-products" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">상품 관리</h2>
          <p className="text-muted-foreground">등록된 상품을 관리하세요</p>
        </div>
        <Link href="/vendor/products/new/">
          <Button id="vendor-product-form">
            <Plus className="h-4 w-4 mr-2" />
            상품 추가
          </Button>
        </Link>
      </div>

      <Card id="vendor-products">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">이미지</TableHead>
                <TableHead>상품명</TableHead>
                <TableHead>카테고리</TableHead>
                <TableHead>가격</TableHead>
                <TableHead>재고</TableHead>
                <TableHead>상태</TableHead>
                <TableHead className="w-[80px]">상태</TableHead>
                <TableHead className="w-[60px]">수정</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productList.map((product) => {
                const category = categories.find((c) => c.id === product.categoryId);
                const info = statusMap[product.status];
                return (
                  <TableRow key={product.id}>
                    <TableCell>
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs text-gray-400">{product.nameEn}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {category ? `${category.icon} ${category.name}` : "-"}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{formatKRW(product.price)}</p>
                        {product.discountRate > 0 && (
                          <p className="text-xs text-red-500">-{product.discountRate}%</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={product.stock <= 10 ? "text-orange-500 font-medium" : ""}>
                        {product.stock.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={info.className}>
                        {info.label}
                      </Badge>
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button variant="outline" size="sm" className="text-xs">
                              변경 <ChevronDown className="ml-1 h-3 w-3" />
                            </Button>
                          }
                        />
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleStatusChange(product.id, "active")}>판매중</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(product.id, "soldout")}>품절</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(product.id, "hidden")}>숨김</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                    <TableCell>
                      <Link href={`/vendor/products/${product.id}/edit/`}>
                        <Button variant="ghost" size="sm">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
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
