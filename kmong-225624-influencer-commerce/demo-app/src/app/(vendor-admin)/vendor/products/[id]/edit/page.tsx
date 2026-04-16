import { products } from "@/lib/data";
import { EditClient } from "./client";

export function generateStaticParams() {
  return products
    .filter((p) => p.vendorId === "ven-1")
    .map((p) => ({ id: p.id }));
}

export default async function VendorProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="p-8 text-center text-gray-500">
        상품을 찾을 수 없습니다.
      </div>
    );
  }

  return <EditClient product={product} />;
}
