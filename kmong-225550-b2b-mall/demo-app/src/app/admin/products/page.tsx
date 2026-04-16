'use client';

import { useState } from 'react';
import { products, type Product } from '@/data/products';
import Modal from '@/components/Modal';
import RichEditor from '@/components/RichEditor';
import { useToast } from '@/contexts/ToastContext';

function formatPrice(price: number) {
  return price.toLocaleString('ko-KR');
}

export default function AdminProductsPage() {
  const { showToast } = useToast();
  const [productList, setProductList] = useState<Product[]>(products);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editActive, setEditActive] = useState(true);
  const [editMinAmount, setEditMinAmount] = useState('');
  const [editMaxQty, setEditMaxQty] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const openEdit = (product: Product) => {
    setSelectedProduct(product);
    setEditName(product.name);
    setEditCategory(product.category);
    setEditPrice(String(product.basePrice));
    setEditActive(product.isActive);
    setEditMinAmount(String(product.purchaseLimit.minAmount));
    setEditMaxQty(String(product.purchaseLimit.maxQuantity));
    setEditDescription(product.detailDescription);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!selectedProduct) return;
    setProductList(prev => prev.map(p =>
      p.id === selectedProduct.id ? {
        ...p,
        name: editName,
        category: editCategory,
        basePrice: Number(editPrice),
        isActive: editActive,
        purchaseLimit: { ...p.purchaseLimit, minAmount: Number(editMinAmount), maxQuantity: Number(editMaxQty) },
        detailDescription: editDescription,
      } : p
    ));
    setIsEditing(false);
    setSelectedProduct(null);
    showToast('상품이 수정되었습니다.', 'success');
  };

  const handleAdd = () => {
    const newProduct: Product = {
      id: `P${String(productList.length + 1).padStart(3, '0')}`,
      name: editName || '새 상품',
      category: editCategory || '사무용품',
      description: '새로 등록된 상품입니다.',
      detailDescription: editDescription || '<p>상품 상세 설명을 입력해주세요.</p>',
      images: ['/images/products/new.jpg'],
      basePrice: Number(editPrice) || 10000,
      options: [{ name: '기본', values: [{ label: '기본', stock: 100, additionalPrice: 0 }] }],
      purchaseLimit: { minAmount: Number(editMinAmount) || 10000, maxQuantity: Number(editMaxQty) || 100 },
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setProductList(prev => [...prev, newProduct]);
    setShowAddModal(false);
    resetForm();
    showToast('상품이 추가되었습니다.', 'success');
  };

  const resetForm = () => {
    setEditName('');
    setEditCategory('');
    setEditPrice('');
    setEditActive(true);
    setEditMinAmount('');
    setEditMaxQty('');
    setEditDescription('');
  };

  const toggleActive = (id: string) => {
    setProductList(prev => prev.map(p =>
      p.id === id ? { ...p, isActive: !p.isActive } : p
    ));
    showToast('상품 상태가 변경되었습니다.', 'info');
  };

  const renderForm = () => (
    <div className="space-y-4">
      <div>
        <label className="label-field">상품명 <span className="text-error">*</span></label>
        <input value={editName} onChange={(e) => setEditName(e.target.value)} className="input-field" placeholder="상품명" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label-field">카테고리</label>
          <select value={editCategory} onChange={(e) => setEditCategory(e.target.value)} className="input-field">
            <option value="식품/음료">식품/음료</option>
            <option value="생활용품">생활용품</option>
            <option value="사무용품">사무용품</option>
            <option value="패션잡화">패션잡화</option>
          </select>
        </div>
        <div>
          <label className="label-field">기본가격 (원)</label>
          <input type="text" inputMode="numeric" onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, ''); }} value={editPrice} onChange={(e) => setEditPrice(e.target.value)} className="input-field" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label-field">최소 주문금액 (원)</label>
          <input type="text" inputMode="numeric" onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, ''); }} value={editMinAmount} onChange={(e) => setEditMinAmount(e.target.value)} className="input-field" />
        </div>
        <div>
          <label className="label-field">최대 주문수량</label>
          <input type="text" inputMode="numeric" onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, ''); }} value={editMaxQty} onChange={(e) => setEditMaxQty(e.target.value)} className="input-field" />
        </div>
      </div>
      <div>
        <label className="label-field">상세 설명</label>
        <RichEditor value={editDescription} onChange={setEditDescription} />
      </div>
      {isEditing && (
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={editActive} onChange={(e) => setEditActive(e.target.checked)} />
          <span className="text-sm">활성화</span>
        </label>
      )}

      {/* Options display */}
      {selectedProduct && (
        <div>
          <label className="label-field">옵션별 재고</label>
          <div className="bg-neutral-100 rounded-lg p-3 space-y-2">
            {selectedProduct.options.map(opt => (
              <div key={opt.name}>
                <p className="text-xs font-medium text-neutral-600 mb-1">{opt.name}</p>
                {opt.values.map(v => (
                  <div key={v.label} className="flex items-center justify-between text-xs py-0.5">
                    <span>{v.label} {v.additionalPrice !== 0 && `(${v.additionalPrice > 0 ? '+' : ''}${formatPrice(v.additionalPrice)}원)`}</span>
                    <span className="text-neutral-400">재고: {v.stock}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div id="admin-products">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">상품관리</h1>
        <button
          onClick={() => { resetForm(); setShowAddModal(true); }}
          className="btn-secondary"
        >
          + 상품 추가
        </button>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm table-striped">
            <thead>
              <tr className="bg-neutral-100">
                <th className="text-left px-4 py-3 font-medium text-neutral-600">ID</th>
                <th className="text-left px-4 py-3 font-medium text-neutral-600">상품명</th>
                <th className="text-left px-4 py-3 font-medium text-neutral-600">카테고리</th>
                <th className="text-right px-4 py-3 font-medium text-neutral-600">가격</th>
                <th className="text-center px-4 py-3 font-medium text-neutral-600">상태</th>
                <th className="text-center px-4 py-3 font-medium text-neutral-600">관리</th>
              </tr>
            </thead>
            <tbody>
              {productList.map(product => (
                <tr key={product.id} className="border-b border-neutral-100">
                  <td className="px-4 py-3 font-mono text-xs text-neutral-400">{product.id}</td>
                  <td className="px-4 py-3 font-medium max-w-[200px] truncate">{product.name}</td>
                  <td className="px-4 py-3 text-neutral-400">{product.category}</td>
                  <td className="px-4 py-3 text-right">{formatPrice(product.basePrice)}원</td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => toggleActive(product.id)} className="cursor-pointer">
                      <span className={`inline-block w-3 h-3 rounded-full ${product.isActive ? 'bg-success' : 'bg-neutral-400'}`} />
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => openEdit(product)} className="text-primary hover:underline text-xs cursor-pointer">
                      수정
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit modal */}
      <Modal isOpen={isEditing} onClose={() => { setIsEditing(false); setSelectedProduct(null); }} title="상품 수정" size="lg">
        {renderForm()}
        <div className="flex justify-end gap-2 mt-6 border-t border-neutral-200 pt-4">
          <button onClick={() => { setIsEditing(false); setSelectedProduct(null); }} className="btn-outline">취소</button>
          <button onClick={handleSave} className="btn-primary">저장</button>
        </div>
      </Modal>

      {/* Add modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="상품 추가" size="lg">
        {renderForm()}
        <div className="flex justify-end gap-2 mt-6 border-t border-neutral-200 pt-4">
          <button onClick={() => setShowAddModal(false)} className="btn-outline">취소</button>
          <button onClick={handleAdd} className="btn-secondary">추가</button>
        </div>
      </Modal>
    </div>
  );
}
