package bitc.fullstack.meausrepro_spring.controller;

import bitc.fullstack.meausrepro_spring.dto.MeasurementDTO;
import bitc.fullstack.meausrepro_spring.service.MeasurementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// 프론트엔드의 특정 도메인에서 접근을 허용하기 위한 CORS 설정
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/measurements")
public class MeasurementController {

    @Autowired
    private MeasurementService measurementService;

    // 특정 계측기 ID에 대한 모든 측정값을 가져오는 API 엔드포인트
    @GetMapping("/{instrumentId}")
    public ResponseEntity<List<MeasurementDTO>> getMeasurementsByInstrumentId(@PathVariable Long instrumentId) {
        List<MeasurementDTO> measurements = measurementService.getMeasurementsByInstrumentId(instrumentId);
        return ResponseEntity.ok(measurements);
    }

    // 새로운 측정값을 추가하고 QR 코드를 생성하는 API 엔드포인트
    @PostMapping("/add")
    public ResponseEntity<String> addMeasurement(@RequestBody MeasurementDTO measurementDTO) {
        measurementService.saveMeasurement(measurementDTO);
        // 저장 후 QR 코드 생성
        String qrCode = measurementService.generateQRCode(measurementDTO);
        return ResponseEntity.ok("Measurement added and QR code generated: " + qrCode);
    }
}
