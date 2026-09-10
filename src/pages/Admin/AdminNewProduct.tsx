import React from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { ProductForm } from '../../components/admin/ProductForm';
import { ProductService } from '../../services/products';

export const AdminNewProduct: React.FC = () => {
  const handleSubmit = async (data: any) => {
    await ProductService.addProduct(data);
  };

  return (
    <AdminLayout
      title="Add New Stock Device"
      subtitle="Publish a new sealed iPhone, pre-owned certified device, or Apple accessory."
    >
      <ProductForm onSubmit={handleSubmit} buttonText="Publish Stock Item" />
    </AdminLayout>
  );
};
