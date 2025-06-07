import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Devise } from '../../../models/devise.modal';
import { DeviseService } from '../../services/devise.service';

@Component({
  selector: 'app-add-edit-devise-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-edit-devise-modal.component.html',
  styleUrls: ['./add-edit-devise-modal.component.scss']
})
export class AddEditDeviseModalComponent {
  @Input() isEdit: boolean = false;
  @Input() devise: Devise = { id: 0, code: '', nom: '', symbole: '', tauxChange: 0 }; // Retirez l'ID
  constructor(
    public activeModal: NgbActiveModal,
    private deviseService: DeviseService
  ) {}
onSubmit(): void {
  if (this.isEdit && this.devise.id) {
    // Modification - nécessite un ID
    this.deviseService.updateDevise(this.devise.id, this.devise as Devise).subscribe({
      next: () => this.activeModal.close('saved'),
      error: (error) => console.error('Error updating:', error)
    });
  } else {
    // Création - sans ID
    const { id, ...newDevise } = this.devise;
    this.deviseService.createDevise(newDevise).subscribe({
      next: () => this.activeModal.close('saved'),
      error: (error) => console.error('Error creating:', error)
    });
  }
}

}
