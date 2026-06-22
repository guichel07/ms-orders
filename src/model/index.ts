export interface OrderLabel {
  key: string;
  label: string;
}

export type OrderStatus = 'completed' | 'pending' | 'failed';

export interface Order {
  id: string;
  time: string;
  payment: string;
  items: string[];
  total: number;
  status: OrderStatus;
  group: string; // doit correspondre à la clé (key) d'un OrderLabel
}

export interface RenderOrdersInterface {
  statistiques: {
    daily: number;
    weekly: number;
    basketMean: number;
  };
  ordersLabels: OrderLabel[];
  orders: Order[];
}
