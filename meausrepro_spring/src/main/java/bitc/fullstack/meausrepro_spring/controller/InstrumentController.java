package bitc.fullstack.meausrepro_spring.controller;

import bitc.fullstack.meausrepro_spring.dto.InsGeometryDto;
import bitc.fullstack.meausrepro_spring.dto.InstrumenetDTO;
import bitc.fullstack.meausrepro_spring.model.MeausreProInsType;
import bitc.fullstack.meausrepro_spring.model.MeausreProInstrument;
import bitc.fullstack.meausrepro_spring.service.InstrumentService;
import bitc.fullstack.meausrepro_spring.service.InstrumentTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/MeausrePro/Instrument")
public class InstrumentController {
    @Autowired
    private InstrumentService instrumentService;

    @Autowired
    private InstrumentTypeService instrumentTypeService;

    @PostMapping("/save")
    public ResponseEntity<MeausreProInstrument> save(@RequestBody InsGeometryDto request) {
        MeausreProInstrument instrument = request.getInstrument();
        MeausreProInsType insType = request.getInsType();

        if (instrument.getInsGeometry() == null || instrument.getInsGeometry().isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }

        // 계측기 저장
        MeausreProInstrument savedInstrument = instrumentService.save(instrument);

        // insType에 instrId 설정
        insType.setInstrId(savedInstrument);

        // insType 저장
        instrumentTypeService.save(insType);

        // 저장된 데이터 반환
        return ResponseEntity.ok(savedInstrument);
    }

    // 특정 구간 계측기 보기
    @GetMapping("/section/{sectionId}")
    public List<MeausreProInstrument> sectionInstruments(@PathVariable("sectionId") int sectionId) {
        System.out.println("\n" + sectionId);
        return instrumentService.sectionInstruments(sectionId);
    }

    // 계측기 추가 정보 조회
    @GetMapping("/details/{id}")
    public ResponseEntity<List<MeausreProInsType>> getInstrumentTypes(@PathVariable int id) {
        List<MeausreProInsType> instrumentTypes = instrumentService.getInstrumentTypeDetails(id);
        return ResponseEntity.ok(instrumentTypes);
    }

    // 프로젝트별 계측기 보기
    @GetMapping("/{projectId}")
    public List<MeausreProInstrument> projectInstruments(@PathVariable("projectId") int projectId) {
        return instrumentService.projectInstruments(projectId);
    }

    // 계측기 지오메트리 업데이트
    @PutMapping("/updateInsGeometry")
    public ResponseEntity<String> updateInsGeometry(@RequestBody InsGeometryDto insGeometryDto) {
        Optional<MeausreProInstrument> instrumentOptional = instrumentService.findById(insGeometryDto.getIdx());
        if (instrumentOptional.isPresent()) {
            MeausreProInstrument instrument = instrumentOptional.get();
            instrument.setInsGeometry(insGeometryDto.getInsGeometryData());
            instrumentService.save(instrument);
            return ResponseEntity.ok("계측기 지오메트리 업데이트 성공");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("계측기를 찾을 수 없습니다.");
        }
    }

    @PutMapping("/update")
    public ResponseEntity<String> updateInstrument(@RequestBody InstrumenetDTO request) {
        MeausreProInstrument instrument = request.getInstrument();
        MeausreProInsType insType = request.getInsType(); // 추가 테이블 정보

        Optional<MeausreProInstrument> existingInstrumentOptional = instrumentService.findById(instrument.getIdx());

        if (existingInstrumentOptional.isPresent()) {
            MeausreProInstrument existingInstrument = existingInstrumentOptional.get();

            // 기본 테이블 업데이트
            existingInstrument.setInsName(instrument.getInsName());
            existingInstrument.setInsNum(instrument.getInsNum());
            existingInstrument.setInsNo(instrument.getInsNo());
            existingInstrument.setCreateDate(instrument.getCreateDate());
            existingInstrument.setInsLocation(instrument.getInsLocation());
            existingInstrument.setMeasurement1(instrument.getMeasurement1());
            existingInstrument.setMeasurement2(instrument.getMeasurement2());
            existingInstrument.setMeasurement3(instrument.getMeasurement3());
            existingInstrument.setVerticalPlus(instrument.getVerticalPlus());
            existingInstrument.setVerticalMinus(instrument.getVerticalMinus());

            // 기본 테이블 저장
            instrumentService.save(existingInstrument);

            // 추가 정보 업데이트
            if (insType != null) {
                // 인스트루먼트 타입 조회
                List<MeausreProInsType> insTypeList = instrumentTypeService.findByInstrumentId(existingInstrument.getIdx());
                Optional<MeausreProInsType> existingInsTypeOptional = insTypeList.stream().findFirst();

                if (existingInsTypeOptional.isPresent()) {
                    MeausreProInsType existingInsType = existingInsTypeOptional.get();
                    existingInsType.setLogger(insType.getLogger());
                    existingInsType.setAPlus(insType.getAPlus());
                    existingInsType.setAMinus(insType.getAMinus());
                    existingInsType.setBPlus(insType.getBPlus());
                    existingInsType.setBMinus(insType.getBMinus());
                    existingInsType.setKnTone(insType.getKnTone());
                    existingInsType.setDisplacement(insType.getDisplacement());
                    existingInsType.setDepExcavation(insType.getDepExcavation());
                    existingInsType.setZeroRead(insType.getZeroRead());
                    existingInsType.setTenAllowable(insType.getTenAllowable());
                    existingInsType.setTenDesign(insType.getTenDesign());
                    existingInsType.setInstrId(existingInstrument); // 관계 설정
                    instrumentTypeService.save(existingInsType); // 업데이트 저장
                } else {
                    // 존재하지 않을 경우 새로 저장
                    insType.setInstrId(existingInstrument); // 계측기와 연결된 insType 설정
                    instrumentTypeService.save(insType);  // 추가 정보 저장
                }
            }

            return ResponseEntity.ok("계측기 및 추가 정보가 성공적으로 업데이트되었습니다.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("계측기를 찾을 수 없습니다.");
        }
    }

    // 계측기 삭제
    @DeleteMapping("/delete/{idx}")
    public ResponseEntity<String> deleteInstrument(@PathVariable("idx") int idx) {
        System.out.println("삭제 요청된 계측기 idx: " + idx); // 로그 추가
        Optional<MeausreProInstrument> instrument = instrumentService.findById(idx);
        if (instrument.isPresent()) {
            instrumentService.deleteById(idx); // 계측기 삭제
            return ResponseEntity.ok("계측기 삭제 성공");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("계측기를 찾을 수 없습니다.");
        }
    }

    // 계측기 정보
    @GetMapping("/get/{idx}")
    public Optional<MeausreProInstrument> getInsInfo(@PathVariable("idx") int idx) {
        Optional<MeausreProInstrument> instrumentOptional = instrumentService.findById(idx);
        if (instrumentOptional.isPresent()) {
            return instrumentOptional;
        } else {
            return Optional.empty();
        }
    }
}