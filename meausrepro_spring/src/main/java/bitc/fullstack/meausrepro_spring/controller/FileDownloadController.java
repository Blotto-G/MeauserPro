package bitc.fullstack.meausrepro_spring.controller;

import bitc.fullstack.meausrepro_spring.service.PdfService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
public class FileDownloadController {

    private final PdfService pdfService;

    // PdfService를 주입 받아 컨트롤러 생성자에서 사용합니다.
    @Autowired
    public FileDownloadController(PdfService pdfService) {
        this.pdfService = pdfService;
    }

    // GET 요청을 통해 PDF 파일을 다운로드할 수 있는 엔드포인트를 제공합니다.
    @GetMapping("/download/pdf")
    public void downloadPdf(HttpServletResponse response) throws IOException {
        // 응답의 콘텐츠 타입을 PDF로 설정합니다.
        response.setContentType("application/pdf");
        // 클라이언트에게 다운로드할 파일 이름을 example.pdf로 설정합니다.
        response.setHeader("Content-Disposition", "attachment; filename=example.pdf");

        // PdfService를 통해 생성된 PDF 데이터를 바이트 배열로 가져옵니다.
        byte[] pdfData = pdfService.generatePdf();
        // 응답의 출력 스트림을 통해 PDF 데이터를 클라이언트로 전송합니다.
        response.getOutputStream().write(pdfData);
    }
}
