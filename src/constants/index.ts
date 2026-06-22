import type {
  Order,
  OrderLabel,
  OrderStatus,
  RenderOrdersInterface,
} from '../model';

export const STATUS_LABELS: Record<OrderStatus, string> = {
  completed: 'Validée',
  pending: 'En attente',
  failed: 'Échouée',
};

export function fmt(amount: number): string {
  return amount.toLocaleString('fr-FR').replace(/,/g, ' ') + ' F';
}

export const MOCK_ORDER_LABELS: OrderLabel[] = [
  { key: 'all', label: 'Tous' },
  { key: 'today', label: "Aujourd'hui" },
  { key: 'week', label: 'Cette semaine' },
  { key: 'month', label: 'Ce mois' },
];

export const MOCK_ORDERS: Order[] = [
  {
    id: '1042',
    time: "Aujourd'hui · 14:32",
    payment: 'Espèces',
    items: ['Crème hydratante', 'Savon noir'],
    total: 3700,
    status: 'completed',
    group: 'today',
  },
  {
    id: '1041',
    time: "Aujourd'hui · 11:08",
    payment: 'Mobile money',
    items: ['Vitamines C 1000'],
    total: 3000,
    status: 'completed',
    group: 'today',
  },
  {
    id: '1040',
    time: "Aujourd'hui · 09:54",
    payment: 'Carte',
    items: ['Parfum bio', 'Baume à lèvres'],
    total: 5200,
    status: 'pending',
    group: 'today',
  },
  {
    id: '1039',
    time: 'Hier · 18:21',
    payment: 'Espèces',
    items: ['Gel douche', 'Shampoing naturel'],
    total: 2400,
    status: 'completed',
    group: 'week',
  },
  {
    id: '1038',
    time: 'Hier · 16:47',
    payment: 'Espèces',
    items: ['Huile essentielle'],
    total: 1800,
    status: 'failed',
    group: 'week',
  },
  {
    id: '1037',
    time: 'Mardi · 10:15',
    payment: 'Mobile money',
    items: ['Lait corporel', 'Crème hydratante'],
    total: 4500,
    status: 'completed',
    group: 'week',
  },
  {
    id: '1030',
    time: '3 juin · 17:02',
    payment: 'Carte',
    items: ['Multivitamines', 'Vitamines C 1000'],
    total: 6200,
    status: 'completed',
    group: 'month',
  },
  {
    id: '1024',
    time: '28 mai · 12:40',
    payment: 'Espèces',
    items: ['Savon noir'],
    total: 1200,
    status: 'failed',
    group: 'month',
  },
];

export const MOCK_RENDER_ORDERS: RenderOrdersInterface = {
  statistiques: {
    daily: 11900,
    weekly: 23800,
    basketMean: 4100,
  },
  ordersLabels: MOCK_ORDER_LABELS,
  orders: MOCK_ORDERS,
};
