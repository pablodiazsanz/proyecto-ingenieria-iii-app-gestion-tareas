package com.example.taskmanager.service;

import com.example.taskmanager.dto.task.TaskRequest;
import com.example.taskmanager.dto.task.TaskResponse;
import com.example.taskmanager.exception.ResourceNotFoundException;
import com.example.taskmanager.model.Task;
import com.example.taskmanager.model.TaskStatus;
import com.example.taskmanager.model.User;
import com.example.taskmanager.repository.TaskRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;

    @Transactional(readOnly = true)
    public List<TaskResponse> getTasksForUser(User user) {
        return taskRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(TaskResponse::fromEntity)
                .toList();
    }

    @Transactional
    public TaskResponse createTask(User user, TaskRequest request) {
        Task task = taskRepository.save(Task.builder()
                .title(request.title())
                .description(request.description())
                .dueDate(request.dueDate())
                .status(TaskStatus.PENDING)
                .user(user)
                .build());

        notificationService.createTaskNotification(user, task, "Tarea creada: " + task.getTitle());
        auditLogService.log(user, "CREATE_TASK", "TASK:" + task.getId());
        return TaskResponse.fromEntity(task);
    }

    @Transactional
    public TaskResponse updateTask(Long taskId, User user, TaskRequest request) {
        Task task = getOwnedTask(taskId, user);
        task.setTitle(request.title());
        task.setDescription(request.description());
        task.setDueDate(request.dueDate());
        task = taskRepository.save(task);
        notificationService.createTaskNotification(user, task, "Tarea actualizada: " + task.getTitle());
        auditLogService.log(user, "UPDATE_TASK", "TASK:" + task.getId());
        return TaskResponse.fromEntity(task);
    }

    @Transactional
    public void deleteTask(Long taskId, User user) {
        Task task = getOwnedTask(taskId, user);
        auditLogService.log(user, "DELETE_TASK", "TASK:" + task.getId());
        taskRepository.delete(task);
    }

    @Transactional
    public TaskResponse completeTask(Long taskId, User user) {
        Task task = getOwnedTask(taskId, user);
        task.setStatus(TaskStatus.COMPLETED);
        task = taskRepository.save(task);
        notificationService.createTaskNotification(user, task, "Tarea completada: " + task.getTitle());
        auditLogService.log(user, "COMPLETE_TASK", "TASK:" + task.getId());
        return TaskResponse.fromEntity(task);
    }

    private Task getOwnedTask(Long taskId, User user) {
        return taskRepository.findByIdAndUser(taskId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Tarea no encontrada"));
    }
}
