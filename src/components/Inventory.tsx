import React, { useState } from 'react';
import { Package, Edit2, X, Check } from 'lucide-react';
import { Item } from '../types';

interface InventoryProps {
  items: Item[];
  onUpdateStock: (id: string, newStock: number) => void;
  onUpdateItem: (item: Item) => void;
}

export function Inventory({ items, onUpdateStock, onUpdateItem }: InventoryProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Item | null>(null);

  const handleEdit = (item: Item) => {
    setEditingId(item.id);
    setEditForm(item);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const handleSave = () => {
    if (editForm) {
      onUpdateItem(editForm);
      setEditingId(null);
      setEditForm(null);
    }
  };

  const handleChange = (field: keyof Item, value: string | number) => {
    if (editForm) {
      setEditForm({
        ...editForm,
        [field]: field === 'price' || field === 'stock' ? Number(value) : value,
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Package className="w-6 h-6" />
        <h2 className="text-xl font-bold">Inventory Management</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item.id} className="p-4 bg-white rounded-lg shadow">
            {editingId === item.id ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={editForm?.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editForm?.price}
                    onChange={(e) => handleChange('price', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Image URL</label>
                  <input
                    type="url"
                    value={editForm?.imageUrl}
                    onChange={(e) => handleChange('imageUrl', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <input
                    type="text"
                    value={editForm?.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={editForm?.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    onClick={handleCancel}
                    className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="relative">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                  <button
                    onClick={() => handleEdit(item)}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                  >
                    <Edit2 className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{item.category}</p>
                <p className="text-sm text-gray-600 mb-2">${item.price.toFixed(2)}</p>
                <div className="flex items-center space-x-2">
                  <label className="text-sm">Stock:</label>
                  <input
                    type="number"
                    value={item.stock}
                    onChange={(e) => onUpdateStock(item.id, parseInt(e.target.value))}
                    className="w-20 px-2 py-1 border rounded"
                    min="0"
                  />
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}