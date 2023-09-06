import { Component, EventEmitter, Output } from '@angular/core';
@Component({
  selector: 'app-group-model-review',
  templateUrl: './group-model-review.component.html',
  styleUrls: ['./group-model-review.component.scss']
})
export class GroupModelReviewComponent {
  @Output() saveAndNextEvent = new EventEmitter<void>();

  

  saveAndNext(): void {
    // Perform save logic here
    this.saveAndNextEvent.emit();
  }
}
