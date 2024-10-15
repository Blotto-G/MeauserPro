package bitc.fullstack.meausrepro_spring.service;

import bitc.fullstack.meausrepro_spring.PdfDocumentGenerator;
import org.springframework.stereotype.Service;

@Service
public class PdfService {
    private final PdfDocumentGenerator pdfDocumentGenerator = new PdfDocumentGenerator();

    public byte[] generatePdf() {
        return pdfDocumentGenerator.getPdfAsByteArray();
    }
}
