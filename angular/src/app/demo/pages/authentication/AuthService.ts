import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

const API_URL = 'http://localhost:8089/api/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  // ✅ Requête login
  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${API_URL}/login`, credentials);
  }

  // ✅ Requête register - Mise à jour pour accepter roles
  register(user: { username: string; password: string; roles: { roleName: string }[] }): Observable<any> {
    return this.http.post(`${API_URL}/register`, user);
  }

  // ✅ Sauvegarder les tokens
  saveToken(accessToken: string, refreshToken?: string) {
    localStorage.setItem('access-token', accessToken);
    if (refreshToken) {
      localStorage.setItem('refresh-token', refreshToken);
    }
  }

  // ✅ Récupérer le token d'accès
  getAccessToken(): string | null {
    return localStorage.getItem('access-token');
  }

  // ✅ Récupérer le token de rafraîchissement
  getRefreshToken(): string | null {
    return localStorage.getItem('refresh-token');
  }

  // ✅ Supprimer les tokens (logout)
  logout() {
    const accessToken = this.getAccessToken();
    if (accessToken) {
      console.log('Tentative de déconnexion avec token:', accessToken.substring(0, 20) + '...');
      const isValid = this.isTokenValid(accessToken);
      const hasRole = this.hasAdminRole(accessToken);
      console.log('Token valide:', isValid, 'Rôle ADMIN:', hasRole);

      this.logoutFromApi(accessToken).subscribe({
        next: (response) => {
          console.log('Réponse API logout:', response);
          this.clearTokens();
        },
        error: (err) => {
          console.error('Erreur lors de la déconnexion API:', err);
          this.clearTokens(); // Déconnexion locale en cas d'erreur
        }
      });
    } else {
      console.warn('Aucun token d\'accès trouvé, déconnexion locale uniquement.');
      this.clearTokens();
    }
  }

  // ✅ Méthode pour effacer tous les tokens
  private clearTokens() {
    localStorage.removeItem('access-token');
    localStorage.removeItem('refresh-token');
  }

  // ✅ Nouvelle méthode pour consommer l'API de déconnexion
  logoutFromApi(accessToken: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${accessToken}`);
    return this.http.post(`${API_URL}/logout`, {}, { headers }).pipe(
      catchError(err => {
        console.error('Erreur API logout:', err);
        throw err; // Propager l'erreur pour gestion dans logout()
      })
    );
  }

  // ✅ Rafraîchir le token (à implémenter si nécessaire)
  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return of({ error: 'Aucun refresh token disponible' });
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${refreshToken}`);
    return this.http.get(`${API_URL}/refreshToken`, { headers }).pipe(
      tap((response: any) => {
        this.saveToken(response['access-token'], response['refresh-token']);
      }),
      catchError(err => {
        console.error('Erreur lors du rafraîchissement du token:', err);
        this.clearTokens();
        throw err;
      })
    );
  }

  // ✅ Vérifier si le token est valide (non expiré)
  isTokenValid(token: string): boolean {
    try {
      const decoded: any = jwtDecode(token);
      const now = Date.now() / 1000; // timestamp en secondes
      return decoded.exp && decoded.exp > now;
    } catch (e) {
      console.error('Erreur de décodage du token:', e);
      return false;
    }
  }

  // ✅ Vérifier si l'utilisateur est ADMIN
  hasAdminRole(token: string): boolean {
    try {
      const decoded: any = jwtDecode(token);
      const roles: string[] = decoded.roles || [];
      return roles.includes('ADMIN') || roles.includes('ROLE_ADMIN');
    } catch (e) {
      console.error('Erreur de vérification des rôles:', e);
      return false;
    }
  }

  // ✅ Récupérer les rôles depuis le token
  getRoles(): string[] {
    try {
      const token = this.getAccessToken();
      if (!token) return [];
      const decoded: any = jwtDecode(token);
      return decoded.roles || [];
    } catch (e) {
      return [];
    }
  }

  // ✅ Vérifier si l'utilisateur est connecté
  isLoggedIn(): boolean {
    const token = this.getAccessToken();
    return !!token && this.isTokenValid(token);
  }

  // ✅ Récupérer le nom de l'utilisateur à partir du token
  getUserName(): string | null {
    const token = this.getAccessToken();
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        return decoded.sub || 'Utilisateur'; // 'sub' contient généralement le username
      } catch (e) {
        console.error('Erreur de décodage du token pour le nom:', e);
        return null;
      }
    }
    return null;
  }
}