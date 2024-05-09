import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CartRoutingModule } from './cart-routing.module';
import { CartComponent } from './cart.component';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

import { CustomCurrencyModule } from '../../shared/modules/custom-currency/custom-currency.module';

@NgModule({
  declarations: [
    CartComponent
  ],
  imports: [
    CommonModule,
    CartRoutingModule,
    MatInputModule,
    MatDividerModule,
    MatButtonModule,
    FormsModule,
    MatTableModule,
    MatIconModule,
    CustomCurrencyModule
  ]
})
export class CartModule { }
