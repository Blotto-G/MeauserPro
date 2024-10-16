package bitc.fullstack.meausrepro_spring.service;

import bitc.fullstack.meausrepro_spring.dto.MeasurementDTO;
import bitc.fullstack.meausrepro_spring.model.Measurement;
import bitc.fullstack.meausrepro_spring.repository.MeasurementRepository;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MeasurementService {
    @Autowired
    private MeasurementRepository measurementRepository;

    // 특정 계측기 ID에 대한 모든 측정값을 가져옴
    public List<MeasurementDTO> getMeasurementsByInstrumentId(Long instrumentId) {
        List<Measurement> measurements = measurementRepository.findByInstrumentId(instrumentId);
        // 엔티티를 DTO로 변환
        return measurements.stream()
                .map(MeasurementDTO::new)
                .collect(Collectors.toList());
    }

    // 측정값을 저장하는 메서드
    public void saveMeasurement(MeasurementDTO measurementDTO) {
        Measurement measurement = new Measurement();
        // DTO의 데이터를 엔티티로 변환
        measurement.setValue(measurementDTO.getValue());
        // 데이터베이스에 저장
        measurementRepository.save(measurement);
    }

    // QR 코드 생성 메서드
    public String generateQRCode(MeasurementDTO measurementDTO) {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        // QR 코드에 포함할 데이터 설정
        String measurementData = "측정값 데이터: " + measurementDTO.toString();

        try {
            // QR 코드 비트 매트릭스 생성
            BitMatrix bitMatrix = qrCodeWriter.encode(measurementData, BarcodeFormat.QR_CODE, 200, 200);
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            // 비트 매트릭스를 PNG 이미지로 변환
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);
            // Base64 인코딩된 문자열 반환
            return Base64.getEncoder().encodeToString(outputStream.toByteArray());
        } catch (WriterException | IOException e) {
            e.printStackTrace();
            return null;
        }
    }
}
