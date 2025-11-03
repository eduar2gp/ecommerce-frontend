import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Provider } from '../../model/provider.model'
import { Product } from '../../model/product.model'

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private providerSource = new BehaviorSubject<Provider | null>(null);  
  currentProvider: Observable<Provider | null> = this.providerSource.asObservable();

  private productSource = new BehaviorSubject<Product | null>(null);  
  currentProduct: Observable<Product | null> = this.productSource.asObservable();

  constructor() { }

  updateProvider(provider: Provider) {
    this.providerSource.next(provider);
  }

  updateProduct(product: Product) {
    this.productSource.next(product)
  }
}
