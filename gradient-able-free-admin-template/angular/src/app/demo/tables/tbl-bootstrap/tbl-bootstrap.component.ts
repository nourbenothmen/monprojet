import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviseService } from '../../services/devise.service';
import { Devise } from '../../../models/devise.model';
import { CardComponent } from '../../../theme/shared/components/card/card.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'; // Add this import
import { AddEditDeviseModalComponent } from '../tbl-bootstrap/add-edit-devise-modal.component'; // Adjust path as needed

@Component({
  selector: 'app-tbl-bootstrap',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent
  ],
  templateUrl: './tbl-bootstrap.component.html',
  styleUrls: ['./tbl-bootstrap.component.scss']
})
export class TblBootstrapComponent implements OnInit {
  devises: Devise[] = [];

  constructor(
    private deviseService: DeviseService,
    private modalService: NgbModal // Add modal service
  ) {}

  ngOnInit(): void {
    this.loadDevises();
  }

  loadDevises(): void {
    this.deviseService.getAllDevises().subscribe({
      next: (data: Devise[]) => {
        console.log('Données reçues:', data);
        this.devises = data;
      },
      error: (error: any) => {
        console.error('Erreur complète:', error);
        if (error.status === 0) {
          console.error('Problème de connexion au serveur');
        } else if (error.status === 500) {
          console.error('Erreur interne du serveur');
        }
      }
    });
  }

  // Add this method
  openAddModal(): void {
    const modalRef = this.modalService.open(AddEditDeviseModalComponent);
    modalRef.componentInstance.isEdit = false;
    modalRef.result.then((result) => {
      if (result === 'saved') {
        this.loadDevises(); // Refresh the list after adding
      }
    }).catch(() => {
      // Handle dismissal
    });
  }

  // Add this method
  openEditModal(devise: Devise): void {
    const modalRef = this.modalService.open(AddEditDeviseModalComponent);
    modalRef.componentInstance.isEdit = true;
    modalRef.componentInstance.devise = { ...devise }; // Pass a copy of the devise
    modalRef.result.then((result) => {
      if (result === 'saved') {
        this.loadDevises(); // Refresh the list after editing
      }
    }).catch(() => {
      // Handle dismissal
    });
  }

  // Add this method
 // Ajoutez cette méthode à votre classe
confirmDelete(id: number): void {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette devise ?')) {
    this.deviseService.deleteDevise(id).subscribe({
      next: () => {
        this.loadDevises();
        console.log('Devise supprimée avec succès');
      },
      error: (err) => {
        console.error('Erreur suppression:', err);
        alert('Échec de la suppression: ' + (err.error?.message || err.message));
      }
    });
  }
}
}