// Angular Import
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// project import
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: '/analytics',
        pathMatch: 'full'
      },
      {
        path: 'analytics',
        loadComponent: () => import('./demo/dashboard/dash-analytics.component')
                             .then(m => m.DashAnalyticsComponent)
      },
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
        loadComponent: () => import('./demo/tables/tbl-bootstrap/tbl-bootstrap.component')
                           .then(m => m.TblBootstrapComponent)
      },
      {
        path: 'sample-page',
        loadComponent: () => import('./demo/other/sample-page/sample-page.component')
                           .then(m => m.SamplePageComponent)
      },

      {
        path: 'gestion/devises',
        loadComponent: () => import('./demo/tables/tbl-bootstrap/tbl-bootstrap.component')
                           .then(m => m.TblBootstrapComponent)
      },
      {
        path: 'gestion/produits',
        loadComponent: () => import('./demo/tables/tbl-bootstrap/produit-view/produit-table.component')
                           .then(m => m.ProduitTableComponent)
      },
       {
        path: 'gestion/factures',
        loadComponent: () => import('./demo/pages/facture/facture.component')
                           .then(m => m.FactureComponent)
      },

  

    ]
  },

  

  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}