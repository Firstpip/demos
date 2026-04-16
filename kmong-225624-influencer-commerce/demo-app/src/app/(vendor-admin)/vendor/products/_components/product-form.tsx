"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Upload, ArrowLeft, Save, Image as ImageIcon } from "lucide-react";
import { categories, type Product } from "@/lib/data";

export interface ProductFormData {
  name: string;
  nameEn: string;
  description: string;
  price: string;
  categoryId: string;
  stock: string;
  discountRate: string;
  origin: string;
  shippingFee: string;
  freeShippingThreshold: string;
  features: string;
  weight: string;
}

export const emptyFormData: ProductFormData = {
  name: "",
  nameEn: "",
  description: "",
  price: "",
  categoryId: "",
  stock: "",
  discountRate: "0",
  origin: "대한민국",
  shippingFee: "3000",
  freeShippingThreshold: "50000",
  features: "",
  weight: "",
};

export function productToFormData(product: Product): ProductFormData {
  return {
    name: product.name,
    nameEn: product.nameEn,
    description: product.description,
    price: String(product.price),
    categoryId: product.categoryId,
    stock: String(product.stock),
    discountRate: String(product.discountRate),
    origin: product.origin || "대한민국",
    shippingFee: String(product.shippingFee ?? 3000),
    freeShippingThreshold: String(product.freeShippingThreshold ?? 50000),
    features: (product.features || []).join("\n"),
    weight: product.weight || "",
  };
}

interface ProductFormProps {
  mode: "add" | "edit";
  product?: Product;
}

