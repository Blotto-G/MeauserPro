package bitc.fullstack.meausrepro_spring.util;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

public class QRCodeGenerator {

    // QR 코드 생성 유틸리티 메서드
    public static byte[] generateQRCode(String apiUrl, String insGeometryData, int idx) throws WriterException, IOException {
        // QR 코드에 포함할 데이터 포맷 설정
        String qrContent = String.format("URL: %s, GeometryData: %s, ID: %d", apiUrl, insGeometryData, idx);

        // QR 코드 생성
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(qrContent, BarcodeFormat.QR_CODE, 300, 300);

        // 이미지 바이트 배열로 변환하여 반환
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);
        return outputStream.toByteArray();
    }
}
