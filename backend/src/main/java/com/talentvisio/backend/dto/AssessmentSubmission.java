package com.talentvisio.backend.dto;

import java.util.List;
import lombok.Data; 

@Data
public class AssessmentSubmission {
    private String q1;          
    private List<String> q2;    
    private String q3;          
}