import { Component, inject } from '@angular/core';
import { DataService } from '../../../core/services/data.service';
import { Observable } from 'rxjs';
import { Product } from '../../../model/product.model';
import { AsyncPipe } from '@angular/common';
import { NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http'; // 👈 Import HttpClient
import { ProductsService } from '../../../core/services/products.service';


@Component({
  selector: 'app-product-card',
  imports: [AsyncPipe, NgIf, MatFormFieldModule, MatInputModule, FormsModule],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css'
})
export class EditProductComponent {

  // FIX: Allow 'null' in the Observable type to match the DataService.
  productData$!: Observable<Product | null>; // 👈 Changed to include | null

  private productsService = inject(ProductsService);

  constructor(private dataService: DataService, private http: HttpClient) {    
    this.productData$ = this.dataService.currentProduct;
  }

  // Method called when the form is submitted
  saveProduct(product: Product): void {
    console.log('Submitting product:', product);

    // 1. Call the service method, passing the product ID and the entire product object.
    this.productsService.updateProduct(product.id!, product)
      // 2. Subscribe to the Observable to trigger the HTTP request and handle the result.
      .subscribe({
        next: (updatedProduct: Product) => {
          // This runs if the PUT request is successful (HTTP 200/204)
          console.log('Product updated successfully:', updatedProduct);
          alert(`Product ${updatedProduct.name} updated!`);

          // Optional: Perform additional actions like refreshing the list or navigating.
        },
        error: (error) => {
          // This runs if the PUT request fails (e.g., HTTP 4xx or 5xx)
          console.error('Error updating product:', error);
          alert('Failed to save product. Check the console for details.');

          // Optional: Display a user-friendly error message.
        },
        complete: () => {
          // This runs when the Observable completes (after next or error)
          console.log('Product update stream finished.');
        }
      });
    
  }

}
