package bitc.fullstack.meausrepro_spring.controller;

import bitc.fullstack.meausrepro_spring.PdfDocumentGenerator;
import jakarta.servlet.http.HttpServletResponse; // 자카르타 패키지로 변경
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
public class FileDownloadController {
    private final PdfDocumentGenerator pdfDocumentGenerator = new PdfDocumentGenerator(); // 클래스 이름 변경

    @GetMapping("/download/pdf")
    public void downloadPdf(HttpServletResponse response) throws IOException {
        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=example.pdf");

        pdfDocumentGenerator.createPdf(); // PDF 생성 메서드 호출
        response.getOutputStream().write(pdfDocumentGenerator.getPdfAsByteArray()); // PDF를 byte 배열로 가져와서 전송
    }
}
