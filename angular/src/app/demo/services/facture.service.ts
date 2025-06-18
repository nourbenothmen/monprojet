import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, of } from 'rxjs';
import { Facture } from '../../models/facture.modal';
import { Produit } from '../../models/produit.modal';


export interface ClientDebt {
  clientId: number;
  name: string;
  email: string;
  telephone: string; // Correspond à telephone converti en string
  debtAmount: number;
}
@Injectable({
  providedIn: 'root'
})


export class FactureService {
  private baseURL = 'http://localhost:8083/api/factures'; // Remplacez par l'URL de votre backend

  constructor(private http: HttpClient) {}

  calculateCAByMonthAndYear(month: number, year: number): Observable<number> {
    return this.http.get<number>(`${this.baseURL}/calculateCAByMonthAndYear?month=${month}&year=${year}`);
  }

  calculateCAByYear(year: number): Observable<number> {
    return this.http.get<number>(`${this.baseURL}/calculateCAByYear?year=${year}`);
  }

  getFacturesByStatus(status: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseURL}/status/${status}`);
  }

  calculateCAByWeekAndYear(week: number, year: number): Observable<number> {
    return this.http.get<number>(`${this.baseURL}/calculateCAByWeekAndYear?week=${week}&year=${year}`);
  }

  getAllFactures(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseURL}`);
  }

  getFacturesByClient(clientId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseURL}/client/${clientId}`);
  }

  deleteFacture(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseURL}/${id}`);
  }

  createFacture(facture: any): Observable<any> {
    return this.http.post<any>(this.baseURL, facture);
  }

  updateFacture(id: number, facture: Facture): Observable<Facture> {
    return this.http.put<Facture>(`${this.baseURL}/${id}`, facture);
  }

  // Nouvelle méthode pour récupérer le CA par mois pour une année donnée
  getCAByMonthForYear(year: number): Observable<number[]> {
    return this.http.get<number[]>(`${this.baseURL}/caByMonthForYear?year=${year}`);
  }

  // Nouvelle méthode pour récupérer les clients les plus fidèles par année
  getTopLoyalClientsByYear(year: number): Observable<ClientLoyalty[]> {
    return this.http.get<ClientLoyalty[]>(`${this.baseURL}/top-loyal-clients?year=${year}`);
  }

// Nouvelle méthode pour récupérer le reste global des montants non payés
  getTotalRemainingAmount(): Observable<number> {
    return this.http.get<number>(`${this.baseURL}/total-remaining-amount`).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération du reste global:', error);
        return of(0); // Retourne 0 en cas d'erreur
      })
    );
  }

/*
getDebtsByClient(): Observable<Map<number, number>> {
    return this.http.get<Map<number, number>>(`${this.baseURL}/debts-by-client`).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des dettes par client:', error);
        return of(new Map<number, number>()); // Retourne un Map vide en cas d'erreur
      })
    );
  }*/


// Méthode pour récupérer les dettes par client
  getDebtsByClient(): Observable<ClientDebt[]> {
    return this.http.get<ClientDebt[]>(`${this.baseURL}/debts-by-client`).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des dettes par client:', error);
        return of([]);
      })
    );
  }


  getTotalClients(): Observable<number> {
    return this.http.get<number>(`${this.baseURL}/total`).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération du total des clients:', error);
        return of(0);
      })
    );
  }


}


// Interface pour typer les données de ClientLoyalty (basée sur le backend)
export interface ClientLoyalty {
  clientId: number;
  nom:string,
  email:string,
  factureCount: number;
}