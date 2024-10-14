package bitc.fullstack.meausrepro_spring.controller;

import bitc.fullstack.meausrepro_spring.model.MeausreProInsType;
import bitc.fullstack.meausrepro_spring.service.InstrumentTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/MeausrePro/InstrumentType")
public class InstrumentTypeController {
    @Autowired
    private InstrumentTypeService instrumentTypeService;

    // 계측기 추가 데이터 저장
    @PostMapping("/save")
    public ResponseEntity<String> save(@RequestBody MeausreProInsType instrumentType) {
        instrumentTypeService.save(instrumentType);

        return ResponseEntity.ok("계측기 추가 데이터 저장 성공");
    }
}
