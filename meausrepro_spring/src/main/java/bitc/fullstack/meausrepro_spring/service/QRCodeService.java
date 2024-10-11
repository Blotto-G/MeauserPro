package bitc.fullstack.meausrepro_spring.service;

import bitc.fullstack.meausrepro_spring.model.Measurement;
import bitc.fullstack.meausrepro_spring.repository.MeasurementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class QRCodeService {

    @Autowired
    private MeasurementRepository measurementRepository;

    public String getMeasurementDataForQRCode(Long id) {
        Measurement measurement = measurementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Measurement not found"));

        // QR 코드에 포함할 데이터를 String으로 변환합니다.
        return "ID: " + measurement.getId() + ", Value: " + measurement.getValue();
    }
}
