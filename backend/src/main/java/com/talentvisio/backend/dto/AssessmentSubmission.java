package com.talentvisio.backend.dto;

import java.util.List;
import lombok.Data; // Lombok use kar rahe hain getters/setters ke liye

@Data
public class AssessmentSubmission {
    private String q1;          // Question 1 ka answer
    private List<String> q2;    // Question 2 (Multiple options)
    private String q3;          // Question 3 (Text answer)
}