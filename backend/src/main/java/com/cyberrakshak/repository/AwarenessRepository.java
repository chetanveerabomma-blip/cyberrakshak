package com.cyberrakshak.repository;

import com.cyberrakshak.model.AwarenessArticle;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AwarenessRepository extends MongoRepository<AwarenessArticle, String> {
    Optional<AwarenessArticle> findBySlug(String slug);
    List<AwarenessArticle> findByCategory(String category);
}
