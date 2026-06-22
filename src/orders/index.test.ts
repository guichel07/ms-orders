// @vitest-environment jsdom
import { describe, test, expect, beforeEach } from 'vitest';
import { Orders } from '.';
import type { RenderOrdersInterface } from '../model';

// Définition de fausses données de test (Mocks) pour simuler l'orchestrateur
const mockOrdersData: RenderOrdersInterface = {
  statistiques: {
    daily: 150.5,
    weekly: 1200.0,
    basketMean: 25.1,
  },
  ordersLabels: [
    { key: 'all', label: 'Toutes' },
    { key: 'today', label: "Aujourd'hui" },
    { key: 'pending', label: 'En attente' },
  ],
  orders: [
    {
      id: '1001',
      time: '12:30',
      payment: 'CB',
      items: ['Pizza', 'Soda'],
      total: 18.5,
      status: 'completed',
      group: 'today',
    },
    {
      id: '1002',
      time: '14:15',
      payment: 'Espèces',
      items: ['Burger'],
      total: 12.0,
      status: 'pending',
      group: 'pending',
    },
  ],
};

describe('Orders Component', () => {
  let ordersComponent: Orders;

  beforeEach(() => {
    // Réinitialisation complète du DOM simulé avant chaque cas de test
    document.body.innerHTML = '';

    // Instanciation et rendu initial
    ordersComponent = new Orders(document.body);
    ordersComponent.render(mockOrdersData);
  });

  // TEST 1 : Rendu de la structure et des statistiques financières
  test('Should render the global layout and correctly format statistics', () => {
    expect(document.querySelector('#section-orders')).not.toBeNull();

    // Vérification que les blocs de statistiques contiennent les valeurs formatées
    const statToday = document.querySelector('#stat-today');
    expect(statToday).not.toBeNull();
    expect(statToday?.textContent).not.toBe('');
  });

  // TEST 2 : Rendu des filtres (Chips) et état actif initial
  test('Should render filter chips and mark "all" as active by default', () => {
    const chips = document.querySelectorAll('.chip');
    expect(chips.length).toBe(mockOrdersData.ordersLabels.length);

    // Par défaut, le filtre 'all' doit porter la classe active
    const activeChip = document.querySelector('.chip.active');
    expect(activeChip).not.toBeNull();
    expect(activeChip?.getAttribute('data-filter')).toBe('all');
  });

  // TEST 3 : Rendu complet de la liste des commandes initiale
  test('Should render the complete list of orders when "all" filter is active', () => {
    const orderRows = document.querySelectorAll('.order-row');
    expect(orderRows.length).toBe(mockOrdersData.orders.length);

    // Vérification qu'un numéro de reçu spécifique est bien visible dans le DOM
    expect(document.body.innerHTML).toContain('Reçu n° 1001');
  });

  // TEST 4 : Validation de la délégation d'événement au clic sur un filtre
  test('Should filter rows dynamically and switch active class when clicking a chip', () => {
    // Ciblage du filtre 'pending' via son attribut personnalisé data-filter
    const pendingChip = document.querySelector(
      '[data-filter="pending"]'
    ) as HTMLElement;
    expect(pendingChip).not.toBeNull();

    // Simulation du clic de l'utilisateur
    pendingChip.click();

    // 1. Vérification du transfert de la classe visuelle active
    const activeChip = document.querySelector('.chip.active');
    expect(activeChip?.getAttribute('data-filter')).toBe('pending');

    // 2. Vérification du filtrage de la liste : seule la commande 'pending' doit rester
    const orderRows = document.querySelectorAll('.order-row');
    expect(orderRows.length).toBe(1);
    expect(document.body.innerHTML).toContain('Reçu n° 1002');
    expect(document.body.innerHTML).not.toContain('Reçu n° 1001');
  });

  // TEST 5 : Scénario "Aucun résultat"
  test('Should display the "no results" state when a filter returns an empty list', () => {
    // On simule un clic sur le filtre 'today' si on imagine qu'aucune commande ne matche
    // Pour ce test précis, on force un filtre qui va vider la liste
    const todayChip = document.querySelector(
      '[data-filter="today"]'
    ) as HTMLElement;

    // On modifie temporairement les données pour qu'aucune commande ne corresponde à 'today'
    mockOrdersData.orders.forEach((o) => (o.group = 'none'));
    ordersComponent.render(mockOrdersData);

    todayChip.click();

    const noResultsBlock = document.querySelector('.no-results');
    expect(noResultsBlock).not.toBeNull();
    expect(noResultsBlock?.textContent).toContain('Aucune commande');

    // Remise à zéro des données de mock pour éviter de polluer d'autres tests
    mockOrdersData.orders[0].group = 'today';
    mockOrdersData.orders[1].group = 'pending';
  });
});
