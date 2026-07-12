import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonText,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonContent,
    IonHeader,
    IonInput,
    IonItem,
    IonText,
    IonTitle,
    IonToolbar
  ],
  template: `
    <ion-header translucent="true">
      <ion-toolbar>
        <ion-title>Login</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true">
      <div class="auth-shell">
        <ion-card>
          <ion-card-header>
            <ion-card-subtitle>Proyecto de Ingeniería III</ion-card-subtitle>
            <ion-card-title>Task Manager Secure Mobile</ion-card-title>
          </ion-card-header>

          <ion-card-content>
            <form [formGroup]="form" (ngSubmit)="submit()" class="auth-form">
              <ion-item lines="full">
                <ion-input label="Email" labelPlacement="stacked" type="email" formControlName="email" placeholder="demo@example.com"></ion-input>
              </ion-item>

              <ion-item lines="full">
                <ion-input label="Contraseña" labelPlacement="stacked" type="password" formControlName="password" placeholder="demo1234"></ion-input>
              </ion-item>

              <ion-text color="danger" *ngIf="errorMessage()">
                <p class="message">{{ errorMessage() }}</p>
              </ion-text>

              <ion-button expand="block" type="submit" [disabled]="form.invalid || loading()">
                {{ loading() ? 'Entrando...' : 'Iniciar sesión' }}
              </ion-button>

              <ion-button expand="block" fill="clear" routerLink="/register">
                Crear cuenta
              </ion-button>
            </form>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  `,
  styles: [`
    .auth-shell {
      min-height: 100%;
      display: grid;
      align-items: center;
      padding: 1rem;
      background:
        radial-gradient(circle at top, rgba(21, 94, 117, 0.14), transparent 28%),
        linear-gradient(180deg, #f6f1e7 0%, #dde8ea 100%);
    }

    ion-card {
      border-radius: 24px;
      box-shadow: 0 24px 80px rgba(23, 49, 62, 0.16);
    }

    .auth-form {
      display: grid;
      gap: 1rem;
    }

    .message {
      margin: 0.25rem 0 0;
    }
  `]
})
export class LoginPageComponent {
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
