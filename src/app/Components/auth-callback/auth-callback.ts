import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/Auth/auth';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <p class="auth-eyebrow">VANTA/</p>
        <h1 class="auth-title">SIGNING IN...</h1>
        <p style="color: var(--muted-foreground); text-align: center;">Completing Google authentication.</p>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      background-color: var(--background);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .auth-card {
      width: 100%;
      max-width: 400px;
      border: 1px solid var(--border);
      padding: 2.5rem 2rem;
      background-color: var(--card);
      border-radius: var(--radius);
      text-align: center;
    }
    .auth-eyebrow {
      font-family: 'JetBrains Mono', monospace;
      font-size: 1.1rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      margin: 0 0 0.5rem;
      color: var(--foreground);
    }
    .auth-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 2rem;
      font-weight: 900;
      letter-spacing: -0.02em;
      margin: 0 0 1rem;
      color: var(--foreground);
    }
  `]
})
export class AuthCallback {

  authService = inject(AuthService);
  router = inject(Router);

  async ngOnInit() {
    try {
      const user = await this.authService.getGoogleUser();
      if (user) {
        const username = user.user_metadata?.['full_name'] || user.email || 'user';
        localStorage.setItem('username', username);
        this.router.navigate(['/home']);
      } else {
        this.router.navigate(['/login']);
      }
    } catch {
      this.router.navigate(['/login']);
    }
  }
}
