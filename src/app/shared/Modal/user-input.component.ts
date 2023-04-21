import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'user-input',
  template: ` <div class="modal-content">
    <div class="modal-header">
      <h5 class="modal-title">{{ modalTitle }}</h5>
      <button
        type="button"
        class="btn  btn-danger"
        aria-label="Close"
        (click)="modal.dismiss(null)"
      >
        X
      </button>
    </div>
    <div class="modal-body">
      <div class="control-group form-group">
        <label class="form-control-label text-dark" for="noOfOutstandingShares"
          >Enter {{ modalTitle }}</label
        >
        <input
          class="form-control "
          [(ngModel)]="userValue"
          required
          type="text"
          placeholder="Enter value"
        />
      </div>
    </div>
    <div class="modal-footer p-2">
      <button
        type="button"
        class=" btn  btn-danger"
        (click)="modal.close(null)"
      >
        Close
      </button>
      <button class="btn  btn-primary" type="button" (click)="close()">Save</button>
    </div>
  </div>`,

  styles: [``],
})
export class UserInputComponent {
  @Input() modalTitle: any = '';
  userValue: any = ''
  constructor(public modal: NgbActiveModal) {

  }

  close() {
    this.modal.close(this.userValue)
  }

}
