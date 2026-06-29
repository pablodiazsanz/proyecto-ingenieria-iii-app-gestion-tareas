package com.example.taskmanager.service;

import com.example.taskmanager.model.AuditLog;
import com.example.taskmanager.model.User;
import com.example.taskmanager.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public void log(User user, String action, String resource) {
        auditLogRepository.save(AuditLog.builder()
                .user(user)
                .action(action)
                .resource(resource)
                .build());
    }
}
