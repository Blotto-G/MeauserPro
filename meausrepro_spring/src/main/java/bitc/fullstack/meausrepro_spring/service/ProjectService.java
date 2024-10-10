package bitc.fullstack.meausrepro_spring.service;

import bitc.fullstack.meausrepro_spring.dto.GeometryDto;
import bitc.fullstack.meausrepro_spring.model.MeausreProProject;
import bitc.fullstack.meausrepro_spring.repository.ProjectRepository;
import bitc.fullstack.meausrepro_spring.repository.SectionRepository;
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
    @Autowired
    private SectionRepository sectionRepository;

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

    // 프로젝트 삭제
    public ResponseEntity<String> deleteProject(int idx) {
        Optional<MeausreProProject> projectOptional = projectRepository.findByIdx(idx);
        if (projectOptional.isPresent()) {
            MeausreProProject project =projectOptional.get();
            // 프로젝트 id 참조하는 구간 삭제
            sectionRepository.deleteByProjectId(project.getIdx());
            projectRepository.delete(project);
            return ResponseEntity.ok("프로젝트 삭제 성공");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("프로젝트를 찾을 수 없습니다.");
        }
    }

    // 프로젝트 수정
    public ResponseEntity<String> updateProject(int idx, MeausreProProject updatedProject) {
        Optional<MeausreProProject> projectOptional = projectRepository.findByIdx(idx);
        if (projectOptional.isPresent()) {
            MeausreProProject existingProject = projectOptional.get();
            existingProject.setSiteName(updatedProject.getSiteName());
            existingProject.setSiteAddress(updatedProject.getSiteAddress());
            existingProject.setStartDate(updatedProject.getStartDate());
            existingProject.setEndDate(updatedProject.getEndDate());
            existingProject.setContractor(updatedProject.getContractor());
            existingProject.setMeasurer(updatedProject.getMeasurer());
            existingProject.setSiteCheck(updatedProject.getSiteCheck());
            // 지오메트리는 수정하지 않음
            projectRepository.save(existingProject);
            return ResponseEntity.ok("프로젝트 수정 성공");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("프로젝트를 찾을 수 없습니다.");
        }
    }
}

