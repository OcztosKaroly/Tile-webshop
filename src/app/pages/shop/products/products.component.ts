import { Component, OnDestroy, OnInit } from '@angular/core';
import { Product } from '../../../shared/models/Product';
import { ProductService } from '../../../shared/services/product.service';
import { FilterService } from '../../../shared/services/filter.service';
import { Subscription } from 'rxjs';
import { CartService } from '../../../shared/services/cart.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnDestroy {
  products?: Product[];
  filterSubscription?: Subscription;
  getFilteredColorsSubscription?: Subscription;
  getFilteredSizesSubscription?: Subscription;
  getFilteredWheresSubscription?: Subscription;

  constructor(private productService: ProductService, private filterService: FilterService, private cartService: CartService) {
    this.filterSubscription = this.filterService.filterUpdated.subscribe((filters: any) => {
      this.getFilteredColorsSubscription = this.productService.getFilteredColors(filters.get("colors")).subscribe(colorFiltered => {
        const colorFilteredProducts = colorFiltered ? colorFiltered : [];
        this.getFilteredSizesSubscription = this.productService.getFilteredSizes(filters.get("product_sizes")).subscribe(sizeFiltered => {
          const sizeFilteredProducts = sizeFiltered ? sizeFiltered : [];
          this.getFilteredWheresSubscription = this.productService.getFilteredWheres(filters.get("wheres")).subscribe(whereFiltered => {
            const whereFilteredProducts = whereFiltered ? whereFiltered : [];
            this.products = this.arrayIntersection(colorFilteredProducts, sizeFilteredProducts, whereFilteredProducts);
          }, error => {
            console.error(error);
          });
        }, error => {
          console.error(error);
        });
      }, error => {
        console.error(error);
      });
    });
  }

  getProductImageUrl(productId: string): string {
    return 'https://firebasestorage.googleapis.com/v0/b/webkeret-tiles-webshop.appspot.com/o/images%2F'
        + productId
        + '.jpeg?alt=media';
  }

  private arrayIntersection(array1: Product[], array2: Product[], array3: Product[]) {
    if(array1.length === 0 || array2.length === 0 || array3.length === 0) {
      return [];
    }

    let intersection: Product[] = [];

    for(const product1 of array1) {
      for(const product2 of array2) {
        for(const product3 of array3) {
          if(product1.id == product2.id && product1.id == product3.id) {
            intersection.push(product1);
          }
        }
      }
    }

    return intersection;
  }

  addToCart(productId: string) {
    this.getFilteredWheresSubscription = this.productService.getById(productId).subscribe(data => {
      const product = data;
      if (product) {
        const quantityInput = document.getElementById(productId) as HTMLInputElement;
        let quantity = Number(quantityInput.value);
        if (quantity < 1) {
          quantity = 1;
        }
        this.cartService.addItemToCart(product, quantity);
      }
    }, error => {
      console.error(error);
    });
  }

  ngOnDestroy(): void {
    this.getFilteredColorsSubscription?.unsubscribe();
    this.getFilteredSizesSubscription?.unsubscribe();
    this.getFilteredWheresSubscription?.unsubscribe();
    this.filterSubscription?.unsubscribe();
  }
}
