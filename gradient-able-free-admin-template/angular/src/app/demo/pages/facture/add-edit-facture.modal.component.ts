import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Facture } from '../../../models/facture.modal';
import { Client } from '../../../models/client.modal';
import { Produit } from '../../../models/produit.modal';
import { FactureLigne } from '../../../models/facture-ligne.model';

@Component({
  selector: 'app-add-edit-facture-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-edit-facture.modal.component.html',
  //styleUrls: ['./add-edit-facture-modal.component.scss']
})
export class AddEditFactureModalComponent {
  @Input() isEdit = false;
  @Input() facture: Facture = {
    dateFacture: new Date(),
    clientID: 0, // Use 0 instead of null
    factureLignes: []
  };
  @Input() clients: Client[] = [];
  @Input() produits: Produit[] = [];

  newLigne: FactureLigne = {
    produitID: 0, // Use 0 instead of null
    quantity: 1,
    price: 0
  };

  constructor(public activeModal: NgbActiveModal) {}

  addLigne(): void {
    if (this.newLigne.produitID && this.newLigne.quantity > 0) {
      const produit = this.produits.find(p => p.id === this.newLigne.produitID);
      if (produit) {
        const ligne: FactureLigne = {
          ...this.newLigne,
          price: produit.price // Utilise le prix actuel du produit
        };
        this.facture.factureLignes = [...this.facture.factureLignes, ligne];
        this.resetNewLigne();
      }
    }
  }

  removeLigne(index: number): void {
    this.facture.factureLignes = this.facture.factureLignes.filter((_, i) => i !== index);
  }

  updateLignePrice(index: number): void {
    const ligne = this.facture.factureLignes[index];
    const produit = this.produits.find(p => p.id === ligne.produitID);
    if (produit) {
      this.facture.factureLignes[index].price = produit.price;
    }
  }

  getProduitName(produitID: number): string {
    const produit = this.produits.find(p => p.id === produitID);
    return produit ? produit.name : 'Produit inconnu';
  }

  calculateTotal(): number {
    return this.facture.factureLignes.reduce(
      (total, ligne) => total + (ligne.price * ligne.quantity), 0
    );
  }

  private resetNewLigne(): void {
    this.newLigne = {
      produitID: 0, // Use 0 instead of null
      quantity: 1,
      price: 0
    };
  }

  save(): void {
    if (this.isFormValid()) {
      this.activeModal.close('saved');
    }
  }

  public isFormValid(): boolean {
    return !!this.facture.clientID && 
           this.facture.factureLignes.length > 0 &&
           this.facture.dateFacture !== null;
  }
}