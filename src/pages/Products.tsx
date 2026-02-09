import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '@/store/slices/productsSlice';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { TableSkeleton } from '@/components/ui/Loader';
import { ProductForm } from '@/components/products/ProductForm';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import type { Product, ProductFormData } from '@/types';
import './Products.css';
import { toast } from 'sonner';

export const Products: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items: products, loading, error } = useAppSelector((state) => state.products);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleCreate = async (data: ProductFormData) => {
    await dispatch(createProduct(data));
    setIsFormOpen(false);
    toast.success('Product created successfully');
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
    toast.success('Product edited successfully');
  };

  const handleUpdate = async (data: ProductFormData) => {
    if (editingProduct) {
      await dispatch(updateProduct({ id: editingProduct.id, data }));
      setIsFormOpen(false);
      setEditingProduct(null);
      toast.success('Product updated successfully');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await dispatch(deleteProduct(id));
      toast.success('Product deleted successfully');
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Products</h1>
          <p className="page-description">Manage your product catalog</p>
        </div>
        <Button icon={<Plus size={20} />} onClick={() => setIsFormOpen(true)}>
          Add Product
        </Button>
      </div>

      <Card>
        <div className="table-header">
          <div className="search-wrapper">
            <Search size={20} className="search-icon" />
            <Input
              type="search"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading && products.length === 0 ? (
          <TableSkeleton rows={5} />
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Unit Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr key={product.id}>
                      <td>{product.code}</td>
                      <td>{product.name}</td>
                      <td>${product.unitPrice.toFixed(2)}</td>
                      <td>
                        <div className="table-actions">
                          <Button
                            size="sm"
                            variant="ghost"
                            icon={<Edit size={16} />}
                            onClick={() => handleEdit(product)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            icon={<Trash2 size={16} />}
                            onClick={() => handleDelete(product.id)}
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
                      {searchTerm ? 'No products found' : 'No products yet. Add one to get started!'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <ProductForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={editingProduct ? handleUpdate : handleCreate}
        initialData={
          editingProduct
            ? { name: editingProduct.name, unitPrice: editingProduct.unitPrice }
            : undefined
        }
        loading={loading}
      />
    </div>
  );
};
