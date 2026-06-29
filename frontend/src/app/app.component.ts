import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="shell">
      <header class="topbar">
        <a routerLink="/tasks" class="brand">Task Manager Secure</a>
        <nav class="nav">
          <a routerLink="/login" routerLinkActive="active" *ngIf="!authService.isAuthenticated()">Login</a>
          <a routerLink="/register" routerLinkActive="active" *ngIf="!authService.isAuthenticated()">Registro</a>
          <button type="button" class="logout" *ngIf="authService.isAuthenticated()" (click)="logout()">
            Cerrar sesión
          </button>
        </nav>
      </header>
      <main class="content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background:
        radial-gradient(circle at top left, rgba(255, 212, 163, 0.65), transparent 28%),
        linear-gradient(135deg, #f6f1e8 0%, #dce7df 55%, #bfd6d2 100%);
      color: #1f2933;
      font-family: "Segoe UI", sans-serif;
    }

    .shell {
      min-height: 100vh;
    }

    .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 1.5rem;
      backdrop-filter: blur(10px);
      background: rgba(255, 255, 255, 0.72);
      border-bottom: 1px solid rgba(31, 41, 51, 0.08);
      position: sticky;
      top: 0;
      z-index: 10;
    }

    .brand {
      font-size: 1.15rem;
      font-weight: 700;
      color: #17313e;
      text-decoration: none;
      letter-spacing: 0.02em;
    }

    .nav {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .nav a,
    .logout {
      border: 0;
      background: transparent;
      color: #17313e;
      text-decoration: none;
      font-weight: 600;
      cursor: pointer;
    }

    .nav a.active {
      color: #0f766e;
    }

    .content {
      padding: 1.5rem;
    }
  `]
})
export class AppComponent {
  protected readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
