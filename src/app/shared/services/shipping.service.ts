import { Injectable } from '@angular/core';
import { Shipping } from '../models/Shipping';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class ShippingService {
  collectionName = 'Shippings';

  constructor(private afs: AngularFirestore) { }

  create(shipping: Shipping) {
    return this.afs.collection<Shipping>(this.collectionName).doc(shipping.userId).set(shipping);
  }

  getById(userId: string) {
    return this.afs.collection<Shipping>(this.collectionName).doc(userId).valueChanges();
  }

  update(shipping: Shipping) {
    return this.afs.collection<Shipping>(this.collectionName).doc(shipping.userId).set(shipping);
  }

  delete(shipping: Shipping) {
    return this.afs.collection<Shipping>(this.collectionName).doc(shipping.userId).delete();
  }

  deleteById(userId: string) {
    return this.afs.collection<Shipping>(this.collectionName).doc(userId).delete();
  }
}
