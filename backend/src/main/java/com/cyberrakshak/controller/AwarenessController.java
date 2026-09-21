package com.cyberrakshak.controller;

import com.cyberrakshak.model.AwarenessArticle;
import com.cyberrakshak.repository.AwarenessRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/awareness")
public class AwarenessController {

    private final AwarenessRepository awarenessRepository;

    public AwarenessController(AwarenessRepository awarenessRepository) {
        this.awarenessRepository = awarenessRepository;
    }

    @GetMapping
    public ResponseEntity<List<AwarenessArticle>> getAllArticles() {
        return ResponseEntity.ok(awarenessRepository.findAll());
    }

    @GetMapping("/{slug}")
    public ResponseEntity<AwarenessArticle> getArticleBySlug(@PathVariable String slug) {
        return awarenessRepository.findBySlug(slug)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<AwarenessArticle>> getByCategory(@PathVariable String category) {
        return ResponseEntity.ok(awarenessRepository.findByCategory(category));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<AwarenessArticle> createArticle(@RequestBody AwarenessArticle article) {
        return ResponseEntity.ok(awarenessRepository.save(article));
    }
}
