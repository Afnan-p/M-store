import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { ProductForm } from '../../components/admin/ProductForm';
import { ProductService } from '../../services/products';
import { StockService } from '../../services/stock';
import type { Product } from '../../types/product';

export const AdminEditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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
    const { initialStock, ...productData } = data;
    await ProductService.updateProduct(id, productData);

    if (initialStock !== undefined) {
      const STORES = ['store001', 'store002', 'store003', 'store004'];
      const pStoreIds = Array.isArray(productData.storeIds) && productData.storeIds.length > 0
        ? productData.storeIds
        : [productData.storeId || 'ALL'];

      const targetStores = pStoreIds.includes('ALL') || pStoreIds.includes('all')
        ? STORES
        : STORES.filter((sId) => pStoreIds.includes(sId));

      for (const sId of targetStores) {
        await StockService.updateStock({
          productId: id,
          storeId: sId,
          newStock: Number(initialStock),
          reason: 'Stock Correction',
          notes: 'Updated via edit product form',
          updatedBy: 'M Store Admin',
        });
      }
    }
    navigate('/admin/products');
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
