// Angular Import
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// project import
import { AdminComponent } from './theme/layout/admin/admin.component';
// Layouts
import { GuestComponent } from './theme/layout/guest/guest.component';

// Auth Pages
import { LoginComponent } from './demo/pages/authentication/login/login.component';
import { RegisterComponent } from './demo/pages/authentication/register/register.component';

// ✅ Import de la guard admin
import { AdminAuthGuard } from './demo/guards/admin-auth.guard';


const routes: Routes = [
    {
    path: '',
    component: GuestComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent }
    ]
  },
  {
    path: '',
    component: AdminComponent,
    canActivate: [AdminAuthGuard], // ✅ Protection globale du layout Admin
    children: [
      {
        path: '',
        redirectTo: '/analytics',
        pathMatch: 'full'
      },
      {
        path: 'analytics',
        canActivate: [AdminAuthGuard],
        loadComponent: () => import('./demo/dashboard/dash-analytics.component')
                             .then(m => m.DashAnalyticsComponent)
      },
      /*
      {
        path: 'component',
        loadChildren: () => import('./demo/ui-element/ui-basic.module')
                           .then((m) => m.UiBasicModule)
      },
      {
        path: 'chart',
        loadComponent: () => import('./demo/chart-maps/core-apex.component')
                           .then(m => m.CoreApexComponent)
      },
      {
        path: 'forms',

        loadComponent: () => import('./demo/forms/form-elements/form-elements.component')
                           .then(m => m.FormElementsComponent)
      },
      {
        path: 'tables',
        canActivate: [AdminAuthGuard],
        loadComponent: () => import('./demo/tables/tbl-bootstrap/tbl-bootstrap.component')
                           .then(m => m.TblBootstrapComponent)
      },
      {
        path: 'sample-page',
        canActivate: [AdminAuthGuard],
        loadComponent: () => import('./demo/other/sample-page/sample-page.component')
                           .then(m => m.SamplePageComponent)
      },*/

      {
        path: 'gestion/devises',
        canActivate: [AdminAuthGuard],
        loadComponent: () => import('./demo/tables/tbl-bootstrap/tbl-bootstrap.component')
                           .then(m => m.TblBootstrapComponent)
      },
      {
        path: 'gestion/produits',
        canActivate: [AdminAuthGuard],
        loadComponent: () => import('./demo/tables/tbl-bootstrap/produit-view/produit-table.component')
                           .then(m => m.ProduitTableComponent)
      },
       {
        path: 'gestion/factures',
        canActivate: [AdminAuthGuard],
        loadComponent: () => import('./demo/pages/facture/facture.component')
                           .then(m => m.FactureComponent)
      },
      {
        path: 'gestion/clients',
        canActivate: [AdminAuthGuard],
        loadComponent: () => import('./demo/tables/tbl-bootstrap/client-view/client-table.component')
        .then(m => m.ClientsComponent)
      },
       {
        path: 'gestion/reglements',
        canActivate: [AdminAuthGuard],
        loadComponent: () => import('./demo/tables/tbl-bootstrap/reglement-view/reglement-table.component')
        .then(m => m.ReglementTableComponent)
      },


  

    ]
  },

  { path: '**', redirectTo: '/login' } // Redirection des routes inconnues

  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}