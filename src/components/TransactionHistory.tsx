import React, { useState } from 'react';
import { Clock, FileSpreadsheet } from 'lucide-react';
import { Transaction } from '../types';
import * as XLSX from 'xlsx';

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
  const [selectedTransactions, setSelectedTransactions] = useState<Set<string>>(new Set());

  const toggleTransaction = (id: string) => {
    const newSelected = new Set(selectedTransactions);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedTransactions(newSelected);
  };

  const handleExport = () => {
    const transactionsToExport = transactions.filter(t => 
      selectedTransactions.size === 0 || selectedTransactions.has(t.id)
    );

    // Prepare data for Excel
    const excelData = transactionsToExport.flatMap(transaction => 
      transaction.items.map(({ item, quantity }) => ({
        'Transaction ID': transaction.id,
        'Date': new Date(transaction.timestamp).toLocaleString(),
        'Item Name': item.name,
        'Category': item.category,
        'Quantity': quantity,
        'Unit Price': item.price,
        'Total': item.price * quantity,
      }))
    );

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');

    // Generate file name with current date
    const date = new Date().toISOString().split('T')[0];
    const fileName = `transactions-${date}.xlsx`;

    // Save file
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Clock className="w-6 h-6" />
          <h2 className="text-xl font-bold">Transaction History</h2>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <FileSpreadsheet className="w-5 h-5 mr-2" />
          Export {selectedTransactions.size > 0 ? 'Selected' : 'All'} to Excel
        </button>
      </div>
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div 
            key={transaction.id} 
            className={`bg-white p-4 rounded-lg shadow cursor-pointer transition-colors ${
              selectedTransactions.has(transaction.id) ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => toggleTransaction(transaction.id)}
          >
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">
                {new Date(transaction.timestamp).toLocaleString()}
              </span>
              <span className="font-bold">${transaction.total.toFixed(2)}</span>
            </div>
            <ul className="space-y-2">
              {transaction.items.map(({ item, quantity }) => (
                <li key={item.id} className="flex justify-between">
                  <span>{item.name}</span>
                  <span>x{quantity}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}