import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { AuthService } from './core/services/auth.service'; // 👈 Assuming path is correct
import { CommonModule } from '@angular/common'; // Needed for pipes/directives if not using built-in control flow

@Component({
  selector: 'app-root',
  standalone: true,
  // Ensure RouterLink and RouterOutlet are imported
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ecommerce-frontend');

  // 💡 Inject the service and router
  public authService = inject(AuthService);
  private router = inject(Router);

  /**
   * Handles the logout action, clearing the token and redirecting.
   */
  public handleLogout(): void {
    this.authService.logout();
    // Redirect to the login page after logging out
    this.router.navigate(['/login']);
  }
}
