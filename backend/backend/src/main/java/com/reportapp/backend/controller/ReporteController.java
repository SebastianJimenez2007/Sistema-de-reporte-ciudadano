package com.reportapp.backend.controller;

import com.reportapp.backend.model.Reporte;
import com.reportapp.backend.repository.ReporteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/reportes")
@CrossOrigin(origins = "*")
public class ReporteController {

    @Autowired
    private ReporteRepository reporteRepository;

    @GetMapping
    public List<Reporte> obtenerTodos() {
        return reporteRepository.findAll();
    }

    @PostMapping
    public Reporte crearReporte(@RequestBody Reporte reporte) {
        reporte.setFechaCreacion(LocalDateTime.now());
        reporte.setVistas(0);
        reporte.setApoyo(0);
        reporte.setEstado("Pendiente");
        return reporteRepository.save(reporte);
    }
    @PostMapping("/{id}/apoyar")
    public Reporte apoyarReporte(@PathVariable Integer id) {
        Reporte reporte = reporteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reporte no encontrado con id: " + id));
        reporte.setApoyo(reporte.getApoyo() + 1);
        return reporteRepository.save(reporte);
    }
    @GetMapping("/{id}")
    public Reporte obtenerPorId(@PathVariable Integer id) {
        return reporteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reporte no encontrado con id: " + id));
    }
}