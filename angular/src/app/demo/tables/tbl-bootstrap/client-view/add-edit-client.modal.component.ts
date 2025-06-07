import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Client } from '../../../../models/client.modal';
import { ClientService } from '../../../services/client.service';

@Component({
  selector: 'app-add-edit-client-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-edit-client.modal.component.html'
})
export class AddEditClientModalComponent {
  @Input() isEdit: boolean = false;
  @Input() client: Client = { name: '', email: '', adresse: '', telephone: '' };

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Client>(); // ⚠️ ici : type correct

  constructor(private clientService: ClientService) {}

  onSave(): void {
    if (this.isEdit && this.client.id) {
      this.clientService.updateClient(this.client.id, this.client).subscribe({
        next: (updatedClient) => this.save.emit(updatedClient),
        error: (err) => console.error('Erreur lors de la mise à jour :', err)
      });
    } else {
      this.clientService.addClient(this.client).subscribe({
        next: (newClient) => this.save.emit(newClient),
        error: (err) => console.error('Erreur lors de l’ajout :', err)
      });
    }
  }

  onClose(): void {
    this.close.emit();
  }
}
