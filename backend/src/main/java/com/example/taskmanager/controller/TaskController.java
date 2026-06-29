package com.example.taskmanager.controller;

import com.example.taskmanager.dto.task.TaskRequest;
import com.example.taskmanager.dto.task.TaskResponse;
import com.example.taskmanager.model.User;
import com.example.taskmanager.service.TaskService;
import com.example.taskmanager.service.UserService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;
    private final UserService userService;

    @GetMapping
    public List<TaskResponse> getTasks(Authentication authentication) {
        User user = userService.getByEmail(authentication.getName());
        return taskService.getTasksForUser(user);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TaskResponse createTask(Authentication authentication, @Valid @RequestBody TaskRequest request) {
        User user = userService.getByEmail(authentication.getName());
        return taskService.createTask(user, request);
    }

    @PutMapping("/{id}")
    public TaskResponse updateTask(Authentication authentication,
                                   @PathVariable Long id,
                                   @Valid @RequestBody TaskRequest request) {
        User user = userService.getByEmail(authentication.getName());
        return taskService.updateTask(id, user, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTask(Authentication authentication, @PathVariable Long id) {
        User user = userService.getByEmail(authentication.getName());
        taskService.deleteTask(id, user);
    }

    @PatchMapping("/{id}/complete")
    public TaskResponse completeTask(Authentication authentication, @PathVariable Long id) {
        User user = userService.getByEmail(authentication.getName());
        return taskService.completeTask(id, user);
    }
}
