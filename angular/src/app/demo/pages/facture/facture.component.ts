import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FactureService } from '../../services/facture.service';
import { ClientService } from '../../services/client.service';
import { ProduitService } from '../../services/produit.service';
import { DeviseService } from '../../services/devise.service';
import { ReglementService } from '../../services/reglement.service';
import { Facture, FactureStatus } from '../../../models/facture.modal';
import { Client } from '../../../models/client.modal';
import { Produit } from '../../../models/produit.modal';
import { Devise } from '../../../models/devise.modal';
import { Reglement, ModePaiement } from '../../../models/reglement.modal';
import { CardComponent } from '../../../theme/shared/components/card/card.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddEditFactureModalComponent } from './add-edit-facture.modal.component';
import { AddEditReglementModalComponent } from '../../tables/tbl-bootstrap/reglement-view/add-edit-reglement.modal.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-facture',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent, AddEditFactureModalComponent],
  templateUrl: './facture.component.html'
})
export class FactureComponent implements OnInit {
  factures: Facture[] = [];
  clients: Client[] = [];
  produits: Produit[] = [];
  devises: Devise[] = [];
  reglements: Reglement[] = [];
  selectedClientId: number | null = null;
  isDataLoaded = false;

  constructor(
    private factureService: FactureService,
    private clientService: ClientService,
    private produitService: ProduitService,
    private deviseService: DeviseService,
    private reglementService: ReglementService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

loadData(): void {
  forkJoin({
    factures: this.factureService.getAllFactures(),
    clients: this.clientService.getAllClients(),
    produits: this.produitService.getProduits(),
    devises: this.deviseService.getAllDevises(),
    reglements: this.reglementService.getAllReglements()
  }).subscribe({
    next: ({ factures, clients, produits, devises, reglements }) => {
      // Log raw backend response for factures with detailed fields
      console.log('Raw factures from backend:', factures.map(f => ({
        id: f.id,
        total: f.total,
        montantRestant: f.montantRestant,
        status: f.status,
        deviseId: f.deviseId
      })));
      
      this.factures = factures.map(f => {
        const mappedFacture = {
          ...f,
          montantRestant: f.montantRestant !== undefined 
            ? f.montantRestant 
            : this.calculateMontantRestant(f.id, reglements)
        };
        console.log('Mapped facture:', {
          id: mappedFacture.id,
          total: mappedFacture.total,
          montantRestant: mappedFacture.montantRestant,
          status: mappedFacture.status,
          deviseId: mappedFacture.deviseId
        });
        return mappedFacture;
      });
      this.clients = clients;
      this.produits = produits;
      this.devises = devises;
      this.reglements = reglements;
      this.isDataLoaded = true;
      console.log('Factures chargées:', this.factures.map(f => ({
        id: f.id,
        total: f.total,
        montantRestant: f.resteAPayer,
        status: f.status,
        deviseId: f.deviseId
      })));
      console.log('Clients chargés:', clients);
      console.log('Produits chargés:', produits);
      console.log('Devises chargées:', devises);
      console.log('Règlements chargés:', reglements);
    },
    error: (error) => {
      console.error('Erreur lors du chargement des données:', error);
      this.isDataLoaded = true;
    }
  });
}

calculateMontantRestant(factureId: number | undefined, reglements: Reglement[]): number {
  if (!factureId) return 0;
  const totalPaid = reglements
    .filter(r => r.factureId === factureId)
    .reduce((sum, r) => sum + r.montant, 0);
  // Use the original facture from the backend response if available
  const facture = this.factures.find(f => f.id === factureId);
  return facture?.resteAPayer !== undefined ? facture.resteAPayer : (facture?.total || 0 - totalPaid);
}

  filterByClient(): void {
    if (this.selectedClientId) {
      this.factureService.getFacturesByClient(this.selectedClientId).subscribe({
        next: (data: Facture[]) => {
          this.factures = data.map(f => ({
            ...f,
            montantRestant: f.resteAPayer ?? this.calculateMontantRestant(f.id, this.reglements)
          }));
        },
        error: (error) => {
          console.error('Erreur lors du filtrage par client:', error);
        }
      });
    } else {
      this.loadData();
    }
  }
  /*
    openAddModal(): void {
      if (!this.isDataLoaded) {
        console.warn('Données non chargées, impossible d\'ouvrir la modale');
        return;
      }
      const modalRef = this.modalService.open(AddEditFactureModalComponent, { size: 'lg' });
      modalRef.componentInstance.facture = {
        dateFacture: new Date(),
        clientID: 0,
        factureLignes: [],
        status: FactureStatus.NON_REGLE,
        total: 0,
        montantRestant: 0,
        deviseId: this.devises.length > 0 ? this.devises[0].id : 0
      };
      modalRef.componentInstance.clients = [...this.clients];
      modalRef.componentInstance.produits = [...this.produits];
      modalRef.componentInstance.devises = [...this.devises];
      modalRef.result.then((result: Facture) => {
        if (result) {
          this.factureService.createFacture(result).subscribe({
            next: () => this.loadData(),
            error: (err) => console.error('Erreur création de facture:', err)
          });
        }
      }).catch(() => {});
    }
  */
  openAddModal(): void {
    if (!this.isDataLoaded) {
      console.warn('Données non chargées, impossible d\'ouvrir la modale');
      return;
    }
    const modalRef = this.modalService.open(AddEditFactureModalComponent, { size: 'lg' });
    modalRef.componentInstance.facture = {
      dateFacture: new Date(),
      clientID: 0,
      factureLignes: [],
      status: FactureStatus.NON_REGLE,
      total: 0,
      deviseId: this.devises.length > 0 ? this.devises[0].id : 0
      // Remove montantRestant: 0 to let the modal handle it
    };
    modalRef.componentInstance.clients = [...this.clients];
    modalRef.componentInstance.produits = [...this.produits];
    modalRef.componentInstance.devises = [...this.devises];
    modalRef.result.then((result: Facture) => {
      if (result) {
        this.factureService.createFacture(result).subscribe({
          next: () => this.loadData(),
          error: (err) => console.error('Erreur création de facture:', err)
        });
      }
    }).catch(() => { });
  }
  openEditModal(facture: Facture): void {
    if (!this.isDataLoaded) {
      console.warn('Données non chargées, impossible d\'ouvrir la modale');
      return;
    }
    const modalRef = this.modalService.open(AddEditFactureModalComponent, { size: 'lg' });
    const factureCopy = {
      ...facture,
      dateFacture: new Date(facture.dateFacture),
      factureLignes: facture.factureLignes.map(l => ({
        ...l,
        produit: l.produit ? { ...l.produit } : undefined
      }))
    };
    modalRef.componentInstance.facture = factureCopy;
    modalRef.componentInstance.clients = [...this.clients];
    modalRef.componentInstance.produits = [...this.produits];
    modalRef.componentInstance.devises = [...this.devises];
    modalRef.componentInstance.isEdit = true;
    modalRef.result.then((updatedFacture: Facture) => {
      if (updatedFacture?.id) {
        this.factureService.updateFacture(updatedFacture.id, updatedFacture).subscribe({
          next: () => this.loadData(),
          error: (err) => console.error('Erreur mise à jour de facture:', err)
        });
      }
    }).catch(() => { });
  }

  openAddReglementModal(facture: Facture): void {
    if (!this.isDataLoaded) {
      console.warn('Données non chargées, impossible d\'ouvrir la modale');
      return;
    }
    const modalRef = this.modalService.open(AddEditReglementModalComponent, { size: 'lg' });
    modalRef.componentInstance.reglement = {
      montant: 0,
      dateReglement: new Date().toISOString(),
      factureId: facture.id!,
      modePaiement: ModePaiement.CASH,
      deviseId: facture.deviseId
    };
    modalRef.componentInstance.factures = [facture];
    modalRef.componentInstance.devises = [...this.devises];
    modalRef.componentInstance.isEdit = false;
    modalRef.result.then((result: Reglement) => {
      if (result) {
        this.reglementService.createReglement(result).subscribe({
          next: () => this.loadData(),
          error: (err) => console.error('Erreur création de règlement:', err)
        });
      }
    }).catch(() => { });
  }

  confirmDelete(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')) {
      this.factureService.deleteFacture(id).subscribe({
        next: () => this.loadData(),
        error: (err) => console.error('Erreur lors de la suppression:', err)
      });
    }
  }

  getProduitPrice(produitId: number): number {
    const produit = this.produits.find(p => p.id === produitId);
    return produit?.price || 0;
  }

  getDeviseSymbol(deviseId: number): string {
    const devise = this.devises.find(d => d.id === deviseId);
    return devise ? devise.symbole : 'TND';
  }

  // Exemple de mapping du statut vers une string simple
  getStatusLabel(status: FactureStatus | null): 'regle' | 'non_regle' | 'other' {
    if (!status) return 'other';

    switch (status) {
      case FactureStatus.REGLE:  // Si FactureStatus est un enum, adapte ici
        return 'regle';
      case FactureStatus.NON_REGLE:
        return 'non_regle';
      default:
        return 'other';
    }
  }
  


}