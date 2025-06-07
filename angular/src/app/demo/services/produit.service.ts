import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Produit } from '../../models/produit.modal';

@Injectable({
  providedIn: 'root'
})
export class ProduitService {
   private apiUrl = 'http://localhost:8081/produits';

  constructor(private http: HttpClient) { }

  // Récupérer tous les produits
  getProduits(): Observable<Produit[]> {
    return this.http.get<Produit[]>(this.apiUrl);
  }

  // Récupérer un produit par ID
  getProduit(id: number): Observable<Produit> {
    return this.http.get<Produit>(`${this.apiUrl}/${id}`);
  }

  // Récupérer les produits par catégorie
  getProduitsByCategory(category: string): Observable<Produit[]> {
    return this.http.get<Produit[]>(`${this.apiUrl}/category/${category}`);
  }

  // Créer un nouveau produit
  createProduit(produit: Produit): Observable<Produit> {
    return this.http.post<Produit>(this.apiUrl, produit);
  }

  // Mettre à jour un produit
  updateProduit(id: number, produit: Produit): Observable<Produit> {
    return this.http.put<Produit>(`${this.apiUrl}/${id}`, produit);
  }

  // Supprimer un produit
  deleteProduit(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
 getProduitsCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}count`);
  }

// In your ProduitService
getMostRequestedProducts(limit: number = 5): Observable<Produit[]> {
  return this.http.get<Produit[]>(`${this.apiUrl}/most-requested?limit=${limit}`);
}
// Dans produit.service.ts
getBestSellingProductsByYear(year: number, limit: number = 5): Observable<Produit[]> {
  return this.http.get<Produit[]>(`${this.apiUrl}/best-selling/${year}?limit=${limit}`);
}
// Dans produit.service.ts
getOutOfStockProducts(): Observable<Produit[]> {
  return this.http.get<Produit[]>(`${this.apiUrl}/out-of-stock`);
}

getTotalProduits(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/total`).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération du total des produits:', error);
        return of(0);
      })
    );
  }


}