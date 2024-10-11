package bitc.fullstack.meausrepro_spring.controller;

import bitc.fullstack.meausrepro_spring.dto.MeasurementDTO;
import bitc.fullstack.meausrepro_spring.service.MeasurementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/measurements")
public class MeasurementController {

    @Autowired
    private MeasurementService measurementService;

    @GetMapping("/{instrumentId}")
    public ResponseEntity<List<MeasurementDTO>> getMeasurementsByInstrumentId(@PathVariable Long instrumentId) {
        List<MeasurementDTO> measurements = measurementService.getMeasurementsByInstrumentId(instrumentId);
        return ResponseEntity.ok(measurements);
    }
}
