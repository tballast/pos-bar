export interface Item {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  description: string;
  stock: number;
}

export interface Transaction {
  id: string;
  items: {
    item: Item;
    quantity: number;
  }[];
  total: number;
  timestamp: Date;
}

export interface CartItem {
  item: Item;
  quantity: number;
}