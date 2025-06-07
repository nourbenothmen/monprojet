import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../../services/client.service';
import { Client } from '../../../../models/client.modal';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { AddEditClientModalComponent } from './add-edit-client.modal.component';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent, AddEditClientModalComponent],
  templateUrl: './client-table.component.html'
})
export class ClientsComponent implements OnInit {
  clients: Client[] = [];
  showModal: boolean = false;
  isEditMode: boolean = false;
  selectedClient: Client = { name: '', email: '', adresse: '', telephone: '' };

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.clientService.getAllClients().subscribe(data => this.clients = data);
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.selectedClient = { name: '', email: '', adresse: '', telephone: '' };
    this.showModal = true;
  }

  openEditModal(client: Client): void {
    this.isEditMode = true;
    this.clientService.getClientById(client.id!).subscribe({
      next: (fetchedClient) => {
        this.selectedClient = { ...fetchedClient };
        this.showModal = true;
      },
      error: (err) => {
        console.error("Erreur lors du chargement du client:", err);
      }
    });
  }

  handleSave(client: Client): void {
    if (this.isEditMode) {
      const index = this.clients.findIndex(c => c.id === client.id);
      if (index !== -1) this.clients[index] = client;
    } else {
      this.clients.push(client);
    }
    this.closeModal();
  }

  closeModal(): void {
    this.showModal = false;
  }

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
