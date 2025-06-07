import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../pages/authentication/AuthService';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const token = this.auth.getAccessToken(); // Remplacé getToken() par getAccessToken()

    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        const roles: string[] = decoded.roles || [];
        const now = Date.now() / 1000;

        // Vérifie que le token est encore valide (non expiré)
        if (decoded.exp && decoded.exp > now) {
          // Vérifie si l'utilisateur a le rôle ADMIN
          if (roles.includes('ADMIN') || roles.includes('ROLE_ADMIN')) {
            return true;
          }
        }
      } catch (err) {
        console.error('Erreur de décodage du token', err);
      }
    }

    // Sauvegarde l'URL demandée pour redirection après login
    localStorage.setItem('redirectUrl', state.url);

    // Redirige vers la page login
    return this.router.parseUrl('/login');
  }
}