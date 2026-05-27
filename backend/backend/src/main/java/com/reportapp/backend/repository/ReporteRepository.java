package com.reportapp.backend.repository;

import com.reportapp.backend.model.Reporte;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Map;

@Repository
public interface ReporteRepository extends JpaRepository<Reporte, Integer> {

    @Query("SELECT COUNT(r) FROM Reporte r WHERE r.estado = :estado")
    long countByEstado(@Param("estado") String estado);

    @Query("SELECT COUNT(r) FROM Reporte r WHERE r.categoria.idCategoria = :idCategoria")
    long countByCategoriaId(@Param("idCategoria") Integer idCategoria);

    // COMENTADO TEMPORALMENTE - CAUSA ERROR
    // @Query(value = "SELECT AVG(DATEDIFF(r.fecha_cierre, r.fecha_creacion)) FROM reporte r WHERE r.fecha_cierre IS NOT NULL", nativeQuery = true)
    // Double avgTiempoResolucion();

    @Query("SELECT r.barrio as barrio, COUNT(r) as total, SUM(CASE WHEN r.estado != 'resuelto' THEN 1 ELSE 0 END) as sinResolver FROM Reporte r WHERE r.barrio IS NOT NULL GROUP BY r.barrio")
    List<Map<String, Object>> getEstadisticasPorBarrio();
}