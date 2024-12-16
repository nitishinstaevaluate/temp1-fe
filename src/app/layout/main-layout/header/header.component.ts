import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { GenericModalBoxComponent } from 'src/app/shared/modal box/generic-modal-box/generic-modal-box.component';
import { CalculationsService } from 'src/app/shared/service/calculations.service';
import { NavService } from 'src/app/shared/service/nav.service';
import { UserService } from 'src/app/shared/service/user.service';

@Component({
  selector: 'mvp-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public isCollapsed = true;
  store: any;
  menuItems: any;
  userName: any;

  constructor(
    public navServices: NavService,
    private router: Router,
    private calculationService: CalculationsService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ){}


  // data$ = this.store.select('data')
  totalMoney:any = 0
  totalLength = 1
  delectFunction = false
  getdelectData:any;
  isDropdownOpen: boolean = false;
  ngOnInit(): void {
    this.fetchUser();
  }


  toggleSidebar(){
    if ((this.navServices.collapseSidebar = true)) {
      document.querySelector("body")?.classList.toggle("sidenav-toggled")
    }
  
  }

  open(content:any) {
    // this.modalService.open(content, {backdrop : 'static' , windowClass : 'modalCusSty', size: 'lg' })
  }

  toggleSwitcher() {
    // this.SwitcherService.emitChange(true);
    document.querySelector('body')?.classList.remove("sidenav-toggled-open")
  }

  toggleSidebarNotification() {
    // this.layoutService.emitSidebarNotifyChange(true);
  }

  signout() {
    // this.auth.SignOut();
    // this.router.navigate(['/auth/login']);
  }


  // Search
  // public menuItems!: Menu[];
  //   public items!: Menu[];
    public text!: string;
    public SearchResultEmpty:boolean = false;


// 
  Search(searchText: any) {
    // if (!searchText) return this.menuItems = [];
    // items array which stores the elements
    let items:any[] = [];
    // Converting the text to lower case by using toLowerCase() and trim() used to remove the spaces from starting and ending
    searchText = searchText.toLowerCase().trim();
    // this.items.filter((menuItems:any) => {
    //   // checking whether menuItems having title property, if there was no title property it will return
    //   if (!menuItems?.title) return false;
    //   //  checking wheteher menuitems type is text or string and checking the titles of menuitems
    //   if (menuItems.type === 'link' && menuItems.title.toLowerCase().includes(searchText)) {
    //     // Converting the menuitems title to lowercase and checking whether title is starting with same text of searchText
    //     if( menuItems.title.toLowerCase().startsWith(searchText)){// If you want to get all the data with matching to letter entered remove this line(condition and leave items.push(menuItems))
    //       // If both are matching then the code is pushed to items array
    //       items.push(menuItems);
    //     }
    //   }
    //   //  checking whether the menuItems having children property or not if there was no children the return
    //   if (!menuItems.children) return false;
    //   menuItems.children.filter((subItems:any) => {
    //     if (subItems.type === 'link' && subItems.title.toLowerCase().includes(searchText)) {
    //       if( subItems.title.toLowerCase().startsWith(searchText)){         // If you want to get all the data with matching to letter entered remove this line(condition and leave items.push(subItems))
    //         items.push(subItems);
    //       }

    //     }
    //     if (!subItems.children) return false;
    //     subItems.children.filter((subSubItems:any) => {
    //       if (subSubItems.title.toLowerCase().includes(searchText)) {
    //         if( subSubItems.title.toLowerCase().startsWith(searchText)){// If you want to get all the data with matching to letter entered remove this line(condition and leave items.push(subSubItems))
    //           items.push(subSubItems);
    //         }
    //       }
    //     })
    //     return;
    //   })
    //   return this.menuItems = items;
    // });
    // Used to show the No search result found box if the length of the items is 0
    if(!items.length){
      this.SearchResultEmpty = true;
    }
    else{
      this.SearchResultEmpty = false;
    }
    return;
  }

   //  Used to clear previous search result
   clearSearch() {
    this.text = '';
    this.menuItems = [];
    this.SearchResultEmpty = false;
    return this.text, this.menuItems
  }

  toggleDropdown(open: boolean): void {
    this.isDropdownOpen = open;
  }

  checkStatus(status:string){
    if(status === 'signOut'){
      sessionStorage.clear();
      this.router.navigate(['./']);
    }
  }

  isLoggedIn(){
    const access_token = sessionStorage.getItem('access_token');
    if(!access_token)
      return false;
    return true;
  }

  fetchUser(){
    this.calculationService.userName.subscribe((userResponse:any)=>{
      if(userResponse){
        this.userName = userResponse;
      }else{
        this.handleError('User not found')
      }
    },(error)=>{
      this.handleError(`${error?.message}`);
    })
  }

  handleError(message: string) {
    this.snackBar.open(message, 'OK', { 
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      duration: 3000,
      panelClass: 'app-notification-error'
    });
}
  showQrCode(){
    const dataSet={
      value: 'qrCode',
    }
    const dialogRef =  this.dialog.open(GenericModalBoxComponent, {data:dataSet,width:'20%'});
  }
}
