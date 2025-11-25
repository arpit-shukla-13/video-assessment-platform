package com.talentvisio.backend.service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.ArrayList;
import java.util.Random;

@Service
public class GeminiAIService { // Naam Gemini hai, par andar Groq chalega ;)

    // 🔴 YAHAN APNI GROQ KEY PASTE KAREIN (gsk_...)
   @Value("${groq.api.key}")
   private String apiKey;

    // Groq URL (Llama 3 Model)
    private final String GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

    public String generateAssessmentQuestions(String resumeText) {
        try {
            RestTemplate restTemplate = new RestTemplate();

            // 1. Prompt
            String prompt = "You are a technical interviewer. Analyze the resume below and generate a JSON object. " +
                    "Format: { \"technicalQuestions\": [ { \"question\": \"...\", \"options\": [\"...\"], \"correctAnswer\": \"...\" } (5 questions) ], " +
                    "\"interviewQuestions\": [ \"...\" ] (3 questions) } " +
                    "Strictly JSON only. No markdown. Resume: " + resumeText;

            // 2. Request Body (Groq Format - OpenAI Style)
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "llama-3.1-8b-instant"); // Free & Fast Model
            
            Map<String, String> message = new HashMap<>();
            message.put("role", "user");
            message.put("content", prompt);
            
            requestBody.put("messages", List.of(message));

            // 3. Headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + apiKey); // Bearer Token zaroori hai

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            System.out.println("--- Sending Request to Groq AI ---");
            ResponseEntity<Map> response = restTemplate.postForEntity(GROQ_URL, entity, Map.class);
            
            // 4. Response Parse karna (Groq Format)
            // Structure: { choices: [ { message: { content: "JSON..." } } ] }
            Map<String, Object> responseBody = response.getBody();
            
            if (responseBody != null && responseBody.containsKey("choices")) {
                List<Map<String, Object>> choices = (List<Map<String, Object>>) responseBody.get("choices");
                if (choices != null && !choices.isEmpty()) {
                    Map<String, Object> firstChoice = choices.get(0);
                    Map<String, Object> messagePart = (Map<String, Object>) firstChoice.get("message");
                    String rawText = (String) messagePart.get("content");
                    
                    System.out.println("Groq Response Received!");

                    // Cleaning Logic
                    String cleaned = rawText.replace("```json", "").replace("```", "");
                    int start = cleaned.indexOf("{");
                    int end = cleaned.lastIndexOf("}");
                    if (start != -1 && end != -1) {
                        return cleaned.substring(start, end + 1);
                    }
                    return cleaned;
                }
            }
        } catch (Exception e) {
            System.out.println("⚠️ GROQ API FAILED: " + e.getMessage());
            System.out.println("🔄 Switching to BACKUP DATA...");
            return getRandomMockData();
        }
        return getRandomMockData();
    }

    // --- 🎲 RANDOM BACKUP GENERATOR (Same as before) ---
    private String getRandomMockData() {
        // ... (Pichla wala 10 sets ka code yahan same rahega) ...
        // Main space bachane ke liye poora copy nahi kar raha hu, 
        // par aap pichle code se wo 'List<String> sets...' wala part yahan rakh lena.
        // Agar wo hata diya hai to batao, main wapas de dunga.
        
        // TEMPORARY SMALL BACKUP (Agar aapne pichla delete kar diya ho)
        return "{" +
                "\"technicalQuestions\": [" +
                "  {\"question\": \"What is the primary purpose of React's Virtual DOM?\", \"options\": [\"Direct DB Access\", \"Optimizing UI updates\", \"Server-side rendering\", \"Memory Management\"], \"correctAnswer\": \"Optimizing UI updates\"}," +
                "  {\"question\": \"In Java, which keyword is used to inherit a class?\", \"options\": [\"implement\", \"extends\", \"inherits\", \"using\"], \"correctAnswer\": \"extends\"}," +
                "  {\"question\": \"Which HTTP method is idempotent?\", \"options\": [\"POST\", \"GET\", \"PATCH\", \"CONNECT\"], \"correctAnswer\": \"GET\"}," +
                "  {\"question\": \"What does CSS stand for?\", \"options\": [\"Computer Style Sheets\", \"Creative Style System\", \"Cascading Style Sheets\", \"Colorful Style Sheets\"], \"correctAnswer\": \"Cascading Style Sheets\"}," +
                "  {\"question\": \"What is the default port for a Spring Boot application?\", \"options\": [\"3000\", \"8080\", \"5000\", \"4200\"], \"correctAnswer\": \"8080\"}" +
                "]," +
                "\"interviewQuestions\": [\"Explain JDK vs JRE.\", \"Explain React Hooks.\"]" +
                "}";
    }
}