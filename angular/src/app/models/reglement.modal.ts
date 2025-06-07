import { Devise } from "./devise.modal"; // Assuming you have a Devise model
import { Facture } from "./facture.modal";



// reglement.modal.ts
export interface Reglement {
  id?: number;
  factureId: number; // Garanti non-undefined
  montant: number;
  modePaiement: ModePaiement;
  deviseId: number;
  dateReglement: string;
}
export enum ModePaiement {
  CASH = 'CASH',
  CHECK = 'CHECK',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CREDIT_CARD = 'CREDIT_CARD'
}