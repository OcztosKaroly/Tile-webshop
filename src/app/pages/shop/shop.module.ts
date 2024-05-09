import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShopRoutingModule } from './shop-routing.module';
import { ShopComponent } from './shop.component';
import { FilterComponent } from './filter/filter.component';
import { ProductsComponent } from './products/products.component';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout'
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';

import { CustomCurrencyModule } from '../../shared/modules/custom-currency/custom-currency.module';


@NgModule({
    declarations: [
        ShopComponent,
        FilterComponent,
        ProductsComponent
    ],
    imports: [
        CommonModule,
        ShopRoutingModule,
        MatCardModule,
        FormsModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        MatOptionModule,
        MatCheckboxModule,
        MatDividerModule,
        FlexLayoutModule,
        CustomCurrencyModule
    ]
})
export class ShopModule { }
