import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="auth-card">
      <div class="intro">
        <span class="eyebrow">Proyecto de Ingeniería III</span>
        <h1>Accede a tu gestor de tareas seguro</h1>
        <p>Inicia sesión con JWT y gestiona solo tus propias tareas.</p>
      </div>

      <form [formGroup]="form" (ngSubmit)="submit()" class="form">
        <label>
          <span>Email</span>
          <input type="email" formControlName="email" placeholder="usuario@correo.com">
        </label>

        <label>
          <span>Contraseña</span>
          <input type="password" formControlName="password" placeholder="******">
        </label>

        <p class="error" *ngIf="errorMessage()">{{ errorMessage() }}</p>

        <button type="submit" [disabled]="form.invalid || loading()">
          {{ loading() ? 'Entrando...' : 'Iniciar sesión' }}
        </button>
      </form>

      <p class="switch">
        ¿No tienes cuenta?
        <a routerLink="/register">Crear cuenta</a>
      </p>
    </section>
  `,
  styles: [`
    .auth-card {
      max-width: 460px;
      margin: 3rem auto;
      padding: 2rem;
      border-radius: 24px;
      background: rgba(255, 255, 255, 0.85);
      box-shadow: 0 24px 80px rgba(23, 49, 62, 0.15);
    }

    .intro h1 {
      margin: 0.25rem 0 0.75rem;
      font-size: clamp(2rem, 5vw, 2.6rem);
      line-height: 1.05;
    }

    .eyebrow {
      color: #0f766e;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-size: 0.78rem;
    }

    .form {
      display: grid;
      gap: 1rem;
      margin-top: 1.5rem;
    }

    label {
      display: grid;
      gap: 0.45rem;
      font-weight: 600;
    }

    input {
      border: 1px solid rgba(23, 49, 62, 0.16);
      border-radius: 14px;
      padding: 0.85rem 1rem;
      font: inherit;
      background: #fcfcfb;
    }

    button {
      border: 0;
      border-radius: 14px;
      padding: 0.95rem 1rem;
      background: linear-gradient(135deg, #0f766e, #155e75);
      color: white;
      font-weight: 700;
      cursor: pointer;
    }

    button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .error {
      margin: 0;
      color: #b42318;
      font-size: 0.95rem;
    }

    .switch {
      margin-top: 1.25rem;
      text-align: center;
    }
  `]
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly errorMessage = signal('');

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    this.authService.login(this.form.getRawValue()).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/tasks']);
      },
      error: (error) => {
        this.loading.set(false);
        this.errorMessage.set(error.error?.message ?? 'No se pudo iniciar sesión');
      }
    });
  }
}
