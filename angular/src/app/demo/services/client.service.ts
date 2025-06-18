import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Client } from '../../models/client.modal';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  createClient(client: Client) {
      throw new Error('Method not implemented.');
  }
  private apiUrl = 'http://localhost:8084/api/clients';

  constructor(private http: HttpClient) { }

  getAllClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiUrl);
  }
  getClientById(id: number): Observable<Client> {
  return this.http.get<Client>(`${this.apiUrl}/${id}`);
}

  getClient(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/${id}`);
  }

  addClient(client: Client): Observable<Client> {
    return this.http.post<Client>(this.apiUrl, client);
  }

  /*updateClient(p0: number, client: Client): Observable<Client> {
    return this.http.put<Client>(`${this.apiUrl}/${client.id}`, client);
  }*/
updateClient(id: number, client: Client) {
  console.log('Données envoyées au backend :', client); // Avant l'appel HTTP
  return this.http.put<Client>(`http://localhost:8084/api/clients/${id}`, client).pipe(
    tap((response: Client) => console.log('Réponse du backend :', response))
  );
}
  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
getClientsCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }


  getTotalClients(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/total`).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération du total des clients:', error);
        return of(0);
      })
    );
  }


}
