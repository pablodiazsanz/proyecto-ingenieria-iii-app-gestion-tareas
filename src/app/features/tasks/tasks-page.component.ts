import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonBadge,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonText,
  IonTextarea,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import { AuthService } from '../../core/services/auth.service';
import { TaskService } from '../../core/services/task.service';
import { Task } from '../../shared/models';

@Component({
  selector: 'app-tasks-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonBadge,
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonContent,
    IonHeader,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonNote,
    IonText,
    IonTextarea,
    IonTitle,
    IonToolbar
  ],
  template: `
    <ion-header translucent="true">
      <ion-toolbar>
        <ion-title>Mis tareas</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="logout()">Salir</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true">
      <div class="page-shell">
        <ion-card class="hero-card">
          <ion-card-content>
            <p class="eyebrow">Gestor seguro</p>
            <h1>{{ authService.currentUser()?.username }}</h1>
            <p class="subtitle">Usa el mismo backend JWT del proyecto web para gestionar tus tareas desde móvil.</p>
            <div class="stats">
              <div>
                <strong>{{ tasks().length }}</strong>
                <span>Total</span>
              </div>
              <div>
                <strong>{{ completedCount() }}</strong>
                <span>Completadas</span>
              </div>
            </div>
          </ion-card-content>
        </ion-card>

        <ion-card>
          <ion-card-content>
            <form [formGroup]="taskForm" (ngSubmit)="saveTask()" class="task-form">
              <h2>{{ editingTaskId() ? 'Editar tarea' : 'Crear tarea' }}</h2>

              <ion-item lines="full">
                <ion-input label="Título" labelPlacement="stacked" formControlName="title" placeholder="Preparar memoria final"></ion-input>
              </ion-item>

              <ion-item lines="full">
                <ion-textarea label="Descripción" labelPlacement="stacked" formControlName="description" placeholder="Describe la tarea"></ion-textarea>
              </ion-item>

              <ion-item lines="full">
                <ion-input label="Fecha límite" labelPlacement="stacked" type="date" formControlName="dueDate"></ion-input>
              </ion-item>

              <ion-text color="danger" *ngIf="errorMessage()">
                <p class="message">{{ errorMessage() }}</p>
              </ion-text>

              <div class="actions">
                <ion-button expand="block" type="submit" [disabled]="taskForm.invalid || loading()">
                  {{ loading() ? 'Guardando...' : (editingTaskId() ? 'Actualizar tarea' : 'Crear tarea') }}
                </ion-button>
                <ion-button expand="block" fill="outline" color="medium" *ngIf="editingTaskId()" (click)="cancelEdit()" type="button">
                  Cancelar edición
                </ion-button>
              </div>
            </form>
          </ion-card-content>
        </ion-card>

        <ion-list lines="none" *ngIf="tasks().length; else emptyState">
          <ion-card *ngFor="let task of tasks()" class="task-card">
            <ion-card-content>
              <div class="task-top">
                <div>
                  <h3>{{ task.title }}</h3>
                  <p>{{ task.description || 'Sin descripción' }}</p>
                </div>
                <ion-badge [color]="task.status === 'COMPLETED' ? 'success' : 'warning'">
                  {{ task.status === 'COMPLETED' ? 'Completada' : 'Pendiente' }}
                </ion-badge>
              </div>

              <div class="meta">
                <ion-note>Entrega: {{ task.dueDate || 'Sin fecha' }}</ion-note>
                <ion-note>Actualizada: {{ task.updatedAt | date:'short' }}</ion-note>
              </div>

              <div class="actions compact">
                <ion-button size="small" fill="outline" (click)="startEdit(task)">Editar</ion-button>
                <ion-button size="small" color="success" (click)="markComplete(task)" [disabled]="task.status === 'COMPLETED'">Completar</ion-button>
                <ion-button size="small" color="danger" (click)="deleteTask(task.id)">Eliminar</ion-button>
              </div>
            </ion-card-content>
          </ion-card>
        </ion-list>

        <ng-template #emptyState>
          <ion-card>
            <ion-card-content>
              <p class="empty">Todavía no hay tareas. Crea la primera desde el formulario superior.</p>
            </ion-card-content>
          </ion-card>
        </ng-template>
      </div>
    </ion-content>
  `,
  styles: [`
    .page-shell {
      padding: 1rem;
      display: grid;
      gap: 1rem;
      background:
        radial-gradient(circle at top, rgba(15, 118, 110, 0.1), transparent 24%),
        linear-gradient(180deg, #f5f0e7 0%, #e2edf0 100%);
      min-height: 100%;
    }

    .hero-card,
    ion-card {
      border-radius: 24px;
      box-shadow: 0 18px 54px rgba(23, 49, 62, 0.12);
    }

    .eyebrow {
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #0f766e;
      font-weight: 700;
      font-size: 0.76rem;
    }

    h1,
    h2,
    h3 {
      margin: 0;
      color: #17313e;
    }

    .subtitle,
    .empty,
    .task-top p {
      color: #52606d;
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.75rem;
      margin-top: 1rem;
    }

    .stats div {
      background: linear-gradient(180deg, #17313e, #245267);
      color: white;
      border-radius: 18px;
      padding: 0.9rem;
      text-align: center;
    }

    .stats strong {
      display: block;
      font-size: 1.5rem;
    }

    .task-form,
    .actions {
      display: grid;
      gap: 0.9rem;
    }

    .task-card {
      margin: 0;
    }

    .task-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1rem;
    }

    .meta {
      display: grid;
      gap: 0.25rem;
      margin: 0.8rem 0;
    }

    .compact {
      grid-template-columns: repeat(3, 1fr);
    }

    .message {
      margin: 0;
    }
  `]
})
export class TasksPageComponent implements OnInit {
  protected readonly authService = inject(AuthService);
  private readonly taskService = inject(TaskService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  readonly tasks = signal<Task[]>([]);
  readonly loading = signal(false);
  readonly errorMessage = signal('');
  readonly editingTaskId = signal<number | null>(null);
  readonly completedCount = computed(() => this.tasks().filter((task) => task.status === 'COMPLETED').length);

  readonly taskForm = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(120)]],
    description: ['', [Validators.maxLength(500)]],
    dueDate: ['']
  });

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.loading.set(true);
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks.set(tasks);
        this.loading.set(false);
      },
      error: (error) => {
        this.loading.set(false);
        this.errorMessage.set(error.error?.message ?? 'No se pudieron cargar las tareas');
      }
    });
  }

  saveTask(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    const raw = this.taskForm.getRawValue();
    const payload = {
      title: raw.title,
      description: raw.description,
      dueDate: raw.dueDate || null
    };

    const request$ = this.editingTaskId()
      ? this.taskService.updateTask(this.editingTaskId() as number, payload)
      : this.taskService.createTask(payload);

    request$.subscribe({
      next: () => {
        this.loading.set(false);
        this.cancelEdit();
        this.loadTasks();
      },
      error: (error) => {
        this.loading.set(false);
        this.errorMessage.set(error.error?.message ?? 'No se pudo guardar la tarea');
      }
    });
  }

  startEdit(task: Task): void {
    this.editingTaskId.set(task.id);
    this.taskForm.patchValue({
      title: task.title,
      description: task.description ?? '',
      dueDate: task.dueDate ?? ''
    });
  }

  cancelEdit(): void {
    this.editingTaskId.set(null);
    this.taskForm.reset({
      title: '',
      description: '',
      dueDate: ''
    });
  }

  markComplete(task: Task): void {
    this.loading.set(true);
    this.taskService.completeTask(task.id).subscribe({
      next: () => {
        this.loading.set(false);
        this.loadTasks();
      },
      error: (error) => {
        this.loading.set(false);
        this.errorMessage.set(error.error?.message ?? 'No se pudo completar la tarea');
      }
    });
  }

  deleteTask(id: number): void {
    this.loading.set(true);
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.loading.set(false);
        if (this.editingTaskId() === id) {
          this.cancelEdit();
        }
        this.loadTasks();
      },
      error: (error) => {
        this.loading.set(false);
        this.errorMessage.set(error.error?.message ?? 'No se pudo eliminar la tarea');
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
