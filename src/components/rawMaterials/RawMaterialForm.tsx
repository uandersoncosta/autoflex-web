import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import type { RawMaterialFormData } from '@/types';

interface RawMaterialFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RawMaterialFormData) => void;
  initialData?: RawMaterialFormData;
  loading?: boolean;
}

export const RawMaterialForm: React.FC<RawMaterialFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  loading = false,
}) => {
  const [formData, setFormData] = useState<RawMaterialFormData>(
    initialData || { name: '', stockQuantity: '' }
  );
  const [errors, setErrors] = useState<{ name?: string; stockQuantity?: string }>({});

  const validate = (): boolean => {
    const newErrors: { name?: string; stockQuantity?: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    const quantity = Number(formData.stockQuantity);
    if (formData.stockQuantity === '' || isNaN(quantity) || quantity < 0) {
      newErrors.stockQuantity = 'Stock quantity must be 0 or greater';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
      setFormData({ name: '', stockQuantity: '' });
      setErrors({});
    }
  };

  const handleClose = () => {
    setFormData({ name: '', stockQuantity: '' });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={initialData ? 'Edit Raw Material' : 'Add Raw Material'}
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
          label="Material Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
          placeholder="Enter material name"
          required
        />
        <Input
          label="Stock Quantity"
          type="number"
          step="0.01"
          value={formData.stockQuantity}
          onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
          error={errors.stockQuantity}
          placeholder="0.00"
          required
        />
      </form>
    </Modal>
  );
};
