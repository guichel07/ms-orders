import 'tek-ms-ds/dist/style.css';
import { Orders } from './orders';
import { MOCK_RENDER_ORDERS } from './constants';

const app = document.querySelector<HTMLDivElement>('#app')!;

const orders = new Orders(app);

orders.render(MOCK_RENDER_ORDERS);
