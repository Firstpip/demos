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
import { promotions, influencers, getInfluencer, formatKRW } from "@/lib/data";
import type { Promotion } from "@/lib/data";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function AdminPromotionsPage() {
  const [promoList, setPromoList] = useState<Promotion[]>([...promotions]);
  const [createOpen, setCreateOpen] = useState(false);
  const [editPromo, setEditPromo] = useState<Promotion | null>(null);

  // Form state
  const [formCode, setFormCode] = useState("");
  const [formType, setFormType] = useState<"percentage" | "fixed">("percentage");
  const [formValue, setFormValue] = useState("");
  const [formInfluencer, setFormInfluencer] = useState("none");
  const [formValidFrom, setFormValidFrom] = useState("");
  const [formValidTo, setFormValidTo] = useState("");
  const [formMaxUsage, setFormMaxUsage] = useState("");

  function resetForm() {
    setFormCode("");
    setFormType("percentage");
    setFormValue("");
    setFormInfluencer("none");
    setFormValidFrom("");
    setFormValidTo("");
    setFormMaxUsage("");
  }

  function openCreate() {
    resetForm();
    setCreateOpen(true);
  }

  function openEdit(promo: Promotion) {
    setFormCode(promo.code);
    setFormType(promo.type);
    setFormValue(String(promo.value));
    setFormInfluencer(promo.influencerId ?? "none");
    setFormValidFrom(promo.validFrom);
    setFormValidTo(promo.validTo);
    setFormMaxUsage(String(promo.maxUsage));
    setEditPromo(promo);
  }

  function handleSave() {
    if (!formCode || !formValue) {
      toast("코드명과 할인값을 입력해주세요");
      return;
    }
    if (editPromo) {
      setPromoList((prev) =>
        prev.map((p) =>
          p.id === editPromo.id
            ? {
                ...p,
                code: formCode,
                type: formType,
                value: Number(formValue),
                influencerId:
                  formInfluencer === "none" ? undefined : formInfluencer,
                validFrom: formValidFrom,
                validTo: formValidTo,
                maxUsage: Number(formMaxUsage) || p.maxUsage,
              }
            : p
        )
      );
      toast("할인코드가 수정되었습니다");
      setEditPromo(null);
    } else {
      const newPromo: Promotion = {
        id: `promo-${Date.now()}`,
        code: formCode,
        type: formType,
        value: Number(formValue),
        influencerId:
          formInfluencer === "none" ? undefined : formInfluencer,
        validFrom: formValidFrom || "2026-04-01",
        validTo: formValidTo || "2026-12-31",
        usageCount: 0,
        maxUsage: Number(formMaxUsage) || 100,
      };
      setPromoList((prev) => [...prev, newPromo]);
      toast("할인코드가 생성되었습니다");
      setCreateOpen(false);
    }
    resetForm();
  }

  function handleDelete(id: string) {
    setPromoList((prev) => prev.filter((p) => p.id !== id));
    toast("할인코드가 삭제되었습니다");
  }

  function isActive(promo: Promotion) {
    const now = new Date().toISOString().slice(0, 10);
    return promo.validFrom <= now && now <= promo.validTo && promo.usageCount < promo.maxUsage;
  }

  return (
    <div id="page-admin-promotions" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">프로모션</h2>
          <p className="text-gray-500 mt-1">할인코드를 관리합니다</p>
        </div>
        <Button onClick={openCreate} id="btn-create-promotion">
          <Plus className="h-4 w-4 mr-2" />
          할인코드 생성
        </Button>
      </div>

      <Card id="admin-promotions">
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>코드</TableHead>
                <TableHead>할인타입</TableHead>
                <TableHead>할인값</TableHead>
                <TableHead>인플루언서</TableHead>
                <TableHead>유효기간</TableHead>
                <TableHead>사용/최대</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>액션</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promoList.map((promo) => {
                const inf = promo.influencerId
                  ? getInfluencer(promo.influencerId)
                  : null;
                const active = isActive(promo);
                return (
                  <TableRow key={promo.id}>
                    <TableCell className="font-mono font-semibold">
                      {promo.code}
                    </TableCell>
                    <TableCell>
                      {promo.type === "percentage" ? "비율" : "정액"}
                    </TableCell>
                    <TableCell>
                      {promo.type === "percentage"
                        ? `${promo.value}%`
                        : formatKRW(promo.value)}
                    </TableCell>
                    <TableCell>{inf?.name ?? "-"}</TableCell>
                    <TableCell className="text-sm">
                      {promo.validFrom} ~ {promo.validTo}
                    </TableCell>
                    <TableCell>
                      {promo.usageCount} / {promo.maxUsage}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          active
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                        }
                      >
                        {active ? "활성" : "만료"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEdit(promo)}
                          id={`btn-edit-promo-${promo.id}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(promo.id)}
                          id={`btn-delete-promo-${promo.id}`}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
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

      {/* Create / Edit Dialog */}
      <Dialog
        open={createOpen || !!editPromo}
        onOpenChange={(open) => {
          if (!open) {
            setCreateOpen(false);
            setEditPromo(null);
            resetForm();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editPromo ? "할인코드 수정" : "할인코드 생성"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>코드명</Label>
              <Input
                value={formCode}
                onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                placeholder="예: SUMMER20"
                id="input-promo-code"
              />
            </div>
            <div className="space-y-2">
              <Label>할인 타입</Label>
              <Select
                value={formType}
                onValueChange={(v) => setFormType((v ?? "percentage") as "percentage" | "fixed")}
              >
                <SelectTrigger id="select-promo-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">비율 (%)</SelectItem>
                  <SelectItem value="fixed">정액 (원)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>할인값</Label>
              <Input
                value={formValue}
                onChange={(e) =>
                  setFormValue(e.target.value.replace(/[^0-9.]/g, ""))
                }
                placeholder={formType === "percentage" ? "예: 15" : "예: 5000"}
                id="input-promo-value"
              />
            </div>
            <div className="space-y-2">
              <Label>인플루언서 (선택)</Label>
              <Select value={formInfluencer} onValueChange={(v) => setFormInfluencer(v ?? "none")}>
                <SelectTrigger id="select-promo-influencer">
                  <SelectValue placeholder="선택 안함" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">선택 안함</SelectItem>
                  {influencers.map((inf) => (
                    <SelectItem key={inf.id} value={inf.id}>
                      {inf.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>유효기간 시작</Label>
                <Input
                  type="date"
                  value={formValidFrom}
                  onChange={(e) => setFormValidFrom(e.target.value)}
                  id="input-promo-valid-from"
                />
              </div>
              <div className="space-y-2">
                <Label>유효기간 종료</Label>
                <Input
                  type="date"
                  value={formValidTo}
                  onChange={(e) => setFormValidTo(e.target.value)}
                  id="input-promo-valid-to"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>최대 사용 횟수</Label>
              <Input
                value={formMaxUsage}
                onChange={(e) =>
                  setFormMaxUsage(e.target.value.replace(/[^0-9]/g, ""))
                }
                placeholder="예: 1000"
                id="input-promo-max-usage"
              />
            </div>
            <Button
              className="w-full"
              onClick={handleSave}
              id="btn-save-promotion"
            >
              {editPromo ? "수정" : "저장"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
