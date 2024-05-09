import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';

import { UserService } from '../../shared/services/user.service';
import { User } from '../../shared/models/User';
import { Shipping } from '../../shared/models/Shipping';
import { Billing } from '../../shared/models/Billing';
import { ShippingService } from '../../shared/services/shipping.service';
import { BillingService } from '../../shared/services/billing.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit {
  user?: User;
  shipping?: Shipping;
  billing?: Billing;
  errors: Array<string> = new Array();
  
  settingsForm = new FormGroup({
    profile: new FormGroup({
      email: new FormControl(''),
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
    })
  });

  constructor(private router: Router, 
              private userService: UserService,
              private shippingService: ShippingService,
              private billingService: BillingService) { }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') as string) as firebase.default.User;

    const userSubscription = this.userService.getById(user.uid).subscribe(data => {
      this.user = data;
      
      this.settingsForm.get('profile.email')?.setValue(this.user?.email as string);
      this.settingsForm.get('profile.email')?.disable();
      this.settingsForm.get('profile.phone')?.setValue(this.user?.phone as string);
      this.settingsForm.get('profile.customerType')?.setValue(this.user?.customerType as string);
      this.settingsForm.get('profile.taxNumber')?.setValue(this.user?.taxNumber as string);

      this.settingsForm.get('billing.isBillingSameAsShipping')?.setValue(this.user?.isBillingSameAsShipping as boolean);
      userSubscription.unsubscribe();
    }, error => {
      console.error(error);
      userSubscription.unsubscribe();
    });

    const shippingSubscription = this.shippingService.getById(user.uid).subscribe(data => {
      this.shipping = data;

      this.settingsForm.get('shipping.shippingName')?.setValue(this.shipping?.name as string);
      this.settingsForm.get('shipping.shippingCountry')?.setValue(this.shipping?.country as string);
      this.settingsForm.get('shipping.shippingPostnumber')?.setValue(this.shipping?.postnumber as string);
      this.settingsForm.get('shipping.shippingCity')?.setValue(this.shipping?.city as string);
      this.settingsForm.get('shipping.shippingAddress')?.setValue(this.shipping?.address as string);
      shippingSubscription.unsubscribe();
    }, error => {
      console.error(error);
      shippingSubscription.unsubscribe();
    });

    const billingSubscription = this.billingService.getById(user.uid).subscribe(data => {
      this.billing = this.user?.isBillingSameAsShipping === true ? this.shipping : data;

      this.settingsForm.get('billing.billingName')?.setValue(this.billing?.name as string);
      this.settingsForm.get('billing.billingCountry')?.setValue(this.billing?.country as string);
      this.settingsForm.get('billing.billingPostnumber')?.setValue(this.billing?.postnumber as string);
      this.settingsForm.get('billing.billingCity')?.setValue(this.billing?.city as string);
      this.settingsForm.get('billing.billingAddress')?.setValue(this.billing?.address as string);
      billingSubscription.unsubscribe();
    }, error => {
      console.error(error);
      billingSubscription.unsubscribe();
    });
  }

  onSubmit() {
    if (this.inputsValid() === true) {

      const taxNumber = (this.settingsForm.get('profile.customerType')?.value === 'company') ?
                          this.settingsForm.get('profile.taxNumber')?.value as string : '';
      const user: User = {
        id: this.user?.id as string,
        email: this.settingsForm.get('profile.email')?.value as string,
        phone: this.settingsForm.get('profile.phone')?.value as string,
        customerType: this.settingsForm.get('profile.customerType')?.value as string,
        taxNumber: taxNumber,
        isBillingSameAsShipping: this.settingsForm.get('billing.isBillingSameAsShipping')?.value as boolean
      };
      
      this.userService.update(user).then(_ => {
        console.log('User updated successfully.');

        const shipping: Shipping = {
          userId: this.user?.id as string,
          name: this.settingsForm.get('shipping.shippingName')?.value as string,
          country: this.settingsForm.get('shipping.shippingCountry')?.value as string,
          postnumber: this.settingsForm.get('shipping.shippingPostnumber')?.value as string,
          city: this.settingsForm.get('shipping.shippingCity')?.value as string,
          address: this.settingsForm.get('shipping.shippingAddress')?.value as string
        };
        this.shippingService.update(shipping).then(_ => {
          console.log('User shipping updated successfully.');

          if (!user.isBillingSameAsShipping) {
            const billing: Billing = {
              userId: this.user?.id as string,
              name: this.settingsForm.get('billing.billingName')?.value as string,
              country: this.settingsForm.get('billing.billingCountry')?.value as string,
              postnumber: this.settingsForm.get('billing.billingPostnumber')?.value as string,
              city: this.settingsForm.get('billing.billingCity')?.value as string,
              address: this.settingsForm.get('billing.billingAddress')?.value as string
            };

            this.billingService.update(billing).then(_ => {
              console.log('User billing updated successfully.');
            }).catch(error => {
              console.error(error);
            });
          } else {
            this.billingService.deleteById(this.user?.id as string).then(_ => {
              console.log('User billing successfully deleted.');
            });
          }
        }).catch(error => {
          console.error(error);
        });
      }).catch(error => {
        console.error(error);
      });
    }
  }

  inputsValid() {
    this.errors = [];

    if (this.settingsForm.get('profile.customerType')?.value === 'company' && this.settingsForm.get('profile.taxNumber')?.value === '') {
      this.errors.push('Céges vásárlótípus esetén adószám megadása kötelező!');
    }

    if (this.settingsForm.get('profile.email')?.value === '' ||
        this.settingsForm.get('profile.phone')?.value === '' ||
        this.settingsForm.get('profile.customerType')?.value === '' ||
        this.settingsForm.get('shipping.shippingName')?.value === '' || 
        this.settingsForm.get('shipping.shippingCountry')?.value === '' ||
        this.settingsForm.get('shipping.shippingPostnumber')?.value === '' ||
        this.settingsForm.get('shipping.shippingCity')?.value === '' ||
        this.settingsForm.get('shipping.shippingAddress')?.value === '') {
      this.errors.push('Minden mező kitöltése kötelező!');
    }

    if (this.settingsForm.get('billing.isBillingSameAsShipping')?.value === false) {
      if (this.settingsForm.get('billing.billingName')?.value === '' || 
          this.settingsForm.get('billing.billingCountry')?.value === '' ||
          this.settingsForm.get('billing.billingPostnumber')?.value === '' ||
          this.settingsForm.get('billing.billingCity')?.value === '' ||
          this.settingsForm.get('billing.billingAddress')?.value === '') {
        this.errors.push('Számlázási adatok megadása kötelező, ha eltér a szállítási adatoktól!');
      }
    }

    if (this.errors.length === 0) {
      return true;
    }
    return false;
  }

  deleteProfile() {
    this.userService.delete(this.user as User).then(_ => {
      console.log('User deleted successfully.');
    }).catch(error => {
      console.error(error);
    });

    this.shippingService.delete(this.shipping as Shipping).then(_ => {
      console.log('User shipping deleted successfully.');
    }).catch(error => {
      console.error(error);
    });

    this.billingService.delete(this.billing as Billing).then(_ => {
      console.log('User billing deleted successfully.');
    }).catch(error => {
      console.error(error);
    });
    
    this.router.navigateByUrl('/login');
  }
}
