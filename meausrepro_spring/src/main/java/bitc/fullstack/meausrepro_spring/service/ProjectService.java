package bitc.fullstack.meausrepro_spring.service;

import bitc.fullstack.meausrepro_spring.model.MeausreProProject;
import bitc.fullstack.meausrepro_spring.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.List;

@Service
public class ProjectService {
    @Autowired
    private ProjectRepository projectRepository;

    // 저장
    public ResponseEntity<String> save(MeausreProProject project) {
        // 프로젝트 저장
        MeausreProProject savedProject = projectRepository.save(project);

        // 저장 성공 메시지 반환
        if (savedProject != null) {
            return ResponseEntity.ok("Project saved successfully");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to save project");
        }
    }

    // 공사 현장 검색
    public List<MeausreProProject> searchSite(String id, String siteName) {
        return projectRepository.searchSite(id, siteName);
    }
}
