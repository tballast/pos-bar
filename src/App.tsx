import React, { useState } from 'react';
import { Beer, Package, History } from 'lucide-react';
import { Item, Transaction, CartItem } from './types';
import { ItemForm } from './components/ItemForm';
import { Inventory } from './components/Inventory';
import { POS } from './components/POS';
import { TransactionHistory } from './components/TransactionHistory';

const defaultItems: Item[] = [
  {
    id: crypto.randomUUID(),
    name: 'Beer',
    price: 5,
    imageUrl:
      'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=500',
    category: 'Beer',
    description: 'Refreshing draft beer',
    stock: 100,
  },
  {
    id: crypto.randomUUID(),
    name: 'White Wine',
    price: 5,
    imageUrl:
      'https://images.unsplash.com/photo-1566275529824-cca6d008f3da?w=500',
    category: 'Wine',
    description: 'Crisp white wine',
    stock: 100,
  },
  {
    id: crypto.randomUUID(),
    name: 'Red Wine',
    price: 5,
    imageUrl:
      'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=500',
    category: 'Wine',
    description: 'Full-bodied red wine',
    stock: 100,
  },
  {
    id: crypto.randomUUID(),
    name: 'Spirits',
    price: 5,
    imageUrl:
      'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=500',
    category: 'Spirits',
    description: 'Standard spirits',
    stock: 100,
  },
  {
    id: crypto.randomUUID(),
    name: 'Premium Spirit',
    price: 8,
    imageUrl:
      'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=500',
    category: 'Spirits',
    description: 'Top-shelf premium spirits',
    stock: 100,
  },
];

function App() {
  const [items, setItems] = useState<Item[]>(defaultItems);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState<'pos' | 'inventory' | 'history'>(
    'pos'
  );

  const handleAddItem = (item: Item) => {
    setItems([...items, item]);
  };

  const handleUpdateStock = (id: string, newStock: number) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, stock: newStock } : item
      )
    );
  };

  const handleUpdateItem = (updatedItem: Item) => {
    setItems(
      items.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
  };

  const handleTransaction = (cartItems: CartItem[]) => {
    // Update stock
    const updatedItems = items.map((item) => {
      const cartItem = cartItems.find((ci) => ci.item.id === item.id);
      return cartItem
        ? { ...item, stock: item.stock - cartItem.quantity }
        : item;
    });

    // Create transaction record
    const transaction: Transaction = {
      id: crypto.randomUUID(),
      items: cartItems,
      total: cartItems.reduce(
        (sum, { item, quantity }) => sum + item.price * quantity,
        0
      ),
      timestamp: new Date(),
    };

    setItems(updatedItems);
    setTransactions([transaction, ...transactions]);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Beer className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold invisible sm:visible">
                  Bar POS
                </span>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('pos')}
                className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                  activeTab === 'pos'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Beer className="w-5 h-5 mr-1" />
                POS
              </button>
              <button
                onClick={() => setActiveTab('inventory')}
                className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                  activeTab === 'inventory'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Package className="w-5 h-5 mr-1" />
                Inventory
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                  activeTab === 'history'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <History className="w-5 h-5 mr-1" />
                History
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'pos' && (
          <POS items={items} onTransaction={handleTransaction} />
        )}
        {activeTab === 'inventory' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-bold mb-4">Add New Item</h2>
              <ItemForm onAddItem={handleAddItem} />
            </div>
            <div>
              <Inventory
                items={items}
                onUpdateStock={handleUpdateStock}
                onUpdateItem={handleUpdateItem}
              />
            </div>
          </div>
        )}
        {activeTab === 'history' && (
          <TransactionHistory transactions={transactions} />
        )}
      </main>
    </div>
  );
}

export default App;
