package com.reportapp.backend.repository;

import com.reportapp.backend.model.Reporte;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReporteRepository extends JpaRepository<Reporte, Long> {

    // Buscar por estado
    List<Reporte> findByEstado(String estado);

    // Buscar por categoría
    List<Reporte> findByCategoria(String categoria);

    // Buscar por barrio
    List<Reporte> findByBarrio(String barrio);

    // Buscar por categoría y estado
    List<Reporte> findByCategoriaAndEstado(String categoria, String estado);
}