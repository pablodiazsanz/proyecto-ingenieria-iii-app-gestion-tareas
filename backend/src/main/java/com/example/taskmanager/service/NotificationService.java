package com.example.taskmanager.service;

import com.example.taskmanager.model.Notification;
import com.example.taskmanager.model.Task;
import com.example.taskmanager.model.User;
import com.example.taskmanager.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public void createTaskNotification(User user, Task task, String message) {
        notificationRepository.save(Notification.builder()
                .message(message)
                .read(false)
                .user(user)
                .task(task)
                .build());
    }
}
