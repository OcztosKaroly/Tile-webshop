import { Component, OnInit } from '@angular/core';
import { Product } from '../../shared/models/Product';
import { CartService } from '../../shared/services/cart.service';
import { InvoiceService } from '../../shared/services/invoice.service';
import { User } from '../../shared/models/User';
import { UserService } from '../../shared/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  cartItems: Product[] = [];
  cartItemsCounts: number[] = [];
  user?: User;

  displayedColumns: string[] = ['name', 'color', 'size', 'quantity', 'price', 'total', 'delete'];

  constructor(private cartService: CartService, private invoiceService: InvoiceService,
              private userService: UserService, private router: Router) {  }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') as string) as firebase.default.User;
    if (user !== null) {
      const userSubscription = this.userService.getById(user.uid).subscribe(data => {
        this.user = data;
        userSubscription.unsubscribe();
      }, error => {
        console.error(error);
        userSubscription.unsubscribe();
      });
    }
    this.getAllItemsFromCart();
  }

  onQuantityChange(row: number) {
    if (this.cartItemsCounts[row] === null || this.cartItemsCounts[row] < 1) {
      this.cartItemsCounts[row] = 1;
    }
    
    this.cartService.addItemToCart(this.cartItems[row], this.cartItemsCounts[row]);
    this.getAllItemsFromCart();
    this.getTotalPrice();
  }

  purchase() {
    if (!this.user || this.user == null) {
      this.router.navigateByUrl('/register');
    } else {
      const cartValue = this.cartService.getCartValue();
      this.invoiceService.create(this.user.id as string, cartValue as number).then(() => {
        this.cartService.clearCart();
        this.router.navigateByUrl('/invoices');
      }).catch((error) => {
        console.error('Error creating invoice:', error);
        window.location.reload();
      });
    }
  }

  delete(row: number) {
    this.cartService.removeItemFromCart(this.cartItems[row]);
    this.getAllItemsFromCart();
    window.location.reload();
  }

  getAllItemsFromCart() {
    let cartItems = this.cartService.getCartItems();
    let i = 0;
    for (const item of cartItems.entries()) {
      this.cartItems[i] = item[0];
      this.cartItemsCounts[i] = item[1];
      i++;
    }
    for (let i = 1; i < this.cartItems.length; i++) {
      const currentProduct = this.cartItems[i];
      const currentQuantity = this.cartItemsCounts[i];
      let j = i - 1;
      while (j >= 0 && this.cartItems[j].id > currentProduct.id) {
        this.cartItems[j + 1] = this.cartItems[j];
        this.cartItemsCounts[j + 1] = this.cartItemsCounts[j];
          j--;
      }
      this.cartItems[j + 1] = currentProduct;
      this.cartItemsCounts[j + 1] = currentQuantity;
    }
  }

  getTotalPrice() {
    return this.cartService.getCartValue();
  }

  clearCart() {
    this.cartService.clearCart();
    window.location.reload();
  }
}
