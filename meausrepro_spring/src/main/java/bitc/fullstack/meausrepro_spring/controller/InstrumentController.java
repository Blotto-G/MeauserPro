package bitc.fullstack.meausrepro_spring.controller;

import bitc.fullstack.meausrepro_spring.model.MeausreProInstrument;
import bitc.fullstack.meausrepro_spring.model.MeausreProProject;
import bitc.fullstack.meausrepro_spring.model.MeausreProSection;
import bitc.fullstack.meausrepro_spring.repository.InstrumentRepository;
import bitc.fullstack.meausrepro_spring.service.InstrumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/MeausrePro/Instrument")
public class InstrumentController {
    @Autowired private InstrumentService instrumentService;

    // 계측기 저장
    @PostMapping("/save")
    public ResponseEntity saveinsLocation(@RequestBody MeausreProInstrument instrument) {
        if (instrument.getInsGeometry() == null || instrument.getInsGeometry().isEmpty()) {
            return ResponseEntity.badRequest().body("유효하지 않은 데이터");
        }
        System.out.println("받은 지오메트리 : " + instrument.getInsGeometry());

        instrumentService.save(instrument);

        return ResponseEntity.ok("프로젝트 데이터 저장 성공");
    }

    // 저장된 계측기 모두 보기
    @GetMapping("/instrumentList/{id}")
    public List<MeausreProInstrument> instrumentList(@PathVariable String id) {
        return instrumentService.instrumentList(id);
    }

    // 특정 구간 계측기 보기
    @GetMapping("/{sectionId}")
    public List<MeausreProInstrument> sectionInstruments(@PathVariable("sectionId") int sectionId) {
        return instrumentService.sectionInstruments(sectionId);
    }
}
