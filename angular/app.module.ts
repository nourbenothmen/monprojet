import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './src/app/app.component';
import { FactureComponent } from './src/app/demo/pages/facture/facture.component';
import { ReglementTableComponent } from '../angular/src/app/demo/tables/tbl-bootstrap/reglement-view/reglement-table.component';
import {  } from '../angular/src/app/demo/tables/tbl-bootstrap/reglement-view/add-edit-reglement.modal.component';
import { CardComponent } from '../angular/src/app/theme/shared/components/card/card.component';
// Layouts
import { AdminComponent } from '../angular/src/app/theme/layout/admin/admin.component';
import { GuestComponent } from '../angular/src/app/theme/layout/guest/guest.component';
// AuthModule que tu viens de créer
import { AuthModule } from '../angular/src/app/demo/pages/authentication/auth.module';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    AppComponent,
    FactureComponent,
    ReglementTableComponent,
    CardComponent,
    AdminComponent,
    GuestComponent,

  ],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    NgbModule,
    HttpClientModule,
    AuthModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}