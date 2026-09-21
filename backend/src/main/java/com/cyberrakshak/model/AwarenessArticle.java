package com.cyberrakshak.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "awarenessContent")
public class AwarenessArticle {
    @Id
    private String id;
    private String category;
    private String title;
    @Indexed(unique = true)
    private String slug;
    private String summary;
    private String content;
    private List<String> warningSigns = new ArrayList<>();
    private List<String> dos = new ArrayList<>();
    private List<String> donts = new ArrayList<>();
    private List<String> officialHelplines = new ArrayList<>();
    private LocalDateTime publishedAt = LocalDateTime.now();

    public AwarenessArticle() {}

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private final AwarenessArticle a = new AwarenessArticle();

        public Builder id(String id) { a.id = id; return this; }
        public Builder category(String category) { a.category = category; return this; }
        public Builder title(String title) { a.title = title; return this; }
        public Builder slug(String slug) { a.slug = slug; return this; }
        public Builder summary(String summary) { a.summary = summary; return this; }
        public Builder content(String content) { a.content = content; return this; }
        public Builder warningSigns(List<String> signs) { a.warningSigns = signs != null ? signs : new ArrayList<>(); return this; }
        public Builder dos(List<String> dos) { a.dos = dos != null ? dos : new ArrayList<>(); return this; }
        public Builder donts(List<String> donts) { a.donts = donts != null ? donts : new ArrayList<>(); return this; }
        public Builder officialHelplines(List<String> helplines) { a.officialHelplines = helplines != null ? helplines : new ArrayList<>(); return this; }
        public Builder publishedAt(LocalDateTime publishedAt) { a.publishedAt = publishedAt; return this; }

        public AwarenessArticle build() {
            return a;
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public List<String> getWarningSigns() { return warningSigns; }
    public void setWarningSigns(List<String> warningSigns) { this.warningSigns = warningSigns; }
    public List<String> getDos() { return dos; }
    public void setDos(List<String> dos) { this.dos = dos; }
    public List<String> getDonts() { return donts; }
    public void setDonts(List<String> donts) { this.donts = donts; }
    public List<String> getOfficialHelplines() { return officialHelplines; }
    public void setOfficialHelplines(List<String> officialHelplines) { this.officialHelplines = officialHelplines; }
    public LocalDateTime getPublishedAt() { return publishedAt; }
    public void setPublishedAt(LocalDateTime publishedAt) { this.publishedAt = publishedAt; }
}
