import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Reglement, ModePaiement } from '../../../../models/reglement.modal';
import { Facture } from '../../../../models/facture.modal';
import { Devise } from '../../../../models/devise.modal';
import { ReglementService } from '../../../services/reglement.service';
import { FactureService } from '../../../services/facture.service';
import { FactureStatus } from '../../../../models/facture.modal';

@Component({
  selector: 'app-add-edit-reglement-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-edit-reglement.modal.component.html'
})
export class AddEditReglementModalComponent {
  @Input() isEdit = false;
  @Input() reglement: Reglement = {
    montant: 0,
    dateReglement: new Date().toISOString(),
    factureId: 0,
    modePaiement: ModePaiement.CASH,
    deviseId: 0
  };
  @Input() factures: Facture[] = [];
  @Input() devises: Devise[] = [];

  modePaiementOptions = Object.values(ModePaiement);
  selectedFactureTotal: number = 0;
  originalDeviseId: number = 0;
  montantConvertiDT: number = 0;
  originalMontantRestant: number = 0;

  constructor(
    public activeModal: NgbActiveModal,
    private reglementService: ReglementService,
    private factureService: FactureService
  ) {}

  get isDataLoaded(): boolean {
    return this.factures.length > 0 && this.devises.length > 0;
  }

  getDeviseSymbol(deviseId: number): string {
    const devise = this.devises.find(d => d.id === deviseId);
    return devise?.symbole || 'TND';
  }

  updateFactureDetails(): void {
    const facture = this.factures.find(f => f.id === this.reglement.factureId);
    if (facture) {
      this.selectedFactureTotal = facture.total || 0;
      this.originalDeviseId = facture.deviseId || 0;
      this.reglement.deviseId = facture.deviseId || 0;
      this.originalMontantRestant = facture.resteAPayer ?? facture.total ?? 0;
      this.calculateMontant();
      this.updateMontantRestant();
    }
  }

calculateMontant(): void {
  if (this.reglement.factureId > 0 && this.selectedFactureTotal > 0 && this.reglement.deviseId > 0) {
    const originalDevise = this.devises.find(d => d.id === this.originalDeviseId);
    const targetDevise = this.devises.find(d => d.id === this.reglement.deviseId);
    if (originalDevise && targetDevise && originalDevise.tauxChange && targetDevise.tauxChange) {
      const tauxConversion = targetDevise.tauxChange; // Should be 3.39 for EUR
      let calculatedMontant = this.reglement.montant * tauxConversion;
      // Round to 2 decimal places
      this.montantConvertiDT = Math.round(calculatedMontant * 100) / 100;
      // Force to originalMontantRestant if within 0.01 DT tolerance and covers the total
      if (Math.abs(this.montantConvertiDT - this.originalMontantRestant) <= 0.01 && this.montantConvertiDT >= this.originalMontantRestant) {
        this.montantConvertiDT = this.originalMontantRestant;
      }
      console.log('calculateMontant Debug:', {
        reglementMontant: this.reglement.montant,
        targetDeviseTauxChange: targetDevise.tauxChange,
        calculatedMontant,
        montantConvertiDT: this.montantConvertiDT
      });
      this.updateMontantRestant();
    } else {
      this.montantConvertiDT = this.reglement.montant;
      console.warn('No conversion applied, using raw montant');
    }
  }
}
updateMontantRestant(): void {
  const facture = this.factures.find(f => f.id === this.reglement.factureId);
  if (facture && this.montantConvertiDT > 0) {
    const currentMontantRestant = facture.resteAPayer ?? facture.total ?? 0;
    const nouveauMontantRestant = currentMontantRestant - this.montantConvertiDT;
    // Force resteAPayer to 0 if payment matches or exceeds the original amount
    if (this.montantConvertiDT >= this.originalMontantRestant) {
      facture.resteAPayer = 0;
    } else {
      facture.resteAPayer = Math.max(0, Math.round(nouveauMontantRestant * 100) / 100);
    }
    console.log('updateMontantRestant Debug:', {
      currentMontantRestant,
      montantConvertiDT: this.montantConvertiDT,
      originalMontantRestant: this.originalMontantRestant,
      nouveauMontantRestant,
      updatedResteAPayer: facture.resteAPayer
    });
    this.updateStatutFacture(facture);
  }
}
  

  updateStatutFacture(facture: Facture): void {
    const montantRestant = facture.resteAPayer ?? facture.total ?? 0;
    if (montantRestant <= 0.01) {
      facture.status = FactureStatus.REGLE;
    } else {
      facture.status = FactureStatus.NON_REGLE;
    }
  }

  get filteredFactures(): Facture[] {
    return this.factures.filter(facture => (facture.resteAPayer ?? facture.total ?? 0) > 0);
  }

  isFormValid(): boolean {
    const facture = this.factures.find(f => f.id === this.reglement.factureId);
    const montantConvertiDT = this.montantConvertiDT || 0;

    console.log('isFormValid Debug:', {
      facture,
      originalMontantRestant: this.originalMontantRestant,
      montantConvertiDT,
      reglement: this.reglement
    });

    const isValid = this.reglement.montant > 0 &&
                    this.reglement.factureId > 0 &&
                    this.reglement.modePaiement != null &&
                    this.reglement.deviseId > 0 &&
                    montantConvertiDT <= this.originalMontantRestant &&
                    montantConvertiDT > 0;

    console.log('isValid:', isValid);
    return isValid;
  }

  saveReglement(): void {
    if (!this.isFormValid()) {
      console.warn('Formulaire invalide');
      alert('Le montant payé ne peut pas dépasser le montant restant initial de la facture.');
      return;
    }

    const facture = this.factures.find(f => f.id === this.reglement.factureId);
    if (facture) {
      this.updateMontantRestant();
      this.updateStatutFacture(facture);

      if (facture.id !== undefined) {
        this.factureService.updateFacture(facture.id, facture).subscribe({
          next: () => console.log('Facture mise à jour:', facture),
          error: (err) => console.error('Erreur mise à jour facture:', err)
        });
      } else {
        console.error('Erreur: facture.id est undefined');
        return;
      }
    }

    const operation = this.isEdit && this.reglement.id
      ? this.reglementService.updateReglement(this.reglement.id, this.reglement)
      : this.reglementService.createReglement(this.reglement);

    operation.subscribe({
      next: (result) => {
        this.activeModal.close(result);
        this.loadDataAfterSave();
      },
      error: (err) => {
        console.error('Erreur:', err);
        alert(`Erreur: ${err.error?.message || 'Une erreur est survenue'}`);
      }
    });
  }

  loadDataAfterSave(): void {
    // À implémenter selon votre architecture
  }
}