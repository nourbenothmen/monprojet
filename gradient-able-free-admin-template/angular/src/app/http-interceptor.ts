// Créez un fichier http-interceptor.ts
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export class LoggingInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('Requête envoyée:', req);
    return next.handle(req).pipe(
      tap(
        event => console.log('Réponse reçue:', event),
        error => console.error('Erreur de requête:', error)
      )
    );
  }
}
