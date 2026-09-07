import React, { useState, useMemo } from 'react';
import { Search, ChevronUp, ChevronDown, Package, Plus, RefreshCw } from 'lucide-react';

export default function ProductList({ products, loading, onSelectProduct, onOpenCreate, initialFilter = 'all', onRestockProduct, restockingId }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState(initialFilter);
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });

  React.useEffect(() => {
    if (initialFilter) {
      setStockFilter(initialFilter);
    }
  }, [initialFilter]);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Stock filter
      if (stockFilter === 'out' && product.quantity !== 0) return false;
      if (stockFilter === 'low' && (product.quantity === 0 || product.quantity > 10)) return false;

      // Text search
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();
      return (
        product.name.toLowerCase().includes(term) ||
        (product.description && product.description.toLowerCase().includes(term)) ||
        product.id.toString().includes(term)
      );
    });
  }, [products, searchTerm, stockFilter]);

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      const dir = sortConfig.direction === 'asc' ? 1 : -1;
      if (sortConfig.key === 'id') return (a.id - b.id) * dir;
      if (sortConfig.key === 'name') return a.name.localeCompare(b.name) * dir;
      if (sortConfig.key === 'price') return (a.price - b.price) * dir;
      if (sortConfig.key === 'quantity') return (a.quantity - b.quantity) * dir;
      return 0;
    });
  }, [filteredProducts, sortConfig]);

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <ChevronDown size={12} style={{ opacity: 0.25, marginLeft: '0.25rem' }} />;
    }
    return sortConfig.direction === 'asc' ? (
      <ChevronUp size={12} style={{ color: 'var(--text-primary)', marginLeft: '0.25rem' }} />
    ) : (
      <ChevronDown size={12} style={{ color: 'var(--text-primary)', marginLeft: '0.25rem' }} />
    );
  };

  const getStockBadge = (quantity) => {
    if (quantity === 0) {
      return (
        <span className="badge badge-danger tabular-nums">
          <span className="badge-dot"></span> Out of stock
        </span>
      );
    }
    if (quantity <= 10) {
      return (
        <span className="badge badge-warning tabular-nums">
          <span className="badge-dot"></span> {quantity} left
        </span>
      );
    }
    return (
      <span className="badge badge-success tabular-nums">
        <span className="badge-dot"></span> {quantity} in stock
      </span>
    );
  };

  if (loading && products.length === 0) {
    return (
      <div className="state-container">
        <div className="spinner"></div>
        <p className="state-subtitle">Loading products...</p>
      </div>
    );
  }

  const lowStockCount = products.filter((p) => p.quantity > 0 && p.quantity <= 10).length;
  const outOfStockCount = products.filter((p) => p.quantity === 0).length;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Inventory</h1>
          <p className="page-subtitle">Manage products, pricing, and stock</p>
        </div>
      </div>

      <div className="card">
        <div className="filter-toolbar">
          <div className="search-container">
            <Search className="search-icon" size={15} />
            <input
              type="text"
              className="search-field"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <button
              className={`filter-chip ${stockFilter === 'all' ? 'active' : ''}`}
              onClick={() => setStockFilter('all')}
            >
              All ({products.length})
            </button>
            <button
              className={`filter-chip ${stockFilter === 'low' ? 'active' : ''}`}
              onClick={() => setStockFilter('low')}
            >
              Low Stock ({lowStockCount})
            </button>
            <button
              className={`filter-chip ${stockFilter === 'out' ? 'active' : ''}`}
              onClick={() => setStockFilter('out')}
            >
              Out of Stock ({outOfStockCount})
            </button>
          </div>
        </div>

        {sortedProducts.length === 0 ? (
          <div className="state-container">
            <Package size={28} style={{ color: 'var(--text-muted)' }} />
            <p className="state-title">No products found</p>
            <p className="state-subtitle">
              {products.length === 0 ? 'No products added yet.' : 'No products match your search.'}
            </p>
            {products.length === 0 && (
              <button className="btn btn-primary btn-sm" style={{ marginTop: '0.75rem' }} onClick={onOpenCreate}>
                <Plus size={14} /> Add Product
              </button>
            )}
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th
                    style={{ width: '80px', cursor: 'pointer', userSelect: 'none' }}
                    onClick={() => handleSort('id')}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                      ID {renderSortIcon('id')}
                    </span>
                  </th>
                  <th
                    style={{ cursor: 'pointer', userSelect: 'none' }}
                    onClick={() => handleSort('name')}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                      Name {renderSortIcon('name')}
                    </span>
                  </th>
                  <th
                    style={{ width: '120px', cursor: 'pointer', userSelect: 'none' }}
                    onClick={() => handleSort('price')}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                      Price {renderSortIcon('price')}
                    </span>
                  </th>
                  <th
                    style={{ width: '150px', cursor: 'pointer', userSelect: 'none' }}
                    onClick={() => handleSort('quantity')}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                      Stock {renderSortIcon('quantity')}
                    </span>
                  </th>
                  <th style={{ width: '120px' }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="row-interactive"
                    onClick={() => onSelectProduct(product.id)}
                  >
                    <td style={{ color: 'var(--text-muted)' }} className="tabular-nums">
                      #{product.id}
                    </td>
                    <td>
                      <div className="product-name-cell">{product.name}</div>
                      {product.description && (
                        <div className="product-desc-muted">{product.description}</div>
                      )}
                    </td>
                    <td className="tabular-nums" style={{ fontWeight: 500 }}>
                      ${parseFloat(product.price).toFixed(2)}
                    </td>
                    <td>
                      {getStockBadge(product.quantity)}
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => onRestockProduct && onRestockProduct(product.id)}
                        disabled={restockingId === product.id}
                        title="Add 10 units"
                      >
                        {restockingId === product.id ? (
                          <RefreshCw size={12} style={{ animation: 'spin 0.7s linear infinite' }} />
                        ) : (
                          '+10 Restock'
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
