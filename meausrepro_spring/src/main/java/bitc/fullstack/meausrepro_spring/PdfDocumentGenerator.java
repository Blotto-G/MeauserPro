package bitc.fullstack.meausrepro_spring;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

public class PdfDocumentGenerator {
    public byte[] getPdfAsByteArray() {
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            try (PDDocument document = new PDDocument()) {
                PDPage page = new PDPage();
                document.addPage(page);

                try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                    contentStream.beginText();
                    contentStream.setFont(PDType1Font.HELVETICA, 12);
                    contentStream.newLineAtOffset(100, 700);
                    contentStream.showText("안녕하세요, Apache PDFBox로 생성한 PDF 문서입니다.");
                    contentStream.endText();
                }

                document.save(outputStream); // PDF를 ByteArrayOutputStream에 저장
            }
            return outputStream.toByteArray(); // 바이트 배열 반환
        } catch (IOException e) {
            e.printStackTrace();
            return new byte[0]; // 오류 발생 시 빈 배열 반환
        }
    }

    public void createPdf() {
        // 실제 PDF 생성을 위한 호출이 필요할 수 있습니다.
        getPdfAsByteArray(); // 예시로 메서드 호출
    }
}
