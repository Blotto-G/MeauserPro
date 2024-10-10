package bitc.fullstack.meausrepro_spring.controller;

import bitc.fullstack.meausrepro_spring.dto.GeometryDto;
import bitc.fullstack.meausrepro_spring.model.MeausreProProject;
import bitc.fullstack.meausrepro_spring.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/MeausrePro/Project")
public class ProjectController {
    @Autowired
    private ProjectService projectService;

    // 프로젝트 저장
    @PostMapping("/save")
    public ResponseEntity<String> saveGeometry(@RequestBody MeausreProProject project) {
        if (project.getGeometry() == null || project.getGeometry().isEmpty()) {
            return ResponseEntity.badRequest().body("유효하지 않은 데이터");
        }
        System.out.println("받은 지오메트리 : " + project.getGeometry());

        projectService.save(project);

        return ResponseEntity.ok("프로젝트 데이터 저장 성공");
    }

    // 진행 중인 프로젝트 모두 보기
    @GetMapping("/inProgress/{id}/{topManager}")
    public List<MeausreProProject> inProgress(@PathVariable String id, @PathVariable String topManager) {
        System.out.println("\n" + id + ": " + topManager + "\n");
        return projectService.inProgress(id, topManager);
    }

    // 현장명 검색
    @GetMapping("/search/{id}/{siteName}")
    public List<MeausreProProject> searchSite(@PathVariable String id, @PathVariable String siteName) {
        return projectService.searchSite(id, siteName);
    }

    // 프로젝트 지오메트리 업데이트
    @PutMapping("/updateGeometry")
    public ResponseEntity<String> updateGeometry(@RequestBody GeometryDto geometryDto) {
        Optional<MeausreProProject> projectOptional = projectService.findById(geometryDto.getIdx());
        if (projectOptional.isPresent()) {
            MeausreProProject project = projectOptional.get();
            project.setGeometry(geometryDto.getGeometryData());
            projectService.save(project);
            return ResponseEntity.ok("지오메트리 업데이트 성공");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("프로젝트를 찾을 수 없습니다.");
        }
    }
}