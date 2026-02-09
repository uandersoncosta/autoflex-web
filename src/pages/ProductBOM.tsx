import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProducts } from '@/store/slices/productsSlice';
import { fetchRawMaterials } from '@/store/slices/rawMaterialsSlice';
import { productsApi } from '@/services/productsApi';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Loader } from '@/components/ui/Loader';
import { Plus, Trash2 } from 'lucide-react';
import type { ProductRawMaterial } from '@/types';
import './ProductBOM.css';
import { toast } from 'sonner';

export const ProductBOM: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items: products, loading: productsLoading } = useAppSelector((state) => state.products);
  const { items: rawMaterials, loading: materialsLoading } = useAppSelector(
    (state) => state.rawMaterials
  );

  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>('');
  const [requiredQuantity, setRequiredQuantity] = useState<string>('');
  const [bomItems, setBomItems] = useState<ProductRawMaterial[]>([]);
  const [error, setError] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [loadingBOM, setLoadingBOM] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchRawMaterials());
  }, [dispatch]);

  useEffect(() => {
    const fetchBOMForProduct = async () => {
      if (!selectedProductId) {
        return;
      }

      setLoadingBOM(true);
      try {
        const bomData = await productsApi.getProductBOM(selectedProductId);

        setBomItems(prevItems => {
          const otherProducts = prevItems.filter(
            item => item.product.id !== selectedProductId
          );

          return [...otherProducts, ...bomData];
        });

      } catch (err) {
        console.error('Error fetching BOM:', err);
        toast.error('Error fetching BOM');
      } finally {
        setLoadingBOM(false);
      }
    };

    fetchBOMForProduct();
  }, [selectedProductId, rawMaterials]);

  const handleAddMaterial = async () => {
    setError('');

    if (!selectedProductId) {
      setError('Please select a product');
      return;
    }

    if (!selectedMaterialId) {
      setError('Please select a raw material');
      return;
    }

    const quantity = Number(requiredQuantity);
    if (!requiredQuantity || isNaN(quantity) || quantity <= 0) {
      setError('Required quantity must be greater than 0');
      return;
    }

    const material = rawMaterials.find((m) => m.id === selectedMaterialId);
    if (!material) return;

    try {
      setSaving(true);

      // Call the API to save the BOM relationship
      await productsApi.addRawMaterialToProduct(selectedProductId, {
        rawMaterialId: selectedMaterialId,
        requiredQuantity: requiredQuantity,
      });

      const newItem: ProductRawMaterial = {
        product: {
          id: selectedProductId,
          name: selectedProduct?.name ?? '',
          price: selectedProduct?.unitPrice ?? 0,
        },
        rawMaterial: {
          id: material.id,
          name: material.name,
          stockQuantity: material.stockQuantity,
        },
        quantityRequired: quantity,
      };


      setBomItems([...bomItems, newItem]);
      setSelectedMaterialId('');
      setRequiredQuantity('');

      toast.success('Material added to BOM');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add material to BOM');
      console.error('Error adding BOM item:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveItem = async (index: number) => {
    setBomItems(bomItems.filter((_, i) => i !== index));
    toast.success('Material removed from BOM');
  };

  const loading = productsLoading || materialsLoading;

  if (loading) {
    return (
      <div className="page">
        <Loader />
      </div>
    );
  }

  const selectedProduct = products.find((p) => p.id === selectedProductId);
  const currentBomItems = bomItems.filter((item) => item.product.id === selectedProductId);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Product BOM (Bill of Materials)</h1>
          <p className="page-description">Define raw materials needed for each product</p>
        </div>
      </div>

      <div className="bom-grid">
        <Card>
          <h2 className="section-title">Add Material to Product</h2>

          <div className="form">
            <div className="input-wrapper">
              <label className="input-label">Select Product</label>
              <select
                className="input"
                value={selectedProductId}
                onChange={(e) => {
                  setSelectedProductId(e.target.value);
                  setError('');
                }}
                disabled={saving}
              >
                <option value="">Choose a product...</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.code} - {product.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-wrapper">
              <label className="input-label">Select Raw Material</label>
              <select
                className="input"
                value={selectedMaterialId}
                onChange={(e) => {
                  setSelectedMaterialId(e.target.value);
                  setError('');
                }}
                disabled={!selectedProductId || saving}
              >
                <option value="">Choose a material...</option>
                {rawMaterials.map((material) => (
                  <option key={material.id} value={material.id}>
                    {material.code} - {material.name} (Stock: {material.stockQuantity})
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Required Quantity"
              type="number"
              step="0.01"
              value={requiredQuantity}
              onChange={(e) => {
                setRequiredQuantity(e.target.value);
                setError('');
              }}
              placeholder="0.00"
              disabled={!selectedMaterialId || saving}
            />

            {error && <div className="error-message">{error}</div>}

            <Button
              icon={<Plus size={20} />}
              onClick={handleAddMaterial}
              disabled={!selectedProductId || saving}
              loading={saving}
            >
              Add Material
            </Button>
          </div>
        </Card>

        <Card>
          <h2 className="section-title">
            {selectedProduct ? `BOM for: ${selectedProduct.name}` : 'Product BOM'}
          </h2>

          {loadingBOM ? (
            <div className="empty-state">
              <Loader />
              Loading BOM items...
            </div>
          ) : currentBomItems.length > 0 ? (
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Raw Material</th>
                    <th>Required Quantity</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentBomItems.map((item, index) => (
                    <tr key={index}>
                      <td>{item.rawMaterial.name}</td>
                      <td>{item.quantityRequired.toFixed(2)}</td>
                      <td>
                        <Button
                          size="sm"
                          variant="danger"
                          icon={<Trash2 size={16} />}
                          onClick={() =>
                            handleRemoveItem(bomItems.findIndex((bi) => bi === item))
                          }
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              {selectedProduct
                ? 'No materials added yet. Add materials to define the BOM.'
                : 'Select a product to view its BOM.'}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
