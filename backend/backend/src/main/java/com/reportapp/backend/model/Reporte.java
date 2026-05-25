package com.reportapp.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "reportes")
public class Reporte {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String titulo;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String descripcion;

    @Column(length = 300)
    private String direccion;

    @Column(nullable = false)
    private Double latitud;

    @Column(nullable = false)
    private Double longitud;

    @Column(length = 100)
    private String barrio;

    @Column(length = 100)
    private String categoria;

    @Column(length = 20)
    private String estado = "pendiente"; // pendiente, activo, resuelto

    @Column(length = 500)
    private String imagenUrl;

    private Integer vistas = 0;
    private Integer apoyos = 0;

    @Column(name = "fecha_reporte")
    private LocalDateTime fechaReporte = LocalDateTime.now();

    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion = LocalDateTime.now();
}