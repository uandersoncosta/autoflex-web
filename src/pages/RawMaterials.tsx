import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchRawMaterials,
  createRawMaterial,
  updateRawMaterial,
  deleteRawMaterial,
} from '@/store/slices/rawMaterialsSlice';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { TableSkeleton } from '@/components/ui/Loader';
import { RawMaterialForm } from '@/components/rawMaterials/RawMaterialForm';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import type { RawMaterial, RawMaterialFormData } from '@/types';
import './Products.css';
import { toast } from 'sonner';

export const RawMaterials: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items: rawMaterials, loading } = useAppSelector((state) => state.rawMaterials);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<RawMaterial | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchRawMaterials());
  }, [dispatch]);

  const handleCreate = async (data: RawMaterialFormData) => {
    await dispatch(createRawMaterial(data));
    setIsFormOpen(false);
    toast.success('Raw material created successfully');
  };

  const handleEdit = (material: RawMaterial) => {
    setEditingMaterial(material);
    setIsFormOpen(true);
  };

  const handleUpdate = async (data: RawMaterialFormData) => {
    if (editingMaterial) {
      await dispatch(updateRawMaterial({ id: editingMaterial.id, data }));
      setIsFormOpen(false);
      setEditingMaterial(null);
      toast.success('Raw material updated successfully');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this raw material?')) {
      await dispatch(deleteRawMaterial(id));
      toast.success('Raw material deleted successfully');
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingMaterial(null);
    toast.success('Raw material deleted successfully');
  };

  const filteredMaterials = rawMaterials.filter(
    (material) =>
      material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Raw Materials</h1>
          <p className="page-description">Manage your raw materials inventory</p>
        </div>
        <Button icon={<Plus size={20} />} onClick={() => setIsFormOpen(true)}>
          Add Raw Material
        </Button>
      </div>

      <Card>
        <div className="table-header">
          <div className="search-wrapper">
            <Search size={20} className="search-icon" />
            <Input
              type="search"
              placeholder="Search raw materials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading && rawMaterials.length === 0 ? (
          <TableSkeleton rows={5} />
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Stock Quantity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMaterials.length > 0 ? (
                  filteredMaterials.map((material) => (
                    <tr key={material.id}>
                      <td>{material.code}</td>
                      <td>{material.name}</td>
                      <td>{material.stockQuantity.toFixed(2)}</td>
                      <td>
                        <div className="table-actions">
                          <Button
                            size="sm"
                            variant="ghost"
                            icon={<Edit size={16} />}
                            onClick={() => handleEdit(material)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            icon={<Trash2 size={16} />}
                            onClick={() => handleDelete(material.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="empty-state">
                      {searchTerm ? 'No materials found' : 'No materials yet. Add one to get started!'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <RawMaterialForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={editingMaterial ? handleUpdate : handleCreate}
        initialData={
          editingMaterial
            ? { name: editingMaterial.name, stockQuantity: editingMaterial.stockQuantity }
            : undefined
        }
        loading={loading}
      />
    </div>
  );
};
