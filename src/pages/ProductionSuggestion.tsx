import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProductionSuggestion } from '@/store/slices/productionSlice';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { TableSkeleton } from '@/components/ui/Loader';
import { Calculator, TrendingUp } from 'lucide-react';
import './ProductionSuggestion.css';
import { toast } from 'sonner';

export const ProductionSuggestion: React.FC = () => {
  const dispatch = useAppDispatch();
  const { suggestions, totalRevenue, loading, error } = useAppSelector(
    (state) => state.production
  );

  const handleCalculate = () => {
    dispatch(fetchProductionSuggestion());
    toast.success('Production suggestion calculated successfully');
  };

  useEffect(() => {
    // Auto-calculate on mount
    dispatch(fetchProductionSuggestion());
  }, [dispatch]);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Production Suggestion</h1>
          <p className="page-description">
            Calculate optimal production quantities based on available raw materials
          </p>
        </div>
        <Button icon={<Calculator size={20} />} onClick={handleCalculate} loading={loading}>
          Calculate Production
        </Button>
      </div>

      {totalRevenue > 0 && (
        <Card gradient="success" className="revenue-card">
          <div className="stat-icon">
            <TrendingUp size={32} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Estimated Revenue</p>
            <h2 className="stat-value">${totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
          </div>
        </Card>
      )}

      <Card>
        <h2 className="section-title">Production Opportunities</h2>

        {loading ? (
          <TableSkeleton rows={5} />
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Max Quantity</th>
                  <th>Unit Price</th>
                  <th>Total Value</th>
                </tr>
              </thead>
              <tbody>
                {suggestions.length > 0 ? (
                  suggestions.map((suggestion) => (
                    <tr key={suggestion.productId}>
                      <td className="product-name">{suggestion.productName}</td>
                      <td>
                        <span className="quantity-badge">{suggestion.maxQuantity} units</span>
                      </td>
                      <td>${suggestion.unitPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td className="total-value">${suggestion.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="empty-state">
                      No production suggestions available. Make sure you have products with
                      configured BOM (Bill of Materials) and available raw materials.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
