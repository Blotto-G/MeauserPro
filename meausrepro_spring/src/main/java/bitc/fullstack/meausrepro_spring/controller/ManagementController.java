package bitc.fullstack.meausrepro_spring.controller;

import bitc.fullstack.meausrepro_spring.dto.ManagementDTO;
import bitc.fullstack.meausrepro_spring.model.MeausreProInsType;
import bitc.fullstack.meausrepro_spring.model.MeausreProInstrument;
import bitc.fullstack.meausrepro_spring.model.MeausreProManType;
import bitc.fullstack.meausrepro_spring.model.MeausreProManagement;
import bitc.fullstack.meausrepro_spring.service.InstrumentService;
import bitc.fullstack.meausrepro_spring.service.ManagementService;
import bitc.fullstack.meausrepro_spring.service.ManagementTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/MeausrePro/Management")
public class ManagementController {
    @Autowired
    private ManagementService managementService;

    @Autowired
    private ManagementTypeService manTypeService;
    @Autowired
    private InstrumentService instrumentService;

    // 저장
    @PostMapping("/save/{instrIdx}")
    public ResponseEntity<MeausreProManType> save(@RequestBody ManagementDTO request, @PathVariable int instrIdx) {
        MeausreProManType manType = request.getManagementType();
        MeausreProManagement management = request.getManagement();

        Optional<MeausreProInstrument> instrument = instrumentService.findById(instrIdx);

        if (instrument.isPresent()) {
            // 기본정보부터 저장
            MeausreProInstrument ins = instrument.get();
            management.setInstr_id(ins);

            MeausreProManagement saveManagement = managementService.save(management);

            manType.setMaIdx(saveManagement);

            // manType 저장
            MeausreProManType saveManType = manTypeService.save(manType);

            return ResponseEntity.ok(saveManType);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 특정 계측기 그래프 보기
    @GetMapping("/instrument/{instrId}")
    public List<MeausreProManagement> insManagements(@PathVariable("instrId") int instrId) {
        return managementService.insManagements(instrId);
    }
}