export function ProductForm({ mode, product }: ProductFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<ProductFormData>(
    product ? productToFormData(product) : emptyFormData
  );
  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});

  const validate = useCallback((f: ProductFormData) => {
    const errs: Partial<Record<keyof ProductFormData, string>> = {};
    if (!f.name.trim()) errs.name = "상품명을 입력하세요";
    if (!f.description.trim()) errs.description = "설명을 입력하세요";
    if (!f.price.trim() || isNaN(Number(f.price)) || Number(f.price) <= 0)
      errs.price = "유효한 가격을 입력하세요";
    if (!f.categoryId) errs.categoryId = "카테고리를 선택하세요";
    if (!f.stock.trim() || isNaN(Number(f.stock)) || Number(f.stock) < 0)
      errs.stock = "유효한 재고를 입력하세요";
    if (f.discountRate && (isNaN(Number(f.discountRate)) || Number(f.discountRate) < 0 || Number(f.discountRate) > 100))
      errs.discountRate = "0~100 사이 값을 입력하세요";
    return errs;
  }, []);

  const handleSubmit = () => {
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    toast.success(mode === "add" ? "상품이 등록되었습니다" : "상품이 수정되었습니다");
    router.push("/vendor/products/");
  };

  const numericOnly = (val: string) => val.replace(/[^0-9]/g, "");

  const discountedPrice = form.price && form.discountRate
    ? Math.round(Number(form.price) * (1 - Number(form.discountRate) / 100))
    : Number(form.price) || 0;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => router.push("/vendor/products/")}>
            <ArrowLeft className="h-4 w-4 mr-1" /> 목록
          </Button>
          <div>
            <h2 className="text-2xl font-bold">{mode === "add" ? "상품 추가" : "상품 수정"}</h2>
            <p className="text-sm text-muted-foreground">
              {mode === "add" ? "새로운 상품을 등록합니다" : `${product?.name} 상품을 수정합니다`}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/vendor/products/")}>취소</Button>
          <Button onClick={handleSubmit}>
            <Save className="h-4 w-4 mr-2" />
            {mode === "add" ? "등록" : "저장"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Main form */}
        <div className="lg:col-span-2 space-y-6">
          {/* 기본 정보 */}
          <Card>
            <CardContent className="p-6 space-y-5">
              <h3 className="text-base font-semibold">기본 정보</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prod-name">상품명 (한글) <span className="text-red-500">*</span></Label>
                  <Input
                    id="prod-name"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="예: 전통 고추장 세트"
                  />
                  {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prod-name-en">상품명 (영문)</Label>
                  <Input
                    id="prod-name-en"
                    value={form.nameEn}
                    onChange={(e) => setForm((f) => ({ ...f, nameEn: e.target.value }))}
                    placeholder="예: Traditional Gochujang Set"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="prod-desc">상품 설명 <span className="text-red-500">*</span></Label>
                <Textarea
                  id="prod-desc"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="상품의 특징, 소재, 사이즈 등을 자세히 입력하세요"
                  rows={4}
                />
                {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="prod-category">카테고리 <span className="text-red-500">*</span></Label>
                <Select
                  value={form.categoryId}
                  onValueChange={(v) => setForm((f) => ({ ...f, categoryId: v ?? "" }))}
                >
                  <SelectTrigger id="prod-category" className="w-full sm:w-64">
                    <SelectValue placeholder="카테고리 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.categoryId && <p className="text-xs text-red-500">{errors.categoryId}</p>}
              </div>
            </CardContent>
          </Card>

          {/* 이미지 */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-base font-semibold">상품 이미지</h3>
              <div className="grid grid-cols-5 gap-3">
                {product ? (
                  <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                    <img src={product.images[0]} alt="" className="h-full w-full object-cover" />
                  </div>
                ) : null}
                {Array.from({ length: product ? 4 : 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    {i === 0 && !product ? (
                      <>
                        <Upload className="h-5 w-5 text-gray-400 mb-1" />
                        <span className="text-[10px] text-gray-400">대표 이미지</span>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="h-4 w-4 text-gray-300 mb-1" />
                        <span className="text-[10px] text-gray-300">추가</span>
                      </>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400">PNG, JPG, WEBP (최대 5MB, 최대 5장). 첫 번째 이미지가 대표 이미지로 사용됩니다.</p>
            </CardContent>
          </Card>

          {/* 가격 및 재고 */}
          <Card>
            <CardContent className="p-6 space-y-5">
              <h3 className="text-base font-semibold">가격 및 재고</h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prod-price">판매가 (원) <span className="text-red-500">*</span></Label>
                  <Input
                    id="prod-price"
                    inputMode="numeric"
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: numericOnly(e.target.value) }))}
                    placeholder="0"
                  />
                  {errors.price && <p className="text-xs text-red-500">{errors.price}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prod-discount">할인율 (%)</Label>
                  <Input
                    id="prod-discount"
                    inputMode="numeric"
                    value={form.discountRate}
                    onChange={(e) => setForm((f) => ({ ...f, discountRate: numericOnly(e.target.value) }))}
                    placeholder="0"
                  />
                  {errors.discountRate && <p className="text-xs text-red-500">{errors.discountRate}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prod-stock">재고 수량 <span className="text-red-500">*</span></Label>
                  <Input
                    id="prod-stock"
                    inputMode="numeric"
                    value={form.stock}
                    onChange={(e) => setForm((f) => ({ ...f, stock: numericOnly(e.target.value) }))}
                    placeholder="0"
                  />
                  {errors.stock && <p className="text-xs text-red-500">{errors.stock}</p>}
                </div>
              </div>

              {form.price && Number(form.discountRate) > 0 && (
                <div className="bg-blue-50 rounded-lg p-3 text-sm">
                  <span className="text-gray-600">할인 적용가: </span>
                  <span className="font-bold text-[#2563EB]">
                    {new Intl.NumberFormat("ko-KR").format(discountedPrice)}원
                  </span>
                  <span className="text-gray-400 ml-2 line-through">
                    {new Intl.NumberFormat("ko-KR").format(Number(form.price))}원
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 주요 특징 */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-base font-semibold">주요 특징</h3>
              <p className="text-xs text-gray-400">상품 상세 페이지에 bullet point로 표시됩니다. 줄바꿈으로 구분하세요.</p>
              <Textarea
                id="prod-features"
                value={form.features}
                onChange={(e) => setForm((f) => ({ ...f, features: e.target.value }))}
                placeholder={"한국에서 직접 생산한 정품 보장\n해외 배송 가능\n안전한 포장으로 파손 걱정 없이 배송\n교환/환불 14일 이내 무료"}
                rows={5}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right: Sidebar */}
        <div className="space-y-6">
          {/* 상품 상세 정보 */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-base font-semibold">상세 정보</h3>

              <div className="space-y-2">
                <Label htmlFor="prod-origin">원산지</Label>
                <Input
                  id="prod-origin"
                  value={form.origin}
                  onChange={(e) => setForm((f) => ({ ...f, origin: e.target.value }))}
                  placeholder="대한민국"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prod-weight">중량/규격</Label>
                <Input
                  id="prod-weight"
                  value={form.weight}
                  onChange={(e) => setForm((f) => ({ ...f, weight: e.target.value }))}
                  placeholder="예: 500g, 30ml"
                />
              </div>
            </CardContent>
          </Card>

          {/* 배송 설정 */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-base font-semibold">배송 설정</h3>

              <div className="space-y-2">
                <Label htmlFor="prod-shipping">배송비 (원)</Label>
                <Input
                  id="prod-shipping"
                  inputMode="numeric"
                  value={form.shippingFee}
                  onChange={(e) => setForm((f) => ({ ...f, shippingFee: numericOnly(e.target.value) }))}
                  placeholder="3000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prod-free-shipping">무료배송 기준 (원)</Label>
                <Input
                  id="prod-free-shipping"
                  inputMode="numeric"
                  value={form.freeShippingThreshold}
                  onChange={(e) => setForm((f) => ({ ...f, freeShippingThreshold: numericOnly(e.target.value) }))}
                  placeholder="50000"
                />
              </div>
            </CardContent>
          </Card>

          {/* 미리보기 요약 */}
          {form.name && (
            <Card className="border-blue-200 bg-blue-50/50">
              <CardContent className="p-5 space-y-2">
                <h3 className="text-sm font-semibold text-blue-900">미리보기</h3>
                <p className="text-sm font-medium text-gray-900">{form.name}</p>
                {form.nameEn && <p className="text-xs text-gray-400">{form.nameEn}</p>}
                {form.price && (
                  <div>
                    {Number(form.discountRate) > 0 ? (
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-gray-900">
                          {new Intl.NumberFormat("ko-KR").format(discountedPrice)}원
                        </span>
                        <span className="text-xs text-red-500 font-medium">-{form.discountRate}%</span>
                      </div>
                    ) : (
                      <span className="text-base font-bold text-gray-900">
                        {new Intl.NumberFormat("ko-KR").format(Number(form.price))}원
                      </span>
                    )}
                  </div>
                )}
                <Separator />
                <div className="text-xs text-gray-500 space-y-0.5">
                  <p>원산지: {form.origin || "-"}</p>
                  {form.weight && <p>중량: {form.weight}</p>}
                  <p>배송비: {form.shippingFee ? `${Number(form.shippingFee).toLocaleString()}원` : "3,000원"}</p>
                  <p>무료배송: {form.freeShippingThreshold ? `${Number(form.freeShippingThreshold).toLocaleString()}원 이상` : "50,000원 이상"}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
