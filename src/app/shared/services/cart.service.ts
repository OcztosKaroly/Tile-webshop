import { Injectable } from '@angular/core';
import { Product } from '../models/Product';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: Map<Product, number> = new Map();

  constructor() {  }

  getCartItems() {
    this.loadCartItems();
    return this.cartItems;
  }

  addItemToCart(product: Product, quantity: number) {
    quantity = parseInt(String(quantity), 0);
    if (quantity === 0) {
      this.removeItemFromCart(product);
    } else if (quantity >= 1 || quantity >= 1) {
      if (this.isItemInCart(product)) {
        this.cartItems.set(product, quantity);
      } else {
        this.cartItems.set(product, quantity);
      }
    }
    this.saveCartItems();
  }

  private saveCartItems() {
    localStorage.removeItem('cartItems');
    const serializedData = JSON.stringify(Array.from(this.cartItems.entries()).map(([key, value]) => [JSON.stringify(key), value]));
    localStorage.setItem('cartItems', serializedData);
  }

  private loadCartItems() {
    const storedData = localStorage.getItem('cartItems');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      this.cartItems = new Map<Product, number>(parsedData.map(([key, value]: [string, number]) => [JSON.parse(key), value]));
    }
  }

  private isItemInCart(product: Product) {
    this.loadCartItems();
    for (const item of this.cartItems.keys()) {
      if (product.id === item.id) {
        this.cartItems.delete(item);
        return true;
      }
    }
    return false;
  }

  removeItemFromCart(product: Product) {
    for (const item of this.cartItems.keys()) {
      if (product.id === item.id) {
        this.cartItems.delete(item);
        this.saveCartItems();
        return;
      }
    }
  }

  clearCart() {
    this.cartItems = new Map();
    this.saveCartItems();
  }

  getCartValue() {
    this.loadCartItems();
    let totalValue = 0;
    for (const item of this.cartItems.entries()) {
      totalValue += item[0].price * item[1];
    }
    return totalValue;
  }
}
