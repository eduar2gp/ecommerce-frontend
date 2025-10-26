import { Routes } from '@angular/router';
import { ProductListComponent } from './views/product/products-list/products-list.component';
import { AddProductComponent } from './views/product/add-product/add-product.component'
import { LoginComponent } from './views/login/login.component'; // 👈 Import the new component

export const routes: Routes = [  
  { path: 'login', component: LoginComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'add-product', component: AddProductComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
