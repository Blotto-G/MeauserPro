package bitc.fullstack.meausrepro_spring.controller;

import bitc.fullstack.meausrepro_spring.model.MeausreProProject;
import bitc.fullstack.meausrepro_spring.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/MeausrePro/Project")
public class ProjectController {
    @Autowired private ProjectService projectService;

    // 현장명 검색
    @GetMapping("/search/{id}/{siteName}")
    public List<MeausreProProject> searchSite(@PathVariable String id, @PathVariable String siteName) {
        return projectService.searchSite(id, siteName);
    }
}
