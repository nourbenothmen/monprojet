import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../../services/client.service';
import { Client } from '../../../../models/client.modal';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { AddEditClientModalComponent } from './add-edit-client.modal.component';
import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap'; // Importer NgbModal

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent, AddEditClientModalComponent, NgbModule],
  templateUrl: './client-table.component.html'
})
export class ClientsComponent implements OnInit {
  clients: Client[] = [];

  constructor(private clientService: ClientService, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.clientService.getAllClients().subscribe(data => this.clients = data);
  }

  openAddModal(): void {
    const modalRef = this.modalService.open(AddEditClientModalComponent);
    modalRef.componentInstance.isEdit = false;
    modalRef.componentInstance.client = { name: '', email: '', adresse: '', telephone: '' };
    modalRef.result.then(
      (result: Client) => {
        // Modal fermé avec succès (après sauvegarde)
        this.loadClients(); // Recharger la liste
      },
      (reason) => {
        console.log('Modal fermé', reason);
      }
    );
  }

  openEditModal(client: Client): void {
    const modalRef = this.modalService.open(AddEditClientModalComponent);
    modalRef.componentInstance.isEdit = true;
    modalRef.componentInstance.client = { ...client }; // Passer une copie
    modalRef.result.then(
      (result: Client) => {
        this.loadClients(); // Recharger la liste après modification
      },
      (reason) => {
        console.log('Modal fermé', reason);
      }
    );
  }

  // handleSave n'est plus nécessaire, car la logique est dans le modal
  // closeModal n'est plus nécessaire, car géré par NgbModal

  confirmDelete(id?: number): void {
    if (id && confirm("Voulez-vous vraiment supprimer ce client ?")) {
      this.clientService.deleteClient(id).subscribe(() => {
        this.clients = this.clients.filter(c => c.id !== id);
      });
    }
  }

  trackByClientId(index: number, client: Client): number {
    return client.id!;
  }
}