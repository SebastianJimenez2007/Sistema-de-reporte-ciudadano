
package com.reportapp.backend.controller;

import com.reportapp.backend.dto.LoginRequestDTO;
import com.reportapp.backend.dto.RegistroRequestDTO;
import com.reportapp.backend.model.Usuario;
import com.reportapp.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping("/registro")
    public ResponseEntity<Map<String, Object>> registrarUsuario(@RequestBody RegistroRequestDTO registroDTO) {
        Map<String, Object> response = new HashMap<>();

        try {
            System.out.println("📝 Intentando registrar usuario: " + registroDTO.getEmail());

            if (registroDTO.getAceptaTerminos() == null || !registroDTO.getAceptaTerminos()) {
                response.put("error", "Debes aceptar los términos y condiciones");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            if (usuarioRepository.existsByEmail(registroDTO.getEmail())) {
                response.put("error", "El correo electrónico ya está registrado");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            String rolBD = convertirRol(registroDTO.getRol());

            Usuario nuevoUsuario = new Usuario(
                    registroDTO.getEmail(),
                    registroDTO.getPassword(),
                    registroDTO.getNombreCompleto(),
                    rolBD
            );

            Usuario usuarioGuardado = usuarioRepository.save(nuevoUsuario);
            System.out.println("✅ Usuario guardado con ID: " + usuarioGuardado.getIdUsuario());

            response.put("success", true);
            response.put("mensaje", "Usuario registrado exitosamente");
            response.put("usuario", Map.of(
                    "id", usuarioGuardado.getIdUsuario(),
                    "email", usuarioGuardado.getEmail(),
                    "nombreCompleto", usuarioGuardado.getNombreCompleto(),
                    "rol", usuarioGuardado.getRol()
            ));

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            System.err.println("❌ Error en registro: " + e.getMessage());
            e.printStackTrace();
            response.put("error", "Error al registrar usuario: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUsuario(@RequestBody LoginRequestDTO loginDTO) {
        Map<String, Object> response = new HashMap<>();

        try {
            System.out.println("🔐 Intento de login: " + loginDTO.getEmail());

            Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(loginDTO.getEmail());

            if (usuarioOpt.isEmpty()) {
                response.put("success", false);
                response.put("mensaje", "Usuario no encontrado");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

            Usuario usuario = usuarioOpt.get();

            if (!usuario.getPassword().equals(loginDTO.getPassword())) {
                response.put("success", false);
                response.put("mensaje", "Contraseña incorrecta");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

            if (!"activo".equals(usuario.getEstado())) {
                response.put("success", false);
                response.put("mensaje", "Usuario desactivado");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

            usuario.setUltimoLogin(LocalDateTime.now());
            usuarioRepository.save(usuario);

            response.put("success", true);
            response.put("mensaje", "Login exitoso");
            response.put("id", usuario.getIdUsuario());
            response.put("email", usuario.getEmail());
            response.put("nombreCompleto", usuario.getNombreCompleto());
            response.put("rol", usuario.getRol());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("❌ Error en login: " + e.getMessage());
            e.printStackTrace();
            response.put("success", false);
            response.put("mensaje", "Error en el servidor: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    private String convertirRol(String rolFrontend) {
        switch (rolFrontend.toUpperCase()) {
            case "CIUDADANO":
                return "ciudadano";
            case "VEEDOR":
                return "validador";
            case "ENTIDAD":
                return "entidad";
            case "ADMINISTRADOR":
                return "admin";
            default:
                return "ciudadano";
        }
    }

    @GetMapping("/test")
    public ResponseEntity<Map<String, String>> test() {
        Map<String, String> response = new HashMap<>();
        response.put("mensaje", "API funcionando correctamente");
        response.put("status", "ok");
        return ResponseEntity.ok(response);
    }
}