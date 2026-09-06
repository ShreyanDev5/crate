import React from 'react';
import { Package, RefreshCw } from 'lucide-react';

export default function Home({ products, loading, onViewChange, onSelectProduct, onRestockProduct, restockingId }) {
  if (loading && products.length === 0) {
    return (
      <div className="state-container">
        <div className="spinner"></div>
        <p className="state-subtitle">Loading...</p>
      </div>
    );
  }

  const totalProducts = products.length;
  const outOfStockCount = products.filter((p) => p.quantity === 0).length;
  const lowStockCount = products.filter((p) => p.quantity > 0 && p.quantity <= 10).length;
  const attentionItems = products.filter((p) => p.quantity <= 10);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Overview and stock status</p>
        </div>
      </div>

      {/* 3 Metrics Cards */}
      <div className="dashboard-stats">
        <div className="stat-card" onClick={() => onViewChange('inventory', 'all')}>
          <div className="stat-header">
            <span className="stat-label">Total Products</span>
          </div>
          <div className="stat-value tabular-nums">{totalProducts}</div>
        </div>

        <div className="stat-card" onClick={() => onViewChange('inventory', 'low')}>
          <div className="stat-header">
            <span className="stat-label">Low Stock</span>
            <span className="stat-dot" style={{ background: 'var(--warning)' }}></span>
          </div>
          <div className="stat-value tabular-nums" style={{ color: lowStockCount > 0 ? 'var(--warning)' : 'inherit' }}>
            {lowStockCount}
          </div>
        </div>

        <div className="stat-card" onClick={() => onViewChange('inventory', 'out')}>
          <div className="stat-header">
            <span className="stat-label">Out of Stock</span>
            <span className="stat-dot" style={{ background: 'var(--danger)' }}></span>
          </div>
          <div className="stat-value tabular-nums" style={{ color: outOfStockCount > 0 ? 'var(--danger)' : 'inherit' }}>
            {outOfStockCount}
          </div>
        </div>
      </div>

      {/* Attention Table */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Low Stock Items</h2>
          <span className="badge badge-neutral tabular-nums">{attentionItems.length} items</span>
        </div>

        {attentionItems.length === 0 ? (
          <div className="state-container">
            <Package size={28} style={{ color: 'var(--text-muted)' }} />
            <p className="state-title">Stock levels look good</p>
            <p className="state-subtitle">No items need restocking.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>ID</th>
                  <th>Product</th>
                  <th style={{ width: '120px' }} className="text-right">Price</th>
                  <th style={{ width: '150px' }}>Stock</th>
                  <th style={{ width: '120px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {attentionItems.map((product) => {
                  const isOut = product.quantity === 0;
                  const isRestocking = restockingId === product.id;

                  return (
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
                      <td className="text-right tabular-nums" style={{ fontWeight: 500 }}>
                        ${parseFloat(product.price).toFixed(2)}
                      </td>
                      <td>
                        <span className={`badge ${isOut ? 'badge-danger' : 'badge-warning'} tabular-nums`}>
                          <span className="badge-dot"></span>
                          {isOut ? 'Out of stock' : `${product.quantity} left`}
                        </span>
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => onRestockProduct(product.id)}
                          disabled={isRestocking}
                          title="Add 10 units"
                        >
                          {isRestocking ? (
                            <RefreshCw size={12} style={{ animation: 'spin 0.7s linear infinite' }} />
                          ) : (
                            '+10 Restock'
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
