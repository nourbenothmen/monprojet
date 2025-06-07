import { Client } from './client.modal';
import { FactureLigne } from './facture-ligne.model';

export enum FactureStatus {
  REGLE = 'REGLE',
  NON_REGLE = 'NON_REGLE'
}

export interface Facture {
  id: number;
  dateFacture: Date | string;
  clientID: number;
  client?: Client;
  factureLignes: FactureLigne[];
  status: FactureStatus | null;
  total: number;
  resteAPayer?: number;
  deviseId: number;
}