package com.example.taskmanager.config;

import com.example.taskmanager.model.Role;
import com.example.taskmanager.model.Task;
import com.example.taskmanager.model.TaskStatus;
import com.example.taskmanager.model.User;
import com.example.taskmanager.repository.TaskRepository;
import com.example.taskmanager.repository.UserRepository;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.seed.enabled:false}")
    private boolean seedEnabled;

    @Override
    public void run(String... args) {
        if (!seedEnabled || userRepository.count() > 0) {
            return;
        }

        User demoUser = userRepository.save(User.builder()
                .username("demo")
                .email("demo@example.com")
                .passwordHash(passwordEncoder.encode("demo1234"))
                .role(Role.USER)
                .build());

        taskRepository.save(Task.builder()
                .title("Preparar entrega de Proyecto de Ingenieria III")
                .description("Revisar backend, frontend y docker-compose")
                .status(TaskStatus.PENDING)
                .dueDate(LocalDate.now().plusDays(7))
                .user(demoUser)
                .build());
    }
}
