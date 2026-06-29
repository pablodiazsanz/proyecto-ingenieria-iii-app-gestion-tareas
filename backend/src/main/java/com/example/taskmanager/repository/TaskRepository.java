package com.example.taskmanager.repository;

import com.example.taskmanager.model.Task;
import com.example.taskmanager.model.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByUserOrderByCreatedAtDesc(User user);

    Optional<Task> findByIdAndUser(Long id, User user);
}
