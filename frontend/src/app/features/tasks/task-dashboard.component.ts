import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { TaskService } from '../../core/services/task.service';
import { Task } from '../../shared/models';

@Component({
  selector: 'app-task-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="dashboard">
      <div class="hero">
        <div>
          <span class="eyebrow">Gestor de tareas seguro</span>
          <h1>Panel principal</h1>
          <p>Solo ves las tareas asociadas a tu JWT. Puedes crear, editar, completar y eliminar tareas.</p>
        </div>
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
      </div>

      <div class="layout">
        <article class="panel form-panel">
          <h2>{{ editingTaskId() ? 'Editar tarea' : 'Crear tarea' }}</h2>
          <form [formGroup]="taskForm" (ngSubmit)="saveTask()" class="task-form">
            <label>
              <span>Título</span>
              <input type="text" formControlName="title" placeholder="Preparar informe final">
            </label>

            <label>
              <span>Descripción</span>
              <textarea rows="4" formControlName="description" placeholder="Describe la tarea"></textarea>
            </label>

            <label>
              <span>Fecha límite</span>
              <input type="date" formControlName="dueDate">
            </label>

            <p class="error" *ngIf="errorMessage()">{{ errorMessage() }}</p>

            <div class="actions">
              <button type="submit" [disabled]="taskForm.invalid || loading()">
                {{ loading() ? 'Guardando...' : (editingTaskId() ? 'Actualizar tarea' : 'Crear tarea') }}
              </button>
              <button type="button" class="secondary" *ngIf="editingTaskId()" (click)="cancelEdit()">
                Cancelar edición
              </button>
            </div>
          </form>
        </article>

        <article class="panel list-panel">
          <div class="list-header">
            <h2>Mis tareas</h2>
            <span>{{ authService.currentUser()?.username }}</span>
          </div>

          <p class="empty" *ngIf="!tasks().length && !loading()">Todavía no hay tareas registradas.</p>

          <div class="task-list">
            <article class="task-card" *ngFor="let task of tasks()">
              <div class="task-card__top">
                <div>
                  <h3>{{ task.title }}</h3>
                  <p>{{ task.description || 'Sin descripción' }}</p>
                </div>
                <span class="badge" [class.completed]="task.status === 'COMPLETED'">
                  {{ task.status === 'COMPLETED' ? 'Completada' : 'Pendiente' }}
                </span>
              </div>

              <div class="meta">
                <span>Entrega: {{ task.dueDate || 'Sin fecha' }}</span>
                <span>Actualizada: {{ task.updatedAt | date:'short' }}</span>
              </div>

              <div class="task-actions">
                <button type="button" class="secondary" (click)="startEdit(task)">Editar</button>
                <button type="button" class="accent" (click)="markComplete(task)" [disabled]="task.status === 'COMPLETED'">
                  Completar
                </button>
                <button type="button" class="danger" (click)="deleteTask(task.id)">Eliminar</button>
              </div>
            </article>
          </div>
        </article>
      </div>
    </section>
  `,
  styles: [`
    .dashboard {
      display: grid;
      gap: 1.5rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .hero {
      display: grid;
      grid-template-columns: 1.8fr 1fr;
      gap: 1rem;
      align-items: end;
      padding: 1.75rem;
      border-radius: 28px;
      background: rgba(255, 255, 255, 0.74);
      box-shadow: 0 24px 90px rgba(23, 49, 62, 0.12);
    }

    .hero h1 {
      margin: 0.35rem 0 0.7rem;
      font-size: clamp(2rem, 5vw, 3.2rem);
      line-height: 1;
    }

    .eyebrow {
      color: #0f766e;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-size: 0.78rem;
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.75rem;
    }

    .stats div {
      padding: 1rem;
      border-radius: 18px;
      background: linear-gradient(180deg, #17313e, #245267);
      color: white;
      text-align: center;
    }

    .stats strong {
      display: block;
      font-size: 1.8rem;
    }

    .layout {
      display: grid;
      grid-template-columns: 360px 1fr;
      gap: 1.5rem;
    }

    .panel {
      background: rgba(255, 255, 255, 0.82);
      border-radius: 24px;
      padding: 1.5rem;
      box-shadow: 0 24px 90px rgba(23, 49, 62, 0.1);
    }

    .task-form,
    label {
      display: grid;
      gap: 0.8rem;
    }

    input,
    textarea {
      width: 100%;
      box-sizing: border-box;
      border: 1px solid rgba(23, 49, 62, 0.14);
      border-radius: 14px;
      padding: 0.85rem 1rem;
      font: inherit;
      background: #fcfcfb;
    }

    .actions,
    .task-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }

    button {
      border: 0;
      border-radius: 14px;
      padding: 0.85rem 1rem;
      color: white;
      background: #17313e;
      font-weight: 700;
      cursor: pointer;
    }

    button.secondary {
      background: #d6e4ea;
      color: #17313e;
    }

    button.accent {
      background: #0f766e;
    }

    button.danger {
      background: #b42318;
    }

    button:disabled {
      opacity: 0.65;
      cursor: not-allowed;
    }

    .list-header,
    .task-card__top,
    .meta {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
    }

    .task-list {
      display: grid;
      gap: 1rem;
      margin-top: 1rem;
    }

    .task-card {
      padding: 1.1rem;
      border-radius: 18px;
      background: linear-gradient(180deg, rgba(250, 248, 244, 0.95), rgba(238, 244, 241, 0.95));
      border: 1px solid rgba(23, 49, 62, 0.08);
    }

    .task-card h3 {
      margin: 0 0 0.35rem;
    }

    .task-card p,
    .meta,
    .empty {
      color: #52606d;
    }

    .badge {
      align-self: start;
      padding: 0.4rem 0.7rem;
      border-radius: 999px;
      background: #f59e0b;
      color: white;
      font-size: 0.85rem;
      font-weight: 700;
    }

    .badge.completed {
      background: #0f766e;
    }

    .error {
      margin: 0;
      color: #b42318;
    }

    @media (max-width: 960px) {
      .hero,
      .layout {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class TaskDashboardComponent implements OnInit {
  protected readonly authService = inject(AuthService);
  private readonly taskService = inject(TaskService);
  private readonly fb = inject(FormBuilder);

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
    const rawValue = this.taskForm.getRawValue();
    const payload = {
      title: rawValue.title,
      description: rawValue.description,
      dueDate: rawValue.dueDate || null
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
    if (task.status === 'COMPLETED') {
      return;
    }

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
}
