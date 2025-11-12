import { Component, inject, OnInit, signal, PLATFORM_ID, NgZone, AfterViewInit} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // 👈 Import FormsModule for ngModel
import { AuthService } from '../../core/services/auth.service'; // 👈 Import the new service
import { isPlatformBrowser } from '@angular/common';
import { environment } from '@env/environment'

declare const google: any;

@Component({
  selector: 'app-login',
  standalone: true,  
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit, AfterViewInit {
  // Inject the service and router
  private authService = inject(AuthService);
  private router = inject(Router);

  private platformId = inject(PLATFORM_ID);  

  // Model to hold form data
  public credentials = { username: '', password: '' };
  public googleJWT = { idToken: ''}
  public loginError = signal<string | null>(null);
  
  constructor(private ngZone: NgZone) {}

  ngAfterViewInit(): void {    
    if (isPlatformBrowser(this.platformId)) {       
      if (typeof google !== 'undefined') {
        this.initializeGoogleSignIn();
      }
    }
  }

  ngOnInit(): void {
    // Optional: Check if already logged in and redirect
    // Check if already logged in and redirect, but only in the browser
    if (isPlatformBrowser(this.platformId) && this.authService.getToken()) {
      this.router.navigate(['/products']);
    }    
  }

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

  initializeGoogleSignIn() {
    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (response: any) => this.ngZone.run(() => this.handleCredentialResponse(response)),
      // Optional: auto_select: true for One Tap on page load
    });

    // Optional: Render a button (instead of using the one-tap prompt)
    google.accounts.id.renderButton(
      document.getElementById('google-signin-button'),
      { theme: 'outline', size: 'large' } // Customization options
    );

    // Optional: Display the One Tap prompt
     //google.accounts.id.prompt(); 
  }

  handleCredentialResponse(response: any) {    
    const idToken = response.credential;
    this.googleJWT.idToken = idToken;
    this.authService.googleLogin(this.googleJWT).subscribe({
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
