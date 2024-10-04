package bitc.fullstack.meausrepro_spring.controller;

import bitc.fullstack.meausrepro_spring.dto.GeometryDto;
import bitc.fullstack.meausrepro_spring.model.MeausreProProject;
import bitc.fullstack.meausrepro_spring.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/MeausrePro/Maps")
public class MeausreProController {
    @Autowired
    private ProjectService projectService;

    // 저장
    @PostMapping("/save")
    public ResponseEntity<String> saveGeometry(@RequestBody MeausreProProject project) {
        if (project.getGeometry() == null || project.getGeometry().isEmpty()) {
            return ResponseEntity.badRequest().body("유효하지 않은 데이터");
        }

        System.out.println("받은 지오메트리 : " + project.getGeometry());

        projectService.save(project);

        return ResponseEntity.ok("프로젝트 데이터 저장 성공");
    }

    @RequestMapping({"", "/"})
    public String index() throws Exception {
        return "Spring server 접속";
    }
}
