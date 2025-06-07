import { Client } from "./client.modal";
import { FactureLigne } from "./facture-ligne.model";

export interface Facture {
  id?: number; // Optionnel car généré côté backend
  dateFacture: Date | string;
  clientID: number;
  factureLignes: FactureLigne[];
  client?: Client; // Transient - rempli côté frontend
}