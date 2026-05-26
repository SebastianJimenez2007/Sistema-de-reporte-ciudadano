package com.reportapp.backend.controller;

import com.reportapp.backend.model.Categoria;
import com.reportapp.backend.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/categorias")
@CrossOrigin(origins = "*")
public class CategoriaController {

    @Autowired
    private CategoriaRepository categoriaRepository;

    @GetMapping
    public List<Categoria> obtenerTodas() {
        return categoriaRepository.findAll();
    }
}