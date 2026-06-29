import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task, TaskPayload } from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8081/api/tasks';

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  createTask(payload: TaskPayload): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, payload);
  }

  updateTask(id: number, payload: TaskPayload): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, payload);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  completeTask(id: number): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/${id}/complete`, {});
  }
}
