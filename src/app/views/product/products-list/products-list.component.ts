import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
// 💡 Correctly import the service and interface from the new file
import { ProductsService } from '../../../core/services/products.service';
import { Product } from '../../../model/product.model'

@Component({
  selector: 'app-products-list',
  standalone: true,
  // 💡 Removed HttpClientModule since ProductsService is root-provided
  imports: [CommonModule],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.css'
})
export class ProductListComponent implements OnInit {

  // 💡 Inject the new dedicated service
  private productsService = inject(ProductsService);

  // Note: Product interface is now imported from the service file
  products = signal<Product[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.fetchProducts();
  }

  /**
   * Fetches the list of products using the dedicated service.
   */
  fetchProducts(): void {
    this.loading.set(true);
    this.error.set(null);

    // 💡 Use the service method instead of direct HttpClient call
    this.productsService.getProducts().subscribe({
      next: (data: Product[]) => {
        this.products.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        this.error.set(`Status ${err.status}: ${err.message || 'Check console for details.'}`);
        this.loading.set(false);
        this.products.set([]);
      }
    });
  }

  /**
   * Placeholder function for adding a product to a cart (future feature).
   * @param product The product object to add.
   */
  addToCart(product: Product): void {
    console.log(`[ACTION] Added ${product.name} (ID: ${product.id}) to the cart!`);
    // Toast/Snackbar UI implementation would go here instead of console.log
  }

  deleteProduct(product: Product) {
    console.log(`[deleteProduct]  ${product.name} (ID: ${product.id})`);
    // 1. CHECK FOR UNDEFINED: Ensure the ID is present before calling the service
    if (product.id !== undefined) {
      // TypeScript now knows that product.id is a 'number' inside this block.
      this.productsService.deleteProduct(product.id).subscribe({
        next: () => {
          // Handle success (e.g., refresh the list, show message)
          console.log(`Product with ID ${product.id} deleted successfully.`);
          this.fetchProducts(); // Example function to refresh the list
        },
        error: (err) => {
          // Handle error
          console.error('Deletion failed:', err);
        }
      });
    } else {
      // 2. HANDLE MISSING ID: Log an error or notify the user if the ID is unexpectedly missing
      console.error('Cannot delete product: ID is missing.');
      // Optionally: show a toast notification to the user
    }
  }

}
