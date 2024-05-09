import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../models/User';
import { AuthService } from './auth.service';
import { getAuth, deleteUser } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  collectionName = 'Users';

  constructor(private afs: AngularFirestore, private auth: AuthService) { }

  create(user: User) {
    return this.afs.collection<User>(this.collectionName).doc(user.id).set(user);
  }

  getAll() {
    return  this.afs.collection<User>(this.collectionName).valueChanges();
  }

  getById(id: string) {
    return this.afs.collection<User>(this.collectionName).doc(id).valueChanges();
  }

  getByEmail(email: string) {
    return this.afs.collection<User>(this.collectionName, ref => ref.where('email', '==', email)).valueChanges();
  }

  update(user: User) {
    return this.afs.collection<User>(this.collectionName).doc(user.id).set(user);
  }

  delete(user: User) {
    const currentAuth = getAuth();
    const currentUser = currentAuth.currentUser;

    if (currentUser){
      deleteUser(currentUser).then(() => {
        console.log('User authenticvation deleted successfully.');
      }).catch((error) => {
        console.error(error);
      });
    }
    return this.afs.collection<User>(this.collectionName).doc(user.id).delete();
  }

  deleteById(id: string) {
    const currentAuth = getAuth();
    const currentUser = currentAuth.currentUser;

    if (currentUser){
      deleteUser(currentUser).then(() => {
        console.log('User authenticvation deleted successfully.');
      }).catch((error) => {
        console.error(error);
      });
    }
    return this.afs.collection<User>(this.collectionName).doc(id).delete();
  }
}
