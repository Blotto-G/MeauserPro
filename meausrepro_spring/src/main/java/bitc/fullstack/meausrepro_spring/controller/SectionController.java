package bitc.fullstack.meausrepro_spring.controller;

import bitc.fullstack.meausrepro_spring.model.MeausreProSection;
import bitc.fullstack.meausrepro_spring.repository.SectionRepository;
import bitc.fullstack.meausrepro_spring.service.SectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

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

    // 구간 수정
    @PutMapping("/update")
    public ResponseEntity<String> updateSection(@RequestBody MeausreProSection section) {
        boolean isUpdate = sectionService.updateSection(section);

        if (isUpdate) {
            return ResponseEntity.ok("Update");
        } else {
            return ResponseEntity.badRequest().body("수정에 실패했습니다.");
        }
    }

    // 구간 삭제
    @DeleteMapping("/delete/{idx}")
    public ResponseEntity<String> deleteSection(@PathVariable("idx") int idx) {
        boolean isDeleted = sectionService.deleteSection(idx);
        if (isDeleted) {
            return ResponseEntity.ok("삭제 완료");
        } else {
            return ResponseEntity.status(404).body("해당 구간을 찾을 수 없습니다.");
        }
    }
}