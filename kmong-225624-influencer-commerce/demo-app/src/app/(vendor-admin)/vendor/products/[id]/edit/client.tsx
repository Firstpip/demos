"use client";

import { ProductForm } from "../../_components/product-form";
import type { Product } from "@/lib/data";

export function EditClient({ product }: { product: Product }) {
  return <ProductForm mode="edit" product={product} />;
}
