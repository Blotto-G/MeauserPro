package bitc.fullstack.meausrepro_spring.service;

import bitc.fullstack.meausrepro_spring.model.MeausreProInstrument;
import bitc.fullstack.meausrepro_spring.repository.InstrumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InstrumentService {
    @Autowired
    private InstrumentRepository instrumentRepository;

    // 저장
    public ResponseEntity<String> save(MeausreProInstrument instrument) {
        // 프로젝트 저장
        MeausreProInstrument savedInstrument = instrumentRepository.save(instrument);

        // 저장 성공 메시지 반환
        if (savedInstrument != null) {
            return ResponseEntity.ok("Instrument saved successfully");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to save instrument");
        }
    }

    // 특정 구간 계측기 보기
    public List<MeausreProInstrument> sectionInstruments(int sectionId) {
        return instrumentRepository.findAllBySectionId(sectionId);
    }

    // 특정 구간 계측기 보기
    public List<MeausreProInstrument> projectInstruments(int projectId) {
        return instrumentRepository.findAllByProjectId(projectId);
    }

    // 계측기 지오메트리 업데이트
    public boolean updateInsGeometry(int instrumentId, String newInsGeometry) {
        Optional<MeausreProInstrument> instrumentOptional = instrumentRepository.findById(String.valueOf(instrumentId));
        if (instrumentOptional.isPresent()) {
            MeausreProInstrument instrument = instrumentOptional.get();
            instrument.setInsGeometry(newInsGeometry);
            instrumentRepository.save(instrument);
            return true;
        } else {
            return false;
        }
    }

    // 특정 프로젝트 찾기
    public Optional<MeausreProInstrument> findById(int idx) {
        return instrumentRepository.findByIdx(idx);
    }
}
