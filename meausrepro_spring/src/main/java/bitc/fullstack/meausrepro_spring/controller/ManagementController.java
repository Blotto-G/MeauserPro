package bitc.fullstack.meausrepro_spring.controller;

import bitc.fullstack.meausrepro_spring.dto.ManagementDTO;
import bitc.fullstack.meausrepro_spring.model.MeausreProInstrument;
import bitc.fullstack.meausrepro_spring.model.MeausreProManType;
import bitc.fullstack.meausrepro_spring.model.MeausreProManagement;
import bitc.fullstack.meausrepro_spring.service.InstrumentService;
import bitc.fullstack.meausrepro_spring.service.ManagementService;
import bitc.fullstack.meausrepro_spring.service.ManagementTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
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
            management.setInstr(ins);

            MeausreProManagement saveManagement = managementService.save(management);

            manType.setMaIdx(saveManagement);

            // manType 저장
            MeausreProManType saveManType = manTypeService.save(manType);

            return ResponseEntity.ok(saveManType);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/details/{instrIdx}")
    public ResponseEntity<List<ManagementDTO>> getManagementDetails(@PathVariable int instrIdx) {
        // 계측기 관련 관리 정보를 조회
        Optional<MeausreProInstrument> instrumentOpt = instrumentService.findById(instrIdx);

        if (!instrumentOpt.isPresent()) {
            return ResponseEntity.notFound().build(); // 계측기 정보가 없으면 404 반환
        }

        MeausreProInstrument instrument = instrumentOpt.get();

        // 관리 정보 조회
        List<MeausreProManagement> managementList = managementService.findByInstrument(instrIdx);

        if (managementList.isEmpty()) {
            return ResponseEntity.notFound().build(); // 관리 정보가 없으면 404 반환
        }

        // 모든 관리 정보를 조회하여 DTO 리스트로 변환
        List<ManagementDTO> managementDTOList = new ArrayList<>();

        for (MeausreProManagement management : managementList) {
            Optional<MeausreProManType> manTypeOpt = manTypeService.findByMaIdx(management.getIdx());

            if (!manTypeOpt.isPresent()) {
                continue; // 추가 정보가 없으면 무시하고 다음으로 넘어감
            }

            MeausreProManType manType = manTypeOpt.get();

            // DTO에 정보를 설정
            ManagementDTO dto = new ManagementDTO();
            dto.setManagement(management);
            dto.setManagementType(manType);

            // 리스트에 추가
            managementDTOList.add(dto);
        }

        return ResponseEntity.ok(managementDTOList); // 관리 정보 리스트 반환
    }
}