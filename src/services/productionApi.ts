import api from "./api";
import type { ProductionSuggestion } from "@/types";

export const productionApi = {
  async getProductionSuggestion(): Promise<ProductionSuggestion> {
    const response = await api.get<ProductionSuggestion>(
      "/production/suggestions",
    );
    return response.data;
  },
};
