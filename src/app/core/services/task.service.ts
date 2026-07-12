import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task, TaskPayload } from '../../shared/models';
import { ApiUrlService } from './api-url.service';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly http = inject(HttpClient);
  private readonly apiUrlService = inject(ApiUrlService);

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.getTasksUrl());
  }

  createTask(payload: TaskPayload): Observable<Task> {
    return this.http.post<Task>(this.getTasksUrl(), payload);
  }

  updateTask(id: number, payload: TaskPayload): Observable<Task> {
    return this.http.put<Task>(`${this.getTasksUrl()}/${id}`, payload);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.getTasksUrl()}/${id}`);
  }

  completeTask(id: number): Observable<Task> {
    return this.http.patch<Task>(`${this.getTasksUrl()}/${id}/complete`, {});
  }

  private getTasksUrl(): string {
    return `${this.apiUrlService.getBaseUrl()}/tasks`;
  }
}
