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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { categories, products } from "@/lib/data";
import type { Category } from "@/lib/data";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function AdminCategoriesPage() {
  const [catList, setCatList] = useState<Category[]>([...categories]);
  const [createOpen, setCreateOpen] = useState(false);
  const [editCat, setEditCat] = useState<Category | null>(null);

  const [formName, setFormName] = useState("");
  const [formNameEn, setFormNameEn] = useState("");
  const [formIcon, setFormIcon] = useState("");

  function resetForm() {
    setFormName("");
    setFormNameEn("");
    setFormIcon("");
  }

  function openCreate() {
    resetForm();
    setCreateOpen(true);
  }

  function openEdit(cat: Category) {
    setFormName(cat.name);
    setFormNameEn(cat.nameEn);
    setFormIcon(cat.icon);
    setEditCat(cat);
  }

  function handleSave() {
    if (!formName || !formNameEn) {
      toast("카테고리 이름(한/영)을 입력해주세요");
      return;
    }
    if (editCat) {
      setCatList((prev) =>
        prev.map((c) =>
          c.id === editCat.id
            ? { ...c, name: formName, nameEn: formNameEn, icon: formIcon || c.icon }
            : c
        )
      );
      toast("카테고리가 수정되었습니다");
      setEditCat(null);
    } else {
      const newCat: Category = {
        id: `cat-${Date.now()}`,
        name: formName,
        nameEn: formNameEn,
        icon: formIcon || "📁",
      };
      setCatList((prev) => [...prev, newCat]);
      toast("카테고리가 추가되었습니다");
      setCreateOpen(false);
    }
    resetForm();
  }

  function handleDelete(id: string) {
    setCatList((prev) => prev.filter((c) => c.id !== id));
    toast("카테고리가 삭제되었습니다");
  }

  function getProductCount(categoryId: string) {
    return products.filter((p) => p.categoryId === categoryId).length;
  }

  return (
    <div id="page-admin-categories" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">카테고리</h2>
          <p className="text-gray-500 mt-1">상품 카테고리를 관리합니다</p>
        </div>
        <Button onClick={openCreate} id="btn-create-category">
          <Plus className="h-4 w-4 mr-2" />
          카테고리 추가
        </Button>
      </div>

      <Card id="admin-categories">
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>아이콘</TableHead>
                <TableHead>이름 (한)</TableHead>
                <TableHead>이름 (영)</TableHead>
                <TableHead>상품수</TableHead>
                <TableHead>액션</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {catList.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell className="text-2xl">{cat.icon}</TableCell>
                  <TableCell className="font-medium">{cat.name}</TableCell>
                  <TableCell>{cat.nameEn}</TableCell>
                  <TableCell>{getProductCount(cat.id)}개</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEdit(cat)}
                        id={`btn-edit-cat-${cat.id}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(cat.id)}
                        id={`btn-delete-cat-${cat.id}`}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create / Edit Dialog */}
      <Dialog
        open={createOpen || !!editCat}
        onOpenChange={(open) => {
          if (!open) {
            setCreateOpen(false);
            setEditCat(null);
            resetForm();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editCat ? "카테고리 수정" : "카테고리 추가"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>이름 (한글)</Label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="예: 패션"
                id="input-cat-name"
              />
            </div>
            <div className="space-y-2">
              <Label>이름 (영문)</Label>
              <Input
                value={formNameEn}
                onChange={(e) => setFormNameEn(e.target.value)}
                placeholder="예: Fashion"
                id="input-cat-name-en"
              />
            </div>
            <div className="space-y-2">
              <Label>아이콘 (이모지)</Label>
              <Input
                value={formIcon}
                onChange={(e) => setFormIcon(e.target.value)}
                placeholder="예: 👗"
                id="input-cat-icon"
              />
            </div>
            <Button
              className="w-full"
              onClick={handleSave}
              id="btn-save-category"
            >
              {editCat ? "수정" : "추가"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
