package com.talentvisio.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "candidate_assessments")
public class CandidateAssessment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Keycloak User ID (taaki hum pehchan sake kis user ka data hai)
    private String userId;

    // Resume se nikala gaya poora text
    @Column(columnDefinition = "TEXT")
    private String resumeText;

    // Gemini AI dwara generate kiye gaye Questions (JSON format mein store honge)
    @Column(columnDefinition = "TEXT")
    private String technicalQuestionsJson;

    // Interview ke liye behavioral questions
    @Column(columnDefinition = "TEXT")
    private String interviewQuestionsJson;

    @Column(columnDefinition = "TEXT")
    private String userAnswersJson; // User ne kya select kiya

    private Integer score; // Total Score

    // Kab upload kiya gaya
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}