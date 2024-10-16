package bitc.fullstack.meausrepro_spring.util;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

public class PdfDocumentGenerator {
    // PDF를 생성하고 바이트 배열로 반환하는 메서드입니다.
    public byte[] getPdfAsByteArray() {
        // PDF 데이터를 저장할 ByteArrayOutputStream을 생성합니다.
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            // PDF 문서를 생성하고 페이지를 추가합니다.
            try (PDDocument document = new PDDocument()) {
                PDPage page = new PDPage();
                document.addPage(page);

                // 페이지에 텍스트를 추가하기 위해 ContentStream을 엽니다.
                try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                    contentStream.beginText();
                    contentStream.setFont(PDType1Font.HELVETICA, 12);
                    contentStream.newLineAtOffset(100, 700);
                    contentStream.showText("안녕하세요, Apache PDFBox로 생성한 PDF 문서입니다.");
                    contentStream.endText();
                }

                // PDF 문서를 ByteArrayOutputStream에 저장합니다.
                document.save(outputStream);
            }
            // 생성된 PDF 데이터를 바이트 배열로 반환합니다.
            return outputStream.toByteArray();
        } catch (IOException e) {
            e.printStackTrace();
            // 오류 발생 시 빈 바이트 배열을 반환합니다.
            return new byte[0];
        }
    }

    // 예시로 PDF를 생성할 때 호출하는 메서드입니다.
    public void createPdf() {
        getPdfAsByteArray();
    }
}
