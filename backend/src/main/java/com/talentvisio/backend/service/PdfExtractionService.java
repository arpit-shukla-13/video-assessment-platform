package com.talentvisio.backend.service;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

@Service
public class PdfExtractionService {

    public String extractTextFromPdf(MultipartFile file) throws IOException {
        // PDF document ko load karte hain
        try (PDDocument document = PDDocument.load(file.getInputStream())) {
            // TextStripper class text nikalne me madad karti hai
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        }
    }
}