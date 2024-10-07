package bitc.fullstack.meausrepro_spring.service;

import bitc.fullstack.meausrepro_spring.model.MeausreProSection;
import bitc.fullstack.meausrepro_spring.repository.SectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@Service
public class SectionService {
    @Autowired
    private SectionRepository sectionRepository;

    // 구간 저장
    public ResponseEntity<String> saveSection(@RequestBody MeausreProSection section) {
        sectionRepository.save(section);

        return ResponseEntity.ok("Saved");
    }

    // 특정 프로젝트 구간 보기
    public List<MeausreProSection> projectSections(int projectId) {
        return sectionRepository.findAllByProjectId(projectId);
    }
}
