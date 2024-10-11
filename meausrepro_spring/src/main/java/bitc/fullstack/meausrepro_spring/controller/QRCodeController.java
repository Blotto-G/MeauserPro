package bitc.fullstack.meausrepro_spring.controller;

import bitc.fullstack.meausrepro_spring.service.QRCodeService;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.qrcode.QRCodeWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayOutputStream;

@RestController
public class QRCodeController {

    @Autowired
    private QRCodeService qrCodeService;

    @GetMapping("/api/qrcode/{id}")
    public ResponseEntity<byte[]> generateQRCode(@PathVariable Long id) throws Exception {
        // QR 코드에 포함할 데이터를 가져옵니다.
        String data = qrCodeService.getMeasurementDataForQRCode(id);

        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        var bitMatrix = qrCodeWriter.encode(data, BarcodeFormat.QR_CODE, 300, 300);

        ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);
        byte[] pngData = pngOutputStream.toByteArray();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_PNG);
        headers.setContentLength(pngData.length);

        return ResponseEntity.ok()
                .headers(headers)
                .body(pngData);
    }
}

