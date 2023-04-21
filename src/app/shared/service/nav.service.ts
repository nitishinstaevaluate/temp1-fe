import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, debounceTime, fromEvent, takeUntil } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavService {
	private unsubscriber: Subject<any> = new Subject();
	public megaMenu: boolean = false;
	public levelMenu: boolean = false;
	public megaMenuColapse: boolean = window.innerWidth < 1199 ? true : false;
	public  screenWidth: BehaviorSubject<number> = new BehaviorSubject(window.innerWidth);
	public collapseSidebar: boolean = window.innerWidth < 991 ? true : false;
  constructor() { 
    this.setScreenWidth(window.innerWidth);
		fromEvent(window, 'resize').pipe(
			debounceTime(1000),
			takeUntil(this.unsubscriber)
		).subscribe((evt: any) => {
			this.setScreenWidth(evt.target.innerWidth);
			if (evt.target.innerWidth < 991) {
				this.collapseSidebar = true;
				this.megaMenu = false;
				this.levelMenu = false;
			}
			if(evt.target.innerWidth < 1199) {
				this.megaMenuColapse = true;
			}
		});
	
  }
  private setScreenWidth(width: number): void {
	this.screenWidth.next(width);
}
}
