package com.reportapp.backend.dto;

public class LoginResponseDTO {
    private Long id;
    private String email;
    private String nombreCompleto;
    private String rol;
    private String mensaje;
    private boolean success;

    public LoginResponseDTO() {}

    public LoginResponseDTO(boolean success, String mensaje) {
        this.success = success;
        this.mensaje = mensaje;
    }

    public LoginResponseDTO(Long id, String email, String nombreCompleto, String rol, boolean success, String mensaje) {
        this.id = id;
        this.email = email;
        this.nombreCompleto = nombreCompleto;
        this.rol = rol;
        this.success = success;
        this.mensaje = mensaje;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getNombreCompleto() { return nombreCompleto; }
    public void setNombreCompleto(String nombreCompleto) { this.nombreCompleto = nombreCompleto; }

    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }

    public String getMensaje() { return mensaje; }
    public void setMensaje(String mensaje) { this.mensaje = mensaje; }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
}
