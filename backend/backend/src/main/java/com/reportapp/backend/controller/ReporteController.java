package com.reportapp.backend.controller;

import com.reportapp.backend.model.Reporte;
import com.reportapp.backend.repository.ReporteRepository;
import com.reportapp.backend.repository.CategoriaRepository;
import com.reportapp.backend.model.Categoria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/reportes")
@CrossOrigin(origins = "*")
public class ReporteController {

    @Autowired
    private ReporteRepository reporteRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    // ===== LISTAR TODOS =====
    @GetMapping
    public List<Reporte> obtenerTodos() {
        return reporteRepository.findAll();
    }

    // ===== ENDPOINTS DE TRANSPARENCIA (ESPECÍFICOS - VAN PRIMERO) =====

    @GetMapping("/estadisticas")
    public Map<String, Object> obtenerEstadisticas() {
        Map<String, Object> stats = new HashMap<>();

        long totalReportes = reporteRepository.count();
        long reportesResueltos = reporteRepository.countByEstado("resuelto");
        long reportesPendientes = reporteRepository.countByEstado("pendiente");
        long reportesActivos = reporteRepository.countByEstado("activo");
        // Double tiempoPromedio = reporteRepository.avgTiempoResolucion(); // COMENTADO - CAUSA ERROR
        Double tiempoPromedio = 0.0; // VALOR TEMPORAL

        stats.put("total", totalReportes);
        stats.put("resueltos", reportesResueltos);
        stats.put("pendientes", reportesPendientes);
        stats.put("activos", reportesActivos);
        stats.put("tiempoPromedio", tiempoPromedio != null ? Math.round(tiempoPromedio) : 0);
        stats.put("tasaResolucion", totalReportes > 0 ? (reportesResueltos * 100 / totalReportes) : 0);

        return stats;
    }

    @GetMapping("/estadisticas/categorias")
    public List<Map<String, Object>> obtenerEstadisticasPorCategoria() {
        List<Map<String, Object>> resultados = new ArrayList<>();
        List<Categoria> categorias = categoriaRepository.findAll();

        for (Categoria cat : categorias) {
            Map<String, Object> item = new HashMap<>();
            item.put("nombre", cat.getNombre());
            item.put("total", reporteRepository.countByCategoriaId(cat.getIdCategoria()));
            resultados.add(item);
        }
        return resultados;
    }

    @GetMapping("/estadisticas/barrios")
    public List<Map<String, Object>> obtenerEstadisticasPorBarrio() {
        return reporteRepository.getEstadisticasPorBarrio();
    }

    // ===== ENDPOINTS CON PARÁMETRO (VAN DESPUÉS) =====

    @GetMapping("/{id}")
    public Reporte obtenerPorId(@PathVariable Integer id) {
        return reporteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reporte no encontrado con id: " + id));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Reporte crearReporteConImagen(
            @RequestPart("reporte") Reporte reporte,
            @RequestPart(value = "imagen", required = false) MultipartFile imagen) {

        if (imagen != null && !imagen.isEmpty()) {
            try {
                String fileName = System.currentTimeMillis() + "_" + imagen.getOriginalFilename();
                String uploadDir = "uploads/";
                File directory = new File(uploadDir);
                if (!directory.exists()) directory.mkdirs();

                Path filePath = Paths.get(uploadDir + fileName);
                Files.write(filePath, imagen.getBytes());

                reporte.setImagenUrl("/uploads/" + fileName);
                System.out.println("Imagen guardada en: " + filePath.toString());
            } catch (IOException e) {
                throw new RuntimeException("Error guardando imagen: " + e.getMessage(), e);
            }
        }

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
}