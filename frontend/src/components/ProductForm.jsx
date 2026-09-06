import React, { useState } from 'react';
import { X } from 'lucide-react';
import { createProduct, updateProduct } from '../services/api';

export default function ProductForm({ productToEdit, onClose, onSaved }) {
  const isEdit = !!productToEdit;

  const [formData, setFormData] = useState({
    name: productToEdit?.name || '',
    description: productToEdit?.description || '',
    price: productToEdit ? productToEdit.price.toString() : '',
    quantity: productToEdit ? productToEdit.quantity.toString() : '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Product name is required';
    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) < 0) {
      errs.price = 'Price must be 0 or higher';
    }
    if (!formData.quantity || isNaN(formData.quantity) || parseInt(formData.quantity, 10) < 0) {
      errs.quantity = 'Quantity must be 0 or higher';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || submitting) return;

    setGeneralError(null);
    setSubmitting(true);

    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity, 10),
    };

    try {
      if (isEdit) {
        const updated = await updateProduct(productToEdit.id, payload);
        if (onSaved) onSaved(updated, 'Product updated');
      } else {
        const created = await createProduct(payload);
        if (onSaved) onSaved(created, 'Product added');
      }
      onClose();
    } catch (err) {
      setGeneralError(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{isEdit ? 'Edit Product' : 'Add Product'}</h3>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <X size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {generalError && (
              <div className="form-error" style={{ marginBottom: '0.75rem' }}>
                {generalError}
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="product-name">
                Name
              </label>
              <input
                id="product-name"
                name="name"
                type="text"
                className="form-input"
                placeholder="Product name"
                value={formData.name}
                onChange={handleChange}
                autoFocus
              />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="product-price">
                  Price ($)
                </label>
                <input
                  id="product-price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  className="form-input tabular-nums"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={handleChange}
                />
                {errors.price && <span className="form-error">{errors.price}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="product-quantity">
                  Quantity
                </label>
                <input
                  id="product-quantity"
                  name="quantity"
                  type="number"
                  step="1"
                  min="0"
                  className="form-input tabular-nums"
                  placeholder="0"
                  value={formData.quantity}
                  onChange={handleChange}
                />
                {errors.quantity && <span className="form-error">{errors.quantity}</span>}
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="product-description">
                Description (optional)
              </label>
              <textarea
                id="product-description"
                name="description"
                className="form-textarea"
                placeholder="Brief description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary btn-sm" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm" disabled={submitting}>
              {submitting ? 'Saving...' : isEdit ? 'Save' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
