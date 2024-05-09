import { Component, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  page = '';
  loggedInUser?: firebase.default.User | null;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((evts: any) => {
      this.page = (evts.urlAfterRedirects as string).split('/')[1] as string;
      if (this.page === "logout") {
        this.logout();
      }
    });

    const authSubscription = this.authService.isUserLoggedIn().subscribe(user => {
      this.loggedInUser = user;
      localStorage.setItem('user', JSON.stringify(this.loggedInUser));
      authSubscription.unsubscribe();
    }, error => {
      console.error(error);
      localStorage.setItem('user', JSON.stringify('null'));
      authSubscription.unsubscribe();
    });
  }

  onToggleSidenav(sidenav: MatSidenav) {
    sidenav.toggle();
  }

  onClose(event: any, sidenav: MatSidenav) {
    if (event === true) {
      sidenav.close();
    }
  }

  logout(_?: boolean) {
    this.authService.logout().then(() => {
      console.log('Logged out succesfully.');
    }).catch(error => {
      console.error(error);
    });
    this.router.navigateByUrl('/login');
  }
}
