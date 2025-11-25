package com.talentvisio.backend.controller;

import com.talentvisio.backend.dto.SubmissionRequest; // Ye DTO hona zaroori hai
import com.talentvisio.backend.entity.CandidateAssessment;
import com.talentvisio.backend.repository.CandidateAssessmentRepository;
import com.talentvisio.backend.service.GeminiAIService;
import com.talentvisio.backend.service.PdfExtractionService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/resume")
// Localhost aur Vercel dono ko allow karein (CORS Setting)
@CrossOrigin(origins = {"http://localhost:3000", "https://video-assessment-platform.vercel.app"}, allowCredentials = "true")
public class ResumeUploadController {

    @Autowired
    private PdfExtractionService pdfService;

    @Autowired
    private GeminiAIService aiService;

    @Autowired
    private CandidateAssessmentRepository repository;

    // --- 1. RESUME UPLOAD & QUESTION GENERATION ---
    @PostMapping("/upload")
    public ResponseEntity<?> uploadResume(
            @RequestParam("file") MultipartFile file,
            @RequestParam("userId") String userId
    ) {
        try {
            // 1. Validate File
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("File is empty");
            }

            System.out.println("--- Resume Upload Started for User: " + userId + " ---");

            // 2. Extract Text from PDF
            String resumeText = pdfService.extractTextFromPdf(file);
            System.out.println("Text Extracted via PDFBox. Length: " + resumeText.length());

            // 3. Generate Questions via Gemini AI
            System.out.println("Calling Gemini AI...");
            String aiResponseJson = aiService.generateAssessmentQuestions(resumeText);
            System.out.println("AI Response Received.");

            // 4. Save to Database
            CandidateAssessment assessment = new CandidateAssessment();
            assessment.setUserId(userId);
            assessment.setResumeText(resumeText);
            
            // JSON save kar rahe hain taaki baad me score calculate kar sakein
            assessment.setTechnicalQuestionsJson(aiResponseJson);
            
            repository.save(assessment);
            System.out.println("Data Saved to Database with ID: " + assessment.getId());

            // 5. Response to Frontend
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Resume processed successfully");
            response.put("assessmentId", assessment.getId());
            response.put("aiData", aiResponseJson); 

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error processing resume: " + e.getMessage());
        }
    }

    // --- 2. SUBMIT ANSWERS & CALCULATE SCORE (NEW) ---
    @PostMapping("/submit-answers")
    public ResponseEntity<?> submitAssessmentAnswers(@RequestBody SubmissionRequest request) {
        try {
            System.out.println("--- Submitting Answers for Assessment ID: " + request.getAssessmentId() + " ---");

            // 1. Database se Assessment dhundho
            Optional<CandidateAssessment> assessmentOpt = repository.findById(request.getAssessmentId());
            if (assessmentOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Assessment ID not found");
            }
            CandidateAssessment assessment = assessmentOpt.get();

            // 2. Score Calculation Logic
            int score = 0;
            ObjectMapper mapper = new ObjectMapper();
            
            // Database se Questions ka JSON padho
            JsonNode rootNode = mapper.readTree(assessment.getTechnicalQuestionsJson());
            JsonNode questionsNode = rootNode.get("technicalQuestions");

            int totalQuestions = 0;

            // Loop chala kar check karo
            if (questionsNode != null && questionsNode.isArray()) {
                totalQuestions = questionsNode.size();
                for (int i = 0; i < totalQuestions; i++) {
                    // Sahi jawab database se nikala
                    String correctAnswer = questionsNode.get(i).get("correctAnswer").asText();
                    
                    // User ka jawab Frontend se aaya (Request body se)
                    String userAnswer = request.getAnswers().get(String.valueOf(i));

                    // Check match
                    if (userAnswer != null && userAnswer.trim().equalsIgnoreCase(correctAnswer.trim())) {
                        score++;
                    }
                }
            }

            // 3. Result Save karo
            assessment.setScore(score);
            // User ke answers bhi save kar lete hain future reference ke liye
            assessment.setUserAnswersJson(mapper.writeValueAsString(request.getAnswers()));
            
            repository.save(assessment);

            System.out.println("Score Calculated: " + score + "/" + totalQuestions);

            // 4. Response bhejo
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Submitted Successfully!");
            response.put("score", score);
            response.put("total", totalQuestions);
            
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving answers: " + e.getMessage());
        }
    }

    // ... Baki saare purane methods ke neeche, class ke andar ...

    // --- 3. GET HISTORY API (NEW) ---
    @GetMapping("/history/{userId}")
    public ResponseEntity<?> getUserHistory(@PathVariable String userId) {
        try {
            // Database se list nikalo
            var history = repository.findByUserIdOrderByCreatedAtDesc(userId);
            
            if (history.isEmpty()) {
                return ResponseEntity.ok(java.util.Collections.emptyList());
            }

            return ResponseEntity.ok(history);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching history");
        }
    }
} // Class End