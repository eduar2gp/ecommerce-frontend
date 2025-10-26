import { Injectable, inject, PLATFORM_ID, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, tap } from 'rxjs';
import { environment } from '@env/environment';

// Define interfaces for clarity
interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  jwtToken: string; // Assuming the JWT is returned in a 'token' field
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);  
  
  private LOGIN_ENDPOINT = '/api/v1/auth/login';

  private fullUrl = `${environment.baseApiUrl}${this.LOGIN_ENDPOINT}`;

  private readonly TOKEN_KEY = 'authToken';

  // 💡 New: Signal to track authentication status
  public isAuthenticated = signal(false);
  private currentToken = signal<string | null>(null);
  

  constructor() {
    // 💡 Initialize status on service creation (runs once)
    this.isAuthenticated.set(!!this.getToken());
  }

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.fullUrl, credentials).pipe(
      tap(response => {
        this.storeToken(response.jwtToken);        
      })
    );
  }

  // --- Utility Methods (Platform-protected) ---

  private storeToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      console.log(`saving token ${token}`)
      localStorage.setItem(this.TOKEN_KEY, token);
      this.currentToken.set(token);
      this.isAuthenticated.set(true);
    }
  }

  getToken(): string | null {
    const tokenFromSignal = this.currentToken();

    if (tokenFromSignal) {
      return tokenFromSignal;
    }

    // FINAL FIX: Fallback check on localStorage if the signal is empty
    if (isPlatformBrowser(this.platformId)) {
      // localStorage.getItem returns string or null
      const tokenFromStorage = localStorage.getItem(this.TOKEN_KEY);

      // 💡 DEBUG: Log the presence of the token from storage
      console.log(`token form storage: ${tokenFromStorage}`);

      // Update the signal for next time, but return the token now
      if (tokenFromStorage) {
        this.currentToken.set(tokenFromStorage);
        this.isAuthenticated.set(true);
      }
      // Return null or the string value directly
      return tokenFromStorage;
    }

    // Return null if not in browser and signal is empty
    return null;
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.TOKEN_KEY);
      this.currentToken.set(null);
      this.isAuthenticated.set(false);
    }  
  }
}
