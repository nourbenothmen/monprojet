import { Component, OnInit } from '@angular/core';
import { AuthService } from '../AuthService';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';
  errorMessage = '';
  infoMessage = '';
  errorType: 'admin' | 'credentials' | 'other' | null = null;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    const redirectUrl = localStorage.getItem('redirectUrl');
    if (redirectUrl) {
      this.infoMessage = 'Veuillez vous connecter pour accéder à cette page.';
      // Supprimer pour éviter de garder cette URL inutilement
      localStorage.removeItem('redirectUrl');
    }
  }

  onLogin() {
    this.errorMessage = '';
    this.errorType = null;
    this.infoMessage = '';

    this.auth.login({ username: this.username, password: this.password }).subscribe({
      next: (res) => {
        const token = res['access-token'];
        if (token) {
          interface DecodedToken {
            roles: string[];
            sub: string;
            exp: number;
            [key: string]: any;
          }

          try {
            const decoded = jwtDecode<DecodedToken>(token);
            const roles: string[] = decoded.roles || [];

            if (roles.includes('ADMIN') || roles.includes('ROLE_ADMIN')) {
              this.auth.saveToken(token);

              const redirectUrl = localStorage.getItem('redirectUrl') || '/gestion/clients';
              if (redirectUrl) {
                localStorage.removeItem('redirectUrl');
                this.router.navigateByUrl(redirectUrl);
                return;  // éviter d’exécuter d’autres lignes après la navigation
              }
              this.router.navigate(['/gestion/clients']);
              return;
            } else {
              this.errorMessage = 'Accès interdit : vous devez être administrateur.';
              this.errorType = 'admin';
            }
          } catch (e) {
            console.error('Erreur de décodage du token', e);
            this.errorMessage = 'Erreur lors du traitement du jeton.';
            this.errorType = 'other';
          }
        } else {
          this.errorMessage = 'Réponse invalide du serveur.';
          this.errorType = 'other';
        }
      },
      error: (err) => {
        if (err.status === 403) {
          this.errorMessage = 'Accès interdit : vous devez être administrateur.';
          this.errorType = 'admin';
        } else if (err.status === 401) {
          this.errorMessage = 'Nom d’utilisateur ou mot de passe incorrect.';
          this.errorType = 'credentials';
        } else {
          this.errorMessage = 'Erreur de connexion.';
          this.errorType = 'other';
        }
      }
    });
  }
}
