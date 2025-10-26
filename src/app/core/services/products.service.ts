import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // 💡 Removed HttpHeaders, as interceptor handles it
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'; // 💡 Keeping the import, but removing the injection/use
import { environment } from '@env/environment';
import { Product } from '../../model/product.model'

/**
 * Defines the structure for a product object.
 */
@Injectable({
  // Makes the service available everywhere in your standalone app
  providedIn: 'root'
})
export class ProductsService {
  private http = inject(HttpClient);
  // private authService = inject(AuthService); // 💡 Removed injection, token is retrieved by Interceptor

  private BASE_API_URL = environment.baseApiUrl;
  // 💡 Note: Your previous products endpoint was '/api/v1/products'. 
  // If BASE_API_URL already ends with '/api/v1', this should just be '/products'.
  // I will assume BASE_API_URL includes the version path and correct the endpoint:
  private PRODUCTS_ENDPOINT = '/api/v1/products';

  /**
   * Fetches the list of products from the backend API.
   * The Authorization header is now automatically added by the AuthInterceptor.
   * @returns An Observable array of Product objects.
   */
  getProducts(): Observable<Product[]> {    
    const fullUrl = `${this.BASE_API_URL}${this.PRODUCTS_ENDPOINT}`;   
    return this.http.get<Product[]>(fullUrl);
  }

  /**
   * Sends a POST request to create a new product.
   * The Authorization header is automatically added by the AuthInterceptor.
   * @param product The product data to save.
   * @returns An Observable of the created Product object (with ID).
   */
  createProduct(product: Product): Observable<Product> {
    const fullUrl = `${this.BASE_API_URL}${this.PRODUCTS_ENDPOINT}`;
    return this.http.post<Product>(fullUrl, product);
  }


  // --- New Methods for Update and Delete ---

  /**
   * Sends a PUT request to update an existing product.
   * Assumes the API endpoint is `/api/v1/products/{id}`.
   * @param id The ID of the product to update.
   * @param product The updated product data.
   * @returns An Observable of the updated Product object.
   */
  updateProduct(id: number, product: Product): Observable<Product> {
    const fullUrl = `${this.BASE_API_URL}${this.PRODUCTS_ENDPOINT}/${id}`;
    // Use `put` for replacing the entire resource, or `patch` for partial updates.
    return this.http.put<Product>(fullUrl, product);
  }

  /**
   * Sends a DELETE request to remove a product.
   * Assumes the API endpoint is `/api/v1/products/{id}`.
   * @param id The ID of the product to delete.
   * @returns An Observable that completes upon successful deletion (often returns an empty object {} or void).
   */
  deleteProduct(id: number): Observable<void> {
    const fullUrl = `${this.BASE_API_URL}${this.PRODUCTS_ENDPOINT}/${id}`;
    // The <void> or <any> type depends on what your API returns (often an empty body for 204 No Content).
    return this.http.delete<void>(fullUrl);
  }


}
