package com.talentvisio.backend.repository;

import com.talentvisio.backend.entity.CandidateAssessment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CandidateAssessmentRepository extends JpaRepository<CandidateAssessment, Long> {
    
    // User ID ke basis par assessment dhundhne ke liye method
    // Select * from candidate_assessments where user_id = ? order by date desc
    Optional<CandidateAssessment> findTopByUserIdOrderByCreatedAtDesc(String userId);
}