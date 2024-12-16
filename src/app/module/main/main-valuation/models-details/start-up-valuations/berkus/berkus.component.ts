import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-berkus',
  templateUrl: './berkus.component.html',
  styleUrls: ['./berkus.component.scss']
})
export class BerkusComponent implements OnChanges {
  bstep:any;
  @Input() bStep:any;
  @Output() berkusstep = new EventEmitter();
  ngOnChanges() {
    if(this.bStep === 0 ) this.bstep = 1;
    else this.bstep = this.bStep;
  }
  berkusStep(step:any){
    this.bstep = step;
    this.berkusstep.emit(step)
  }
}
