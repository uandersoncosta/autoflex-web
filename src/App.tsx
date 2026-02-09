import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Products } from './pages/Products';
import { RawMaterials } from './pages/RawMaterials';
import { ProductBOM } from './pages/ProductBOM';
import { ProductionSuggestion } from './pages/ProductionSuggestion';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/raw-materials" element={<RawMaterials />} />
          <Route path="/product-bom" element={<ProductBOM />} />
          <Route path="/production-suggestion" element={<ProductionSuggestion />} />
        </Routes>
      </Layout>
    </Router>
  );
}
