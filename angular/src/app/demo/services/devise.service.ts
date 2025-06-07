import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Devise } from '../../models/devise.modal';

@Injectable({
  providedIn: 'root'
})
export class DeviseService {
  private apiUrl = 'http://localhost:8085/api/devises';

  constructor(private http: HttpClient) { }

  getAllDevises(): Observable<Devise[]> {
    return this.http.get<Devise[]>(this.apiUrl);
  }

  // Pour la création d'une seule devise
createDevise(devise: Omit<Devise, 'id'>): Observable<Devise> {
  return this.http.post<Devise>(this.apiUrl, devise);
}

updateDevise(id: number, devise: Devise): Observable<Devise> {
  return this.http.put<Devise>(`${this.apiUrl}/${id}`, devise);
}

  // Pour la suppression par code
  deleteDevise(id: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
    catchError(error => {
      console.error('Détails erreur suppression:', error);
      throw error;
    })
  );
}
}
