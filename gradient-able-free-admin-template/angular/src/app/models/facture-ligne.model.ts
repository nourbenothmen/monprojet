import { Produit } from "./produit.modal";

export interface FactureLigne {
  id?: number; // Optionnel car généré côté backend
  produitID: number;
  quantity: number;
  price: number;
  produit?: Produit; // Transient - rempli côté frontend
  factureID?: number; // Optionnel pour les relations
}