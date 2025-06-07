import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FactureService } from '../../services/facture.service';
import { Facture } from '../../../models/facture.modal';
import { Client } from '../../../models/client.modal';
import { Produit } from '../../../models/produit.modal';
import { CardComponent } from '../../../theme/shared/components/card/card.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddEditFactureModalComponent } from '../facture/add-edit-facture.modal.component';
import { ClientService } from '../../services/client.service';
import { ProduitService } from '../../services/produit.service';

@Component({
  selector: 'app-facture',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardComponent
  ],
  templateUrl: './facture.component.html',
  //styleUrls: ['./facture.component.scss']
})
export class FactureComponent implements OnInit {
  factures: Facture[] = [];
  clients: Client[] = [];
  produits: Produit[] = [];
  selectedClientId: number | null = null;

  constructor(
    private factureService: FactureService,
    private clientService: ClientService,
    private produitService: ProduitService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.loadFactures();
    this.loadClients();
    this.loadProduits();
  }

  loadFactures(): void {
    this.factureService.getAllFactures().subscribe({
      next: (data: Facture[]) => {
        this.factures = data;
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des factures', error);
      }
    });
  }

  loadClients(): void {
    this.clientService.getAllClients().subscribe({
      next: (data) => {
        this.clients = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des clients', error);
      }
    });
  }

  loadProduits(): void {
    this.produitService.getProduits().subscribe({
      next: (data) => {
        this.produits = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des produits', error);
      }
    });
  }

  filterByClient(): void {
    if (this.selectedClientId) {
      this.factureService.getFacturesByClient(this.selectedClientId).subscribe({
        next: (data: Facture[]) => {
          this.factures = data;
        },
        error: (error: any) => {
          console.error('Erreur lors du filtrage par client', error);
        }
      });
    } else {
      this.loadFactures();
    }
  }

  openAddModal(): void {
    const modalRef = this.modalService.open(AddEditFactureModalComponent, { size: 'lg' });
    modalRef.componentInstance.clients = this.clients;
    modalRef.componentInstance.produits = this.produits;
    
    modalRef.result.then((result) => {
      if (result === 'saved') {
        this.loadFactures();
      }
    }).catch(() => {});
  }

  openEditModal(facture: Facture): void {
    const modalRef = this.modalService.open(AddEditFactureModalComponent, { size: 'lg' });
    modalRef.componentInstance.facture = { ...facture };
    modalRef.componentInstance.clients = this.clients;
    modalRef.componentInstance.produits = this.produits;
    modalRef.componentInstance.isEdit = true;
    
    modalRef.result.then((result) => {
      if (result === 'saved') {
        this.loadFactures();
      }
    }).catch(() => {});
  }

  confirmDelete(id: number | undefined): void {
    if (id === undefined) return;
    if (confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')) {
      this.factureService.deleteFacture(id).subscribe({
        next: () => {
          this.loadFactures();
        },
        error: (error: any) => {
          console.error('Erreur lors de la suppression', error);
        }
      });
    }
  }

  calculateTotal(factureLignes: any[]): number {
    return factureLignes.reduce((total, ligne) => total + (ligne.price * ligne.quantity), 0);
  }
}