import React, { useState, useEffect } from 'react';
import { X, Edit3, Trash2 } from 'lucide-react';
import { getProductById, deleteProduct } from '../services/api';

export default function ProductDetail({ productId, onClose, onEdit, onProductDeleted }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      if (!productId) return;
      try {
        setLoading(true);
        setError(null);
        const data = await getProductById(productId);
        setProduct(data);
      } catch (err) {
        setError(err.message || 'Product not found');
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [productId]);

  const handleDelete = async () => {
    if (!product || deleting) return;
    const confirmed = window.confirm(`Delete "${product.name}"?`);
    if (!confirmed) return;

    try {
      setDeleting(true);
      await deleteProduct(product.id);
      if (onProductDeleted) onProductDeleted(product.id);
      onClose();
    } catch (err) {
      alert(err.message || 'Failed to delete product');
      setDeleting(false);
    }
  };

  const getStockBadge = (quantity) => {
    if (quantity === 0) {
      return (
        <span className="badge badge-danger">
          <span className="badge-dot"></span> Out of stock
        </span>
      );
    }
    if (quantity <= 10) {
      return (
        <span className="badge badge-warning">
          <span className="badge-dot"></span> Low stock ({quantity})
        </span>
      );
    }
    return (
      <span className="badge badge-success">
        <span className="badge-dot"></span> In stock ({quantity})
      </span>
    );
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <span className="badge badge-neutral tabular-nums">#{productId}</span>
            <h3 className="modal-title">Product Details</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <X size={15} />
          </button>
        </div>

        <div className="modal-body">
          {loading ? (
            <div className="state-container">
              <div className="spinner"></div>
            </div>
          ) : error ? (
            <div className="state-container">
              <p className="state-title">{error}</p>
            </div>
          ) : product ? (
            <div className="detail-meta-list">
              {/* Product title with Stock badge aligned right in a single row */}
              <div className="detail-header-row">
                <h2 style={{ fontSize: '1.15rem', fontWeight: 600, letterSpacing: '-0.02em' }}>
                  {product.name}
                </h2>
                <div>
                  {getStockBadge(product.quantity)}
                </div>
              </div>

              {/* Symmetrical Price & Quantity with center divider */}
              <div className="detail-spec-box">
                <div className="spec-item">
                  <span className="spec-label">Price</span>
                  <span className="spec-value tabular-nums">${parseFloat(product.price).toFixed(2)}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Quantity</span>
                  <span className="spec-value tabular-nums">{product.quantity} units</span>
                </div>
              </div>

              <div>
                <div className="detail-desc-label">Description</div>
                <div className="detail-desc-content">
                  {product.description || 'No description.'}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {product && !loading && (
          <div className="modal-footer">
            <button className="btn btn-danger btn-sm" onClick={handleDelete} disabled={deleting}>
              <Trash2 size={13} />
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => onEdit(product)}>
              <Edit3 size={13} />
              Edit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
