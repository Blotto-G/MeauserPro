package bitc.fullstack.meausrepro_spring.service;

import bitc.fullstack.meausrepro_spring.dto.MeasurementDTO;
import bitc.fullstack.meausrepro_spring.model.Measurement;
import bitc.fullstack.meausrepro_spring.repository.MeasurementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MeasurementService {
    @Autowired
    private MeasurementRepository measurementRepository;

    public List<MeasurementDTO> getMeasurementsByInstrumentId(Long instrumentId) {
        List<Measurement> measurements = measurementRepository.findByInstrumentId(instrumentId);
        return measurements.stream()
                .map(measurement -> new MeasurementDTO(measurement))
                .collect(Collectors.toList());
    }
}