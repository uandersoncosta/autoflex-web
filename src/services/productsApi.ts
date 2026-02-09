import api from "./api";
import type {
  Product,
  ProductFormData,
  ProductRawMaterialFormData,
} from "@/types";

// API Response types
interface ProductsResponse {
  products: Array<{
    id: string;
    name: string;
    price: number;
  }>;
}

export const productsApi = {
  async getProducts(): Promise<Product[]> {
    const response = await api.get<ProductsResponse>("/products");
    // Transform API response to match our Product type
    return response.data.products.map((p) => ({
      id: p.id,
      code: `PRD${p.id.slice(0, 6).toUpperCase()}`, // Generate code from ID
      name: p.name,
      unitPrice: p.price,
    }));
  },

  async getProduct(id: string): Promise<Product> {
    const response = await api.get<{ id: string; name: string; price: number }>(
      `/products/${id}`,
    );
    return {
      id: response.data.id,
      code: `PRD${response.data.id.slice(0, 6).toUpperCase()}`,
      name: response.data.name,
      unitPrice: response.data.price,
    };
  },

  async createProduct(data: ProductFormData): Promise<Product> {
    const response = await api.post<{
      id: string;
      name: string;
      price: number;
    }>("/products", {
      name: data.name,
      price: Number(data.unitPrice),
    });
    return {
      id: response.data.id,
      code: `PRD${response.data.id.slice(0, 6).toUpperCase()}`,
      name: response.data.name,
      unitPrice: response.data.price,
    };
  },

  async updateProduct(id: string, data: ProductFormData): Promise<Product> {
    const response = await api.put<{ id: string; name: string; price: number }>(
      `/products/${id}`,
      {
        name: data.name,
        price: Number(data.unitPrice),
      },
    );
    return {
      id: response.data.id,
      code: `PRD${response.data.id.slice(0, 6).toUpperCase()}`,
      name: response.data.name,
      unitPrice: response.data.price,
    };
  },

  async deleteProduct(id: string): Promise<void> {
    await api.delete(`/products/${id}`);
  },

  async addRawMaterialToProduct(
    productId: string,
    data: ProductRawMaterialFormData,
  ): Promise<void> {
    await api.post("/product-raw-material", {
      productId,
      rawMaterialId: data.rawMaterialId,
      quantityRequired: Number(data.requiredQuantity),
    });
  },

  async getProductBOM(
    productId: string,
  ): Promise<ProductRawMaterialFormData[]> {
    try {
      // const response = await api.get<any>(`/products/${productId}/bom`);
      const response = await api.get<any>(
        `/product-raw-material/${productId}/materials`,
      );
      // Handle different possible response formats
      if (Array.isArray(response.data)) {
        return response.data;
      }
      return response.data.materials || [];
    } catch (error) {
      // If endpoint doesn't exist yet, return empty array
      console.warn("BOM endpoint not available:", error);
      return [];
    }
  },
};
