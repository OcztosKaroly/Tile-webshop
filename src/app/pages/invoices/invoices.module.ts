import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoicesRoutingModule } from './invoices-routing.module';
import { InvoicesComponent } from './invoices.component';
import { DateFormatPipe } from '../../shared/pipes/date-format.pipe';
import { MatTableModule } from '@angular/material/table';
import { CustomCurrencyModule } from '../../shared/modules/custom-currency/custom-currency.module';


@NgModule({
  declarations: [
    InvoicesComponent,
    DateFormatPipe
  ],
  imports: [
    CommonModule,
    InvoicesRoutingModule,
    MatTableModule,
    CustomCurrencyModule
  ]
})
export class InvoicesModule { }
