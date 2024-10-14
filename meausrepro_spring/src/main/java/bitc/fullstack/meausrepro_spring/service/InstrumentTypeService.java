package bitc.fullstack.meausrepro_spring.service;

import bitc.fullstack.meausrepro_spring.model.MeausreProInsType;
import bitc.fullstack.meausrepro_spring.model.MeausreProInstrument;
import bitc.fullstack.meausrepro_spring.repository.InstrumentTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

@Service
public class InstrumentTypeService {
    @Autowired
    private InstrumentTypeRepository instrumentTypeRepository;

    // 저장
    public ResponseEntity<String> save(@RequestBody MeausreProInsType instrumentType) {
        // 프로젝트 저장
        MeausreProInsType savedInstrumentType = instrumentTypeRepository.save(instrumentType);

        // 저장 성공 메시지 반환
        if (savedInstrumentType != null) {
            return ResponseEntity.ok("Instrument saved successfully");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to save instrument");
        }
    }
}
