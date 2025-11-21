package com.talentvisio.backend.controller;

import com.talentvisio.backend.dto.AssessmentSubmission;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/assessment")
@CrossOrigin(origins = "http://localhost:3000")
public class AssessmentController {

    @PostMapping("/submit")
    public ResponseEntity<?> submitAssessment(@RequestBody AssessmentSubmission submission) {
        System.out.println("--- New Assessment Received ---");
        System.out.println("Q1 Answer: " + submission.getQ1());
        System.out.println("Q2 Answer: " + submission.getQ2());
        System.out.println("Q3 Answer: " + submission.getQ3());

        // Response wapas bhejna
        Map<String, String> response = new HashMap<>();
        response.put("message", "Assessment submitted successfully to Java Backend!");
        response.put("status", "success");

        return ResponseEntity.ok(response);
    }
}