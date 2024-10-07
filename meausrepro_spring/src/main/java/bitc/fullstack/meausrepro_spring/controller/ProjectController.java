package bitc.fullstack.meausrepro_spring.controller;

import bitc.fullstack.meausrepro_spring.model.MeausreProProject;
import bitc.fullstack.meausrepro_spring.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/MeausrePro/Project")
public class ProjectController {
    @Autowired private ProjectService projectService;

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
    @GetMapping("/inProgress/{id}")
    public List<MeausreProProject> inProgress(@PathVariable String id) {
        return projectService.inProgress(id);
    }

    // 현장명 검색
    @GetMapping("/search/{id}/{siteName}")
    public List<MeausreProProject> searchSite(@PathVariable String id, @PathVariable String siteName) {
        return projectService.searchSite(id, siteName);
    }
}
