package com.example.taskmanager.dto.task;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record TaskRequest(
        @NotBlank(message = "El titulo es obligatorio")
        @Size(max = 120, message = "El titulo no puede superar 120 caracteres")
        String title,
        @Size(max = 500, message = "La descripcion no puede superar 500 caracteres")
        String description,
        LocalDate dueDate
) {
}
