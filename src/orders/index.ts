import { fmt, STATUS_LABELS } from '../constants';
import type { RenderOrdersInterface } from '../model';

export class Orders {
  private el: HTMLElement;
  private data: RenderOrdersInterface | null = null;
  private activeFilter: string = 'all';

  constructor(mountPoint: HTMLElement) {
    this.el = mountPoint;
  }

  render(renderOrdersInterface: RenderOrdersInterface): void {
    this.data = renderOrdersInterface;
    this.activeFilter = 'all';

    this.el.innerHTML = `
      <div class="section-view" id="section-orders">
        <div class="catalog-head">
          <h2>Commandes</h2>
          <div class="sub">Historique des ventes enregistrées</div>
        </div>

        <div class="stat-row">
          <div class="stat-card">
            <span class="stat-lab">Aujourd'hui</span>
            <span class="stat-amt" id="stat-today">${fmt(renderOrdersInterface.statistiques.daily)}</span>
          </div>
          <div class="stat-card">
            <span class="stat-lab">Cette semaine</span>
            <span class="stat-amt">${fmt(renderOrdersInterface.statistiques.weekly)}</span>
          </div>
          <div class="stat-card">
            <span class="stat-lab">Panier moyen</span>
            <span class="stat-amt">${fmt(renderOrdersInterface.statistiques.basketMean)}</span>
          </div>
        </div>

        <div class="category-row" id="order-filter-row" style="margin:14px 0 12px;"></div>

        <div id="orders-list"></div>
      </div>
    `;

    this.renderFilterChips();
    this.renderOrdersList();
    this.bindEvents();
  }

  private renderFilterChips(): void {
    if (!this.data) return;
    const row = this.el.querySelector<HTMLElement>('#order-filter-row');
    if (!row) return;

    row.innerHTML = this.data.ordersLabels
      .map(
        (orderLabel) => `
          <div class="chip ${orderLabel.key === this.activeFilter ? 'active' : ''}" data-filter="${orderLabel.key}">
            ${orderLabel.label}
          </div>
        `
      )
      .join('');
  }

  private renderOrdersList(): void {
    if (!this.data) return;

    const statToday = this.el.querySelector<HTMLElement>('#stat-today');
    if (statToday) statToday.textContent = fmt(this.data.statistiques.daily);

    const filtered =
      this.activeFilter === 'all'
        ? this.data.orders
        : this.data.orders.filter((o) => o.group === this.activeFilter);

    const list = this.el.querySelector<HTMLElement>('#orders-list');
    if (!list) return;

    if (filtered.length === 0) {
      list.innerHTML = `
        <div class="no-results">
          <span class="mark">Aucune commande</span>
          Essayez une autre période
        </div>
      `;
      return;
    }

    list.innerHTML = filtered
      .map(
        (o) => `
          <div class="order-row">
            <div class="meta-col">
              <div class="ticket">Reçu n° ${o.id}</div>
              <div class="when">${o.time} · ${o.payment}</div>
              <div class="items-preview">${o.items.join(', ')}</div>
            </div>
            <div class="amt-col">
              <div class="amt">${fmt(o.total)}</div>
              <span class="status-pill ${o.status}">${STATUS_LABELS[o.status]}</span>
            </div>
          </div>
        `
      )
      .join('');
  }

  // Délégation d'événements : un seul listener sur la rangée de filtres,
  // plutôt que des "onclick" globaux incompatibles avec une classe encapsulée.
  private bindEvents(): void {
    const row = this.el.querySelector<HTMLElement>('#order-filter-row');
    if (!row) return;

    row.addEventListener('click', (e) => {
      const chip = (e.target as HTMLElement).closest<HTMLElement>('.chip');
      if (!chip) return;
      const filter = chip.dataset.filter;
      if (filter === undefined) return;
      this.selectOrderFilter(filter);
    });
  }

  private selectOrderFilter(filter: string): void {
    this.activeFilter = filter;
    this.renderFilterChips();
    this.renderOrdersList();
  }
}
