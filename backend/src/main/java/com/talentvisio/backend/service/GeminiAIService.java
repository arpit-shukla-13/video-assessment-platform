package com.talentvisio.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import java.util.HashMap;
import java.util.Map;
import java.util.List;

@Service
public class GeminiAIService {

    // Aap chaho to application.properties me 'gemini.api.key' daal kar yahan @Value se le sakte ho
    // Ya abhi direct yahan string me paste kar do testing ke liye.
    @Value("${gemini.api.key}") 
    private String apiKey; 

    private final String GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=";

    public String generateAssessmentQuestions(String resumeText) {
        RestTemplate restTemplate = new RestTemplate();
        String url = GEMINI_URL + apiKey;

        // 1. Prompt Taiyaar karna
        String prompt = "You are a technical interviewer. Based on the following resume text, generate a JSON object containing:" +
                "1. 'technicalQuestions': A list of 5 multiple choice questions (with fields: question, options (array), correctAnswer). " +
                "2. 'interviewQuestions': A list of 3 behavioral/technical interview questions strings. " +
                "RESUME TEXT: " + resumeText + 
                "\n\nIMPORTANT: Return ONLY raw JSON. Do not use Markdown formatting like ```json.";

        // 2. Request Body banana (Gemini specific format)
        Map<String, Object> requestBody = new HashMap<>();
        Map<String, Object> content = new HashMap<>();
        Map<String, Object> part = new HashMap<>();
        
        part.put("text", prompt);
        content.put("parts", List.of(part));
        requestBody.put("contents", List.of(content));

        // 3. Headers set karna
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            // 4. API Call
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            
            // 5. Response Parse karna
            Map<String, Object> responseBody = response.getBody();
            if (responseBody != null && responseBody.containsKey("candidates")) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseBody.get("candidates");
                if (!candidates.isEmpty()) {
                    Map<String, Object> firstCandidate = candidates.get(0);
                    Map<String, Object> contentPart = (Map<String, Object>) firstCandidate.get("content");
                    List<Map<String, Object>> parts = (List<Map<String, Object>>) contentPart.get("parts");
                    return (String) parts.get(0).get("text");
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"error\": \"AI generation failed\"}";
        }
        return "{}";
    }
}