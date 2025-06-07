import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Reglement, ModePaiement } from '../../models/reglement.modal';

@Injectable({
  providedIn: 'root'
})
export class ReglementService {
  private apiUrl = 'http://localhost:8087/api/reglements';

  constructor(private http: HttpClient) {}

  getAllReglements(): Observable<Reglement[]> {
    return this.http.get<Reglement[]>(this.apiUrl);
  }

  getReglementById(id: number): Observable<Reglement> {
    return this.http.get<Reglement>(`${this.apiUrl}/${id}`);
  }

  createReglement(reglement: Reglement): Observable<Reglement> {
    return this.http.post<Reglement>(this.apiUrl, reglement);
  }

  updateReglement(id: number, reglement: Reglement): Observable<Reglement> {
    return this.http.put<Reglement>(`${this.apiUrl}/${id}`, reglement);
  }

  getReglementsByFactureId(factureId: number): Observable<Reglement[]> {
    return this.http.get<Reglement[]>(`${this.apiUrl}/facture/${factureId}`);
  }

  deleteReglement(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}