import React, { useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Package, Boxes, DollarSign } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProducts } from '@/store/slices/productsSlice';
import { fetchRawMaterials } from '@/store/slices/rawMaterialsSlice';
import { Loader } from '@/components/ui/Loader';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items: products, loading: productsLoading } = useAppSelector((state) => state.products);
  const { items: rawMaterials, loading: materialsLoading } = useAppSelector(
    (state) => state.rawMaterials
  );

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchRawMaterials());
  }, [dispatch]);

  const totalStockValue = rawMaterials.reduce((sum, mat) => sum + mat.stockQuantity * 10, 0);

  const loading = productsLoading || materialsLoading;

  if (loading) {
    return (
      <div className="page">
        <Loader />
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p className="page-description">Overview of your stock production system</p>
      </div>

      <div className="stats-grid">
        <Card gradient="primary" className="stat-card">
          <div className="stat-icon">
            <Package size={32} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Products</p>
            <h2 className="stat-value">{products.length}</h2>
          </div>
        </Card>

        <Card gradient="success" className="stat-card">
          <div className="stat-icon">
            <Boxes size={32} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Raw Materials</p>
            <h2 className="stat-value">{rawMaterials.length}</h2>
          </div>
        </Card>

        <Card gradient="accent" className="stat-card">
          <div className="stat-icon">
            <DollarSign size={32} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Stock Value</p>
            <h2 className="stat-value">${totalStockValue.toFixed(2)}</h2>
          </div>
        </Card>
      </div>
    </div>
  );
};
