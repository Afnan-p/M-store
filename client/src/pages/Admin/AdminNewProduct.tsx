import React from 'react';
import { useLocation } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { ProductForm } from '../../components/admin/ProductForm';
import { ProductService } from '../../services/products';
import { StockService } from '../../services/stock';

export const AdminNewProduct: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isAccessory = searchParams.get('type') === 'accessory';

  const handleSubmit = async (data: any) => {
    const { initialStock, ...productData } = data;
    const newProduct = await ProductService.addProduct(productData);

    if (newProduct?.id && initialStock !== undefined) {
      const STORES = ['store001', 'store002', 'store003', 'store004'];
      const targetStores = productData.storeId === 'ALL' || productData.storeId === 'all'
        ? STORES
        : [productData.storeId || 'store001'];

      for (const sId of targetStores) {
        await StockService.updateStock({
          productId: newProduct.id,
          storeId: sId,
          newStock: Number(initialStock),
          reason: 'New Stock Added',
          notes: 'Set during product addition',
          updatedBy: 'M Store Admin',
        });
      }
    }
  };

  return (
    <AdminLayout
      title={isAccessory ? 'Add New Accessory' : 'Add New iPhone Device'}
      subtitle={
        isAccessory
          ? 'Publish a new charger, speaker, AirPods, case, or custom accessory to a showroom store branch.'
          : 'Publish a new sealed iPhone or pre-owned certified device to a showroom store branch.'
      }
    >
      <ProductForm
        onSubmit={handleSubmit}
        defaultCategory={isAccessory ? 'accessory' : 'iphone-used'}
        buttonText={isAccessory ? 'Publish Accessory' : 'Publish iPhone Device'}
      />
    </AdminLayout>
  );
};
