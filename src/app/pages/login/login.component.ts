import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  email = new FormControl('');
  password = new FormControl('');

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void { }

  login() {
    this.authService.login(this.email.value as string, this.password.value as string).then(cred => {
      this.router.navigateByUrl('/shop');
    }).catch(error => {
      console.log(error);
    });
  }

  redirectToRegister() {
    this.router.navigateByUrl('/register');
  }
}
