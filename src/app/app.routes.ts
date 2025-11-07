import { Routes } from '@angular/router';
import { ProductListComponent } from './views/product/products-list/products-list.component';
import { AddProductComponent } from './views/product/add-product/add-product.component'
import { EditProductComponent } from './views/product/edit-product/edit-product.component'
import { LoginComponent } from './views/login/login.component'; // 👈 Import the new component
import { ProvidersListComponent } from './views/provider/providers-list/providers-list.component'
import { EditProviderComponent } from './views/provider/edit-provider/edit-provider.component'
import { AddProviderComponent } from './views/provider/add-provider/add-provider.component'

export const routes: Routes = [  
  { path: 'login', component: LoginComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'add-product', component: AddProductComponent },
  { path: 'edit-product', component: EditProductComponent },
  { path: 'providers', component: ProvidersListComponent },
  { path: 'add-provider', component: AddProviderComponent },
  { path: 'edit-provider', component: EditProviderComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
