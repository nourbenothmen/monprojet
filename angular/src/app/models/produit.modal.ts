// src/app/models/produit.modal.ts
export interface Produit {
  id?: number; // Optionnel car généré côté backend
  name: string;
  price: number;
  quantity: number;
  category: string;
  quantitySold: number; // Nouveau champ
  totalSales: number;   // Nouveau champ
  lastSoldDate: string; // Nouveau champ, format ISO (ex. "2025-06-07")
  version?: number;     // Nouveau champ, optionnel pour le verrouillage optimiste
}