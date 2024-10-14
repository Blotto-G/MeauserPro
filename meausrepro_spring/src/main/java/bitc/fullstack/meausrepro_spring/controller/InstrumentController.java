package bitc.fullstack.meausrepro_spring.controller;

import bitc.fullstack.meausrepro_spring.dto.InsGeometryDto;
import bitc.fullstack.meausrepro_spring.model.MeausreProInstrument;
import bitc.fullstack.meausrepro_spring.service.InstrumentService;
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

    // 계측기 저장
    @PostMapping("/save")
    public ResponseEntity<String> save(@RequestBody MeausreProInstrument instrument) {
        if (instrument.getInsGeometry() == null || instrument.getInsGeometry().isEmpty()) {
            return ResponseEntity.badRequest().body("유효하지 않은 데이터");
        }
        System.out.println("받은 지오메트리 : " + instrument.getInsGeometry());

        instrumentService.save(instrument);

        return ResponseEntity.ok("계측기 데이터 저장 성공");
    }

//    // 특정 구간 계측기 보기
//    @GetMapping("/{sectionId}")
//    public List<MeausreProInstrument> sectionInstruments(@PathVariable("sectionId") int sectionId) {
//        return instrumentService.sectionInstruments(sectionId);
//    }

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

    // 계측기 수정
    @PutMapping("/update")
    public ResponseEntity<String> updateInstrument(@RequestBody MeausreProInstrument instrument) {
        Optional<MeausreProInstrument> existingInstrument = instrumentService.findById(instrument.getIdx());
        if (existingInstrument.isPresent()) {
            // 필드 업데이트를 원하는 것만 선택적으로 덮어쓰기
            MeausreProInstrument updatedInstrument = existingInstrument.get();
            updatedInstrument.setInsName(instrument.getInsName());
            updatedInstrument.setInsType(instrument.getInsType());
            updatedInstrument.setInsNum(instrument.getInsNum());
            updatedInstrument.setInsNo(instrument.getInsNo());
            updatedInstrument.setCreateDate(instrument.getCreateDate());
            updatedInstrument.setInsLocation(instrument.getInsLocation());
            updatedInstrument.setMeasurement1(instrument.getMeasurement1());
            updatedInstrument.setMeasurement2(instrument.getMeasurement2());
            updatedInstrument.setMeasurement3(instrument.getMeasurement3());
            updatedInstrument.setVerticalPlus(instrument.getVerticalPlus());
            updatedInstrument.setVerticalMinus(instrument.getVerticalMinus());

            instrumentService.save(updatedInstrument);  // 변경된 값 저장
            return ResponseEntity.ok("계측기 수정 성공");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("계측기를 찾을 수 없습니다.");
        }
    }

    // 계측기 삭제
    @DeleteMapping("/delete/{idx}")
    public ResponseEntity<String> deleteInstrument(@PathVariable("idx") int idx) {
        Optional<MeausreProInstrument> instrument = instrumentService.findById(idx);
        if (instrument.isPresent()) {
            instrumentService.deleteById(idx); // 계측기 삭제
            return ResponseEntity.ok("계측기 삭제 성공");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("계측기를 찾을 수 없습니다.");
        }
    }
}