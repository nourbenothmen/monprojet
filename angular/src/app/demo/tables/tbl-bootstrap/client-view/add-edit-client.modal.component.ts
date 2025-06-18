import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Client } from '../../../../models/client.modal';
import { ClientService } from '../../../services/client.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-edit-client-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-edit-client.modal.component.html'
})
export class AddEditClientModalComponent {
  @Input() isEdit: boolean = false;
  @Input() client: Client = { name: '', email: '', adresse: '', telephone: '' };

  @Output() save = new EventEmitter<Client>(); // Événement pour notifier la sauvegarde

  isSaving: boolean = false;

  constructor(
    private clientService: ClientService,
    public activeModal: NgbActiveModal
  ) {}

  onSave(): void {
    if (this.isSaving) return;
    this.isSaving = true;
    const clientToSave = { ...this.client };
    console.log('Client avant sauvegarde (copie) :', clientToSave);
    if (this.isEdit && this.client.id) {
      this.clientService.updateClient(this.client.id, clientToSave).subscribe({
        next: (updatedClient) => {
          this.save.emit(updatedClient);
          this.activeModal.close(updatedClient); // Fermer avec le client mis à jour
          this.isSaving = false;
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour :', err);
          this.isSaving = false;
        }
      });
    } else {
      this.clientService.addClient(clientToSave).subscribe({
        next: (newClient) => {
          this.save.emit(newClient);
          this.activeModal.close(newClient); // Fermer avec le nouveau client
          this.isSaving = false;
        },
        error: (err) => {
          console.error('Erreur lors de l’ajout :', err);
          this.isSaving = false;
        }
      });
    }
  }

  onClose(): void {
    this.activeModal.dismiss(); // Fermer sans sauvegarde
  }
}