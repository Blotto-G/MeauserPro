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

    // 특정 프로젝트 계측기 보기
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

    // 특정 계측기 찾기
    public Optional<MeausreProInstrument> findById(int idx) {
        return instrumentRepository.findByIdx(idx);
    }

    // 계측기 수정 (지오메트리 정보, 구간 번호, 계측기 번호는 수정 불가)
    public ResponseEntity<String> updateInstrument(MeausreProInstrument updatedInstrument) {
        Optional<MeausreProInstrument> existingInstrumentOptional = instrumentRepository.findById(String.valueOf(updatedInstrument.getIdx()));

        if (existingInstrumentOptional.isPresent()) {
            MeausreProInstrument existingInstrument = existingInstrumentOptional.get();

            // 수정 가능한 필드들만 업데이트
            existingInstrument.setInsName(updatedInstrument.getInsName());
            existingInstrument.setInsType(updatedInstrument.getInsType());
            existingInstrument.setInsNum(updatedInstrument.getInsNum());
            existingInstrument.setInsNo(updatedInstrument.getInsNo());
            existingInstrument.setCreateDate(updatedInstrument.getCreateDate());
            existingInstrument.setInsLocation(updatedInstrument.getInsLocation());
            existingInstrument.setMeasurement1(updatedInstrument.getMeasurement1());
            existingInstrument.setMeasurement2(updatedInstrument.getMeasurement2());
            existingInstrument.setMeasurement3(updatedInstrument.getMeasurement3());
            existingInstrument.setVerticalPlus(updatedInstrument.getVerticalPlus());
            existingInstrument.setVerticalMinus(updatedInstrument.getVerticalMinus());

            // 변경사항 저장
            instrumentRepository.save(existingInstrument);

            return ResponseEntity.ok("계측기 정보가 성공적으로 업데이트되었습니다.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("계측기를 찾을 수 없습니다.");
        }
    }

    // 계측기 삭제
    public void deleteById(int idx) {
        instrumentRepository.deleteById(String.valueOf(idx)); // idx를 String으로 변환하여 삭제
    }
}
