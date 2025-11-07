import { Component, inject } from '@angular/core';
import { DataService } from '../../../core/services/data.service';
import { Observable } from 'rxjs';
import { Provider } from '../../../model/provider.model';
import { AsyncPipe } from '@angular/common';
import { NgIf } from '@angular/common';
import { ProvidersService } from '../../../core/services/providers.service';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-edit-provider.component',
  imports: [AsyncPipe, NgIf, FormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './edit-provider.component.html',
  styleUrl: './edit-provider.component.css',
})
export class EditProviderComponent {

  // FIX: Allow 'null' in the Observable type to match the DataService.
  providerData$!: Observable<Provider | null>; // 👈 Changed to include | null
  selectedFile: File | null = null;
  private providersService = inject(ProvidersService);

  constructor(private dataService: DataService) {
    // This assignment is now valid.
    this.providerData$ = this.dataService.currentProvider;
  }

  // Method to capture the selected file
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      console.log('file selected')
    }
  }

  saveChanges(provider: Provider): void {
  
    console.log('Submitting provider:', provider);
    // 1. Call the service method, passing the product ID and the entire product object.
    this.providersService.updateProvider(provider.id!, provider)
      // 2. Subscribe to the Observable to trigger the HTTP request and handle the result.
      .subscribe({
        next: (updatedProduct: Provider) => {
          // This runs if the PUT request is successful (HTTP 200/204)
          console.log('Product updated successfully:', updatedProduct);
          //alert(`Product ${updatedProduct.name} updated!`);
          // Optional: Perform additional actions like refreshing the list or navigating.

          if (this.selectedFile) {
            const formData = new FormData();
            formData.append('file', this.selectedFile, this.selectedFile.name);
            this.providersService.updateProviderImage(provider.id!, formData).subscribe({
              next: (updatedProduct: any) => {
                console.log('Product image saved successfully!', updatedProduct);
                // Handle success (e.g., navigate, show notification)
              },
              error: (err: any) => {
                console.error('Error saving product:', err);
                // Handle error
              }
            });
          }

        },
        error: (error: any) => {
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
