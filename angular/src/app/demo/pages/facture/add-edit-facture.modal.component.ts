import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Facture, FactureStatus } from '../../../models/facture.modal';
import { FactureLigne } from '../../../models/facture-ligne.model';
import { Produit } from '../../../models/produit.modal';
import { Client } from '../../../models/client.modal';
import { Devise } from '../../../models/devise.modal';

@Component({
  selector: 'app-add-edit-facture-modal',
  templateUrl: './add-edit-facture.modal.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AddEditFactureModalComponent {
  @Input() isEdit = false;
  @Input() facture: Facture = {
    id: 0,
    dateFacture: new Date(),
    clientID: 0,
    factureLignes: [],
    status: FactureStatus.NON_REGLE,
    total: 0,
    resteAPayer: 0, // Ajouté pour correspondre à l'entité backend
    deviseId: 0
  };
  @Input() clients: Client[] = [];
  @Input() produits: Produit[] = [];
  @Input() devises: Devise[] = [];

  newLigne: FactureLigne = {
    produitID: 0,
    quantity: 1,
    price: 0
  };

  get isDataLoaded(): boolean {
    return this.clients.length > 0 && this.produits.length > 0 && this.devises.length > 0;
  }

  constructor(public activeModal: NgbActiveModal) {
    console.log('Initialisation du composant');
    console.log('Clients disponibles:', this.clients);
    console.log('Produits des lignes:', this.produits);
    console.log('Devises disponibles:', this.devises);
    console.log('Facture initiale reçue:', { ...this.facture });
  }

  get formattedDate(): string {
    if (!this.facture.dateFacture) return '';
    const d = new Date(this.facture.dateFacture);
    return d.toISOString().split('T')[0];
  }

  getProduitPrice(produitId: number): number {
    const produit = this.produits.find(p => p.id === Number(produitId));
    return produit ? produit.price : 0;
  }

  getLigneTotal(ligne: FactureLigne): number {
    return this.getProduitPrice(ligne.produitID) * ligne.quantity;
  }

  getDeviseSymbol(): string {
    const devise = this.devises.find(d => d.id === this.facture.deviseId);
    return devise ? devise.symbole : 'TND';
  }

  addLigne(): void {
    console.log('--- Début addLigne ---');
    console.log('newLigne avant traitement:', this.newLigne);
    console.log('Liste des produits disponibles:', this.produits);

    if (this.newLigne.produitID > 0) {
      console.log('ProduitID valide:', this.newLigne.produitID);
      const produit = this.produits.find(p => p.id === Number(this.newLigne.produitID));
      console.log('Produit trouvé:', produit);
      if (produit) {
        console.log('Prix du produit:', produit.price);
        const ligne: FactureLigne = {
          ...this.newLigne,
          price: produit.price
        };
        console.log('Nouvelle ligne créée:', ligne);
        this.facture.factureLignes.push(ligne); // Utiliser push au lieu de spread
        console.log('Liste des lignes après ajout:', this.facture.factureLignes);
        this.resetNewLigne();
        console.log('newLigne après reset:', this.newLigne);
      } else {
        console.error('Aucun produit trouvé avec ID:', this.newLigne.produitID);
      }
    } else {
      console.warn('ID de produit invalide ou non sélectionné');
    }
    console.log('--- Fin addLigne ---');
  }

  removeLigne(index: number): void {
    this.facture.factureLignes.splice(index, 1); // Utiliser splice directement
    console.log('Liste des lignes après suppression:', this.facture.factureLignes);
  }

  getProduitName(produitId: number): string {
    const produit = this.produits.find(p => p.id === produitId);
    if (!produit) {
      console.warn('Produit non trouvé pour ID:', produitId);
    }
    return produit ? produit.name : 'Produit inconnu';
  }

  calculateTotal(): number {
    return this.facture.factureLignes.reduce(
      (total, ligne) => total + (this.getProduitPrice(ligne.produitID) * ligne.quantity),
      0
    );
  }

  isFormValid(): boolean {
    return this.facture.clientID > 0 &&
           this.facture.dateFacture != null &&
           this.facture.factureLignes.length > 0 &&
           this.facture.deviseId > 0;
  }

  save(): void {
    if (this.isFormValid()) {
      this.facture.factureLignes.forEach(ligne => {
        const produit = this.produits.find(p => p.id === ligne.produitID);
        if (produit) {
          ligne.price = produit.price;
        }
      });
      this.facture.total = this.calculateTotal();
      if (!this.isEdit) {
        console.log('Setting resteAPayer for new facture:', this.facture.total);
        this.facture.resteAPayer = this.facture.total;
      } else if (this.facture.resteAPayer === undefined || this.facture.resteAPayer === null) {
        console.log('Setting resteAPayer for edit case:', this.facture.total);
        this.facture.resteAPayer = this.facture.total;
      }
      console.log('Envoi au serveur:', this.facture);
      this.activeModal.close(this.facture);
    } else {
      console.warn('Formulaire invalide');
    }
  }

  updateLigne(index: number): void {
    const ligne = this.facture.factureLignes[index];
    if (ligne.quantity < 1) {
      ligne.quantity = 1;
    }
    const produit = this.produits.find(p => p.id === ligne.produitID);
    if (produit) {
      ligne.price = produit.price;
    }
    // Pas besoin de recréer la collection ici
    console.log('Ligne mise à jour:', {
      ...ligne,
      total: this.getProduitPrice(ligne.produitID) * ligne.quantity
    });
  }

  private resetNewLigne(): void {
    console.log('Reset de newLigne');
    this.newLigne = {
      produitID: 0,
      quantity: 1,
      price: 0
    };
  }

  onDateChange(dateString: string): void {
    if (dateString) {
      const dateParts = dateString.split('-');
      const jsDate = new Date(
        parseInt(dateParts[0], 10),
        parseInt(dateParts[1], 10) - 1,
        parseInt(dateParts[2], 10)
      );
      console.log('Date convertie:', jsDate);
      this.facture.dateFacture = jsDate;
    }
  }
}