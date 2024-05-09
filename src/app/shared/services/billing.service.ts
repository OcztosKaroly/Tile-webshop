import { Injectable } from '@angular/core';
import { Billing } from '../models/Billing';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class BillingService {
  collectionName = "Billings";

  constructor(private afs: AngularFirestore) { }
  
  create(billing: Billing) {
    return this.afs.collection<Billing>(this.collectionName).doc(billing.userId).set(billing);
  }

  getById(userId: string) {
    return this.afs.collection<Billing>(this.collectionName).doc(userId).valueChanges();
  }

  update(billing: Billing) {
    return this.afs.collection<Billing>(this.collectionName).doc(billing.userId).set(billing);
  }

  delete(billing: Billing) {
    return this.afs.collection<Billing>(this.collectionName).doc(billing.userId).delete();
  }

  deleteById(id: string) {
    return this.afs.collection<Billing>(this.collectionName).doc(id).delete();
  }
}
