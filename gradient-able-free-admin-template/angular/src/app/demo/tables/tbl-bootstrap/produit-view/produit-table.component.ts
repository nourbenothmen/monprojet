import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProduitService } from '../../../services/produit.service';
import { Produit } from '../../../../models/produit.modal';
import { CardComponent } from '../../../../theme/shared/components/card/card.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddEditProduitModalComponent } from './add-edit-produit.modal.component';

@Component({
  selector: 'app-produit-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardComponent
  ],
  templateUrl: './produit-table.component.html',
})
export class ProduitTableComponent implements OnInit {
  produits: Produit[] = [];
  filteredProduits: Produit[] = [];
  categories: string[] = ['PC', 'Souris', 'Clavier', 'Écran', 'Stockage', 'Casque', 'Composant'];
  selectedCategory: string = '';

  constructor(
    private produitService: ProduitService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadProduits();
  }

  loadProduits(): void {
    this.produitService.getProduits().subscribe({
      next: (data: Produit[]) => {
        this.produits = data;
        this.filteredProduits = [...data];
      },
      error: (error: any) => console.error('Erreur:', error)
    });
  }

  filterByCategory(): void {
    if (!this.selectedCategory) {
      this.filteredProduits = [...this.produits];
    } else {
      this.filteredProduits = this.produits.filter(
        p => p.category === this.selectedCategory
      );
    }
  }

  openAddModal(): void {
    const modalRef = this.modalService.open(AddEditProduitModalComponent);
    modalRef.componentInstance.isEdit = false;
    modalRef.result.then((result) => {
      if (result === 'saved') {
        this.loadProduits();
      }
    }).catch(() => {});
  }

  openEditModal(produit: Produit): void {
    const modalRef = this.modalService.open(AddEditProduitModalComponent);
    modalRef.componentInstance.isEdit = true;
    modalRef.componentInstance.produit = { ...produit };
    modalRef.result.then((result) => {
      if (result === 'saved') {
        this.loadProduits();
      }
    }).catch(() => {});
  }

  confirmDelete(id: number | undefined): void {
    if (!id) return;
    
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      this.produitService.deleteProduit(id).subscribe({
        next: () => {
          this.loadProduits();
          console.log('Produit supprimé avec succès');
        },
        error: (err) => {
          console.error('Erreur suppression:', err);
          alert('Échec de la suppression: ' + (err.error?.message || err.message));
        }
      });
    }
  }
}