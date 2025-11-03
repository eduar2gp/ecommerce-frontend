import { Component, signal, inject, ViewChild } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { AuthService } from './core/services/auth.service'; // 👈 Assuming path is correct
import { CommonModule } from '@angular/common'; // Needed for pipes/directives if not using built-in control flow
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  standalone: true,
  // Ensure RouterLink and RouterOutlet are imported
  imports: [RouterOutlet, RouterLink, CommonModule, MatIconModule, MatButtonModule, MatToolbarModule, MatSidenavModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Exchange');

  @ViewChild('sidenav') sidenav!: MatSidenav;

  // 💡 Inject the service and router
  public authService = inject(AuthService);
  private router = inject(Router);

  // State for the mobile menu
  public isMenuOpen = signal(false);

  /**
   * Handles the logout action, clearing the token and redirecting.
   */
  public handleLogout(): void {
    this.authService.logout();
    // Redirect to the login page after logging out
    this.router.navigate(['/login']);
    this.closeSidenav();
  }

  // Function to toggle the mobile menu
  toggleMenu() {
    this.isMenuOpen.update(value => !value);
  }

  public openSidenav(): void {
    this.sidenav.open();
  }

  public closeSidenav(): void {
    this.sidenav.close();
  }
}
