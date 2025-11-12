import { Injectable, inject } from '@angular/core';
import { Firestore, collectionData, collection, CollectionReference } from '@angular/fire/firestore';
import { catchError, Observable, of } from 'rxjs';
import { FirebaseError } from '@firebase/util';
import { Order } from '../../model/order.model'

@Injectable({
  providedIn: 'root'
})
export class OrdersService {  
  
  private ordersCollection: CollectionReference<Order>;
  constructor(private firestore: Firestore) {    
    this.ordersCollection = collection(this.firestore, 'providers') as CollectionReference<Order>;
  }
  
  getOrders(): Observable<Order[]> {
    return collectionData(this.ordersCollection, {
      idField: 'id' 
    }) as Observable<Order[]>;
  }  
  
}
