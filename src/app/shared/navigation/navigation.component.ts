import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent implements OnInit, AfterViewInit {
  @Output() onCloseSidenav: EventEmitter<boolean> = new EventEmitter();
  @Output() selectedPage: EventEmitter<string> = new EventEmitter();
  @Output() onLogOut: EventEmitter<boolean> = new EventEmitter(); 
  @Input() currentPage: string = '';
  @Input() loggedInUser?: firebase.default.User | null;

  constructor() { }

  ngOnInit(): void { }

  ngAfterViewInit(): void { }

  navigationSwitch(page: string) {
    this.selectedPage.emit(page);
  }

  close(logout?: boolean) {
    this.onCloseSidenav.emit(true);
    if (logout === true) {
      this.onLogOut.emit(logout);
    }
  }
}
