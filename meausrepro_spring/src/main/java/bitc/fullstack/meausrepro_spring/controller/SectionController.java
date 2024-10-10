package bitc.fullstack.meausrepro_spring.controller;

import bitc.fullstack.meausrepro_spring.model.MeausreProSection;
import bitc.fullstack.meausrepro_spring.service.SectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/MeausrePro/Section")
public class SectionController {
    @Autowired
    private SectionService sectionService;

    // 구간 저장
    @PostMapping("/save")
    public ResponseEntity<String> saveSection(@RequestBody MeausreProSection section) {
        sectionService.saveSection(section);

        return ResponseEntity.ok("Saved");
    }

    // 특정 프로젝트 구간 보기
    @GetMapping("/{projectId}")
    public List<MeausreProSection> projectSections(@PathVariable("projectId") int projectId) {
        return sectionService.projectSections(projectId);
    }
}
