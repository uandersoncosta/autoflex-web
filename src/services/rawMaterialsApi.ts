import api from "./api";
import type { RawMaterial, RawMaterialFormData } from "@/types";

// API Response types
interface RawMaterialsResponse {
  materials: Array<{
    id: string;
    name: string;
    stockQuantity: number;
  }>;
}

export const rawMaterialsApi = {
  async getRawMaterials(): Promise<RawMaterial[]> {
    const response = await api.get<RawMaterialsResponse>("/raw-materials");
    // Transform API response to match our RawMaterial type
    return response.data.materials.map((m) => ({
      id: m.id,
      code: `MAT${m.id.slice(0, 6).toUpperCase()}`, // Generate code from ID
      name: m.name,
      stockQuantity: m.stockQuantity,
    }));
  },

  async getRawMaterial(id: string): Promise<RawMaterial> {
    const response = await api.get<{
      id: string;
      name: string;
      stockQuantity: number;
    }>(`/raw-materials/${id}`);
    return {
      id: response.data.id,
      code: `MAT${response.data.id.slice(0, 6).toUpperCase()}`,
      name: response.data.name,
      stockQuantity: response.data.stockQuantity,
    };
  },

  async createRawMaterial(data: RawMaterialFormData): Promise<RawMaterial> {
    const response = await api.post<{
      id: string;
      name: string;
      stockQuantity: number;
    }>("/raw-materials", {
      name: data.name,
      stockQuantity: Number(data.stockQuantity),
    });
    return {
      id: response.data.id,
      code: `MAT${response.data.id.slice(0, 6).toUpperCase()}`,
      name: response.data.name,
      stockQuantity: response.data.stockQuantity,
    };
  },

  async updateRawMaterial(
    id: string,
    data: RawMaterialFormData,
  ): Promise<RawMaterial> {
    const response = await api.put<{
      id: string;
      name: string;
      stockQuantity: number;
    }>(`/raw-materials/${id}`, {
      name: data.name,
      stockQuantity: Number(data.stockQuantity),
    });
    return {
      id: response.data.id,
      code: `MAT${response.data.id.slice(0, 6).toUpperCase()}`,
      name: response.data.name,
      stockQuantity: response.data.stockQuantity,
    };
  },

  async deleteRawMaterial(id: string): Promise<void> {
    await api.delete(`/raw-materials/${id}`);
  },
};
