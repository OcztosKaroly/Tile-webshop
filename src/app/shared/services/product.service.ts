import { Injectable, Query } from '@angular/core';
import { AngularFirestore, QueryFn } from '@angular/fire/compat/firestore';
import { Product } from '../models/Product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  collectionName = 'Products';

  constructor(private afs: AngularFirestore) { }

  create(product: Product) {
    return this.afs.collection<Product>(this.collectionName).doc(product.id).set(product);
  }

  getById(productId: string) {
    return this.afs.collection<Product>(this.collectionName).doc(productId).valueChanges();
  }

  getAll() {
    return this.afs.collection<Product>(this.collectionName).valueChanges();
  }

  /**
   * @deprecated The method should not be used.
   * 
   * Túl sok összetett lekérdezés miatt nem képes lekérni az adatokat.
   **/
  getFiltered(colors: Array<any>, sizes: Array<any>, wheres: Array<any>) {
    return this.afs.collection<any>(this.collectionName, ref =>
      ref.where('color', 'in', colors)
         .where('size', 'in', sizes)
         .where('where', 'in', wheres)
    ).valueChanges();
  }

  getFilteredColors(colors: Array<any>) {
    return this.afs.collection<any>(this.collectionName, ref => ref.where('color', 'in', colors)).valueChanges();
  }

  getFilteredSizes(sizes: Array<any>) {
    return this.afs.collection<any>(this.collectionName, ref => ref.where('size', 'in', sizes)).valueChanges();
  }

  getFilteredWheres(wheres: Array<any>) {
    return this.afs.collection<any>(this.collectionName, ref => ref.where('where', 'in', wheres)).valueChanges();
  }

  update(product: Product) {
    return this.afs.collection<Product>(this.collectionName).doc(product.id).set(product);
  }

  delete(product: Product) {
    return this.afs.collection<Product>(this.collectionName).doc(product.id).delete();
  }
}
