package com.reportapp.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class LogService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void registrarLog(Long idUsuario, String accion, String detalle) {
        try {
            String sql = "INSERT INTO log (id_usuario, id_registro, accion, detalle, fecha) VALUES (?, ?, ?, ?, ?)";
            jdbcTemplate.update(sql,
                    idUsuario,
                    null, // id_registro puede ser null si no está asociado a un registro específico
                    accion,
                    detalle,
                    LocalDateTime.now()
            );
        } catch (Exception e) {
            System.err.println("Error al registrar log: " + e.getMessage());
        }
    }

    public void registrarLogConEntidad(Long idUsuario, Long idEntidad, String accion, String detalle) {
        try {
            String sql = "INSERT INTO log (id_usuario, entidad, id_registro, accion, detalle, fecha) VALUES (?, ?, ?, ?, ?, ?)";
            jdbcTemplate.update(sql,
                    idUsuario,
                    idEntidad,
                    null,
                    accion,
                    detalle,
                    LocalDateTime.now()
            );
        } catch (Exception e) {
            System.err.println("Error al registrar log: " + e.getMessage());
        }
    }

    public void registrarLogConRegistro(Long idUsuario, Long idRegistro, String accion, String detalle) {
        try {
            String sql = "INSERT INTO log (id_usuario, id_registro, accion, detalle, fecha) VALUES (?, ?, ?, ?, ?)";
            jdbcTemplate.update(sql,
                    idUsuario,
                    idRegistro,
                    accion,
                    detalle,
                    LocalDateTime.now()
            );
        } catch (Exception e) {
            System.err.println("Error al registrar log: " + e.getMessage());
        }
    }
}
