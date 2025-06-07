import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Produit } from '../../../../models/produit.modal';
import { ProduitService } from '../../../services/produit.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-edit-produit-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-edit-produit.modal.component.html'
})
export class AddEditProduitModalComponent {
  @Input() isEdit = false;
  @Input() produit: Produit = {
    name: '',
    price: 0,
    quantity: 0,
    category: ''
  };

  categories = ['PC', 'Souris', 'Clavier', 'Écran', 'Stockage', 'Casque', 'Composant'];

  constructor(
    public activeModal: NgbActiveModal,
    private produitService: ProduitService
  ) {}

  save(): void {
    const operation = this.isEdit 
      ? this.produitService.updateProduit(this.produit.id!, this.produit)
      : this.produitService.createProduit(this.produit);

    operation.subscribe({
      next: () => this.activeModal.close('saved'),
      error: (err) => console.error('Erreur:', err)
    });
  }
}