package com.talentvisio.backend.repository;

import com.talentvisio.backend.entity.CandidateAssessment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List; // List import karna mat bhoolna
import java.util.Optional;

public interface CandidateAssessmentRepository extends JpaRepository<CandidateAssessment, Long> {
    
    Optional<CandidateAssessment> findTopByUserIdOrderByCreatedAtDesc(String userId);

    // --- 👇 NEW METHOD FOR HISTORY 👇 ---
    // Ye user ke saare tests nikal kar dega
    List<CandidateAssessment> findByUserIdOrderByCreatedAtDesc(String userId);
}