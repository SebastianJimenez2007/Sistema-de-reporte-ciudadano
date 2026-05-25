package com.reportapp.backend.controller;

import com.reportapp.backend.model.Reporte;
import com.reportapp.backend.service.ReporteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reportes")
@CrossOrigin(origins = "*") // permite peticiones desde tu frontend
public class ReporteController {

    @Autowired
    private ReporteService reporteService;

    // GET /api/reportes → todos los reportes
    @GetMapping
    public List<Reporte> getAll() {
        return reporteService.getAll();
    }

    // GET /api/reportes/1 → un reporte por ID
    @GetMapping("/{id}")
    public ResponseEntity<Reporte> getById(@PathVariable Long id) {
        return reporteService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET /api/reportes?estado=pendiente → filtrar por estado
    @GetMapping(params = "estado")
    public List<Reporte> getByEstado(@RequestParam String estado) {
        return reporteService.getByEstado(estado);
    }

    // GET /api/reportes?categoria=Vías → filtrar por categoría
    @GetMapping(params = "categoria")
    public List<Reporte> getByCategoria(@RequestParam String categoria) {
        return reporteService.getByCategoria(categoria);
    }

    // POST /api/reportes → crear nuevo reporte
    @PostMapping
    public ResponseEntity<Reporte> crear(@RequestBody Reporte reporte) {
        Reporte nuevo = reporteService.crear(reporte);
        return ResponseEntity.ok(nuevo);
    }

    // PUT /api/reportes/1/estado → cambiar estado (para la alcaldía)
    @PutMapping("/{id}/estado")
    public ResponseEntity<Reporte> actualizarEstado(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String nuevoEstado = body.get("estado");
        return reporteService.actualizarEstado(id, nuevoEstado)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST /api/reportes/1/apoyar → sumar un apoyo
    @PostMapping("/{id}/apoyar")
    public ResponseEntity<Reporte> apoyar(@PathVariable Long id) {
        return reporteService.apoyar(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE /api/reportes/1 → eliminar (solo admin)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (reporteService.eliminar(id)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
