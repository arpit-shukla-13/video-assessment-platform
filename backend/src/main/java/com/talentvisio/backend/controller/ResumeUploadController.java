package com.talentvisio.backend.controller;

import com.talentvisio.backend.entity.CandidateAssessment;
import com.talentvisio.backend.repository.CandidateAssessmentRepository;
import com.talentvisio.backend.service.GeminiAIService;
import com.talentvisio.backend.service.PdfExtractionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/resume")
@CrossOrigin(origins = "*") // Development ke liye open rakha hai, Production me specific domain dalenge
public class ResumeUploadController {

    @Autowired
    private PdfExtractionService pdfService;

    @Autowired
    private GeminiAIService aiService;

    @Autowired
    private CandidateAssessmentRepository repository;

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

            // 4. Save to Database (PostgreSQL)
            CandidateAssessment assessment = new CandidateAssessment();
            assessment.setUserId(userId);
            assessment.setResumeText(resumeText);
            
            // Note: Hum abhi poora JSON ek field me daal rahe hain simplicity ke liye
            // Real app me hum JSON parse karke alag fields me daal sakte hain
            assessment.setTechnicalQuestionsJson(aiResponseJson);
            
            repository.save(assessment);
            System.out.println("Data Saved to Database with ID: " + assessment.getId());

            // 5. Response to Frontend
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Resume processed successfully");
            response.put("assessmentId", assessment.getId());
            response.put("aiData", aiResponseJson); // Frontend direct is JSON ko use karke quiz dikhayega

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error processing resume: " + e.getMessage());
        }
    }
}