import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { ProductForm } from '../../components/admin/ProductForm';
import { ProductService } from '../../services/products';
import type { Product } from '../../types/product';

export const AdminEditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    ProductService.getProductById(id).then((p) => {
      setProduct(p);
      setLoading(false);
    });
  }, [id]);

  const handleSubmit = async (data: any) => {
    if (!id) return;
    await ProductService.updateProduct(id, data);
  };

  if (loading) {
    return (
      <AdminLayout title="Edit Device Details">
        <div className="p-8 text-center text-zinc-500">Loading product details...</div>
      </AdminLayout>
    );
  }

  if (!product) {
    return (
      <AdminLayout title="Product Not Found">
        <div className="p-8 text-center text-zinc-500">Device could not be found.</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title={`Edit: ${product.name}`}
      subtitle="Update device pricing, pre-owned battery health %, status, or images."
    >
      <ProductForm initialData={product} onSubmit={handleSubmit} buttonText="Save Device Changes" />
    </AdminLayout>
  );
};
