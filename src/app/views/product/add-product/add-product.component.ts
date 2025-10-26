import { Component, OnInit, signal, inject, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Needed for forms and ngModel
import { ProductsService } from '../../../core/services/products.service';
import { Product } from '../../../model/product.model'


// 💡 Removed API_URL constant since the service now handles it

@Component({
  selector: 'app-add-product-form-component',
  standalone: true,
  // 💡 Removed HttpClientModule since the service is root-provided and handles HTTP
  imports: [CommonModule, FormsModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent {
  // 💡 Injected the dedicated service instead of HttpClient
  private productsService = inject(ProductsService);

  // Initial form model state
  newProduct: Product = { name: '', description: '', price: 0.01, stockQuantity: 1 };

  saving = signal(false);
  statusMessage = signal<string | null>(null);
  isSuccess = false;

  @Output() productAdded = new EventEmitter<void>();

  /**
   * Resets the form after successful submission.
   */
  private resetForm(): void {
    this.newProduct = { name: '', description: '', price: 0.01, stockQuantity: 1 };
    // Clear status message after a short delay
    setTimeout(() => this.statusMessage.set(null), 3000);
  }

  /**
   * Sends a POST request to the Spring Boot API to save a new product using the ProductsService.
   */
  saveProduct(isValid: boolean): void {
    if (!isValid) {
      this.statusMessage.set('Please fill out all required fields.');
      this.isSuccess = false;
      return;
    }

    this.saving.set(true);
    this.statusMessage.set(null);

    // 💡 Used the dedicated ProductsService method
    this.productsService.createProduct(this.newProduct).subscribe({
      next: (response) => {
        this.statusMessage.set(`Success! Product '${response.name}' created (ID: ${response.id}).`);
        this.isSuccess = true;
        this.saving.set(false);
        this.resetForm();
        // Notify the parent component (ProductListComponent) to refresh its list
        this.productAdded.emit();
      },
      error: (err) => {
        console.error('Error saving product:', err);
        this.statusMessage.set(`Error saving product. Check console. Status: ${err.status}`);
        this.isSuccess = false;
        this.saving.set(false);
      }
    });
  }
}
