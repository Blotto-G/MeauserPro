package bitc.fullstack.meausrepro_spring.service;

import bitc.fullstack.meausrepro_spring.dto.GeometryDto;
import bitc.fullstack.meausrepro_spring.model.MeausreProProject;
import bitc.fullstack.meausrepro_spring.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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

    // 진행 중인 프로젝트 모두 보기
    public List<MeausreProProject> inProgress(String id, String topManager) {
        return projectRepository.findAllByIdInProgress(id, topManager);
    }

    // 공사 현장 검색
    public List<MeausreProProject> searchSite(String id, String siteName) {
        return projectRepository.searchSite(id, siteName);
    }

    // 지오메트리 업데이트
    public boolean updateGeometry(int projectId, String newGeometry) {
        Optional<MeausreProProject> projectOptional = projectRepository.findById(String.valueOf(projectId));
        if (projectOptional.isPresent()) {
            MeausreProProject project = projectOptional.get();
            project.setGeometry(newGeometry);
            projectRepository.save(project);
            return true;
        } else {
            return false;
        }
    }

    // 특정 프로젝트 찾기
    public Optional<MeausreProProject> findById(int idx) {
        return projectRepository.findByIdx(idx);
    }
}

