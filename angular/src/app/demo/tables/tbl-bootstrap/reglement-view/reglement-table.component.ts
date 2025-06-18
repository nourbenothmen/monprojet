import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin } from 'rxjs';
import { Reglement, ModePaiement } from '../../../../models/reglement.modal';
import { Facture } from '../../../../models/facture.modal';
import { Devise } from '../../../../models/devise.modal';
import { ReglementService } from '../../../services/reglement.service';
import { FactureService } from '../../../services/facture.service';
import { DeviseService } from '../../../services/devise.service';
import { AddEditReglementModalComponent } from './add-edit-reglement.modal.component';
import { CardComponent } from '../../../../theme/shared/components/card/card.component';

@Component({
  selector: 'app-reglement-table',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent],
  templateUrl: './reglement-table.component.html'
})
export class ReglementTableComponent implements OnInit {
  reglements: Reglement[] = [];
  filteredReglements: Reglement[] = [];
  factures: Facture[] = [];
  devises: Devise[] = [];
  modePaiementOptions = Object.values(ModePaiement);
  modePaiementFilter: string = '';
  isDataLoaded = false;

  constructor(
    private reglementService: ReglementService,
    private factureService: FactureService,
    private deviseService: DeviseService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    forkJoin({
      reglements: this.reglementService.getAllReglements(),
      factures: this.factureService.getAllFactures(),
      devises: this.deviseService.getAllDevises()
    }).subscribe({
      next: ({ reglements, factures, devises }) => {
        this.reglements = reglements;
        this.filteredReglements = reglements;
        this.factures = factures.map(f => ({
          ...f,
          resteAPayer: f.resteAPayer ?? f.total ?? 0 // Assurer une valeur par défaut
        })); // Ajouter une vérification pour resteAPayer
        this.devises = devises;
        this.isDataLoaded = true;
        console.log('Règlements chargés:', reglements);
        console.log('Factures chargées (avec resteAPayer):', this.factures);
        console.log('Devises chargées:', devises);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des données:', error);
        this.isDataLoaded = true;
      }
    });
  }

  filterByModePaiement(): void {
    this.filteredReglements = this.modePaiementFilter
      ? this.reglements.filter(r => r.modePaiement === this.modePaiementFilter)
      : [...this.reglements];
  }

  openAddModal(): void {
    if (!this.isDataLoaded) {
      console.warn('Données non chargées, impossible d\'ouvrir la modale');
      return;
    }
    const modalRef = this.modalService.open(AddEditReglementModalComponent, { size: 'lg' });
    modalRef.componentInstance.reglement = {
      montant: 0,
      dateReglement: new Date().toISOString(),
      factureId: 0,
      modePaiement: ModePaiement.CASH,
      deviseId: 0
    };
    modalRef.componentInstance.factures = [...this.factures];
    modalRef.componentInstance.devises = [...this.devises];
    modalRef.componentInstance.isEdit = false;
    modalRef.result.then((result: Reglement) => {
      if (result) {
        this.reglementService.createReglement(result).subscribe({
          next: () => this.loadData(),
          error: (err) => console.error('Erreur création de règlement:', err)
        });
      }
    }).catch(() => {});
  }

  openEditModal(reglement: Reglement): void {
    if (!this.isDataLoaded) {
      console.warn('Données non chargées, impossible d\'ouvrir la modale');
      return;
    }
    const modalRef = this.modalService.open(AddEditReglementModalComponent, { size: 'lg' });
    const reglementCopy = { ...reglement };
    modalRef.componentInstance.reglement = reglementCopy;
    modalRef.componentInstance.factures = [...this.factures];
    modalRef.componentInstance.devises = [...this.devises];
    modalRef.componentInstance.isEdit = true;
    modalRef.result.then((result: Reglement) => {
      if (result && result.id) {
        this.reglementService.updateReglement(result.id, result).subscribe({
          next: () => this.loadData(),
          error: (err) => console.error('Erreur mise à jour de règlement:', err)
        });
      }
    }).catch(() => {});
  }

  confirmDelete(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce règlement ?')) {
      this.reglementService.deleteReglement(id).subscribe({
        next: () => this.loadData(),
        error: (err) => console.error('Erreur lors de la suppression:', err)
      });
    }
  }

  getFactureInfo(factureId: number): string {
    const facture = this.factures.find(f => f.id === factureId);
    return facture ? `${facture.id} - ${facture.client?.name || 'Client inconnu'}` : 'Facture inconnue';
  }

  getDeviseSymbol(deviseId: number): string {
    const devise = this.devises.find(d => d.id === deviseId);
    return devise ? devise.symbole : 'TND';
  }
}