import React, { useState } from 'react';
import { Search, ShoppingCart, X } from 'lucide-react';
import { Item, CartItem } from '../types';

interface POSProps {
  items: Item[];
  onTransaction: (items: CartItem[]) => void;
}

export function POS({ items, onTransaction }: POSProps) {
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (item: Item) => {
    const existingItem = cart.find((cartItem) => cartItem.item.id === item.id);
    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem.item.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCart([...cart, { item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter((cartItem) => cartItem.item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCart(
        cart.map((cartItem) =>
          cartItem.item.id === itemId ? { ...cartItem, quantity } : cartItem
        )
      );
    }
  };

  const total = cart.reduce(
    (sum, { item, quantity }) => sum + item.price * quantity,
    0
  );

  const handleCheckout = () => {
    onTransaction(cart);
    setCart([]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <button
              key={item.id}
              onClick={() => addToCart(item)}
              className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-32 object-cover rounded-md mb-2"
              />
              <h3 className="font-semibold truncate">{item.name}</h3>
              <p className="text-sm text-gray-600">${item.price.toFixed(2)}</p>
            </button>
          ))}
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Current Order</h2>
          <ShoppingCart className="w-6 h-6" />
        </div>
        <div className="space-y-4 mb-4">
          {cart.map(({ item, quantity }) => (
            <div key={item.id} className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-600">
                  ${(item.price * quantity).toFixed(2)}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    updateQuantity(item.id, parseInt(e.target.value))
                  }
                  className="w-16 px-2 py-1 border rounded"
                  min="1"
                />
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t pt-4">
          <div className="flex justify-between mb-4">
            <span className="font-bold">Total:</span>
            <span className="font-bold">${total.toFixed(2)}</span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
          >
            Complete Order
          </button>
        </div>
      </div>
    </div>
  );
}