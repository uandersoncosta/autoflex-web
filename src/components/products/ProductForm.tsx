import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import type { ProductFormData } from '@/types';

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => void;
  initialData?: ProductFormData;
  loading?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  loading = false,
}) => {
  const [formData, setFormData] = useState<ProductFormData>(
    initialData || { name: '', unitPrice: '' }
  );
  const [errors, setErrors] = useState<{ name?: string; unitPrice?: string }>({});

  const validate = (): boolean => {
    const newErrors: { name?: string; unitPrice?: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    const price = Number(formData.unitPrice);
    if (!formData.unitPrice || isNaN(price) || price <= 0) {
      newErrors.unitPrice = 'Unit price must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
      setFormData({ name: '', unitPrice: '' });
      setErrors({});
    }
  };

  const handleClose = () => {
    setFormData({ name: '', unitPrice: '' });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={initialData ? 'Edit Product' : 'Add Product'}
      footer={
        <>
          <Button variant="ghost" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={loading}>
            Save
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="form">
        <Input
          label="Product Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
          placeholder="Enter product name"
          required
        />
        <Input
          label="Unit Price"
          type="number"
          step="0.01"
          value={formData.unitPrice}
          onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
          error={errors.unitPrice}
          placeholder="0.00"
          required
        />
      </form>
    </Modal>
  );
};
