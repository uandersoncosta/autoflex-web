import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, Boxes, Factory, TrendingUp } from 'lucide-react';
import './Sidebar.css';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/products', label: 'Products', icon: Package },
  { path: '/raw-materials', label: 'Raw Materials', icon: Boxes },
  { path: '/product-bom', label: 'Product BOM', icon: Factory },
  { path: '/production-suggestion', label: 'Production Suggestion', icon: TrendingUp },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Factory size={32} className="sidebar-logo" />
        <h1 className="sidebar-title">AutoFlex</h1>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
