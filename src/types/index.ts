// Data Models
export interface Product {
  id: string;
  code: string;
  name: string;
  unitPrice: number;
}

export interface RawMaterial {
  id: string;
  code: string;
  name: string;
  stockQuantity: number;
}

export interface ProductRawMaterial {
  id?: string;

  product: {
    id: string;
    name: string;
    price: number;
  };

  rawMaterial: {
    id: string;
    name: string;
    stockQuantity: number;
  };

  quantityRequired: number;
}

export interface ProductionSuggestionItem {
  productId: string;
  productName: string;
  maxQuantity: number;
  unitPrice: number;
  totalValue: number;
}

export interface ProductionSuggestion {
  totalValue: number;
  products: ProductionSuggestionItem[];
}

export interface ProductFormData {
  name: string;
  unitPrice: number | string;
}

export interface RawMaterialFormData {
  name: string;
  stockQuantity: number | string;
}

export interface ProductRawMaterialFormData {
  rawMaterialId: string;
  requiredQuantity: number | string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface DashboardStats {
  totalProducts: number;
  totalRawMaterials: number;
  totalStockValue: number;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}
