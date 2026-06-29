import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="auth-card">
      <div class="intro">
        <span class="eyebrow">Nuevo usuario</span>
        <h1>Crea tu cuenta</h1>
        <p>El backend almacenará la contraseña con BCrypt y te devolverá un JWT al registrarte.</p>
      </div>

      <form [formGroup]="form" (ngSubmit)="submit()" class="form">
        <label>
          <span>Username</span>
          <input type="text" formControlName="username" placeholder="pablo_dev">
        </label>

        <label>
          <span>Email</span>
          <input type="email" formControlName="email" placeholder="usuario@correo.com">
        </label>

        <label>
          <span>Contraseña</span>
          <input type="password" formControlName="password" placeholder="Mínimo 6 caracteres">
        </label>

        <p class="error" *ngIf="errorMessage()">{{ errorMessage() }}</p>

        <button type="submit" [disabled]="form.invalid || loading()">
          {{ loading() ? 'Creando...' : 'Registrarse' }}
        </button>
      </form>

      <p class="switch">
        ¿Ya tienes cuenta?
        <a routerLink="/login">Ir al login</a>
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
      color: #c2410c;
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
      background: linear-gradient(135deg, #c2410c, #ea580c);
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
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly errorMessage = signal('');

  readonly form = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    this.authService.register(this.form.getRawValue()).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/tasks']);
      },
      error: (error) => {
        this.loading.set(false);
        this.errorMessage.set(error.error?.message ?? 'No se pudo crear la cuenta');
      }
    });
  }
}
