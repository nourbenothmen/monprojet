export interface Produit {
  id?: number; // Optionnel car généré côté backend
  name: string;
  price: number;
  quantity: number;
  category: string;
}