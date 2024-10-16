package bitc.fullstack.meausrepro_spring.service;

import bitc.fullstack.meausrepro_spring.model.MeausreProInsType;
import bitc.fullstack.meausrepro_spring.model.MeausreProInstrument;
import bitc.fullstack.meausrepro_spring.repository.InstrumentRepository;
import bitc.fullstack.meausrepro_spring.repository.InstrumentTypeRepository;
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

    @Autowired
    private InstrumentTypeService instrumentTypeService;

    // 저장
    public MeausreProInstrument save(MeausreProInstrument instrument) {
        // 저장된 계측기 데이터 반환
        return instrumentRepository.save(instrument);
    }

    // 특정 구간 계측기 보기
    public List<MeausreProInstrument> sectionInstruments(int sectionId) {
        return instrumentRepository.findAllBySectionId(sectionId);
    }

    // 프로젝트별 계측기 보기
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
        return instrumentRepository.findByIdx(idx); // idx를 int로 전달
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

    // 계측기 삭제 (계측기 추가 정보도 함께 삭제)
    public void deleteInstrumentBySection(int sectionId) {
        List<MeausreProInstrument> instruments = instrumentRepository.findAllBySectionId(sectionId);

        for (MeausreProInstrument instrument : instruments) {
            instrumentTypeService.deleteByInsId(instrument.getIdx()); // 계측기 추가 정보 삭제
            instrumentRepository.deleteById(String.valueOf(instrument.getIdx())); // 계측기 삭제
        }
    }

    // 계측기 추가정보 불러오기
    public List<MeausreProInsType> getInstrumentTypeDetails(int instrumentId) {
        return instrumentTypeService.findByInstrumentId(instrumentId);
    }

    // 계측기 삭제 (계측기 추가 정보도 함께 삭제)
    public void deleteById(int idx) {
        instrumentTypeService.deleteByInsId(idx); // 계측기 추가 정보 삭제
        instrumentRepository.deleteById(String.valueOf(idx)); // 계측기 삭제
    }
}