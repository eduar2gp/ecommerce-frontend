import { Component, inject, OnInit, signal, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // 👈 Import FormsModule for ngModel
import { AuthService } from '../../core/services/auth.service'; // 👈 Import the new service
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,  
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  // Inject the service and router
  private authService = inject(AuthService);
  private router = inject(Router);

  private platformId = inject(PLATFORM_ID);  

  // Model to hold form data
  public credentials = { username: '', password: '' };
  public loginError = signal<string | null>(null);

  ngOnInit(): void {
    // Optional: Check if already logged in and redirect
    // Check if already logged in and redirect, but only in the browser
    if (isPlatformBrowser(this.platformId) && this.authService.getToken()) {
      this.router.navigate(['/products']);
    }
  }

  /**
   * Handles the login form submission.
   */
  onLogin(): void {
    this.loginError.set(null); // Clear previous errors

    this.authService.login(this.credentials).subscribe({
      next: () => {
        // Successful login, redirect to the products page
        this.router.navigate(['/products']);
      },
      error: (err) => {
        // Handle login failure (e.g., show an error message)
        console.error('Login Failed', err);
        this.loginError.set('Invalid username or password. Please try again.');
      }
    });
  }
}
