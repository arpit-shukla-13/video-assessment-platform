package com.talentvisio.backend.dto;

import lombok.Data;
import java.util.Map;

@Data
public class SubmissionRequest {
    private Long assessmentId;
    private Map<String, String> answers; // Example: {"0": "Option A", "1": "Option B"}
}