import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { User } from '../../shared/models/User';
import { UserService } from '../../shared/services/user.service';
import { Shipping } from '../../shared/models/Shipping';
import { Billing } from '../../shared/models/Billing';
import { ShippingService } from '../../shared/services/shipping.service';
import { BillingService } from '../../shared/services/billing.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  errors: Array<string> = [];
  registerForm = new FormGroup({
    profile: new FormGroup({
      email: new FormControl('', { validators: [Validators.required, Validators.email] }),
      password: new FormControl('', {
        validators: [Validators.required, Validators.pattern(/^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/)],
      }),
      rePassword: new FormControl(''),
      phone: new FormControl(''),
      customerType: new FormControl('private'),
      taxNumber: new FormControl('')
    }),
    shipping: new FormGroup({
      shippingName: new FormControl(''),
      shippingCountry: new FormControl(''),
      shippingPostnumber: new FormControl(''),
      shippingCity: new FormControl(''),
      shippingAddress: new FormControl('')
    }),
    billing: new FormGroup({
      isBillingSameAsShipping: new FormControl(true),
      billingName: new FormControl(''),
      billingCountry: new FormControl(''),
      billingPostnumber: new FormControl(''),
      billingCity: new FormControl(''),
      billingAddress: new FormControl('')
    }),
    terms: new FormGroup({
      dataManagement: new FormControl(false),
      termsOfUse: new FormControl(false)
    })
  });

  constructor(private router: Router,
              private authService: AuthService,
              private userService: UserService,
              private shippingService: ShippingService,
              private billingService: BillingService) { }

  ngOnInit(): void { }

  onSubmit() {
    if (this.inputsValid() === true) {
      this.authService.register(this.registerForm.get('profile.email')?.value as string, this.registerForm.get('profile.password')?.value as string).then(cred => {
        const user: User = {
          id: cred.user?.uid as string,
          email: this.registerForm.get('profile.email')?.value as unknown as string,
          phone: this.registerForm.get('profile.phone')?.value as unknown as string,
          customerType: this.registerForm.get('profile.customerType')?.value as unknown as string,
          taxNumber: this.registerForm.get('profile.taxNumber')?.value as unknown as string,
          isBillingSameAsShipping: this.registerForm.get('billing.isBillingSameAsShipping')?.value as boolean
        };
        
        this.userService.create(user).then(_ => {
          console.log('User created successfully.');

          const shipping: Shipping = {
            userId: cred.user?.uid as string,
            name: this.registerForm.get('shipping.shippingName')?.value as unknown as string,
            country: this.registerForm.get('shipping.shippingCountry')?.value as unknown as string,
            postnumber: this.registerForm.get('shipping.shippingPostnumber')?.value as unknown as string,
            city: this.registerForm.get('shipping.shippingCity')?.value as unknown as string,
            address: this.registerForm.get('shipping.shippingAddress')?.value as unknown as string
          };
          this.shippingService.create(shipping).then(_ => {
            console.log('User shipping created successfully.');

            if (!user.isBillingSameAsShipping) {
              const billing: Billing = {
                userId: cred.user?.uid as string,
                name: this.registerForm.get('billing.billingName')?.value as unknown as string,
                country: this.registerForm.get('billing.billingCountry')?.value as unknown as string,
                postnumber: this.registerForm.get('billing.billingPostnumber')?.value as unknown as string,
                city: this.registerForm.get('billing.billingCity')?.value as unknown as string,
                address: this.registerForm.get('billing.billingAddress')?.value as unknown as string
              };

              this.billingService.create(billing).then(_ => {
                console.log('User billing created successfully.');
              }).catch(error => {
                console.error(error);
              });
            }
          }).catch(error => {
            console.error(error);
          });
        }).catch(error => {
          console.error(error);
        });
        this.router.navigateByUrl('/shop');
      }).catch(error => {
        console.error(error);
      });
    }
  }

  inputsValid() {
    this.errors = [];
    if (this.registerForm.get('profile.password')?.value !== this.registerForm.get('profile.rePassword')?.value) {
      this.errors.push('Jelszavak nem egyeznek!');
    }

    if (this.registerForm.get('profile.customerType')?.value === 'company' && this.registerForm.get('profile.taxNumber')?.value === '') {
      this.errors.push('Céges vásárlótípus esetén adószám megadása kötelező!');
    }

    if (this.registerForm.get('profile.email')?.value === '' ||
        this.registerForm.get('profile.phone')?.value === '' ||
        this.registerForm.get('profile.customerType')?.value === '' ||
        this.registerForm.get('shipping.shippingName')?.value === '' || 
        this.registerForm.get('shipping.shippingCountry')?.value === '' ||
        this.registerForm.get('shipping.shippingPostnumber')?.value === '' ||
        this.registerForm.get('shipping.shippingCity')?.value === '' ||
        this.registerForm.get('shipping.shippingAddress')?.value === '') {
      this.errors.push('Minden mező kitöltése kötelező!');
    }

    if (this.registerForm.get('billing.isBillingSameAsShipping')?.value === false) {
      if (this.registerForm.get('billing.billingName')?.value === '' || 
          this.registerForm.get('billing.billingCountry')?.value === '' ||
          this.registerForm.get('billing.billingPostnumber')?.value === '' ||
          this.registerForm.get('billing.billingCity')?.value === '' ||
          this.registerForm.get('billing.billingAddress')?.value === '') {
        this.errors.push('Számlázási adatok megadása kötelező, ha eltér a szállítási adatoktól!');
      }
    }

    if (this.registerForm.get('terms.dataManagement')?.value === false) {
      this.errors.push('Adatkezelési tájékoztató elfogadása kötelező!');
    }
    if (this.registerForm.get('terms.termsOfUse')?.value === false) {
      this.errors.push('Használati feltételek elfogadása kötelező!');
    }

    const email = this.registerForm.get('profile.email')?.value;
    if (email) {
      const emailSubscription = this.userService.getByEmail(email).subscribe((users: User[]) => {
        if (users.length > 0) {
          this.errors.push("Az email cím már foglalt!");
        }
        emailSubscription.unsubscribe();
      });
    }

    if (this.errors.length === 0) {
      return true;
    }
    return false;
  }
}
