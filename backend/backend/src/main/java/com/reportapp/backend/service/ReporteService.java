package com.reportapp.backend.service;

import com.reportapp.backend.model.Reporte;
import com.reportapp.backend.repository.ReporteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ReporteService {

    @Autowired
    private ReporteRepository reporteRepository;

    // Obtener todos
    public List<Reporte> getAll() {
        return reporteRepository.findAll();
    }

    // Obtener por ID
    public Optional<Reporte> getById(Long id) {
        return reporteRepository.findById(id);
    }

    // Obtener por estado
    public List<Reporte> getByEstado(String estado) {
        return reporteRepository.findByEstado(estado);
    }

    // Obtener por categoría
    public List<Reporte> getByCategoria(String categoria) {
        return reporteRepository.findByCategoria(categoria);
    }

    // Crear nuevo reporte
    public Reporte crear(Reporte reporte) {
        reporte.setEstado("pendiente");
        reporte.setVistas(0);
        reporte.setApoyos(0);
        reporte.setFechaReporte(LocalDateTime.now());
        reporte.setFechaActualizacion(LocalDateTime.now());
        return reporteRepository.save(reporte);
    }

    // Actualizar estado
    public Optional<Reporte> actualizarEstado(Long id, String nuevoEstado) {
        return reporteRepository.findById(id).map(reporte -> {
            reporte.setEstado(nuevoEstado);
            reporte.setFechaActualizacion(LocalDateTime.now());
            return reporteRepository.save(reporte);
        });
    }

    // Sumar un apoyo
    public Optional<Reporte> apoyar(Long id) {
        return reporteRepository.findById(id).map(reporte -> {
            reporte.setApoyos(reporte.getApoyos() + 1);
            return reporteRepository.save(reporte);
        });
    }

    // Sumar una vista
    public Optional<Reporte> registrarVista(Long id) {
        return reporteRepository.findById(id).map(reporte -> {
            reporte.setVistas(reporte.getVistas() + 1);
            return reporteRepository.save(reporte);
        });
    }

    // Eliminar
    public boolean eliminar(Long id) {
        if (reporteRepository.existsById(id)) {
            reporteRepository.deleteById(id);
            return true;
        }
        return false;
    }
}