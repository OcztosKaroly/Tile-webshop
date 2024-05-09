import { Injectable } from '@angular/core';
import { Invoice } from '../models/Invoice';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Auth, user } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  collectionName = "Invoices";

  constructor(private afs: AngularFirestore) { }

  create(userId: string, value: number) {
    let invoice: Invoice = {
      userId: userId,
      date: Number(Date.now()),
      value: value
    };
    return this.afs.collection<Invoice>(this.collectionName).add(invoice);
  }

  getAllByUserId(userId: string) {
    return this.afs.collection<Invoice>(this.collectionName, ref => ref.where('userId', '==', userId).orderBy('date', 'desc')).valueChanges();
  }
}
