import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./slices/productsSlice";
import rawMaterialsReducer from "./slices/rawMaterialsSlice";
import productionReducer from "./slices/productionSlice";

export const store = configureStore({
  reducer: {
    products: productsReducer,
    rawMaterials: rawMaterialsReducer,
    production: productionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// TypeScript types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
